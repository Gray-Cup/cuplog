import React from "react";
import Link from "next/link";
import { UserProfile } from "@/components/user-profile";
import { DashboardSidebar } from "./_sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen overflow-hidden flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <header className="h-14 shrink-0 bg-white border-b border-neutral-100 flex items-center justify-between px-5">
      <Link href="/" className="font-heading font-bold text-neutral-900 text-lg">
        CupLog
      </Link>
      <UserProfile className="size-8" />
    </header>
  );
}
