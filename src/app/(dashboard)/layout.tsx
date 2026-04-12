import React from "react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/components/user-profile";
import { FlaskConical, Layout, Settings } from "lucide-react";
import Link from "next/link";
import { DashboardNavButtons } from "@/components/nav-buttons";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen overflow-hidden flex flex-col">
      <MockNavbar />
      <div className="flex h-full overflow-hidden">
        <MockSidebar />
        <div id="main" className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

const MockNavbar = () => {
  return (
    <div id="nav" className="border-b border-dashed bg-[#FBFBFB] flex items-center justify-between shrink-0">
      <div id="brand" className="h-full md:border-r border-dashed w-[260px] flex items-center justify-center">
        <Button variant="ghost" className="w-full h-full font-heading text-lg md:text-2xl font-bold gap-2.5" asChild>
          <Link href="/">
            <span>CupLog</span>
          </Link>
        </Button>
      </div>
      <div className="flex-1 flex items-center justify-end h-full border-dashed divide-x divide-dashed">
        <DashboardNavButtons />
        <UserProfile className="size-10 md:size-14" />
      </div>
    </div>
  )
}

const MockSidebar = () => {
  return (
    <div id="sidebar" className="w-[260px] border-r border-dashed bg-[#FBFBFB] hidden md:flex flex-col shrink-0">
      <div className="flex flex-col divide-y divide-dashed border-b border-dashed">
        <SidebarLink href="/dashboard" icon={<Layout className="size-4" />} label="Dashboard" />
        <SidebarLink href="/dashboard/samples" icon={<FlaskConical className="size-4" />} label="Samples" />
        <SidebarLink href="/dashboard/settings" icon={<Settings className="size-4" />} label="Settings" />
      </div>
    </div>
  )
}

function SidebarLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Button
      variant="ghost"
      className="border-dashed h-11 text-left justify-start pl-5 rounded-none gap-3 font-normal text-sm"
      asChild
    >
      <Link href={href}>
        {icon}
        <span>{label}</span>
      </Link>
    </Button>
  );
}