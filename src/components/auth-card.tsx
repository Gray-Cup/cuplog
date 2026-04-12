"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="flex items-center justify-center w-full px-4">
      <div className="w-full max-w-[320px] bg-white rounded-[8px] shadow-sm">
        <div className="px-5 pt-4 pb-0 text-center">
          <h1 className="text-sm font-semibold text-neutral-800">
            {mode === "sign-in" ? "Sign in" : "Create account"}
          </h1>
        </div>

        <form onSubmit={handleEmailSubmit} className="px-5 pt-3 pb-4 space-y-2">
          {mode === "sign-up" && (
            <Input
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border-neutral-200"
              autoComplete="name"
            />
          )}

          <Input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-neutral-200"
            autoComplete="email"
          />

          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="border-neutral-200"
            autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
          />

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-[6px] px-3 py-2">
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

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          <Button
            type="button"
            variant="outline"
            className={cn("w-full border-neutral-200", googleLoading && "opacity-70")}
            disabled={googleLoading || emailLoading}
            onClick={handleGoogle}
          >
            {googleLoading ? <Loader2 className="size-4 animate-spin" /> : <Icons.Google />}
            Continue with Google
          </Button>
        </form>

        <div className="border-t border-neutral-100 px-5 py-2.5 text-center text-xs text-muted-foreground">
          {mode === "sign-in" ? (
            <>
              No account?{" "}
              <Link href="/sign-up" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Have an account?{" "}
              <Link href="/sign-in" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </>
          )}
          <p className="mt-1.5 text-xs text-neutral-400">
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
