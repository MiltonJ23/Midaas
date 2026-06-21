"use client";

import { authProvider } from "@/api/auth";
import { AdminStorageKeys } from "@/api/admin";
import { sidebar } from "@/data/navigation/sidebar";
import { Storage } from "@/api/auth/storage";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { useAuthStore } from "@/store/auth";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

interface Props {
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  onClose,
  collapsed = false,
  onToggleCollapse,
}: Props) {
  const pathname = usePathname();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { user } = useAuthStore();
  const isExpanded = !collapsed;

  const userRole = user?.role ?? "investor";

  const filteredSidebar = useMemo(() => {
    return sidebar.filter((item) => {
      if (!item.allowedRoles || item.allowedRoles.length === 0) return true;
      const roleMap: Record<string, string> = {
        investor: "ROLE_CLIENT",
        entrepreneur: "ROLE_FRANCHISEE",
        admin: "ROLE_ADMIN",
      };
      return item.allowedRoles.includes(roleMap[userRole] as any);
    });
  }, [userRole]);

  const handleToggleCollapse = () => {
    onToggleCollapse?.();
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    Storage.removeItem(AdminStorageKeys.adminAccess);
    Storage.removeItem(AdminStorageKeys.adminId);
    await authProvider.logout();
    setLogoutLoading(false);
  };

  return (
    <aside
      className={twMerge(
        "relative h-full bg-slate-900 flex flex-col overflow-hidden transition-all duration-300 rounded-2xl shadow-xl",
        !isExpanded ? "w-[72px]" : "w-[248px]"
      )}
    >
      {/* Logo */}
      <div
        className={twMerge(
          "flex items-center justify-center py-5 transition-all duration-300 shrink-0",
          !isExpanded ? "px-3" : "px-5"
        )}
      >
        <Image
          src="/logo.png"
          alt="Midaas"
          width={!isExpanded ? 40 : 110}
          height={48}
          className="object-contain brightness-0 invert"
          priority
        />
      </div>

      {/* Navigation */}
      <nav
        className={twMerge(
          "flex-1 overflow-y-auto py-4 transition-all duration-300",
          !isExpanded ? "px-3" : "px-3"
        )}
      >
        <ul className="flex flex-col gap-1">
          {filteredSidebar.map((item) => {
            const isActive =
              pathname === item.link || pathname.startsWith(item.link + "/");
            const Icon = item.icon;

            return (
              <li key={item.key}>
                <Link
                  href={item.link}
                  onClick={onClose}
                  className={twMerge(
                    "flex items-center rounded-xl transition-all duration-200",
                    !isExpanded
                      ? "justify-center py-3 px-0"
                      : "gap-3 py-2.5 px-3",
                    isActive
                      ? "bg-primary text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  )}
                >
                  <Icon
                    className={twMerge(
                      "shrink-0 transition-colors",
                      !isExpanded ? "w-5 h-5" : "w-4 h-4"
                    )}
                    strokeWidth={isActive ? 2.5 : 1.75}
                  />
                  <span
                    className={twMerge(
                      "text-sm font-medium whitespace-nowrap transition-all duration-200 overflow-hidden",
                      !isExpanded
                        ? "max-w-0 opacity-0"
                        : "max-w-[160px] opacity-100",
                      isActive && "font-bold"
                    )}
                  >
                    {item.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom actions */}
      <div className={twMerge("pb-4 shrink-0", !isExpanded ? "px-3" : "px-4")}>
        <button
          onClick={handleToggleCollapse}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
          aria-label={!isExpanded ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isExpanded ? (
            <>
              <PanelLeftClose className="w-4 h-4" />
              <span>Collapse</span>
            </>
          ) : (
            <PanelLeft className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className={twMerge(
            "w-full flex items-center justify-center rounded-xl text-sm font-medium transition-colors disabled:opacity-50 mt-2",
            !isExpanded
              ? "py-3 text-slate-400 hover:text-white hover:bg-slate-800"
              : "gap-2.5 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800"
          )}
        >
          <LogOut className="w-4 h-4" />
          {isExpanded && (
            <span>{logoutLoading ? "..." : "Déconnexion"}</span>
          )}
        </button>
      </div>
    </aside>
  );
}
