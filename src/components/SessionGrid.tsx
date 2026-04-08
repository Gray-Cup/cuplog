import React from "react";

const sessions = [
  {
    id: 1,
    origin: "Ethiopia: Yirgacheffe",
    process: "Natural Process",
    score: 87.25,
    colorClass: "bg-score-citrus",
    attributes: [
      { name: "Fragrance", score: 8.5 },
      { name: "Flavour", score: 8.75 },
      { name: "Acidity", score: 8.0 },
      { name: "Body", score: 8.25 },
      { name: "Aftertaste", score: 8.5 },
    ],
  },
  {
    id: 2,
    origin: "Colombia: Huila",
    process: "Washed",
    score: 85.5,
    colorClass: "bg-score-nutty",
    attributes: [
      { name: "Fragrance", score: 8.25 },
      { name: "Flavour", score: 8.5 },
      { name: "Acidity", score: 8.25 },
      { name: "Body", score: 8.0 },
      { name: "Aftertaste", score: 8.25 },
    ],
  },
  {
    id: 3,
    origin: "Kenya: Nyeri",
    process: "Honey Process",
    score: 88.0,
    colorClass: "bg-score-fruity",
    attributes: [
      { name: "Fragrance", score: 8.75 },
      { name: "Flavour", score: 8.75 },
      { name: "Acidity", score: 8.5 },
      { name: "Body", score: 8.0 },
      { name: "Aftertaste", score: 8.5 },
    ],
  },
  {
    id: 4,
    origin: "Guatemala: Antigua",
    process: "Fully Washed",
    score: 84.75,
    colorClass: "bg-score-cocoa",
    attributes: [
      { name: "Fragrance", score: 8.0 },
      { name: "Flavour", score: 8.25 },
      { name: "Acidity", score: 8.0 },
      { name: "Body", score: 8.5 },
      { name: "Aftertaste", score: 8.25 },
    ],
  },
];

export default function SessionGrid() {
  return (
    <section id="features" className="bg-paper border-b border-ink">
      <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
        {/* Section header */}
        <div className="px-6 md:px-10 pt-16 pb-2">
          <h2
            className="font-sans font-semibold uppercase text-ink"
            style={{ fontSize: "clamp(2.75rem, 5vw, 4.5rem)", lineHeight: 1.0 }}
          >
            From the cupping table.
          </h2>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-ink">
          {sessions.map((session, i) => (
            <div
              key={session.id}
              className={`session-card pb-8 ${i < sessions.length - 1 ? "border-b lg:border-b-0 lg:border-r border-ink" : ""}`}
            >
              <div className={`${session.colorClass} border-b border-ink`} style={{ height: "140px" }} />

              <div className="px-5 pt-5">
                <p className="font-sans font-bold text-xs text-ink uppercase tracking-label">
                  {session.origin}
                </p>
                <p className="font-sans text-sm text-ink mt-1" style={{ opacity: 0.6 }}>
                  {session.process}
                </p>

                <div className="border-t border-ink mt-4 pt-4">
                  <div className="flex items-baseline gap-2">
                    <span
                      className="font-sans font-bold text-ink"
                      style={{ fontSize: "2rem", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}
                    >
                      {session.score}
                    </span>
                    <span className="font-sans text-xs text-ink uppercase tracking-label" style={{ opacity: 0.45 }}>
                      Score
                    </span>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  {session.attributes.map((attr) => (
                    <div key={attr.name} className="flex justify-between font-sans text-sm text-ink">
                      <span style={{ opacity: 0.55 }}>{attr.name}</span>
                      <span className="font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {attr.score}
                      </span>
                    </div>
                  ))}
                </div>

                <a
                  href="https://app.cuplog.app/sign-up"
                  className="inline-flex items-center gap-1 font-sans text-sm font-semibold text-ink border border-ink px-4 py-2 mt-5"
                  style={{ borderRadius: 0 }}
                >
                  View Session →
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 md:px-10 pb-14 pt-6">
          <a
            href="https://app.cuplog.app/sign-up"
            className="font-sans text-sm font-semibold text-ink uppercase tracking-label"
          >
            All Sessions →
          </a>
        </div>
      </div>
    </section>
  );
}
