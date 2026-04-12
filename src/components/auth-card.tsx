"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Icons } from "@/components/icons";
import Link from "next/link";

export default function AuthCard({ mode = "sign-in" }: { mode?: "sign-in" | "sign-up" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailLoading(true);

    try {
      if (mode === "sign-up") {
        const { error } = await signUp.email({
          name,
          email,
          password,
          callbackURL: "/dashboard",
        });
        if (error) setError(error.message ?? "Sign up failed.");
      } else {
        const { error } = await signIn.email({
          email,
          password,
          callbackURL: "/dashboard",
        });
        if (error) setError(error.message ?? "Sign in failed. Check your credentials.");
      }
    } finally {
      setEmailLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    await signIn.social({ provider: "google", callbackURL: "/dashboard" });
  };

  return (
    <div className="flex items-center justify-center w-full min-h-[60vh] px-4">
      <div className="w-full max-w-sm border border-neutral-200 bg-white">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 pt-6 pb-1">
          <CupLogMark />
          <span className="font-bold text-lg font-heading">CupLog</span>
        </div>

        <div className="px-6 pt-3 pb-1 text-center">
          <h1 className="text-base font-semibold text-neutral-800">
            {mode === "sign-in" ? "Sign in to your account" : "Create your account"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {mode === "sign-in"
              ? "Welcome back. Enter your credentials to continue."
              : "Start cupping with SCA-standard scoring."}
          </p>
        </div>

        <form onSubmit={handleEmailSubmit} className="px-6 pt-3 pb-5 space-y-3">
          {mode === "sign-up" && (
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-neutral-200"
                autoComplete="name"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-neutral-200"
              autoComplete="email"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder={mode === "sign-up" ? "At least 8 characters" : "Your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="border-neutral-200"
              autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={emailLoading || googleLoading}
          >
            {emailLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : mode === "sign-in" ? (
              "Sign in"
            ) : (
              "Create account"
            )}
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          {/* Google */}
          <Button
            type="button"
            variant="outline"
            className={cn("w-full gap-2 border-neutral-200", googleLoading && "opacity-70")}
            disabled={googleLoading || emailLoading}
            onClick={handleGoogle}
          >
            {googleLoading ? <Loader2 className="size-4 animate-spin" /> : <Icons.Google />}
            Continue with Google
          </Button>
        </form>

        {/* Footer */}
        <div className="border-t border-neutral-100 px-6 py-3 text-center text-xs text-muted-foreground">
          {mode === "sign-in" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </>
          )}
          <p className="mt-2 text-neutral-400">
            By continuing you agree to our{" "}
            <Link href="/terms" className="hover:underline">Terms</Link>
            {" & "}
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

const CupLogMark = () => (
  <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 8h20l-2 12H6L4 8z" fill="#171717" />
    <path d="M24 10h2a2 2 0 0 1 0 4h-2" stroke="#171717" strokeWidth="2" strokeLinecap="square" />
    <rect x="2" y="21" width="24" height="2" fill="#171717" />
    <path d="M10 5V3" stroke="#171717" strokeWidth="1.5" strokeLinecap="square" />
    <path d="M14 6V3" stroke="#171717" strokeWidth="1.5" strokeLinecap="square" />
    <path d="M18 5V3" stroke="#171717" strokeWidth="1.5" strokeLinecap="square" />
  </svg>
);
