"use client";

import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import AdminLoader from "@/components/organisms/modals/loader/adminLoader";
import ModalContainer from "@/components/organisms/modals/modals-content/modal-container";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import useAuth from "@/hooks/useAuth";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const { user } = useAuthStore();
  const router = useRouter();

  useAuth();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      if (window.innerWidth < 1024) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="bg-white w-screen h-screen flex overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-30">
        <Navbar onOpen={() => setOpen(true)} sidebarCollapsed={collapsed} />
      </div>

      <div className="hidden lg:block fixed left-3 top-3 bottom-3 z-40">
        <Sidebar
          onClose={() => setOpen(false)}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((value) => !value)}
        />
      </div>

      <div
        className={twMerge(
          "block lg:hidden fixed top-0 left-0 bottom-0 z-50 transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar
          onClose={() => setOpen(false)}
          collapsed={false}
          onToggleCollapse={() => setCollapsed((value) => !value)}
        />
      </div>

      <main
        className="w-full h-full pt-20 relative z-20 transition-[margin-left] duration-300"
        style={{ marginLeft: collapsed ? "96px" : "272px" }}
      >
        <div className="h-full overflow-y-auto">
          <div className="min-h-full p-6 lg:p-8">
            {children}
          </div>
        </div>
      </main>

      <div
        className={twMerge(
          "fixed inset-0 bg-black/40 z-30 lg:hidden",
          open ? "block" : "hidden"
        )}
        onClick={() => setOpen(false)}
      />
    </section>
  );
}
