import React from "react";
import Link from "next/link";
import { MarketingNavButtons } from "@/components/nav-buttons";
import { UserProfile } from "@/components/user-profile";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Header */}
      <header className="w-full bg-white">
        <div className="flex h-16 items-center justify-between max-w-4xl mx-auto px-4 lg:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-semibold flex items-center gap-3">
              <span className="text-md font-bold text-neutral-800 font-heading">CupLog</span>
            </Link>
            <nav className="hidden text-sm md:flex gap-6">
              <Link href="https://graycup.org" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                Developed by Gray Cup
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <GitHubWidget repo="Gray-Cup/cuplog" stars="100" />
            <MarketingNavButtons />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#FBFBFB]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 py-6 flex items-center justify-between text-sm text-muted-foreground relative">
          <span>© {new Date().getFullYear()} CupLog</span>
          <span className="absolute left-1/2 -translate-x-1/2 text-xs text-muted-foreground">made with love in india</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="https://x.com/arjvnz" target="_blank" className="hover:text-foreground transition-colors">Twitter</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const GitHubWidget = ({ repo, stars }: { repo: string; stars: string }) => {
  return (
    <div className="hidden md:flex items-stretch border border-neutral-200 text-sm overflow-hidden rounded-full">
      <a
        href={`https://github.com/${repo}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-50 transition-colors text-neutral-700"
        aria-label={`${repo} on GitHub`}
      >
        <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" fill="currentColor">
          <path d="M6.766 11.328c-2.063-.25-3.516-1.734-3.516-3.656 0-.781.281-1.625.75-2.188-.203-.515-.172-1.609.063-2.062.625-.078 1.468.25 1.968.703.594-.187 1.219-.281 1.985-.281.765 0 1.39.094 1.953.265.484-.437 1.344-.765 1.969-.687.218.422.25 1.515.046 2.047.5.593.766 1.39.766 2.203 0 1.922-1.453 3.375-3.547 3.64.531.344.89 1.094.89 1.954v1.625c0 .468.391.734.86.547C13.781 14.359 16 11.53 16 8.03 16 3.61 12.406 0 7.984 0 3.563 0 0 3.61 0 8.031a7.88 7.88 0 0 0 5.172 7.422c.422.156.828-.125.828-.547v-1.25c-.219.094-.5.156-.75.156-1.031 0-1.64-.562-2.078-1.609-.172-.422-.36-.672-.719-.719-.187-.015-.25-.093-.25-.187 0-.188.313-.328.625-.328.453 0 .844.281 1.25.86.313.452.64.655 1.031.655s.641-.14 1-.5c.266-.265.47-.5.657-.656" />
        </svg>
        <span>GitHub</span>
      </a>
      <a
        href={`https://github.com/${repo}/stargazers`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center px-2.5 py-1.5 bg-neutral-50 hover:bg-neutral-100 transition-colors text-neutral-600 border-l border-neutral-200 font-mono text-xs"
        aria-label={`${stars} stargazers on GitHub`}
      >
        {stars}
      </a>
    </div>
  );
};
