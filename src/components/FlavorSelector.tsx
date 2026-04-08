"use client";

import React, { useState } from "react";

const flavors = [
  {
    id: "citrus",
    label: "Citrus",
    colorClass: "bg-score-citrus",
    description:
      "Bright, zesty notes with lemon, orange, and grapefruit acidity. High clarity cups with a clean, vibrant finish.",
    exampleScore: 87.5,
    exampleOrigin: "Ethiopia, Kenya, Rwanda",
  },
  {
    id: "floral",
    label: "Floral",
    colorClass: "bg-score-floral",
    description:
      "Delicate jasmine, rose, and bergamot aromatics in the cup. Elegant, perfumed, and often associated with high-altitude naturals.",
    exampleScore: 88.0,
    exampleOrigin: "Ethiopia Yirgacheffe, Panama Geisha",
  },
  {
    id: "nutty",
    label: "Nutty",
    colorClass: "bg-score-nutty",
    description:
      "Rich almond, hazelnut, and walnut warmth. Comforting, rounded sweetness with a smooth, lingering body.",
    exampleScore: 84.25,
    exampleOrigin: "Brazil, Guatemala, Honduras",
  },
  {
    id: "fruity",
    label: "Fruity",
    colorClass: "bg-score-fruity",
    description:
      "Stone fruit and berry sweetness — peach, plum, blueberry, and strawberry. Often natural-processed, always expressive.",
    exampleScore: 86.75,
    exampleOrigin: "Ethiopia Natural, Burundi, Bolivia",
  },
  {
    id: "cocoa",
    label: "Cocoa",
    colorClass: "bg-score-cocoa",
    description:
      "Deep chocolate and dark roast depth. Dark cherry, bittersweet cocoa, and a heavy, silky body.",
    exampleScore: 83.5,
    exampleOrigin: "Colombia, Peru, Mexico",
  },
  {
    id: "sweet",
    label: "Sweet",
    colorClass: "bg-score-citrus",
    description:
      "Caramel, brown sugar, and honey sweetness. Balanced and approachable, with a long, clean finish.",
    exampleScore: 85.0,
    exampleOrigin: "Costa Rica, El Salvador, Nicaragua",
  },
];

export default function FlavorSelector() {
  const [active, setActive] = useState(flavors[0].id);
  const selected = flavors.find((f) => f.id === active)!;

  return (
    <section id="flavours" className="bg-paper border-b border-ink">
      <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
        <div className="px-6 md:px-10 pt-16 pb-2">
          <h2
            className="font-sans font-semibold uppercase text-ink"
            style={{ fontSize: "clamp(2.75rem, 5vw, 4.5rem)", lineHeight: 1.0 }}
          >
            What does your cup taste like?
          </h2>
        </div>

        {/* Tab row */}
        <div
          className="flex gap-0 overflow-x-auto border-b border-ink px-6 md:px-10"
          style={{ scrollbarWidth: "none" }}
        >
          {flavors.map((flavor) => (
            <button
              key={flavor.id}
              onClick={() => setActive(flavor.id)}
              className={`font-sans text-sm text-ink px-5 py-4 border-b-2 whitespace-nowrap transition-colors ${
                active === flavor.id
                  ? "border-ink font-semibold"
                  : "border-transparent"
              }`}
              style={{ borderRadius: 0 }}
            >
              {flavor.label}
            </button>
          ))}
        </div>

        {/* Selected flavor content */}
        <div className="grid md:grid-cols-2 border-b border-ink">
          {/* Color swatch */}
          <div
            className={`${selected.colorClass} border-r border-ink`}
            style={{ minHeight: "240px" }}
          />

          {/* Description */}
          <div className="px-8 md:px-12 py-10">
            <h3 className="font-sans font-semibold uppercase text-3xl text-ink mb-4">
              {selected.label}
            </h3>
            <p
              className="font-sans text-base text-ink leading-relaxed"
              style={{ maxWidth: "440px", opacity: 0.8 }}
            >
              {selected.description}
            </p>

            <div className="mt-6 flex items-center gap-6">
              <div>
                <p
                  className="font-sans text-xs text-ink uppercase tracking-label"
                  style={{ opacity: 0.5 }}
                >
                  Avg Score
                </p>
                <p
                  className="font-sans font-bold text-ink"
                  style={{ fontSize: "2rem", fontVariantNumeric: "tabular-nums" }}
                >
                  {selected.exampleScore}
                </p>
              </div>
              <div className="w-px bg-ink self-stretch" style={{ opacity: 0.15 }} />
              <div>
                <p
                  className="font-sans text-xs text-ink uppercase tracking-label"
                  style={{ opacity: 0.5 }}
                >
                  Typical Origins
                </p>
                <p className="font-sans text-sm text-ink mt-1">
                  {selected.exampleOrigin}
                </p>
              </div>
            </div>

            <a
              href="https://app.cuplog.app/sign-up"
              className="inline-flex items-center gap-2 font-sans font-semibold text-sm text-ink border border-ink px-6 py-3 mt-8"
              style={{ borderRadius: 0 }}
            >
              Show me sessions like this →
            </a>
          </div>
        </div>

        <div className="h-16" />
      </div>
    </section>
  );
}
