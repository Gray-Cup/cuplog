import React from "react";

const plans = [
  {
    name: "Free",
    price: null,
    priceNote: "Always free",
    cta: "Get started",
    ctaHref: "https://app.cuplog.app/sign-up",
    featured: false,
    features: [
      "10 sessions per month",
      "Basic SCA scoring",
      "Flavour tags",
      "Session history (30 days)",
      "Export single sessions",
    ],
  },
  {
    name: "Pro",
    price: "£9",
    priceNote: "per month",
    cta: "Start free trial",
    ctaHref: "https://app.cuplog.app/sign-up?plan=pro",
    featured: true,
    features: [
      "Unlimited sessions",
      "Full SCA scoring form",
      "PDF export",
      "Score history graphs",
      "Flavour wheel integration",
      "Session comparison",
      "Email reports",
    ],
  },
  {
    name: "Team",
    price: "£29",
    priceNote: "per month",
    cta: "Contact us",
    ctaHref: "mailto:hello@cuplog.app",
    featured: false,
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Shared cupping sessions",
      "Role management",
      "Team score comparisons",
      "Priority support",
      "Custom branding",
    ],
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-paper border-b border-ink">
      <div style={{ maxWidth: "1024px", margin: "0 auto" }}>

        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-ink">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`px-7 py-10 ${plan.featured ? "bg-ink" : "bg-paper"} ${i < plans.length - 1 ? "border-b md:border-b-0 md:border-r border-ink" : ""}`}
            >
              <p
                className={`font-sans font-bold text-xs uppercase tracking-label ${plan.featured ? "text-peach" : "text-ink"}`}
                style={{ opacity: plan.featured ? 0.8 : 0.45 }}
              >
                {plan.name}
              </p>

              <div className="mt-4 mb-6">
                {plan.price ? (
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`font-sans font-bold ${plan.featured ? "text-white" : "text-ink"}`}
                      style={{ fontSize: "2.75rem", fontVariantNumeric: "tabular-nums" }}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`font-sans text-base ${plan.featured ? "text-white" : "text-ink"}`}
                      style={{ opacity: 0.5 }}
                    >
                      {plan.priceNote}
                    </span>
                  </div>
                ) : (
                  <span className={`font-sans font-bold text-3xl ${plan.featured ? "text-white" : "text-ink"}`}>
                    {plan.priceNote}
                  </span>
                )}
              </div>

              <div
                className="w-full h-px"
                style={{ background: plan.featured ? "rgba(255,255,255,0.2)" : "#111008" }}
              />

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={`font-sans text-base flex items-start gap-2 ${plan.featured ? "text-white" : "text-ink"}`}
                    style={{ opacity: plan.featured ? 0.8 : 0.72 }}
                  >
                    <span className="mt-0.5 shrink-0" style={{ opacity: 0.45 }}>—</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div
                className="w-full h-px mt-8"
                style={{ background: plan.featured ? "rgba(255,255,255,0.2)" : "#111008" }}
              />

              <a
                href={plan.ctaHref}
                className={`inline-flex items-center justify-center w-full font-sans font-semibold text-base px-6 py-4 mt-6 border ${
                  plan.featured
                    ? "bg-white text-ink border-white"
                    : "bg-transparent text-ink border-ink"
                }`}
                style={{ borderRadius: 0 }}
              >
                {plan.cta} →
              </a>
            </div>
          ))}
        </div>

        <div className="h-14" />
      </div>
    </section>
  );
}
