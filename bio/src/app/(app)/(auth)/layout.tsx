import { Logo } from "@/components/ui/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_minmax(0,560px)]">
      <aside className="relative hidden overflow-hidden bg-canvas-abyss p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Logo href={process.env.MARKETING_URL ?? "https://serverlys.com/bio"} tone="light" />
        <div className="max-w-md">
          <p className="font-display text-[40px] leading-[1.1] text-white">One link for everything you do.</p>
          <p className="mt-4 text-body-lg text-fg-on-dark-secondary">Templates, a visual editor, analytics and lead forms. Free — no card, no paid plans.</p>
        </div>
        <p className="text-small text-fg-on-dark-muted">Serverlys Bio is a free product by Serverlys.</p>
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full bg-primary opacity-40 blur-[120px]" />
      </aside>
      <main id="main" className="flex flex-col px-5 py-10 sm:px-10">
        <div className="lg:hidden">
          <Logo href={process.env.MARKETING_URL ?? "https://serverlys.com/bio"} />
        </div>
        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-10">{children}</div>
      </main>
    </div>
  );
}
