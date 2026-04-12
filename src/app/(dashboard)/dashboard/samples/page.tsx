import { Badge } from "@/components/ui/badge";

type Sample = {
  id: string;
  name: string;
  origin: string;
  variety: string;
  process: string;
  roast: string;
  date: string;
  scores: {
    fragrance: number;
    flavor: number;
    aftertaste: number;
    acidity: number;
    body: number;
    balance: number;
    overall: number;
    uniformity: number;
    cleanCup: number;
    sweetness: number;
  };
  defects: { taints: number; faults: number };
  notes: string;
};

const SAMPLES: Sample[] = [
  {
    id: "1",
    name: "Yirgacheffe Kochere",
    origin: "Ethiopia",
    variety: "Heirloom",
    process: "Washed",
    roast: "Light",
    date: "2026-03-15",
    scores: {
      fragrance: 8.75,
      flavor: 8.5,
      aftertaste: 8.25,
      acidity: 8.75,
      body: 7.75,
      balance: 8.5,
      overall: 8.5,
      uniformity: 10,
      cleanCup: 10,
      sweetness: 10,
    },
    defects: { taints: 0, faults: 0 },
    notes: "Bright lemon acidity, jasmine florals on the dry fragrance. Tea-like body with a clean, lingering finish.",
  },
  {
    id: "2",
    name: "Huila Finca El Paraíso",
    origin: "Colombia",
    variety: "Caturra",
    process: "Honey",
    roast: "Light-Medium",
    date: "2026-03-22",
    scores: {
      fragrance: 8.25,
      flavor: 8.25,
      aftertaste: 8.0,
      acidity: 8.0,
      body: 8.5,
      balance: 8.25,
      overall: 8.25,
      uniformity: 10,
      cleanCup: 10,
      sweetness: 10,
    },
    defects: { taints: 0, faults: 0 },
    notes: "Stone fruit sweetness, peach and apricot notes. Medium-full body, smooth aftertaste. Excellent uniformity.",
  },
  {
    id: "3",
    name: "Sidama Bensa",
    origin: "Ethiopia",
    variety: "Heirloom",
    process: "Natural",
    roast: "Light",
    date: "2026-04-01",
    scores: {
      fragrance: 8.5,
      flavor: 8.25,
      aftertaste: 8.0,
      acidity: 7.75,
      body: 8.25,
      balance: 8.0,
      overall: 8.25,
      uniformity: 10,
      cleanCup: 8,
      sweetness: 10,
    },
    defects: { taints: 1, faults: 0 },
    notes: "Blueberry and dark fruit. One cup showed slight ferment — taint flagged. Dense, wine-like body.",
  },
  {
    id: "4",
    name: "Antigua San Marcos",
    origin: "Guatemala",
    variety: "Bourbon",
    process: "Washed",
    roast: "Medium",
    date: "2026-04-08",
    scores: {
      fragrance: 8.0,
      flavor: 8.0,
      aftertaste: 7.75,
      acidity: 7.75,
      body: 8.25,
      balance: 8.0,
      overall: 8.0,
      uniformity: 10,
      cleanCup: 10,
      sweetness: 10,
    },
    defects: { taints: 0, faults: 0 },
    notes: "Milk chocolate, brown sugar, mild citrus. Well-balanced, consistent across all cups. Reliable lot.",
  },
  {
    id: "5",
    name: "Sumatra Mandheling G1",
    origin: "Indonesia",
    variety: "Tim Tim / Ateng",
    process: "Wet-Hulled",
    roast: "Medium-Dark",
    date: "2026-04-10",
    scores: {
      fragrance: 7.75,
      flavor: 7.75,
      aftertaste: 7.5,
      acidity: 7.25,
      body: 8.5,
      balance: 7.75,
      overall: 7.75,
      uniformity: 8,
      cleanCup: 8,
      sweetness: 10,
    },
    defects: { taints: 0, faults: 0 },
    notes: "Earthy, cedar, dark chocolate. Heavy body as expected. Two cups showed mild inconsistency. Solid for blending.",
  },
];

function finalScore(s: Sample): number {
  const attrSum =
    s.scores.fragrance +
    s.scores.flavor +
    s.scores.aftertaste +
    s.scores.acidity +
    s.scores.body +
    s.scores.balance +
    s.scores.overall;
  const checks = s.scores.uniformity + s.scores.cleanCup + s.scores.sweetness;
  const defects = s.defects.taints * 2 + s.defects.faults * 4;
  return attrSum + checks - defects;
}

function scoreTier(score: number): { label: string; className: string } {
  if (score >= 90) return { label: "Outstanding", className: "bg-neutral-900 text-white" };
  if (score >= 85) return { label: "Excellent", className: "bg-neutral-700 text-white" };
  if (score >= 80) return { label: "Very Good", className: "bg-neutral-500 text-white" };
  return { label: "Not specialty", className: "bg-neutral-200 text-neutral-600" };
}

export default function SamplesPage() {
  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold font-heading text-neutral-900">Samples</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Example cupping sessions using real SCA scoring methodology. Use these as a reference for your own sessions.
        </p>
      </div>

      {/* Attribution note */}
      <div className="border border-dashed border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-muted-foreground">
        These are demonstration sessions with realistic scores. All data is for reference only — not affiliated with any specific roaster or lot.
      </div>

      {/* Session cards */}
      <div className="space-y-px border border-dashed border-neutral-200 bg-neutral-200">
        {SAMPLES.map((sample) => {
          const score = finalScore(sample);
          const tier = scoreTier(score);
          return (
            <div key={sample.id} className="bg-white p-4 space-y-3">
              {/* Top row */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold text-neutral-900">{sample.name}</h2>
                    <Badge variant="secondary" className="text-xs font-normal">{sample.process}</Badge>
                    <Badge variant="outline" className="text-xs font-normal border-dashed">{sample.roast}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {sample.origin} · {sample.variety} · {new Date(sample.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold font-mono text-neutral-900">{score.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-0.5 font-medium ${tier.className}`}>{tier.label}</span>
                </div>
              </div>

              {/* Scores grid */}
              <div className="grid grid-cols-4 md:grid-cols-7 gap-px bg-neutral-100 border border-neutral-100">
                {[
                  { key: "Fragrance", val: sample.scores.fragrance },
                  { key: "Flavor", val: sample.scores.flavor },
                  { key: "Aftertaste", val: sample.scores.aftertaste },
                  { key: "Acidity", val: sample.scores.acidity },
                  { key: "Body", val: sample.scores.body },
                  { key: "Balance", val: sample.scores.balance },
                  { key: "Overall", val: sample.scores.overall },
                ].map((attr) => (
                  <div key={attr.key} className="bg-white p-2 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{attr.key}</p>
                    <p className="font-mono text-sm font-semibold text-neutral-800 mt-0.5">{attr.val.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Per-cup checks + defects */}
              <div className="flex items-center gap-6 text-sm flex-wrap">
                <div className="flex gap-4">
                  {[
                    { key: "Uniformity", val: sample.scores.uniformity },
                    { key: "Clean Cup", val: sample.scores.cleanCup },
                    { key: "Sweetness", val: sample.scores.sweetness },
                  ].map((c) => (
                    <div key={c.key}>
                      <p className="text-xs text-muted-foreground">{c.key}</p>
                      <p className="font-mono font-semibold text-neutral-800">{c.val}</p>
                    </div>
                  ))}
                </div>
                <div className="w-px h-8 bg-neutral-200" />
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Taints</p>
                    <p className={`font-mono font-semibold ${sample.defects.taints > 0 ? "text-red-600" : "text-neutral-400"}`}>
                      {sample.defects.taints} (−{sample.defects.taints * 2})
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Faults</p>
                    <p className={`font-mono font-semibold ${sample.defects.faults > 0 ? "text-red-600" : "text-neutral-400"}`}>
                      {sample.defects.faults} (−{sample.defects.faults * 4})
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {sample.notes && (
                <p className="text-sm text-muted-foreground border-t border-dashed border-neutral-200 pt-3">
                  {sample.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
