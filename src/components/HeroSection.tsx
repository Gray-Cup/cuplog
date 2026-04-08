import React from "react";

export default function HeroSection() {
  return (
    <section
      className="bg-green-200 border-b border-ink"
      style={{ minHeight: "85vh" }}
    >
      <div
        className="flex flex-col justify-center px-6 md:px-12 py-10"
        style={{ maxWidth: "1024px", margin: "0 auto", minHeight: "inherit" }}
      >
        <div className="max-w-3xl">
          <h1 className="font-sans font-semibold uppercase text-hero text-ink hero-headline" style={{ lineHeight: 0.95 }}>
            Score every<br />cup.
          </h1>

          <p
            className="font-sans text-lg text-ink hero-sub mt-8"
            style={{ maxWidth: "520px", opacity: 0.85 }}
          >
            The cupping log built for people who care what's in their cup.
            Track flavour, score sessions, and build your palate with
            SCA-standard scoring forms.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10 hero-ctas">
            <a
              href="https://app.cuplog.app/sign-up"
              className="inline-flex items-center gap-2 font-sans font-semibold text-sm text-white bg-ink px-8 py-4 border border-ink"
              style={{ borderRadius: 0 }}
            >
              Start for free →
            </a>
            <a
              href="/#how-it-works"
              className="inline-flex items-center gap-2 font-sans font-semibold text-sm text-ink bg-white px-8 py-4 border border-ink"
              style={{ borderRadius: 0 }}
            >
              See how it works →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
