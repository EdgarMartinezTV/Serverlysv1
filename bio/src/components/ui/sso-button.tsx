/** "Continue with Serverlys" — only rendered when OIDC is configured. */
export function SsoButton({ next }: { next: string }) {
  return (
    <div className="mt-8">
      <a href={`/api/auth/sso/start?next=${encodeURIComponent(next)}`} className="btn h-12 w-full gap-3 text-body text-fg ring-1 ring-line hover:bg-canvas-secondary">
        <img src="/brand/logo-square.png" alt="" width={20} height={20} className="rounded-[4px]" />
        Continue with your Serverlys account
      </a>
      <p className="mt-6 flex items-center gap-3 text-caption uppercase text-fg-muted before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">or</p>
    </div>
  );
}
