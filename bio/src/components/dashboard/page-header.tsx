import type { ReactNode } from "react";

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 px-5 pb-6 pt-8 sm:px-8">
      <div className="min-w-0">
        <h1 className="text-h3 font-semibold">{title}</h1>
        {description ? <p className="mt-1 text-body text-fg-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function Body({ children }: { children: ReactNode }) {
  return <div className="px-5 pb-16 sm:px-8">{children}</div>;
}
