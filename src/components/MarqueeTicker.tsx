import React from "react";

const items = [
  "SCA-Standard Scoring",
  "10 Attributes",
  "Team Sessions",
  "Export to PDF",
  "Flavour Wheel",
  "Built for Q-Graders",
  "Free to Start",
  "Score History",
  "Blind Cuppings",
  "Session Notes",
];

export default function MarqueeTicker() {
  const doubled = [...items, ...items];

  return (
    <section className="bg-amber-400 border-b border-ink overflow-hidden py-4">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-sans font-bold text-xs text-ink uppercase tracking-label flex items-center gap-3"
          >
            <span className="text-base" style={{ opacity: 0.4 }}>→</span>
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
