import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-10 md:py-16 text-center border-b border-dashed border-neutral-200">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
          SCA-standard cupping · digital · precise
        </p>
        <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 font-heading tracking-tight mb-4">
          SCA cup scoring,<br />simplified.
        </h1>
        <p className="text-base text-muted-foreground max-w-lg mx-auto mb-7">
          The fastest way to evaluate coffee. Replace paper forms with a clean digital cupping sheet built for speed and accuracy.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild className="px-5 h-9">
            <Link href="/sign-up">Get Started</Link>
          </Button>
          <Button variant="outline" asChild className="px-5 h-9 border-dashed">
            <Link href="#how-it-works">How It Works</Link>
          </Button>
        </div>
      </section>

      {/* Value props */}
      <section className="py-10 border-b border-dashed border-neutral-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200 border border-neutral-200">
          <ValueProp label="Instant calculation" description="Scores are totaled automatically as you input. No mental math, no formula errors." />
          <ValueProp label="Session management" description="Organize cupping sessions with multiple coffees, origins, and roast metadata." />
          <ValueProp label="Multi-cupper support" description="Multiple users score the same coffee. Scores are averaged to reduce individual bias." />
          <ValueProp label="Full history" description="Every session is stored. Compare batches, track consistency, monitor quality trends." />
          <ValueProp label="Distraction-free" description="No clutter. The interface disappears — only the coffee and the score remain." />
          <ValueProp label="Export-ready" description="Export results for reporting, importing into spreadsheets, or sharing with buyers." />
        </div>
      </section>

      {/* How SCA scoring works */}
      <section id="how-it-works" className="py-10 border-b border-dashed border-neutral-200">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">The method</p>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900 font-heading mb-1">How SCA cup scoring works</h2>
          <p className="text-sm text-muted-foreground mb-7 max-w-2xl">
            Standardized method used by roasters, buyers, and Q-graders. Each attribute scored 6.00–10.00 in 0.25 increments.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Positive attributes */}
            <div className="border border-dashed border-neutral-200 p-4">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Positive attributes (6.00 → 10.00)</p>
              <div className="space-y-2">
                {[
                  { name: "Fragrance / Aroma", desc: "Smell dry and wet" },
                  { name: "Flavor", desc: "Overall taste profile" },
                  { name: "Aftertaste", desc: "Length & quality of finish" },
                  { name: "Acidity", desc: "Brightness, not sourness" },
                  { name: "Body", desc: "Mouthfeel — light to heavy" },
                  { name: "Balance", desc: "Harmony of all components" },
                  { name: "Overall", desc: "Subjective final impression" },
                ].map((attr) => (
                  <div key={attr.name} className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-neutral-800">{attr.name}</span>
                    <span className="text-xs text-muted-foreground text-right">{attr.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div className="border border-dashed border-neutral-200 p-4">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Per-cup checks (5 cups)</p>
                <div className="space-y-1.5">
                  {["Uniformity", "Clean Cup", "Sweetness"].map((check) => (
                    <div key={check} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-800">{check}</span>
                      <span className="text-xs text-muted-foreground">+2 pts per cup · max 10</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-dashed border-neutral-200 p-4">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Defects (negative)</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-800">Taint</span>
                    <span className="text-xs text-red-600 font-mono">−2 pts each</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-800">Fault</span>
                    <span className="text-xs text-red-600 font-mono">−4 pts each</span>
                  </div>
                </div>
              </div>

              <div className="border border-dashed border-neutral-200 p-4 bg-neutral-50">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Final score formula</p>
                <p className="font-mono text-xs text-neutral-700 leading-relaxed">
                  Σ attributes<br />
                  + Uniformity + Clean Cup + Sweetness<br />
                  − Defects<br />
                  <span className="text-neutral-400">──────────────────</span><br />
                  = <strong className="text-neutral-900">Final Score</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Score interpretation */}
      <section className="py-10 border-b border-dashed border-neutral-200">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Interpretation</p>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900 font-heading mb-5">What the score means</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-200 border border-neutral-200">
            {[
              { range: "90+", label: "Outstanding", color: "text-neutral-900" },
              { range: "85–89.99", label: "Excellent", color: "text-neutral-700" },
              { range: "80–84.99", label: "Very Good", color: "text-neutral-600" },
              { range: "< 80", label: "Not specialty", color: "text-muted-foreground" },
            ].map((tier) => (
              <div key={tier.range} className="bg-white p-4">
                <p className={`text-xl font-bold font-mono ${tier.color} mb-0.5`}>{tier.range}</p>
                <p className="text-xs text-muted-foreground">{tier.label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Scores 80+ qualify as specialty. This is a lab-grade evaluation used in real trade decisions.
          </p>
        </div>
      </section>

      {/* What CupLog is */}
      <section className="py-10 border-b border-dashed border-neutral-200">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">The product</p>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900 font-heading mb-2">
            A quality control system, not just a scoring tool.
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mb-6">
            CupLog replaces paper SCA forms and adds workflow and analytics for roasters, buyers, and Q-graders.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-200 border border-neutral-200">
            {[
              { title: "Digital cupping forms", body: "Input scores directly. Totals calculate automatically. No transcription errors from paper." },
              { title: "Session & batch management", body: "Create sessions, add multiple coffees, store origin, variety, and roast metadata." },
              { title: "Multi-cupper averaging", body: "Multiple users score independently. CupLog averages scores to reduce individual bias." },
              { title: "Quality analytics", body: "Track scores across batches, monitor consistency, and make better roasting decisions." },
            ].map((item) => (
              <div key={item.title} className="bg-white p-4">
                <h3 className="font-semibold text-sm text-neutral-800 mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 text-center">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Ready to cup?</p>
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 font-heading mb-3">
          Clean cupping. Zero clutter.
        </h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
          Start your first cupping session in under a minute.
        </p>
        <Button asChild className="px-8">
          <Link href="/sign-up">Get Started — It&apos;s Free</Link>
        </Button>
      </section>
    </div>
  );
}

function ValueProp({ label, description }: { label: string; description: string }) {
  return (
    <div className="bg-white p-4 md:p-5">
      <h3 className="font-semibold text-sm text-neutral-800 mb-1">{label}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
