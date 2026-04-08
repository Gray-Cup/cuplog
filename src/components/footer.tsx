"use client";

import React from "react";
import Link from "next/link";

const columns = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Changelog", href: "#" },
      { label: "Roadmap", href: "#" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help Centre", href: "#" },
      { label: "Contact", href: "mailto:hello@cuplog.app" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "#" },
      { label: "Twitter / X", href: "#" },
      { label: "Instagram", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink">
      <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] border-b border-white/20 px-6 md:px-12 py-12 gap-12">
          <div>
            <Link
              href="/"
              className="font-sans font-bold text-3xl text-white"
              style={{ letterSpacing: "0.04em" }}
            >
              CupLog
            </Link>
            <p className="font-sans text-base text-white mt-2" style={{ opacity: 0.5 }}>
              Score every cup.
            </p>
          </div>

          <div
            className="border border-white/35 bg-white px-6 py-4 self-start"
            style={{ minWidth: "140px" }}
          >
            <p
              className="font-sans font-bold text-xs text-black uppercase tracking-label"
              style={{ opacity: 0.4 }}
            >
              SCA Aligned
            </p>
            <p className="font-sans text-xs text-neutral-100 mt-1" style={{ opacity: 0.4 }}>
              Standard scoring
            </p>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 border-b border-white/20 px-6 md:px-12 py-12 gap-10">
          {columns.map((col) => (
            <div key={col.heading}>
              <p
                className="font-sans font-bold text-xs text-white uppercase tracking-label mb-5"
                style={{ opacity: 0.4 }}
              >
                {col.heading}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-white hover:opacity-100 transition-opacity"
                      style={{ opacity: 0.6 }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-b border-white/20 px-6 md:px-12 py-10">
          <p className="font-sans text-sm text-white mb-4" style={{ opacity: 0.6 }}>
            Sign up for cupping tips and new feature updates
          </p>
          <form
            className="flex flex-col sm:flex-row border border-white/30"
            style={{ maxWidth: "480px", borderRadius: 0 }}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 font-sans text-sm text-white bg-transparent px-4 py-3 outline-none placeholder:opacity-30"
              style={{ borderRadius: 0 }}
            />
            <button
              type="submit"
              className="font-sans font-semibold text-xs text-ink bg-white px-6 py-3 border-t sm:border-t-0 sm:border-l border-white/30 uppercase tracking-label"
              style={{ borderRadius: 0 }}
            >
              Subscribe →
            </button>
          </form>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 md:px-12 py-6 gap-4">
          <p className="font-sans text-xs text-white" style={{ opacity: 0.35 }}>
            © 2025 CupLog · All rights reserved
          </p>
          <a
            href="https://app.cuplog.app/sign-up"
            className="font-sans text-xs font-semibold text-white border-b border-white/40 pb-0.5"
            style={{ opacity: 0.5 }}
          >
            Feeling bold? Try a blind cup →
          </a>
        </div>
      </div>
    </footer>
  );
}
