"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon, type IconName } from "./icons";
import { Logo } from "@/components/ui/logo";

type Item = { href: string; label: string; icon: IconName; exact?: boolean };

export function DashboardNav({ items, user, editorHref, logout }: { items: Item[]; user: { name: string; email: string; admin: boolean }; editorHref: string | null; logout: () => Promise<void> }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const all: Item[] = [
    ...items.slice(0, 4),
    ...(editorHref ? [{ href: editorHref, label: "Editor", icon: "edit" as const }] : []),
    ...items.slice(4),
    ...(user.admin ? [{ href: "/admin", label: "Admin", icon: "shield" as const }] : []),
  ];
  const active = (i: Item) => (i.exact ? pathname === i.href : pathname === i.href || pathname.startsWith(i.href + "/"));

  const list = (
    <nav aria-label="Dashboard" className="flex flex-1 flex-col gap-1">
      {all.map((i) => (
        <Link
          key={i.href + i.label}
          href={i.href}
          onClick={() => setOpen(false)}
          aria-current={active(i) ? "page" : undefined}
          className={`flex items-center gap-3 rounded-sm px-3 py-2 text-small font-medium transition-colors ${active(i) ? "bg-primary-soft text-primary" : "text-fg-secondary hover:bg-canvas-inset hover:text-fg"}`}
        >
          <Icon name={i.icon} />
          {i.label}
        </Link>
      ))}
    </nav>
  );

  const footer = (
    <div className="border-t border-line pt-4">
      <p className="truncate text-small font-semibold text-fg">{user.name || "Your account"}</p>
      <p className="truncate text-caption font-normal normal-case tracking-normal text-fg-muted">{user.email}</p>
      <form action={logout} className="mt-3">
        <button className="flex items-center gap-2 text-small text-fg-muted hover:text-fg">
          <Icon name="logout" size={16} /> Log out
        </button>
      </form>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-surface px-4 lg:hidden">
        <Logo />
        <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="grid size-10 place-items-center rounded-sm hover:bg-canvas-inset">
          <Icon name="menu" />
        </button>
      </header>
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-6 border-r border-line bg-surface p-4 lg:flex">
        <div className="px-2 pt-1">
          <Logo />
        </div>
        {list}
        {footer}
      </aside>
      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col gap-6 bg-surface p-4 shadow-e5">
            <div className="flex items-center justify-between px-2">
              <Logo />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="grid size-10 place-items-center rounded-sm hover:bg-canvas-inset">
                <Icon name="x" />
              </button>
            </div>
            {list}
            {footer}
          </div>
        </div>
      ) : null}
    </>
  );
}
