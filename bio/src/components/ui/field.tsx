import type { ComponentProps, ReactNode } from "react";

export function Field({ label, hint, error, children, htmlFor }: { label: ReactNode; hint?: ReactNode; error?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-small font-semibold text-fg">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-small text-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-small text-fg-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input(props: ComponentProps<"input">) {
  return <input {...props} className={`field ${props.className ?? ""}`} />;
}

export function Textarea(props: ComponentProps<"textarea">) {
  return <textarea {...props} className={`field min-h-24 ${props.className ?? ""}`} />;
}

export function Select(props: ComponentProps<"select">) {
  return <select {...props} className={`field ${props.className ?? ""}`} />;
}

export function Notice({ tone = "info", children }: { tone?: "info" | "success" | "error" | "warning"; children: ReactNode }) {
  const tones = {
    info: "bg-primary-soft text-fg",
    success: "bg-success-soft text-success",
    error: "bg-error-soft text-error",
    warning: "bg-warning-soft text-warning",
  } as const;
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`rounded-sm px-4 py-3 text-small ${tones[tone]}`}>
      {children}
    </div>
  );
}
