import type { Metadata } from "next";
import PricingSection from "@/components/PricingSection";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, honest pricing. Start free. Upgrade when you need more. CupLog plans for individual cuppers and professional tasting teams.",
};

export default function PricingPage() {
  return (
    <>
      <PricingSection />

      {/* FAQ-style callout */}
      <section className="bg-peach border-b border-ink">
        <div
          className="px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-2 gap-12"
          style={{ maxWidth: "1280px", margin: "0 auto" }}
        >
          <div>
            <h2
              className="font-serif text-ink"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: 1.1 }}
            >
              Questions about pricing?
            </h2>
            <p
              className="font-sans text-sm text-ink mt-4 leading-relaxed"
              style={{ opacity: 0.7 }}
            >
              Reach out directly — we're happy to help with team plans, custom
              arrangements, or any questions about what's included.
            </p>
            <a
              href="mailto:hello@cuplog.app"
              className="inline-flex items-center gap-2 font-sans font-semibold text-sm text-ink border border-ink px-6 py-3 mt-6"
              style={{ borderRadius: 0 }}
            >
              Get in touch →
            </a>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes. Cancel with one click from your account settings. No lock-in, no questions.",
              },
              {
                q: "What counts as a session?",
                a: "One cupping session = one set of coffees evaluated together. You can add as many coffees as you like within a session.",
              },
              {
                q: "Is there a team trial?",
                a: "Yes — start a free trial on the Pro plan and add team members. Upgrade to Team when you're ready.",
              },
            ].map((item) => (
              <div key={item.q} className="border-t border-rule pt-5">
                <p className="font-sans font-semibold text-sm text-ink">
                  {item.q}
                </p>
                <p
                  className="font-sans text-sm text-ink mt-2 leading-relaxed"
                  style={{ opacity: 0.7 }}
                >
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
