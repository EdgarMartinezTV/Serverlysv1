/**
 * The four stages of getting something online: Build → Launch → Grow → Manage.
 *
 * This is the spine of the homepage. The hero cards, the sticky stage rail and
 * the four stage sections all read from here, so the labels, anchors and order
 * can only ever be changed in one place. Three surfaces that used to disagree
 * about what "Grow" meant now cannot.
 *
 * `id` doubles as the section anchor (`#build`) and the scroll-spy key — the
 * rail observes elements by exactly these ids, so renaming one without renaming
 * its section silently breaks the rail rather than erroring.
 */

export type StageId = "build" | "launch" | "grow" | "manage";

export type Stage = {
  id: StageId;
  /** Shown on the tab pill over the open card. Must exist in nav-icons. */
  icon: "layout" | "globe" | "chat" | "shield";
  /** Rail label and hero card title. One word — the rail is a compact row. */
  label: string;
  /** Hero card subtitle. Fits on two lines at the collapsed card width. */
  blurb: string;
  /** Section heading for the matching stage band. */
  heading: string;
  /** Section lede. */
  lede: string;
};

export const stages: readonly Stage[] = [
  {
    id: "build",
    icon: "layout",
    label: "Build",
    blurb: "Get a real site standing, on hardware that will not be the reason it is slow.",
    heading: "Build it on infrastructure that is not the bottleneck",
    lede:
      "NVMe storage, a managed LiteSpeed stack and a control panel that does not hide the parts you need. Bring an existing site and we move it for you.",
  },
  {
    id: "launch",
    icon: "globe",
    label: "Launch",
    blurb: "Domain, SSL, email and DNS handled before you send the first link.",
    heading: "Launch with the essentials already done",
    lede:
      "A domain, a certificate, working mail and DNS you can actually edit. None of it is an upsell and none of it is a separate invoice.",
  },
  {
    id: "grow",
    icon: "chat",
    label: "Grow",
    blurb: "Turn the traffic you already have into conversations and bookings.",
    heading: "Grow what the site already brings you",
    lede:
      "Most sites do not need more visitors first. They need the ones arriving now to be answered. That is what ConvoAI and CallFlow are for.",
  },
  {
    id: "manage",
    icon: "shield",
    label: "Manage",
    blurb: "Backups, updates, staging and monitoring, without a standing chore list.",
    heading: "Manage it without it becoming a second job",
    lede:
      "Daily backups, one-click staging, automatic updates and someone reachable when it matters. Or hand the whole thing to us.",
  },
];

export const stageById = (id: StageId) => stages.find((s) => s.id === id)!;
