import React from "react";

const categories = [
  {
    title: "Cupping Sessions",
    description:
      "Log every session with SCA-standard scoring forms. Add your coffees, origin, process, and roast details in seconds.",
    cta: "Start logging →",
  },
  {
    title: "Score History",
    description:
      "Track your scores over time and see how your palate develops. Visualise trends, compare coffees, spot patterns.",
    cta: "View history →",
  },
  {
    title: "Flavour Wheel",
    description:
      "Visual tasting notes with the full SCA flavour wheel built in. Tag every session with precise descriptor vocabulary.",
    cta: "Explore wheel →",
  },
  {
    title: "Team Cuppings",
    description:
      "Invite your team. Score together. Compare results and discuss every attribute across your whole tasting panel.",
    cta: "Invite team →",
  },
];

export default function CategoryTiles() {
  return (
    <section className="bg-paper border-b border-ink">
      <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
        <div className="px-6 md:px-10 pt-16 pb-2">
          <h2
            className="font-sans font-semibold uppercase text-ink"
            style={{ fontSize: "clamp(2.75rem, 5vw, 4.5rem)", lineHeight: 1.0 }}
          >
            Everything you need to cup.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-ink">
          {categories.map((cat, i) => (
            <div
              key={cat.title}
              className={`px-6 md:px-7 py-10 ${i < categories.length - 1 ? "border-b sm:border-b-0 sm:border-r border-ink" : ""}`}
            >
              <h3 className="font-sans font-bold text-xs text-ink uppercase tracking-label">
                {cat.title}
              </h3>
              <p className="font-sans text-base text-ink mt-4 leading-relaxed" style={{ opacity: 0.7 }}>
                {cat.description}
              </p>
              <a
                href="https://app.cuplog.app/sign-up"
                className="inline-block font-sans text-sm font-semibold text-ink mt-6 border-b border-ink pb-0.5"
              >
                {cat.cta}
              </a>
            </div>
          ))}
        </div>

        <div className="h-14" />
      </div>
    </section>
  );
}
