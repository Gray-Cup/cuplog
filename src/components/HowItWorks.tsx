import React from "react";

const steps = [
  {
    step: "01",
    title: "Log",
    description:
      "Start a cupping session in seconds. Add your coffees, origin, process, and roast details. Organise by date, farm, or variety.",
    cta: "See the form →",
  },
  {
    step: "02",
    title: "Score",
    description:
      "Rate 10 SCA attributes with precision sliders. Add tasting notes, flavour tags, and defect counts as you cup.",
    cta: "Try scoring →",
  },
  {
    step: "03",
    title: "Reflect",
    description:
      "Review your sessions over time. See your palate develop, compare coffees side by side. Export. Share. Improve.",
    cta: "View dashboard →",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-paper border-b border-ink">
      <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
        <div className="px-6 md:px-10 pt-16 pb-2">
          <h2
            className="font-sans font-semibold uppercase text-ink"
            style={{ fontSize: "clamp(2.75rem, 5vw, 4.5rem)", lineHeight: 1.0 }}
          >
            Three steps to a better cup.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-ink">
          {steps.map((step, i) => (
            <div
              key={step.step}
              className={`px-6 md:px-8 py-12 ${i < steps.length - 1 ? "border-b md:border-b-0 md:border-r border-ink" : ""}`}
            >
              <div
                className="bg-peach border border-ink mb-8"
                style={{ height: "160px" }}
              >
                <div className="h-full flex items-center justify-center">
                  <span className="font-serif text-6xl text-ink" style={{ opacity: 0.12 }}>
                    {step.step}
                  </span>
                </div>
              </div>

              <p className="font-sans font-bold text-xs text-ink uppercase tracking-label mb-1" style={{ opacity: 0.45 }}>
                Step {step.step}
              </p>
              <h3 className="font-sans font-semibold uppercase text-4xl text-ink mb-4">{step.title}</h3>
              <p className="font-sans text-base text-ink leading-relaxed" style={{ opacity: 0.7 }}>
                {step.description}
              </p>
              <a
                href="https://app.cuplog.app/sign-up"
                className="inline-block font-sans text-sm font-semibold text-ink mt-6 border-b border-ink pb-0.5"
              >
                {step.cta}
              </a>
            </div>
          ))}
        </div>

        <div className="h-14" />
      </div>
    </section>
  );
}
