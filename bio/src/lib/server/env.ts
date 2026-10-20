import "server-only";

/**
 * Server configuration. Every value is read here so nothing else touches
 * process.env, and so a missing production secret fails loudly at first use
 * instead of silently weakening security.
 */
function required(name: string, devFallback: string): string {
  const v = process.env[name];
  if (v) return v;
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") {
    throw new Error(`Missing required environment variable ${name}`);
  }
  return devFallback;
}

export const env = {
  get appUrl() {
    return (process.env.APP_URL ?? "http://localhost:3200").replace(/\/$/, "");
  },
  get marketingUrl() {
    return process.env.MARKETING_URL ?? "https://serverlys.com/bio";
  },
  get authSecret() {
    return required("AUTH_SECRET", "dev-only-secret-change-me-0123456789abcdef");
  },
  get resendKey() {
    return process.env.RESEND_API_KEY ?? "";
  },
  get emailFrom() {
    return process.env.EMAIL_FROM ?? "Serverlys Bio <bio@serverlys.com>";
  },
  get redisUrl() {
    return process.env.REDIS_URL ?? "";
  },
  get storageDir() {
    return process.env.STORAGE_DIR ?? ".data/media";
  },
  /** IP address/hostname customers point custom domains at (A / CNAME target). */
  get domainTargetHost() {
    return process.env.CUSTOM_DOMAIN_TARGET ?? "bio.serverlys.com";
  },
  get domainTargetIp() {
    return process.env.CUSTOM_DOMAIN_TARGET_IP ?? "72.61.9.224";
  },
  get oidc() {
    return {
      issuer: process.env.SERVERLYS_OIDC_ISSUER ?? "",
      clientId: process.env.SERVERLYS_OIDC_CLIENT_ID ?? "",
      clientSecret: process.env.SERVERLYS_OIDC_CLIENT_SECRET ?? "",
    };
  },
  get isProd() {
    return process.env.NODE_ENV === "production";
  },
  /** Comma-separated emails promoted to ADMIN on login (bootstrap only). */
  get adminEmails() {
    return (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  },
};

/** The host the app itself answers on (bio.serverlys.com in production). */
export function appHost(): string {
  return new URL(env.appUrl).host;
}
