"use client";

import React from "react";
import Link from "next/link";
import { UserProfile } from "@/components/user-profile";
import { useSession } from "@/lib/auth-client";

export function MarketingNavButtons() {
  const { data: session, isPending } = useSession();

  return (
    <>
      {!isPending && (session ? (
        <Link href="/dashboard" className="flex text-sm font-medium py-1.5 px-3.5 items-center text-white bg-neutral-900 hover:bg-neutral-700 transition-colors rounded-full">
          Dashboard
        </Link>
      ) : (
        <>
          <Link href="/sign-in" className="flex text-muted-foreground text-sm font-medium items-center">
            Sign In
          </Link>
          <Link href="/sign-up" className="flex text-sm font-medium py-1.5 px-3.5 items-center text-white bg-blue-500 hover:bg-blue-600 transition-colors rounded-full">
            Sign Up
          </Link>
        </>
      ))}
      <UserProfile className="size-9" />
    </>
  );
}

export function DashboardNavButtons() {
  return (
    <>
      <div className="h-full border-l border-dashed">
        <a href="https://x.com/arjunaditya_" target="_blank" className="flex items-center">
          <span>X</span>
        </a>
      </div>
      <div className="h-full border-l border-dashed">
        <a href="https://github.com/Gray-Cup/cuplog" target="_blank" className="flex items-center">
          <span>Github</span>
        </a>
      </div>
    </>
  );
} 