"use client";

import { useAuthStore } from "@/store/auth";
import { ModalNames, useModalStore } from "@/store/modal";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Menu, Settings, Bell } from "lucide-react";

interface Props {
  onOpen: () => void;
  sidebarCollapsed: boolean;
}

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Tableau de bord",
  "/admin/companies/pending": "Entreprises en attente",
  "/admin/entrepreneurs": "Gestion des entrepreneurs",
  "/admin/users": "Gestion des utilisateurs",
  "/admin/my-campaigns": "Mes campagnes",
  "/admin/projects": "Explorer les projets",
  "/admin/portfolio": "Mon portefeuille",
  "/admin/notifications": "Notifications",
};

const generateBreadcrumb = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  const pathMap: Record<string, string> = {
    admin: "",
    dashboard: "Dashboard",
    companies: "Entreprises",
    pending: "En attente",
    projects: "Projets",
    entrepreneurs: "Entrepreneurs",
    users: "Utilisateurs",
    "my-campaigns": "Mes Campagnes",
    portfolio: "Portefeuille",
    notifications: "Notifications",
  };

  const breadcrumbItems: { label: string; path: string }[] = [];
  let currentPath = "";

  segments.forEach((segment) => {
    if (/^[0-9a-f-]{8,}$/i.test(segment) || /^\d+$/.test(segment)) return;
    currentPath += `/${segment}`;
    const label =
      pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    if (label) {
      breadcrumbItems.push({ label, currentPath });
    }
  });

  return breadcrumbItems;
};

export default function Navbar({ onOpen, sidebarCollapsed }: Props) {
  const { user } = useAuthStore();
  const { toggle } = useModalStore();
  const pathname = usePathname();
  const unreadCount = 0;

  const breadcrumbItems = useMemo(
    () => generateBreadcrumb(pathname),
    [pathname]
  );
  const pageTitle = useMemo(
    () => pageTitles[pathname] || "",
    [pathname]
  );

  if (!user) return null;

  return (
    <header className="w-full h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      {/* Left section */}
      <div
        className="flex items-center gap-4"
        style={{
          marginLeft: sidebarCollapsed ? "92px" : "268px",
          transition: "margin-left 300ms",
        }}
      >
        <button
          className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          onClick={onOpen}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-slate-500" />
        </button>

        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            {breadcrumbItems.length > 0 ? (
              breadcrumbItems.map((item, index) => (
                <div key={item.path} className="flex items-center gap-1.5">
                  <Link
                    href={item.path}
                    className="hover:text-slate-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                  {index < breadcrumbItems.length - 1 && (
                    <span className="text-slate-300">/</span>
                  )}
                </div>
              ))
            ) : (
              <span>Dashboard</span>
            )}
          </div>
          {pageTitle && (
            <h1 className="text-sm font-bold text-slate-900">{pageTitle}</h1>
          )}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => toggle({ name: ModalNames.PROFILE_DETAIL })}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-slate-400" />
        </button>

        <Link href="/admin/notifications">
          <button
            className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-400" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-white bg-destructive font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        </Link>
      </div>
    </header>
  );
}
