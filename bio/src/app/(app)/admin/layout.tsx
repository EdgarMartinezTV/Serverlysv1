import type { Metadata } from "next";
import { requireAdmin } from "@/lib/server/auth";
import { logoutAction } from "@/lib/actions/auth";
import { DashboardNav } from "@/components/dashboard/nav";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin · Serverlys Bio" }, robots: { index: false, follow: false } };

/** Every /admin page is behind this check; actions re-check in lib/actions/admin.ts. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-dvh bg-canvas-secondary lg:flex">
      <DashboardNav
        user={{ name: `${admin.name || "Admin"} · Admin`, email: admin.email, admin: false }}
        editorHref={null}
        logout={logoutAction}
        items={[
          { href: "/admin", label: "Overview", icon: "chart", exact: true },
          { href: "/admin/users", label: "Users", icon: "user" },
          { href: "/admin/pages", label: "Bio pages", icon: "pages" },
          { href: "/admin/reports", label: "Reports", icon: "shield" },
          { href: "/admin/domains", label: "Domains", icon: "globe" },
          { href: "/admin/templates", label: "Templates", icon: "grid" },
          { href: "/admin/health", label: "Service health", icon: "settings" },
          { href: "/admin/audit", label: "Audit log", icon: "inbox" },
          { href: "/dashboard", label: "Back to dashboard", icon: "arrowLeft", exact: true },
        ]}
      />
      <main id="main" className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
}
