import { getUser } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getUser();

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-heading text-neutral-900">Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}.
          </p>
        </div>
        <Button className="gap-2 h-8 text-sm" disabled>
          <Plus className="size-3.5" />
          New Session
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-200 border border-dashed border-neutral-200">
        <StatCard label="Total Sessions" value="0" />
        <StatCard label="Coffees Cupped" value="0" />
        <StatCard label="Avg Score" value="—" />
        <StatCard label="This Month" value="0" />
      </div>

      {/* Recent sessions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-neutral-800">Recent Sessions</h2>
          <Button variant="ghost" size="sm" className="text-muted-foreground text-xs h-7" disabled>
            View all
          </Button>
        </div>
        <div className="border border-dashed border-neutral-200">
          <div className="py-10 text-center">
            <div className="w-8 h-8 border border-dashed border-neutral-300 mx-auto mb-3 flex items-center justify-center">
              <CupIcon />
            </div>
            <h3 className="text-sm font-medium text-neutral-700 mb-1">No sessions yet</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-4">
              Create your first cupping session to start scoring coffees with the SCA method.
            </p>
            <Button disabled className="gap-2 h-8 text-sm">
              <Plus className="size-3.5" />
              New Session
            </Button>
          </div>
        </div>
      </div>

      {/* Score reference */}
      <div>
        <h2 className="text-sm font-semibold text-neutral-800 mb-3">Score Reference</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-200 border border-dashed border-neutral-200">
          {[
            { range: "90+", label: "Outstanding" },
            { range: "85–89.99", label: "Excellent" },
            { range: "80–84.99", label: "Very Good" },
            { range: "< 80", label: "Not specialty" },
          ].map((tier) => (
            <div key={tier.range} className="bg-white p-3">
              <p className="font-mono font-bold text-sm text-neutral-900">{tier.range}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{tier.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Getting started */}
      <div className="border border-dashed border-neutral-200 p-4">
        <h2 className="text-sm font-semibold text-neutral-800 mb-2">Getting started</h2>
        <div className="space-y-1.5 text-xs text-muted-foreground">
          {[
            "Create a new cupping session and add the coffees you're evaluating.",
            "Score each attribute — fragrance, flavor, acidity, body, balance, and more.",
            "CupLog calculates the SCA final score automatically. Review and export results.",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="font-mono bg-neutral-100 px-1.5 py-0.5 text-neutral-600 shrink-0">{i + 1}</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-dashed border-neutral-200">
          <Button variant="outline" size="sm" className="border-dashed h-7 text-xs" asChild>
            <Link href="/dashboard/samples">View sample sessions</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-3">
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-xl font-bold font-mono text-neutral-900">{value}</p>
    </div>
  );
}

function CupIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 8h20l-2 12H6L4 8z" fill="#d4d4d4" />
      <path d="M24 10h2a2 2 0 0 1 0 4h-2" stroke="#d4d4d4" strokeWidth="2" strokeLinecap="square" />
      <rect x="2" y="21" width="24" height="2" fill="#d4d4d4" />
    </svg>
  );
}
