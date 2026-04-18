"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserProfile } from "@/components/user-profile";
import { useSession } from "@/lib/auth-client";

const SESSION_CACHE_KEY = "cl_session_state";

export function MarketingNavButtons() {
  const { data: session, isPending } = useSession();
  const [cached, setCached] = useState<"in" | "out" | null>(null);

  useEffect(() => {
    const val = localStorage.getItem(SESSION_CACHE_KEY);
    if (val === "in" || val === "out") setCached(val);
  }, []);

  useEffect(() => {
    if (!isPending) {
      const next = session ? "in" : "out";
      localStorage.setItem(SESSION_CACHE_KEY, next);
      setCached(next);
    }
  }, [isPending, session]);

  // Use resolved session truth, fall back to cache, default to "out" if no cache
  const displayState = !isPending ? (session ? "in" : "out") : (cached ?? "out");

  return (
    <>
      {displayState === "in" ? (
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
      )}
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