"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-peach border-b border-ink">
      {/* Row 1: Logo + CTA */}
      <div className="border-b border-ink">
        <div
          className="flex justify-between items-center px-6 md:px-12 py-4"
          style={{ maxWidth: "1024px", margin: "0 auto" }}
        >
          <Link
            href="/"
            className="font-sans font-medium text-3xl text-ink"
            style={{ letterSpacing: "0.04em" }}
          >
            CUPLOG
          </Link>

          <div className="flex items-center gap-6">
            <span className="hidden md:flex items-center gap-2 font-sans font-bold text-sm text-ink uppercase tracking-label">
              <span>●</span>
              <span>Start Cupping</span>
            </span>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span
                className={`block w-6 h-px bg-ink transition-transform duration-200 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block w-6 h-px bg-ink transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-6 h-px bg-ink transition-transform duration-200 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Nav links */}
      <div className="hidden md:block">
        <div
          className="flex justify-between items-center px-6 md:px-12 py-3"
          style={{ maxWidth: "1024px", margin: "0 auto" }}
        >
          <nav className="flex gap-8">
            <Link href="https://graycup.org" target="_blank" className="nav-link font-sans text-sm text-ink">
            Visit Gray Cup
            </Link>
            <Link href="/pricing" className="nav-link font-sans text-sm text-ink">
              Pricing
            </Link>
            <Link href="/about" className="nav-link font-sans text-sm text-ink">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-6">
            <a
              href="https://app.cuplog.app/login"
              className="nav-link font-sans text-sm text-ink"
            >
              Log in
            </a>
            <a
              href="https://app.cuplog.app/sign-up"
              className="nav-link font-sans text-sm text-ink"
            >
              Sign up
            </a>
          </div>
        </div>
      </div>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-0 bg-peach z-40 flex flex-col px-8 pt-24 pb-12">
          <button
            className="absolute top-6 right-6 p-2"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <span className="block w-6 h-px bg-ink rotate-45 translate-y-px" />
            <span className="block w-6 h-px bg-ink -rotate-45 -translate-y-px" />
          </button>

          <nav className="flex flex-col gap-8 flex-1">
            {[
              { href: "https://graycup.org", label: "Visit Gray Cup" },
              { href: "/pricing", label: "Pricing" },
              { href: "/about", label: "About" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-serif text-4xl text-ink"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-4 border-t border-ink pt-8 mt-8">
            <a
              href="https://app.cuplog.app/login"
              className="font-sans text-sm text-ink"
            >
              Log in
            </a>
            <span className="font-sans font-bold text-sm text-ink uppercase tracking-label flex items-center gap-2">
              <span>●</span>
              <span>Start Cupping</span>
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
