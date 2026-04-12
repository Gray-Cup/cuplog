"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FlaskConical, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/samples", label: "Samples", icon: FlaskConical },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-52 flex-col shrink-0 border-r border-neutral-100 bg-neutral-50">
      <nav className="flex flex-col gap-0.5 p-3 pt-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors",
                active
                  ? "bg-white text-neutral-900 font-medium shadow-xs border border-neutral-100"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-white/60"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
