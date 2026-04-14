import { getUser } from "@/lib/auth-utils";
import { getDashboardStats } from "./samples/actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const [user, stats] = await Promise.all([getUser(), getDashboardStats()]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-neutral-900">
            {user?.name ? `Hey, ${user.name.split(" ")[0]}.` : "Dashboard"}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Your cupping workspace.
          </p>
        </div>
        <Button className="gap-2 h-8 text-sm" disabled>
          <Plus className="size-3.5" />
          New Session
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-8">
        <Stat label="Samples" value={String(stats.total)} />
        <Stat label="Cupped" value={String(stats.cupped)} />
        <Stat label="Avg score" value={stats.avgScore !== null ? stats.avgScore.toFixed(2) : "—"} />
        <Stat label="This month" value={String(stats.thisMonth)} />
      </div>

      {/* Recent sessions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-neutral-800">Recent sessions</h2>
          <Button variant="ghost" size="sm" className="text-neutral-400 text-xs h-7" disabled>
            View all
          </Button>
        </div>
        <div className="border border-neutral-100 rounded-md py-12 text-center">
          <CupIcon />
          <p className="text-sm font-medium text-neutral-600 mt-3 mb-1">No sessions yet</p>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto mb-5">
            Create your first cupping session to start scoring with the SCA method.
          </p>
          <Button disabled className="gap-2 h-8 text-sm">
            <Plus className="size-3.5" />
            New Session
          </Button>
        </div>
      </div>

      {/* Getting started */}
      <div>
        <h2 className="text-sm font-semibold text-neutral-800 mb-3">Getting started</h2>
        <ol className="space-y-2 text-sm text-neutral-500">
          {[
            "Log a received sample under Samples.",
            "Start a cupping session — score each SCA attribute.",
            "CupLog calculates the final score. Review and export.",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-xs font-mono text-neutral-300 mt-0.5 shrink-0">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <div className="mt-4">
          <Button variant="outline" size="sm" className="h-7 text-xs border-neutral-200" asChild>
            <Link href="/dashboard/samples">Log a sample →</Link>
          </Button>
        </div>
      </div>

      {/* Score tiers reference */}
      <div>
        <h2 className="text-sm font-semibold text-neutral-800 mb-3">SCA score tiers</h2>
        <div className="flex gap-6 flex-wrap text-sm">
          {[
            { range: "90+", label: "Outstanding" },
            { range: "85–89", label: "Excellent" },
            { range: "80–84", label: "Very Good" },
            { range: "< 80", label: "Not specialty" },
          ].map((t) => (
            <div key={t.range}>
              <p className="font-mono font-semibold text-neutral-900">{t.range}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{t.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-2xl font-bold font-mono text-neutral-900">{value}</p>
      <p className="text-xs text-neutral-400 mt-1">{label}</p>
    </div>
  );
}

function CupIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
      <path d="M4 8h20l-2 12H6L4 8z" fill="#e5e5e5" />
      <path d="M24 10h2a2 2 0 0 1 0 4h-2" stroke="#e5e5e5" strokeWidth="2" strokeLinecap="square" />
      <rect x="2" y="21" width="24" height="2" fill="#e5e5e5" />
    </svg>
  );
}
