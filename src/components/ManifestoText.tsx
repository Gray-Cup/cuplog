import React from "react";

export default function ManifestoText() {
  return (
    <section className="bg-peach border-b border-ink">
      <div
        className="px-6 md:px-10 py-24 md:py-32"
        style={{ maxWidth: "1024px", margin: "0 auto" }}
      >
        <h2
          className="font-sans font-semibold uppercase text-ink"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            maxWidth: "900px",
            lineHeight: 1.1,
          }}
        >
          We're unapologetically obsessed with
          the language of coffee — and the
          numbers behind every great cup.
        </h2>

        <p className="font-sans text-sm text-ink mt-8" style={{ opacity: 0.65 }}>
          Find your score →{" "}
          <a
            href="https://app.cuplog.app/sign-up"
            className="font-semibold border-b border-ink pb-0.5"
            style={{ opacity: 1 }}
          >
            Take the flavour quiz
          </a>
        </p>
      </div>
    </section>
  );
}
