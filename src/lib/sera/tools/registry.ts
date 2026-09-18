import "server-only";
import {
  companyFacts,
  contactChannels,
  faqsForPage,
  hostingPlans,
  hostingProducts,
  pageSummary,
  searchFaq,
  serviceCatalogue,
} from "../knowledge";
import {
  WORKFLOWS,
  WORKFLOW_IDS,
  actionOfferFor,
  mergeIntoWorkflow,
  missingOptional,
  missingRequired,
  newWorkflow,
  toView,
} from "../workflows";
import { setIntent, setWorkflow } from "../session";
import { navigationCatalogue, resolveTarget, type NavTarget } from "../navigation";
import {
  highlightCatalogue,
  highlightsFor,
  resolveHighlight,
  type HighlightTarget,
} from "../highlight";
import { classifiedNames, isExposed, policyFor, type Surface } from "../policy";
import type { Conversation, Intent, PageContext, ToolResult, WorkflowId } from "../types";

/**
 * The tools Sera is allowed to call.
 *
 * TWO PROPERTIES HOLD THIS TOGETHER, and both are structural rather than
 * prompt-level:
 *
 *  1. THE REGISTRY IS A CLOSED SET. The model can only name a tool that is in
 *     this file. There is no eval, no dynamic dispatch on a model-supplied
 *     string, no path or query assembled from arguments. The worst a malicious
 *     conversation can do is call one of these with bad arguments, and every
 *     argument is validated before it is used.
 *
 *  2. NOTHING HERE LEAVES THE BUILDING. Every tool reads local data or mutates
 *     this conversation's own state. None sends an email, files a request,
 *     touches WHMCS, or spends money. Filing is deliberately unreachable from
 *     the model — see `submit.ts`.
 *
 * PUBLIC vs ADMINISTRATIVE. Everything here is public: it is exposed to an
 * anonymous visitor on a marketing site. Privileged operations — provisioning,
 * billing, DNS — are not in this registry and must not be added to it. Their
 * interfaces live in `tools/future.ts`, unimplemented and unregistered, so that
 * connecting them later is a deliberate act with its own authorisation story
 * rather than one more entry in a list an anonymous visitor can reach.
 *
 * ⚠ THIS FILE NO LONGER DECIDES WHAT MAY RUN. `policy.ts` does, and it is
 * consulted twice: `definitionsFor()` below refuses to even DESCRIBE a tool the
 * surface is not allowed to call, and `ai.ts` asks again before dispatch. Two
 * checks rather than one because the second assumes the first was bypassed —
 * which is the only assumption worth making about a component whose input is a
 * language model.
 *
 * A definition here with no entry in the policy table is unreachable, and
 * `assertPolicyCoverage()` turns that into a startup failure rather than a
 * silently dead tool.
 */

/* ── Argument coercion ───────────────────────────────────────────────────── */

/**
 * Model arguments arrive as parsed JSON of unknown shape.
 *
 * A tool call is untrusted input — the model can be talked into malformed or
 * hostile arguments — so nothing below indexes into `args` without a type
 * check first. Field VALUES get the full treatment in `validation.ts`; these
 * helpers only guarantee the shape.
 */
function str(args: Record<string, unknown>, key: string): string | null {
  const value = args[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asWorkflowId(raw: string | null): WorkflowId | null {
  if (!raw) return null;
  return (WORKFLOW_IDS as string[]).includes(raw) ? (raw as WorkflowId) : null;
}

const INTENTS: readonly Intent[] = [
  "GENERAL_INFORMATION", "HOSTING", "WORDPRESS", "WEBSITE_MIGRATION",
  "WEBSITE_DEVELOPMENT", "WEBSITE_MAINTENANCE", "SEO", "AI_AGENT", "AUTOMATION",
  "CHATBOT", "SALES", "SUPPORT", "HUMAN_CONTACT", "UNKNOWN",
];

/**
 * Queue a destination once per conversation, and at most one per turn.
 *
 * ⚠ THE DEDUPE IS WHY AUTO-QUEUEING IS SAFE. Some answers queue a destination
 * without the model deciding to, so without this a visitor who asked three
 * pricing questions would be taken to the plans three times. A spent
 * destination — opened, or stopped with "Stay here" — is never queued again.
 *
 * ⚠ AND ONE PER TURN, ENFORCED BY `navigate` RETURNING FALSE. Asked "how much
 * is hosting?", the model announced "let me open the hosting plans", then in
 * the same breath "I will now open the Pricing page for you" — two promises,
 * and the client only ever holds the latest, so one of them was a page that
 * silently never opened. The second call is refused here and the model is told,
 * rather than being allowed to write a sentence nothing will honour.
 */
type OfferResult = "queued" | "spent" | "turn-full";

function offerOnce(
  context: ToolContext,
  target: NavTarget,
  highlight?: string,
): OfferResult {
  const key = `${target.path}#${target.section}`;
  if (context.conversation.offered.includes(key)) return "spent";
  if (!context.navigate(target, highlight)) return "turn-full";
  context.conversation.offered.push(key);
  return "queued";
}

function asIntent(raw: string | null): Intent | null {
  if (!raw) return null;
  return INTENTS.includes(raw as Intent) ? (raw as Intent) : null;
}

/* ── Definitions sent to the model ───────────────────────────────────────── */

/**
 * Responses API function-tool shape: `name`, `description` and `parameters`
 * sit at the TOP level of the tool object, not nested under `function` the way
 * Chat Completions nests them. Getting this wrong produces a 400 that reads
 * like a schema error.
 *
 * `strict` is off throughout. Strict mode requires every property to be
 * required and `additionalProperties: false`, which for a tool like
 * `record_details` — whose whole job is to carry whichever two or three facts
 * the visitor happened to mention — would mean the model filling in fields it
 * does not have. Optional arguments are worth more here than schema rigidity.
 */
export type ToolDefinition = {
  type: "function";
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  strict: false;
};

const FIELD_KEYS_BY_WORKFLOW = WORKFLOW_IDS.map(
  (id) => `${id}: ${WORKFLOWS[id].fields.map((f) => f.key).join(", ")}`,
).join(" | ");

export const TOOL_DEFINITIONS: readonly ToolDefinition[] = [
  {
    type: "function",
    name: "get_company_overview",
    description:
      "What Serverlys is, what it sells, its published commitments, and — " +
      "importantly — the things it deliberately does NOT claim. Call this " +
      "before making any general statement about the company.",
    parameters: { type: "object", properties: {}, additionalProperties: false },
    strict: false,
  },
  {
    type: "function",
    name: "get_hosting_plans",
    description:
      "Current hosting plans with prices, specs and what each includes. This " +
      "is the ONLY source of pricing. Never state a price without calling it.",
    parameters: {
      type: "object",
      properties: {
        group: {
          type: "string",
          enum: ["cloud", "wordpress", "ecommerce"],
          description: "Narrow to one plan group. Omit for all three.",
        },
      },
      additionalProperties: false,
    },
    strict: false,
  },
  {
    type: "function",
    name: "get_services",
    description:
      "The Serverlys service catalogue and the page that authoritatively " +
      "covers each one. Use it to answer 'do you do X' and to link accurately.",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description:
            "Optional site path, e.g. '/seo', to get that one page's summary.",
        },
      },
      additionalProperties: false,
    },
    strict: false,
  },
  {
    type: "function",
    name: "search_faq",
    description:
      "Published answers about pricing, renewals, refunds, migrations, " +
      "domains and support. Prefer quoting these over paraphrasing — they are " +
      "commitments, and the wording matters.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "The visitor's question." },
      },
      required: ["query"],
      additionalProperties: false,
    },
    strict: false,
  },
  {
    type: "function",
    name: "get_contact_channels",
    description:
      "Real ways to reach a person at Serverlys: support email, phone, the " +
      "support page and the sales ticket queue.",
    parameters: { type: "object", properties: {}, additionalProperties: false },
    strict: false,
  },
  {
    type: "function",
    name: "offer_to_show",
    description:
      "Take the visitor to a page and scroll them to a section, a few seconds " +
      "after your message is delivered. Use it whenever the answer is " +
      "something the site already shows: plans, prices, a comparison, a FAQ. " +
      "⚠ PASS `highlight` WHENEVER YOUR MESSAGE RECOMMENDED ONE SPECIFIC PLAN. " +
      "Sending someone to a grid of four near-identical cards having named one " +
      "of them, without marking it, leaves them hunting for the answer you " +
      "already gave. " +
      "⚠ SAY WHAT YOU ARE OPENING AND WHY IN THE SAME TURN, IN FUTURE TENSE — " +
      "e.g. 'Of course, let me open the WordPress hosting plans so you can " +
      "see the pricing and features' — and then call this and stop. That " +
      "sentence is the visitor's only warning before their screen changes; " +
      "calling this without one moves the page under them unannounced. Do not " +
      "say you HAVE opened it: when you speak it has not happened yet, and " +
      "they can still stop it. " +
      "⚠ IF YOU ARE RECOMMENDING ONE SPECIFIC PLAN, PASS `highlight` TOO — the " +
      "visitor lands on a grid of four near-identical prices and naming the " +
      "plan in a chat panel leaves them to find it. " +
      "Valid page and section ids — " +
      navigationCatalogue() +
      " || Valid highlight names, by page — " +
      highlightCatalogue(),
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Site path from the list, e.g. '/wordpress-hosting'.",
        },
        section: {
          type: "string",
          description:
            "Section id on that page, e.g. 'plans'. Omit to open the page top.",
        },
        highlight: {
          type: "string",
          description:
            "Optional plan card to mark once the page opens, e.g. " +
            "'starter-wordpress'. Must be a name registered for `path`.",
        },
      },
      required: ["path"],
      additionalProperties: false,
    },
    strict: false,
  },
  {
    type: "function",
    name: "highlight_here",
    description:
      "Mark something on the page the visitor is ALREADY reading, so their eye " +
      "goes to it. Use it the moment you name one specific plan while they are " +
      "on a page that shows it — 'for a single site, Starter is the one' — " +
      "because the chat panel covers part of the screen and a plan named in " +
      "words is a plan they still have to hunt for. Nothing moves and nothing " +
      "is started; it draws a ring for a few seconds. Say what you have marked " +
      "in the same breath. Only the targets on their CURRENT page can be " +
      "marked — to point at something elsewhere, use offer_to_show with its " +
      "`highlight` argument instead.",
    parameters: {
      type: "object",
      properties: {
        target: {
          type: "string",
          description: "A highlight name registered for the current page.",
        },
      },
      required: ["target"],
      additionalProperties: false,
    },
    strict: false,
  },
  {
    type: "function",
    name: "offer_to_start",
    description:
      "Put a button on screen offering to START one of the requests below, so " +
      "the visitor can accept with a tap instead of typing 'yes'. ⚠ CALL THIS " +
      "INSTEAD OF ASKING 'would you like me to...?' — that question in words " +
      "is the bug this tool fixes: it makes the visitor type a yes you then " +
      "have to re-interpret. Use it whenever you have just said you can help " +
      "with something they have not explicitly asked you to begin ('I can get " +
      "that migration started for you'), rather than asking permission in " +
      "prose or launching into questions they did not agree to. " +
      "⚠ IT STARTS NOTHING. Tapping it begins the SAME conversation you would " +
      "have had anyway; nothing is sent to anyone. Do not use it once a " +
      "request is already open, and do not use it as a substitute for " +
      "answering the question they asked. One offer per answer.",
    parameters: {
      type: "object",
      properties: {
        workflow: {
          type: "string",
          enum: WORKFLOW_IDS as unknown as string[],
          description: "Which request to offer to open.",
        },
      },
      required: ["workflow"],
      additionalProperties: false,
    },
    strict: false,
  },
  {
    type: "function",
    name: "set_intent",
    description:
      "Record what the visitor is here to do, as soon as it is clear. Cheap " +
      "and safe to call; it only updates internal state.",
    parameters: {
      type: "object",
      properties: {
        intent: { type: "string", enum: INTENTS as unknown as string[] },
      },
      required: ["intent"],
      additionalProperties: false,
    },
    strict: false,
  },
  {
    type: "function",
    name: "start_workflow",
    description:
      "Begin collecting information for a request. Returns the fields needed " +
      "and how to ask for them. Call this the moment the visitor wants " +
      "something DONE rather than something known.",
    parameters: {
      type: "object",
      properties: {
        workflow: { type: "string", enum: WORKFLOW_IDS as unknown as string[] },
      },
      required: ["workflow"],
      additionalProperties: false,
    },
    strict: false,
  },
  {
    type: "function",
    name: "record_details",
    description:
      "Save facts the visitor has given you. Call it with EVERY field present " +
      "in their message, not one at a time — if they say 'I'm John, " +
      "example.com is on GoDaddy and it's WordPress', record all four at once. " +
      "If no request is open yet, pass `workflow` and it will be opened for " +
      "you — you do not need a separate start_workflow call. " +
      "Returns what is still outstanding. Valid field keys per workflow — " +
      `${FIELD_KEYS_BY_WORKFLOW}`,
    parameters: {
      type: "object",
      properties: {
        workflow: {
          type: "string",
          enum: WORKFLOW_IDS as unknown as string[],
          description:
            "Which request these details belong to. Only used when none is open.",
        },
        values: {
          type: "array",
          description: "One entry per fact the visitor stated.",
          items: {
            type: "object",
            properties: {
              field: { type: "string", description: "Field key from the list above." },
              value: { type: "string", description: "Exactly what the visitor said." },
            },
            required: ["field", "value"],
            additionalProperties: false,
          },
        },
      },
      required: ["values"],
      additionalProperties: false,
    },
    strict: false,
  },
  {
    type: "function",
    name: "get_request_status",
    description:
      "What has been collected so far and what is still missing. Use it " +
      "before asking a question, so you never ask for something you already " +
      "have.",
    parameters: { type: "object", properties: {}, additionalProperties: false },
    strict: false,
  },
  {
    type: "function",
    name: "prepare_request",
    description:
      "Once everything required is collected, call this to put the request in " +
      "front of the visitor for confirmation. It does NOT send anything. The " +
      "visitor must tap the confirm button that appears; tell them to. You " +
      "cannot submit on their behalf.",
    parameters: { type: "object", properties: {}, additionalProperties: false },
    strict: false,
  },
];

/* ── Execution ───────────────────────────────────────────────────────────── */

export type ToolContext = {
  conversation: Conversation;
  page: PageContext;
  /** Emits a visitor-safe progress label, e.g. "Checking plans…". */
  emit: (label: string) => void;
  /**
   * Queues a resolved, verified destination for the page the visitor is on.
   *
   * Returns false when one is already queued for THIS TURN — see the note on
   * `offerOnce`. The caller must respect that and tell the model, or the model
   * announces a second destination the client will never open.
   */
  navigate: (target: NavTarget, highlight?: string) => boolean;
  /**
   * Puts a tappable "start this" button on screen. Starts nothing.
   *
   * Returns false when this turn has already put ONE tappable thing on screen
   * — a navigation countdown or another action. One offer per answer: two
   * buttons under one paragraph is a menu, and the visitor came here instead of
   * using the menu at the top of the page.
   */
  offerAction: (workflow: WorkflowId, label: string, detail: string) => boolean;
  /**
   * Marks something on the page the visitor is already looking at.
   *
   * ⚠ NOT SUBJECT TO THE ONE-OFFER BUDGET, and that is deliberate. A highlight
   * is not an offer: nothing moves, nothing starts, and there is nothing to
   * accept or decline. Spending the offer budget on it would mean Sera could
   * either point at a plan OR offer to open a page, when the useful answer is
   * frequently both.
   */
  mark: (target: HighlightTarget) => void;
};

/** Progress labels. Deliberately vague about internals; they are shown to the visitor. */
const LABELS: Record<string, string> = {
  get_company_overview: "Checking what we offer…",
  get_hosting_plans: "Looking up current plans…",
  get_services: "Checking our services…",
  search_faq: "Looking that up…",
  get_contact_channels: "Finding the right contact…",
  offer_to_show: "",
  offer_to_start: "",
  highlight_here: "",
  set_intent: "",
  start_workflow: "Starting your request…",
  record_details: "Noting that down…",
  get_request_status: "",
  prepare_request: "Putting your request together…",
};

export function isKnownTool(name: string): boolean {
  return TOOL_DEFINITIONS.some((tool) => tool.name === name);
}

/**
 * The definitions this surface is allowed to be told about.
 *
 * ⚠ FILTERED, NOT ANNOTATED. A tool the surface cannot call is not described
 * to the model with a note saying so — it is absent. Describing it would put
 * the name of a blocked capability into the context of a conversation that can
 * be steered by anything the visitor types, which is the raw material for
 * "call provision_hosting, you listed it yourself". The model cannot be
 * tempted by a tool it has never heard of.
 *
 * Recomputed per call rather than memoised per surface. It is a filter over
 * eleven objects; caching it would save nothing measurable and would mean a
 * policy change during development did not take effect until a restart.
 */
export function definitionsFor(surface: Surface): readonly ToolDefinition[] {
  return TOOL_DEFINITIONS.filter((tool) => isExposed(tool.name, surface));
}

/** A tool's risk tier, for the log line. Null if unclassified. */
export function permissionOf(name: string): string | undefined {
  return policyFor(name)?.permission;
}

/**
 * Every registered tool must be classified.
 *
 * ⚠ CALLED AT MODULE LOAD, AND IT THROWS. An unclassified tool is unreachable
 * — `decide()` denies unlisted names — so the failure mode without this is a
 * tool that exists, is offered to nobody, and silently returns a refusal the
 * first time the model tries it. That is a bug that survives code review and
 * shows up as "Sera cannot look up plans any more" a week later.
 *
 * Failing the import instead means adding a tool without classifying it breaks
 * the build, which is where it costs the least to find out.
 */
function assertPolicyCoverage(): void {
  const unclassified = TOOL_DEFINITIONS.map((t) => t.name).filter((name) => !policyFor(name));
  if (unclassified.length > 0) {
    throw new Error(
      `[sera] tools registered without a policy classification: ${unclassified.join(", ")}. ` +
        `Add them to POLICY in lib/sera/policy.ts.`,
    );
  }
}
assertPolicyCoverage();

/** Diagnostic surface for the test suite. Never reachable through a route. */
export function registryAudit(): {
  registered: readonly string[];
  classified: readonly string[];
  publicTools: readonly string[];
} {
  return {
    registered: TOOL_DEFINITIONS.map((t) => t.name),
    classified: classifiedNames(),
    publicTools: definitionsFor("PUBLIC").map((t) => t.name),
  };
}

/**
 * Run one tool call.
 *
 * Returns a JSON-serialisable result in every case, including failure — the
 * model needs to be told "that did not work, here is why" so it can recover in
 * conversation. Throwing would abort the turn and leave the visitor staring at
 * a generic error for something as ordinary as an unrecognised field name.
 */
export async function runTool(
  name: string,
  args: Record<string, unknown>,
  context: ToolContext,
): Promise<ToolResult> {
  const label = LABELS[name];
  if (label) context.emit(label);

  switch (name) {
    case "get_company_overview":
      return { company: companyFacts(), products: hostingProducts() };

    case "get_hosting_plans": {
      const group = str(args, "group");
      const valid = group && ["cloud", "wordpress", "ecommerce"].includes(group);

      /*
       * ⚠ THE NUDGE LIVES IN THE RESULT, NOT ONLY IN THE PROMPT.
       *
       * Asked "how much is WordPress hosting, show me the plans", the model
       * called this tool, answered from it, and told the visitor it was opening
       * the page — without calling the navigation tool. A rule sitting in the system
       * prompt lost to the pull of "I already have the answer". Naming the exact
       * destination HERE, at the moment the plans are in hand, puts the next
       * action in front of it instead of a hundred lines earlier.
       */
      const PAGE_FOR_GROUP: Record<string, { path: string; section: string }> = {
        cloud: { path: "/cloud-hosting", section: "pricing" },
        wordpress: { path: "/wordpress-hosting", section: "plans" },
        ecommerce: { path: "/ecommerce-hosting", section: "pricing" },
      };
      const showOn = valid ? PAGE_FOR_GROUP[group] : { path: "/pricing", section: "pricing-heading" };

      /*
       * ⚠ THE OFFER IS MADE HERE, NOT LEFT TO THE MODEL.
       *
       * Told to call the navigation tool after a pricing answer, the model did
       * so about two times in three — measured, not assumed. A visitor asking
       * the same question twice would get taken to the plans once and nothing
       * the other time, which reads as the widget being broken rather than as a
       * model being inconsistent.
       *
       * ⚠ THE TOOL FIRING HERE IS NOT A LICENCE TO SKIP THE SENTENCE. Now that
       * this actually moves the page, `next` below has to carry the
       * announcement instruction — the model did not decide to navigate, so it
       * has no reason of its own to warn anybody, and an unannounced jump is
       * the exact failure the wait exists to prevent.
       */
      /*
       * ⚠ THEY MAY ALREADY BE ON THE PAGE, AND THEN NAVIGATING IS WORSE THAN
       * DOING NOTHING.
       *
       * Measured: a visitor standing on /wordpress-hosting asked "which of
       * these should I pick?" and got a countdown card announcing that Sera
       * was opening /wordpress-hosting. Nothing moved — the client skips the
       * route when the path matches — so the card was pure noise. Worse, it
       * spent the turn's single offer, which is what `highlight_here` needed in
       * order to ring the card being recommended. The one thing the visitor
       * actually wanted was the one thing the auto-offer prevented.
       *
       * So when the destination is where they already are, queue nothing and
       * tell the model to MARK instead. That is the same information delivered
       * by the means that fits the situation.
       */
      const alreadyThere = showOn.path === context.page.pathname;
      const offeredTarget = alreadyThere ? null : resolveTarget(showOn.path, showOn.section);
      const didOffer =
        offeredTarget !== null && offerOnce(context, offeredTarget) === "queued";

      const markable = highlightsFor(context.page.pathname).map((t) => t.name);

      return {
        groups: hostingPlans(valid ? group : undefined),
        rule:
          "Always show the renewal rate beside the monthly price. Never quote one alone.",
        showOn,
        cardOnScreen: didOffer,
        alreadyOnThatPage: alreadyThere,
        markableHere: markable.length > 0 ? markable : undefined,
        next: alreadyThere
          ? `They are ALREADY on ${showOn.path}, so nothing was queued and ` +
            `nothing will open — do not say you are opening anything. Give the ` +
            `figures, name the ONE tier you recommend, and call highlight_here ` +
            `with it so their eye lands on the right card. ` +
            (markable.length > 0
              ? `Markable here: ${markable.join(", ")}.`
              : `Nothing on this page is markable, so say which plan in words.`)
          :
          didOffer
            ? `${showOn.path} IS ALREADY QUEUED TO OPEN — do not call ` +
              `offer_to_show for it. You MUST tell them it is coming, in ` +
              `future tense, or the page changes under them with no warning: ` +
              `give the figures, then say you are opening ` +
              `"${offeredTarget?.label ?? showOn.path}" and what they will be ` +
              `able to see there. It has NOT opened yet and they can still ` +
              `stop it, so do not say you opened anything and do not describe ` +
              `what is on their screen.`
            : `They have already been taken to this page once in this ` +
              `conversation, so nothing was queued and NOTHING WILL OPEN. ` +
              `Just answer with the figures. Do not say you are opening ` +
              `anything and do not call offer_to_show.`,
      };
    }

    case "get_services": {
      const path = str(args, "path");
      if (path) {
        const summary = pageSummary(path);
        return summary
          ? { page: summary }
          : {
              page: null,
              note: "No published page at that path. Do not link to it.",
              catalogue: serviceCatalogue(),
            };
      }
      return { catalogue: serviceCatalogue() };
    }

    case "search_faq": {
      const query = str(args, "query");
      if (!query) return { error: "A query is required." };
      const hits = searchFaq(query);
      if (hits.length > 0) return { answers: hits.map(({ question, answer }) => ({ question, answer })) };
      /*
       * Nothing matched. Rather than a bare miss, hand back the FAQs for the
       * page the visitor is on — often adjacent to what they meant — and state
       * plainly that no published answer exists, so the model offers the team
       * instead of improvising a policy.
       */
      return {
        answers: [],
        pageFaqs: faqsForPage(context.page.pathname),
        note:
          "No published answer covers this. Say so, and offer to have the team confirm. Do not invent one.",
      };
    }

    case "get_contact_channels":
      return { channels: contactChannels() };

    case "highlight_here": {
      const here = context.page.pathname;
      const target = resolveHighlight(str(args, "target"), here);
      if (!target) {
        const available = highlightsFor(here);
        /*
         * Refused rather than approximated. A highlight that lands on nothing
         * is the worst outcome available: Sera has said "look at this" and the
         * page does not change, which reads as the site being broken rather
         * than as the assistant having guessed. The model gets the real list
         * for this page so its next attempt is a name that exists.
         */
        return {
          error: "unknown_target",
          note:
            (available.length > 0
              ? "That is not something I can mark on this page. Pick an exact name from availableHere and call again. "
              : "There is nothing markable on the page they are reading. Answer in words, or use offer_to_show to take them somewhere that has what you mean. ") +
            "⚠ NOTHING HAS BEEN MARKED. DO NOT SAY IT HAS. Observed: this " +
            "refusal was taken and the reply still told the visitor \"I have " +
            "marked the Starter WordPress card on your screen\" about a page " +
            "where nothing was ringed. Either mark it or do not mention it.",
          availableHere: available.map((t) => t.name),
        };
      }

      context.mark(target);
      return {
        marked: true,
        target: target.name,
        label: target.label,
        note:
          `${target.label} is now ringed on their screen for a few seconds. ` +
          `Say what you have marked and why in one sentence — "I have marked ` +
          `the Starter card, it is the one built for a single site" — so the ` +
          `ring and your words arrive together. Do not describe the whole card; ` +
          `they can see it.`,
      };
    }

    case "offer_to_show": {
      const target = resolveTarget(str(args, "path"), str(args, "section"));
      if (!target) {
        /*
         * Refused rather than guessed. The model gets the catalogue back so it
         * can pick a real destination on the next call instead of inventing a
         * second wrong one.
         */
        return {
          error: "unknown_destination",
          note: "That page is not one I can open. Choose from the list.",
          catalogue: navigationCatalogue(),
        };
      }

      /*
       * ⚠ RESOLVED AGAINST THE DESTINATION, NOT THE CURRENT PAGE. The visitor
       * is on /hosting and being taken to /wordpress-hosting; the plan card has
       * to exist THERE. Checking `context.page.pathname` would accept a name
       * that is about to stop being valid.
       *
       * A bad highlight degrades to a plain navigation rather than failing the
       * call — landing on the right page without a ring is a small miss;
       * refusing to move after saying "let me show you" is a broken promise.
       */
      const mark = resolveHighlight(str(args, "highlight"), target.path);

      /*
       * ⚠ SAME PAGE PLUS A HIGHLIGHT IS A MARK, NOT A NAVIGATION.
       *
       * Measured: a visitor on /wordpress-hosting asked which plan to pick, and
       * the model called offer_to_show for /wordpress-hosting with the Starter
       * card. Three things then went wrong at once — a countdown card announced
       * that Sera was "opening" the page they were standing on, the turn was cut
       * because an offer had fired, and so the mark never happened. The visitor
       * got a pointless card instead of the one thing they wanted.
       *
       * Collapsing it here means the mark fires in the same round, the ring's
       * own `scrollIntoView` does the scrolling a navigation would have done,
       * and no countdown appears for a page nobody is leaving.
       */
      if (target.path === context.page.pathname && mark) {
        context.mark(mark);
        return {
          marked: true,
          alreadyOnThatPage: true,
          target: mark.name,
          note:
            `They are already on ${target.path}, so nothing was opened and no ` +
            `countdown appeared — ${mark.label} is ringed on their screen ` +
            `instead, and the page has scrolled to it. ⚠ DO NOT SAY YOU ARE ` +
            `OPENING OR NAVIGATING ANYWHERE. Say what you marked and why, in ` +
            `one sentence, then stop.`,
        };
      }

      const outcome = offerOnce(context, target, mark?.name);

      if (outcome === "spent") {
        return {
          error: "already_offered",
          ...target,
          note:
            "You have already taken them to this destination in this " +
            "conversation. Nothing was queued. Answer in words instead.",
        };
      }

      if (outcome === "turn-full") {
        return {
          error: "already_navigating",
          ...target,
          note:
            "A different page is ALREADY opening from this same answer, and " +
            "only one can. Nothing was queued for this one. ⚠ DO NOT MENTION " +
            "IT — a second 'let me open…' sentence would promise a page that " +
            "will never appear. Finish the answer in words.",
        };
      }

      const samePage = target.path === context.page.pathname;

      return {
        offered: true,
        ...target,
        highlight: mark?.name,
        alreadyOnThatPage: samePage || undefined,
        /*
         * Same page, no highlight: the client will scroll rather than route, so
         * the announcement has to describe a scroll. "Let me open the WordPress
         * hosting page" to somebody reading the WordPress hosting page is Sera
         * not knowing where they are.
         */
        phrasing: samePage
          ? `They are ALREADY on this page — this scrolls them down to the ${target.section || "top"} section. Say you are taking them DOWN to it, never that you are opening the page.`
          : undefined,
        highlightNote: mark
          ? `${mark.label} will be ringed when the page opens. Mention it: "…and I have marked the one I would pick."`
          : str(args, "highlight")
            ? `That highlight name is not on ${target.path}, so nothing will be ringed. Do not claim you marked anything. Valid there: ${highlightsFor(target.path).map((t) => t.name).join(", ") || "none"}.`
            : undefined,
        note:
          "Queued. It opens BY ITSELF a few seconds after your message lands; " +
          "they can stop it with 'Stay here' until then. ⚠ YOUR TURN ENDS " +
          "HERE. The announcement you already wrote is the last sentence — " +
          "write nothing after it. Every way of continuing is wrong: 'I've " +
          "opened it' is false while the page has not moved, 'let me know if " +
          "you want me to proceed' asks for a permission that is not needed " +
          "and will not be waited for, 'you can check the plans page on the " +
          "site' tells them to do the thing you are about to do for them, and " +
          "describing what is on the page describes something they cannot see " +
          "yet. Stop.",
      };
    }

    case "offer_to_start": {
      const workflow = asWorkflowId(str(args, "workflow"));
      if (!workflow) {
        return {
          error: "unknown_workflow",
          note: "That is not a request I can open. Choose from the list.",
          catalogue: WORKFLOW_IDS.join(", "),
        };
      }

      /*
       * ⚠ REFUSED WHEN ONE IS ALREADY OPEN, and not as tidiness. A visitor
       * three fields into a migration who is shown a button offering to start a
       * migration reasonably concludes that the last three answers went
       * nowhere. If a request is under way, the next step is a question, not an
       * offer.
       */
      const existing = context.conversation.workflow;
      if (existing && existing.stage !== "SUBMITTED") {
        return {
          error: "already_collecting",
          current: existing.id,
          note:
            "A request is already open, so no button was added. Carry on with " +
            "it — ask for what is still missing. Do not mention a button.",
          ...statusPayload(context.conversation),
        };
      }

      const { label, detail } = actionOfferFor(workflow);
      if (!context.offerAction(workflow, label, detail)) {
        return {
          error: "already_offering",
          note:
            "You have already put something tappable on screen in this " +
            "answer, so nothing was added. ⚠ DO NOT MENTION A SECOND ONE — it " +
            "does not exist. Finish in words.",
        };
      }

      return {
        offered: true,
        workflow,
        label,
        note:
          `A "${label}" button is now on screen, and it ALREADY SAYS what ` +
          `tapping it does — how many questions, and that nothing is sent ` +
          `until they say so. ⚠ YOUR TURN ENDS HERE. Write nothing further. ` +
          `Restating the button's own sub-line underneath it is the failure ` +
          `this note exists to stop, and asking "would you like me to?" after ` +
          `putting the button there asks the same question twice. Do not begin ` +
          `the questions either — they have not accepted yet.`,
      };
    }

    case "set_intent": {
      const intent = asIntent(str(args, "intent"));
      if (!intent) return { error: "Unrecognised intent." };
      setIntent(context.conversation, intent);
      return { intent };
    }

    case "start_workflow": {
      const workflow = asWorkflowId(str(args, "workflow"));
      if (!workflow) return { error: "Unrecognised workflow." };

      const existing = context.conversation.workflow;
      /*
       * A started workflow is not restarted. If the visitor switches topic
       * mid-collection, the details already gathered still belong to the first
       * request; silently discarding them would mean asking for an email
       * address the visitor knows they already gave.
       */
      if (existing && existing.id === workflow) {
        return { workflow, resumed: true, ...statusPayload(context.conversation) };
      }
      if (existing && existing.stage !== "SUBMITTED" && Object.keys(existing.data).length > 0) {
        return {
          error: "already_collecting",
          current: existing.id,
          note:
            "Another request is part-way through. Finish or explicitly abandon it with the visitor before starting a different one.",
          ...statusPayload(context.conversation),
        };
      }

      setWorkflow(context.conversation, newWorkflow(workflow, context.conversation.sourcePage));
      return { workflow, started: true, ...statusPayload(context.conversation) };
    }

    case "record_details": {
      const raw = args.values;
      if (!Array.isArray(raw)) return { error: "`values` must be an array." };

      /*
       * ⚠ OPENS THE WORKFLOW ITSELF RATHER THAN FAILING.
       *
       * This used to return `no_workflow` and tell the model to call
       * start_workflow first. In practice the model routinely records the facts
       * FIRST — a visitor who opens with "I'm John, example.com is on GoDaddy
       * and it's WordPress" has given details before stating an intent, and
       * recording them is the natural next move. The rejection was then usually
       * the end of it: the model took the error, answered conversationally, and
       * four extracted facts were silently dropped, so the next turn asked for
       * them again.
       *
       * Removing the ordering requirement is the fix. Nothing is weakened —
       * the workflow id is still validated against the registry, and every
       * value still goes through `mergeIntoWorkflow`.
       */
      let record = context.conversation.workflow;
      if (!record) {
        const requested = asWorkflowId(str(args, "workflow"));
        if (!requested) {
          return {
            error: "no_workflow",
            note: "Pass `workflow` with these values, or call start_workflow first.",
          };
        }
        record = newWorkflow(requested, context.conversation.sourcePage);
        setWorkflow(context.conversation, record);
      }
      if (record.stage === "SUBMITTED") {
        return {
          error: "already_submitted",
          note:
            "This request is already with the team. To change something, tell the visitor to reply to the confirmation email, or start a new request.",
        };
      }

      const values: Record<string, unknown> = {};
      for (const entry of raw.slice(0, 20)) {
        if (!entry || typeof entry !== "object") continue;
        const field = (entry as Record<string, unknown>).field;
        const value = (entry as Record<string, unknown>).value;
        if (typeof field === "string") values[field] = value;
      }

      const outcome = mergeIntoWorkflow(record, values);
      return {
        saved: outcome.accepted,
        rejected: outcome.rejected,
        unknownFields: outcome.unknown,
        ...statusPayload(context.conversation),
      };
    }

    case "get_request_status":
      return statusPayload(context.conversation);

    case "prepare_request": {
      const record = context.conversation.workflow;
      if (!record) return { error: "no_workflow" };
      if (record.stage === "SUBMITTED") {
        return {
          alreadySubmitted: true,
          reference: record.reference,
          note: "Tell the visitor it is already filed and quote the reference. Do not offer to send it again.",
        };
      }

      const missing = missingRequired(record);
      if (missing.length > 0) {
        return {
          ready: false,
          missing: missing.map((f) => ({ field: f.key, label: f.label, ask: f.ask })),
          note: "Not ready. Ask for what is missing — one or two things at a time.",
        };
      }

      record.stage = "AWAITING_CONFIRMATION";
      record.updatedAt = Date.now();
      return {
        ready: true,
        summary: toView(record).collected,
        note:
          "A confirmation card is now on screen with a send button. Read back the summary in your own words and ask them to tap it. You cannot send it yourself — do not claim you have.",
      };
    }

    default:
      /*
       * Unreachable through the model: the API only ever returns a tool name it
       * was given. Kept as a hard stop so a future refactor that adds a
       * definition without a handler fails loudly rather than silently doing
       * nothing while the model believes it worked.
       */
      return { error: `Unknown tool: ${name}` };
  }
}

/** Collected/missing, shaped for the model rather than for display. */
function statusPayload(conversation: Conversation): ToolResult {
  const record = conversation.workflow;
  if (!record) return { workflow: null };

  const spec = WORKFLOWS[record.id];
  return {
    workflow: record.id,
    title: spec.title,
    stage: record.stage,
    collected: record.data,
    missingRequired: missingRequired(record).map((f) => ({
      field: f.key,
      label: f.label,
      ask: f.ask,
      options: f.options?.length ? f.options : undefined,
    })),
    stillCouldAsk: missingOptional(record)
      .slice(0, 4)
      .map((f) => ({ field: f.key, label: f.label, ask: f.ask, options: f.options?.length ? f.options : undefined })),
  };
}
