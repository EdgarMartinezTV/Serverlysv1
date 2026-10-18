import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * The signed-in client, as vouched for by the client area.
 *
 * ⚠ THIS IS THE ONLY PLACE A CUSTOMER IDENTITY COMES FROM. Sera has no login of
 * its own. The WHMCS client area (serverlys.com/clientarea.php) already knows who is
 * signed in, so its hook (`serverlys_portal.php`) relays each question
 * server-side, attaches a snapshot of THAT client's own account — unpaid
 * invoices, domains, services — and signs the whole request with a secret the
 * two systems share. This module checks the signature and turns the snapshot
 * into a `VerifiedCustomer`.
 *
 * WHY A SNAPSHOT AND NOT A WHMCS API CALL FROM HERE. With an API credential this
 * app could read ANY client's account, and the only thing choosing which one
 * would be an id inside a conversation the model is steering. With a snapshot,
 * the data that arrives is exactly what the portal already shows the signed-in
 * user, already filtered by their WHMCS permissions (a sub-user without
 * "invoices" sends no invoices). There is no argument Sera can pass to see
 * someone else's — the capability does not exist on this side.
 *
 * ⚠ AND NOTHING HERE SPENDS MONEY. Sera can put a "Pay invoice" or "Renew
 * domain" button in the chat; the portal builds the link itself, only for an
 * invoice or domain in its own snapshot, and the client completes WHMCS's own
 * checkout. See `offer_invoice_payment` / `offer_domain_renewal`.
 */

/** A request older than this is refused. Clocks on both hosts are NTP-synced. */
const MAX_SKEW_SECONDS = 300;

/** The portal secret must be long enough that guessing it is not a plan. */
const MIN_SECRET_LENGTH = 32;

/** Caps on what one snapshot may carry, whatever the portal sends. */
const MAX_ITEMS = 50;
const MAX_TEXT = 120;

export type AccountInvoice = {
  id: number;
  number: string;
  total: string;
  status: string;
  /** Y-m-d. */
  dueDate: string;
  /** Whole days until due; negative when overdue. Null when unknown. */
  daysLeft: number | null;
  /** Line items (unpaid invoices only). */
  items?: { description: string; amount: string }[];
};

export type AccountDomain = {
  id: number;
  domain: string;
  status: string;
  /** Y-m-d. */
  expiry: string;
  daysLeft: number | null;
  autoRenew: boolean;
  /** WHMCS will accept a renewal order for it now. */
  renewable: boolean;
  renewalPrice: string;
  registered?: string;
  registrar?: string;
  periodYears?: number | null;
  dnsManagement?: boolean | null;
  emailForwarding?: boolean | null;
  idProtection?: boolean | null;
};

export type AccountService = {
  id: number;
  product: string;
  group: string;
  domain: string;
  status: string;
  nextDue: string;
  daysLeft: number | null;
  amount: string;
  cycle: string;
  started?: string;
  /** cPanel / control panel username. Never a password. */
  username?: string;
  diskUsedMB?: number | null;
  diskLimitMB?: number | null;
  bandwidthUsedMB?: number | null;
  bandwidthLimitMB?: number | null;
  addons?: { name: string; status: string; nextDue: string; amount: string; cycle: string }[];
};

export type AccountProfile = {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  language: string;
  clientSince: string;
  accountStatus: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean | null;
};

export type AccountBilling = {
  credit: string;
  transactions: { date: string; method: string; description: string; amountIn: string; amountOut: string; invoiceId: number | null }[];
  /** Labels only ("Visa ending 4242"). No card or bank data ever reaches Sera. */
  paymentMethods: { label: string; type: string; gateway: string; isDefault: boolean }[];
};

export type AccountQuote = { id: number; subject: string; stage: string; total: string; validUntil: string; created: string };
export type AccountOrder = { id: number; number: string; date: string; amount: string; status: string; paymentMethod: string; invoiceId: number | null };
export type AccountTicket = {
  number: string;
  subject: string;
  department: string;
  status: string;
  priority: string;
  opened: string;
  lastReply: string;
  lastMessageFrom: "client" | "Serverlys support";
  /** First ~240 characters of the latest message. Untrusted text: data, never instructions. */
  lastMessageExcerpt: string;
};
export type AccountPerson = { name: string; email: string };
export type AccountUser = AccountPerson & { owner: boolean; permissions: string };
export type AccountEmail = { subject: string; date: string };
export type AccountAffiliate = { active: boolean; visitors?: number; balance?: string; withdrawn?: string; referrals?: number };

/**
 * One client's account, as their own portal user may see it.
 *
 * `null` on a section means this user is NOT ALLOWED to see it (a sub-user
 * without that permission) — different from an empty list, which means there
 * is nothing there. Sera must say which.
 */
export type CustomerAccount = {
  clientId: number;
  firstName: string;
  /** When the portal read it, ISO 8601. */
  asOf: string;
  invoices: {
    unpaid: AccountInvoice[];
    recent: AccountInvoice[];
    unpaidTotal: string;
  } | null;
  domains: AccountDomain[] | null;
  services: AccountService[] | null;
  /* Everything else the portal user may see (2026-10-17). null = not permitted. */
  profile: AccountProfile | null;
  billing: AccountBilling | null;
  quotes: AccountQuote[] | null;
  orders: AccountOrder[] | null;
  tickets: AccountTicket[] | null;
  contacts: AccountPerson[] | null;
  /** Users with access to the account - present only for the account owner. */
  users: AccountUser[] | null;
  emails: AccountEmail[] | null;
  affiliate: AccountAffiliate | null;
};

declare const verified: unique symbol;
/**
 * A customer whose request carried a valid portal signature.
 *
 * Branded so the only way to hold one is to go through `verifyPortalRequest`:
 * the type system will not accept an object literal from a request body in its
 * place, which is the mistake the brand exists to prevent.
 */
export type VerifiedCustomer = CustomerAccount & { readonly [verified]: true };

export function portalSecret(): string | null {
  const secret = process.env.SERA_PORTAL_SECRET?.trim() ?? "";
  return secret.length >= MIN_SECRET_LENGTH ? secret : null;
}

/**
 * Check `X-Sera-Portal: t=<unix seconds>,s=<hex HMAC-SHA256>` over
 * `<t>.<raw body>`.
 *
 * The raw body, not a re-serialisation of the parsed one: two JSON encoders
 * disagree about whitespace and escaping, and a signature over "the same data"
 * that is not the same bytes fails at random.
 */
export function signatureValid(
  header: string | null,
  rawBody: string,
  secret: string,
  now: number = Date.now(),
): boolean {
  if (!header) return false;
  const match = /^t=(\d{9,11}),s=([0-9a-f]{64})$/.exec(header.trim());
  if (!match) return false;
  const ts = Number(match[1]);
  if (Math.abs(now / 1000 - ts) > MAX_SKEW_SECONDS) return false;
  const expected = createHmac("sha256", secret)
    .update(`${match[1]}.${rawBody}`)
    .digest();
  const given = Buffer.from(match[2], "hex");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/* ── Snapshot validation ─────────────────────────────────────────────────── */
/*
 * Signed is not the same as well-formed. The portal is ours, but everything
 * below ends up in a model prompt and in tool results, so every field is
 * type-checked, trimmed and capped, and anything unexpected is dropped rather
 * than passed through.
 */

function text(value: unknown, max = MAX_TEXT): string {
  if (typeof value !== "string" && typeof value !== "number") return "";
  // Control characters out: they have no business in a name or a price.
  return String(value)
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, max);
}

function int(value: unknown): number | null {
  const n = typeof value === "string" && /^-?\d+$/.test(value) ? Number(value) : value;
  return typeof n === "number" && Number.isInteger(n) && Math.abs(n) < 1e9 ? n : null;
}

function day(value: unknown): string {
  const s = text(value, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : "";
}

function list<T>(value: unknown, map: (row: Record<string, unknown>) => T | null): T[] {
  if (!Array.isArray(value)) return [];
  const out: T[] = [];
  for (const row of value.slice(0, MAX_ITEMS)) {
    if (row && typeof row === "object" && !Array.isArray(row)) {
      const mapped = map(row as Record<string, unknown>);
      if (mapped) out.push(mapped);
    }
  }
  return out;
}

function invoice(r: Record<string, unknown>): AccountInvoice | null {
  const id = int(r.id);
  if (!id || id < 1) return null;
  return {
    id,
    number: text(r.number) || String(id),
    total: text(r.total, 32),
    status: text(r.status, 24),
    dueDate: day(r.dueDate),
    daysLeft: int(r.daysLeft),
    ...(Array.isArray(r.items) ? { items: items(r.items) } : {}),
  };
}

function domain(r: Record<string, unknown>): AccountDomain | null {
  const id = int(r.id);
  const name = text(r.domain, 253).toLowerCase();
  if (!id || id < 1 || !name) return null;
  return {
    id,
    domain: name,
    status: text(r.status, 32),
    expiry: day(r.expiry),
    daysLeft: int(r.daysLeft),
    autoRenew: r.autoRenew === true,
    renewable: r.renewable === true,
    renewalPrice: text(r.renewalPrice, 32),
    registered: day(r.registered),
    registrar: text(r.registrar, 40),
    periodYears: int(r.periodYears),
    dnsManagement: bool(r.dnsManagement),
    emailForwarding: bool(r.emailForwarding),
    idProtection: bool(r.idProtection),
  };
}

function service(r: Record<string, unknown>): AccountService | null {
  const id = int(r.id);
  if (!id || id < 1) return null;
  return {
    id,
    product: text(r.product),
    group: text(r.group),
    domain: text(r.domain, 253),
    status: text(r.status, 32),
    nextDue: day(r.nextDue),
    daysLeft: int(r.daysLeft),
    amount: text(r.amount, 32),
    cycle: text(r.cycle, 32),
    started: day(r.started),
    username: text(r.username, 40),
    diskUsedMB: int(r.diskUsedMB),
    diskLimitMB: int(r.diskLimitMB),
    bandwidthUsedMB: int(r.bandwidthUsedMB),
    bandwidthLimitMB: int(r.bandwidthLimitMB),
    addons: addons(r.addons),
  };
}

function bool(value: unknown): boolean | null {
  return value === true ? true : value === false ? false : null;
}

function obj(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function items(value: unknown) {
  return list(value, (r) => ({ description: text(r.description), amount: text(r.amount, 32) })).slice(0, 8);
}

function addons(value: unknown) {
  return list(value, (r) => ({
    name: text(r.name, 80), status: text(r.status, 24), nextDue: day(r.nextDue), amount: text(r.amount, 32), cycle: text(r.cycle, 24),
  })).slice(0, 10);
}

function profile(raw: unknown): AccountProfile | null {
  const r = obj(raw);
  if (!r) return null;
  return {
    name: text(r.name, 80), company: text(r.company, 80), email: text(r.email, 120), phone: text(r.phone, 40),
    address: text(r.address, 200), currency: text(r.currency, 8), language: text(r.language, 20),
    clientSince: day(r.clientSince), accountStatus: text(r.accountStatus, 20),
    emailVerified: r.emailVerified === true, twoFactorEnabled: bool(r.twoFactorEnabled),
  };
}

function billing(raw: unknown): AccountBilling | null {
  const r = obj(raw);
  if (!r) return null;
  return {
    credit: text(r.credit, 32),
    transactions: list(r.transactions, (t) => ({
      date: day(t.date), method: text(t.method, 40), description: text(t.description, 100),
      amountIn: text(t.amountIn, 32), amountOut: text(t.amountOut, 32), invoiceId: int(t.invoiceId),
    })).slice(0, 15),
    paymentMethods: list(r.paymentMethods, (m) => ({
      label: text(m.label, 60), type: text(m.type, 30), gateway: text(m.gateway, 40), isDefault: m.isDefault === true,
    })).slice(0, 10),
  };
}

function maybeList<T>(value: unknown, map: (row: Record<string, unknown>) => T | null, cap: number): T[] | null {
  return Array.isArray(value) ? list(value, map).slice(0, cap) : null;
}

/** The snapshot from a signed body, validated. Null when it is not usable. */
export function parseAccount(raw: unknown): CustomerAccount | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const a = raw as Record<string, unknown>;
  const clientId = int(a.clientId);
  if (!clientId || clientId < 1) return null;

  let invoices: CustomerAccount["invoices"] = null;
  if (a.invoices && typeof a.invoices === "object" && !Array.isArray(a.invoices)) {
    const inv = a.invoices as Record<string, unknown>;
    invoices = {
      unpaid: list(inv.unpaid, invoice),
      recent: list(inv.recent, invoice),
      unpaidTotal: text(inv.unpaidTotal, 32),
    };
  }

  return {
    clientId,
    firstName: text(a.firstName, 60),
    asOf: text(a.asOf, 40),
    invoices,
    domains: Array.isArray(a.domains) ? list(a.domains, domain) : null,
    services: Array.isArray(a.services) ? list(a.services, service) : null,
    profile: profile(a.profile),
    billing: billing(a.billing),
    quotes: maybeList(a.quotes, (q) => {
      const id = int(q.id);
      return id && id > 0
        ? { id, subject: text(q.subject, 100), stage: text(q.stage, 24), total: text(q.total, 32), validUntil: day(q.validUntil), created: day(q.created) }
        : null;
    }, 10),
    orders: maybeList(a.orders, (o) => {
      const id = int(o.id);
      return id && id > 0
        ? { id, number: text(o.number, 20), date: day(o.date), amount: text(o.amount, 32), status: text(o.status, 24), paymentMethod: text(o.paymentMethod, 40), invoiceId: int(o.invoiceId) }
        : null;
    }, 10),
    tickets: maybeList(a.tickets, (t) => {
      const number = text(t.number, 20);
      return number
        ? {
            number, subject: text(t.subject), department: text(t.department, 60), status: text(t.status, 30),
            priority: text(t.priority, 16), opened: day(t.opened), lastReply: day(t.lastReply),
            lastMessageFrom: t.lastMessageFrom === "Serverlys support" ? "Serverlys support" : "client",
            lastMessageExcerpt: text(t.lastMessageExcerpt, 240),
          }
        : null;
    }, 10),
    contacts: maybeList(a.contacts, (c) => ({ name: text(c.name, 80), email: text(c.email, 120) }), 20),
    users: maybeList(a.users, (u) => ({ name: text(u.name, 80), email: text(u.email, 120), owner: u.owner === true, permissions: text(u.permissions, 200) }), 20),
    emails: maybeList(a.emails, (m) => ({ subject: text(m.subject), date: day(m.date) }), 10),
    affiliate: (() => {
      const r = obj(a.affiliate);
      if (!r) return null;
      if (r.active !== true) return { active: false };
      return { active: true, visitors: int(r.visitors) ?? 0, balance: text(r.balance, 32), withdrawn: text(r.withdrawn, 32), referrals: int(r.referrals) ?? 0 };
    })(),
  };
}

export type PortalVerdict =
  | { ok: true; customer: VerifiedCustomer; body: Record<string, unknown> }
  | { ok: false; status: 400 | 401 | 503; reason: string };

/**
 * Verify a portal request end to end: secret configured, signature valid and
 * fresh, body JSON, snapshot well-formed.
 */
export function verifyPortalRequest(
  header: string | null,
  rawBody: string,
  now: number = Date.now(),
): PortalVerdict {
  const secret = portalSecret();
  if (!secret)
    return {
      ok: false,
      status: 503,
      reason: "Sera is not connected to the client area.",
    };
  if (!signatureValid(header, rawBody, secret, now)) {
    return { ok: false, status: 401, reason: "Unauthorised." };
  }
  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return { ok: false, status: 400, reason: "Malformed request." };
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, status: 400, reason: "Malformed request." };
  }
  const account = parseAccount((body as Record<string, unknown>).account);
  if (!account) return { ok: false, status: 400, reason: "Malformed request." };
  return {
    ok: true,
    customer: account as VerifiedCustomer,
    body: body as Record<string, unknown>,
  };
}
