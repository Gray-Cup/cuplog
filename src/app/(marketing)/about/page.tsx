import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "CupLog is built for people who take coffee seriously. Learn about our mission, values, and the team behind the cupping workspace.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-peach border-b border-ink">
        <div
          className="px-6 md:px-12 py-20 md:py-28"
          style={{ maxWidth: "1280px", margin: "0 auto" }}
        >
          <p
            className="font-sans font-bold text-xs text-ink uppercase tracking-label mb-4"
            style={{ opacity: 0.6 }}
          >
            About
          </p>
          <h1
            className="font-serif text-ink"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 0.95, maxWidth: "700px" }}
          >
            Built for people who care what's in their cup.
          </h1>
        </div>
      </section>

      {/* Mission section */}
      <section className="bg-paper border-b border-ink">
        <div
          className="px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-2 gap-16"
          style={{ maxWidth: "1280px", margin: "0 auto" }}
        >
          <div>
            <p
              className="font-sans font-bold text-xs text-ink uppercase tracking-label mb-4"
              style={{ opacity: 0.5 }}
            >
              Our Mission
            </p>
            <div className="w-full h-px bg-rule mb-8" />
            <p
              className="font-serif text-ink"
              style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", lineHeight: 1.25 }}
            >
              CupLog exists to give every cupper — amateur or Q-grader —
              the precision tools to understand what's in their cup.
            </p>
          </div>

          <div className="space-y-6">
            <p className="font-sans text-base text-ink leading-relaxed" style={{ opacity: 0.8 }}>
              Cupping is the most systematic way humans have devised to understand
              coffee. But the tools for doing it have stayed analogue — paper forms,
              spreadsheets, scattered notes.
            </p>
            <p className="font-sans text-base text-ink leading-relaxed" style={{ opacity: 0.8 }}>
              CupLog is a workspace designed from the ground up for cupping. Not a
              generic notes app. Not a spreadsheet with a new coat of paint.
              A purpose-built environment for the language of coffee.
            </p>
            <p className="font-sans text-base text-ink leading-relaxed" style={{ opacity: 0.8 }}>
              SCA-standard scoring forms. Visual flavour wheels. Session history.
              Team tastings. Everything that belongs in a cupping log, finally in
              one place.
            </p>
          </div>
        </div>
      </section>

      {/* Values section */}
      <section className="bg-paper border-b border-ink">
        <div
          className="px-6 md:px-12 pt-0 pb-16"
          style={{ maxWidth: "1280px", margin: "0 auto" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-ink">
            {[
              {
                title: "Precision",
                body: "Every attribute. Every decimal place. The SCA protocol exists for a reason and we respect it fully.",
              },
              {
                title: "Warmth",
                body: "Coffee is a craft and a pleasure. Our tools should feel like a good notebook — not a compliance form.",
              },
              {
                title: "Openness",
                body: "Your data is yours. Export everything. We build tools you can trust with your most valuable tasting notes.",
              },
            ].map((val, i) => (
              <div
                key={val.title}
                className={`px-0 md:px-8 py-12 ${i > 0 ? "border-t md:border-t-0 md:border-l border-rule" : ""}`}
                style={{ paddingLeft: i === 0 ? 0 : undefined }}
              >
                <h3
                  className="font-sans font-bold text-xs text-ink uppercase tracking-label mb-4"
                  style={{ opacity: 0.5 }}
                >
                  {val.title}
                </h3>
                <p className="font-serif text-xl text-ink leading-snug">
                  {val.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-peach border-b border-ink">
        <div
          className="px-6 md:px-12 py-16 md:py-24"
          style={{ maxWidth: "1280px", margin: "0 auto" }}
        >
          <h2
            className="font-serif text-ink"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.1, maxWidth: "680px" }}
          >
            Ready to start scoring?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <a
              href="https://app.cuplog.app/sign-up"
              className="inline-flex items-center gap-2 font-sans font-semibold text-sm text-white bg-ink px-8 py-4 border border-ink"
              style={{ borderRadius: 0 }}
            >
              Start Cupping (Test Mode)
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 font-sans font-semibold text-sm text-ink bg-white px-8 py-4 border border-ink"
              style={{ borderRadius: 0 }}
            >
              View pricing →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
