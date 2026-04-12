"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ArrowLeft, FlaskConical } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SampleStatus = "pending" | "complete";

type Sample = {
  id: string;
  name: string;
  origin: string;
  variety: string;
  process: string;
  roast: string;
  dateReceived: string;
  status: SampleStatus;
  finalScore?: number;
};

type Scores = {
  fragrance: string;
  flavor: string;
  aftertaste: string;
  acidity: string;
  body: string;
  balance: string;
  overall: string;
  uniformity: string;
  cleanCup: string;
  sweetness: string;
  taints: string;
  faults: string;
  notes: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const SCA_ATTRS = [
  { key: "fragrance", label: "Fragrance / Aroma" },
  { key: "flavor", label: "Flavor" },
  { key: "aftertaste", label: "Aftertaste" },
  { key: "acidity", label: "Acidity" },
  { key: "body", label: "Body" },
  { key: "balance", label: "Balance" },
  { key: "overall", label: "Overall" },
] as const;

const PER_CUP = [
  { key: "uniformity", label: "Uniformity" },
  { key: "cleanCup", label: "Clean Cup" },
  { key: "sweetness", label: "Sweetness" },
] as const;

const PER_CUP_OPTIONS = [0, 2, 4, 6, 8, 10];

const DEFAULT_SCORES: Scores = {
  fragrance: "",
  flavor: "",
  aftertaste: "",
  acidity: "",
  body: "",
  balance: "",
  overall: "",
  uniformity: "10",
  cleanCup: "10",
  sweetness: "10",
  taints: "0",
  faults: "0",
  notes: "",
};

const INITIAL_SAMPLES: Sample[] = [
  {
    id: "1",
    name: "Yirgacheffe Kochere",
    origin: "Ethiopia",
    variety: "Heirloom",
    process: "Washed",
    roast: "Light",
    dateReceived: "2026-04-10",
    status: "pending",
  },
  {
    id: "2",
    name: "Huila El Paraíso",
    origin: "Colombia",
    variety: "Caturra",
    process: "Honey",
    roast: "Light-Medium",
    dateReceived: "2026-04-08",
    status: "complete",
    finalScore: 87.25,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computeScore(scores: Scores): number | null {
  const attrs = [
    scores.fragrance, scores.flavor, scores.aftertaste,
    scores.acidity, scores.body, scores.balance, scores.overall,
  ];
  if (attrs.some((v) => v === "" || isNaN(parseFloat(v)))) return null;
  const attrSum = attrs.reduce((acc, v) => acc + parseFloat(v), 0);
  const checks = parseFloat(scores.uniformity) + parseFloat(scores.cleanCup) + parseFloat(scores.sweetness);
  const defects = parseInt(scores.taints) * 2 + parseInt(scores.faults) * 4;
  return attrSum + checks - defects;
}

function scoreTier(score: number): { label: string; className: string } {
  if (score >= 90) return { label: "Outstanding", className: "bg-neutral-900 text-white" };
  if (score >= 85) return { label: "Excellent", className: "bg-neutral-700 text-white" };
  if (score >= 80) return { label: "Very Good", className: "bg-neutral-500 text-white" };
  return { label: "Not specialty", className: "bg-neutral-200 text-neutral-600" };
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SamplesPage() {
  const [samples, setSamples] = useState<Sample[]>(INITIAL_SAMPLES);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);
  const [scores, setScores] = useState<Scores>(DEFAULT_SCORES);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newSample, setNewSample] = useState({
    name: "", origin: "", variety: "", process: "", roast: "",
  });

  const activeSample = samples.find((s) => s.id === activeSampleId) ?? null;

  function startCupping(id: string) {
    setActiveSampleId(id);
    setScores(DEFAULT_SCORES);
  }

  function handleBack() {
    setActiveSampleId(null);
    setScores(DEFAULT_SCORES);
  }

  function handleScoreChange(key: keyof Scores, value: string) {
    setScores((prev) => ({ ...prev, [key]: value }));
  }

  function handleSaveSession() {
    if (!activeSampleId) return;
    const score = computeScore(scores);
    if (score === null) return;
    setSamples((prev) =>
      prev.map((s) =>
        s.id === activeSampleId
          ? { ...s, status: "complete", finalScore: score }
          : s
      )
    );
    setActiveSampleId(null);
    setScores(DEFAULT_SCORES);
  }

  function handleLogSample() {
    if (!newSample.name.trim()) return;
    const id = String(Date.now());
    setSamples((prev) => [
      ...prev,
      {
        id,
        name: newSample.name.trim(),
        origin: newSample.origin.trim() || "—",
        variety: newSample.variety.trim() || "—",
        process: newSample.process.trim() || "—",
        roast: newSample.roast.trim() || "—",
        dateReceived: new Date().toISOString().slice(0, 10),
        status: "pending",
      },
    ]);
    setNewSample({ name: "", origin: "", variety: "", process: "", roast: "" });
    setShowNewForm(false);
  }

  if (activeSample) {
    return (
      <CuppingForm
        sample={activeSample}
        scores={scores}
        onChange={handleScoreChange}
        onBack={handleBack}
        onSave={handleSaveSession}
      />
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading text-neutral-900">Samples</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Log received samples and run cupping sessions.
          </p>
        </div>
        <Button
          size="sm"
          className="gap-2 h-8 text-sm shrink-0"
          onClick={() => setShowNewForm((v) => !v)}
        >
          <Plus className="size-3.5" />
          Log Sample
        </Button>
      </div>

      {/* New sample form */}
      {showNewForm && (
        <div className="border border-dashed border-neutral-300 bg-neutral-50 p-4 space-y-3">
          <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">New Sample</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">Sample Name *</label>
              <Input
                placeholder="e.g. Yirgacheffe Kochere"
                value={newSample.name}
                onChange={(e) => setNewSample((p) => ({ ...p, name: e.target.value }))}
                className="rounded-none border-dashed h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Origin</label>
              <Input
                placeholder="e.g. Ethiopia"
                value={newSample.origin}
                onChange={(e) => setNewSample((p) => ({ ...p, origin: e.target.value }))}
                className="rounded-none border-dashed h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Variety</label>
              <Input
                placeholder="e.g. Heirloom"
                value={newSample.variety}
                onChange={(e) => setNewSample((p) => ({ ...p, variety: e.target.value }))}
                className="rounded-none border-dashed h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Process</label>
              <Input
                placeholder="e.g. Washed"
                value={newSample.process}
                onChange={(e) => setNewSample((p) => ({ ...p, process: e.target.value }))}
                className="rounded-none border-dashed h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Roast</label>
              <Input
                placeholder="e.g. Light"
                value={newSample.roast}
                onChange={(e) => setNewSample((p) => ({ ...p, roast: e.target.value }))}
                className="rounded-none border-dashed h-8 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Button size="sm" className="h-7 text-xs" onClick={handleLogSample} disabled={!newSample.name.trim()}>
              Add to Queue
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs text-muted-foreground"
              onClick={() => setShowNewForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Sample list */}
      {samples.length === 0 ? (
        <div className="border border-dashed border-neutral-200 py-12 text-center">
          <FlaskConical className="size-6 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-neutral-600 mb-1">No samples yet</p>
          <p className="text-xs text-muted-foreground">Log a received sample to start a cupping session.</p>
        </div>
      ) : (
        <div className="space-y-px border border-dashed border-neutral-200 bg-neutral-200">
          {samples.map((sample) => (
            <div key={sample.id} className="bg-white p-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-neutral-900">{sample.name}</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-medium border-dashed px-1.5 ${
                      sample.status === "pending"
                        ? "text-amber-700 border-amber-300 bg-amber-50"
                        : "text-neutral-500 border-neutral-300"
                    }`}
                  >
                    {sample.status === "pending" ? "Pending" : "Cupped"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {sample.origin} · {sample.variety} · {sample.process} · {sample.roast}
                </p>
                <p className="text-xs text-muted-foreground">
                  Received{" "}
                  {new Date(sample.dateReceived).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {sample.status === "complete" && sample.finalScore !== undefined && (
                  <div className="text-right">
                    <p className="font-mono font-bold text-lg text-neutral-900">
                      {sample.finalScore.toFixed(2)}
                    </p>
                    <span className={`text-[10px] px-1.5 py-0.5 font-medium ${scoreTier(sample.finalScore).className}`}>
                      {scoreTier(sample.finalScore).label}
                    </span>
                  </div>
                )}
                {sample.status === "pending" && (
                  <Button
                    size="sm"
                    className="h-8 text-xs gap-1.5"
                    onClick={() => startCupping(sample.id)}
                  >
                    <FlaskConical className="size-3.5" />
                    Start Cupping
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Cupping Form ─────────────────────────────────────────────────────────────

function CuppingForm({
  sample,
  scores,
  onChange,
  onBack,
  onSave,
}: {
  sample: Sample;
  scores: Scores;
  onChange: (key: keyof Scores, value: string) => void;
  onBack: () => void;
  onSave: () => void;
}) {
  const liveScore = computeScore(scores);
  const allAttrsFilled = SCA_ATTRS.every((a) => scores[a.key] !== "" && !isNaN(parseFloat(scores[a.key])));

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-neutral-800 mb-2 transition-colors"
          >
            <ArrowLeft className="size-3" />
            Back to samples
          </button>
          <h1 className="text-xl font-bold font-heading text-neutral-900">{sample.name}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {sample.origin} · {sample.variety} · {sample.process} · {sample.roast}
          </p>
        </div>
        {/* Live score */}
        <div className="text-right shrink-0">
          <p className="text-xs text-muted-foreground mb-0.5">Final Score</p>
          <p className="font-mono font-bold text-3xl text-neutral-900">
            {liveScore !== null ? liveScore.toFixed(2) : "—"}
          </p>
          {liveScore !== null && (
            <span className={`text-[10px] px-2 py-0.5 font-medium ${scoreTier(liveScore).className}`}>
              {scoreTier(liveScore).label}
            </span>
          )}
        </div>
      </div>

      {/* SCA Attributes */}
      <div>
        <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-3">
          SCA Attributes
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-200 border border-dashed border-neutral-200">
          {SCA_ATTRS.map((attr) => (
            <div key={attr.key} className="bg-white p-3 flex items-center justify-between gap-4">
              <label className="text-sm text-neutral-700 shrink-0">{attr.label}</label>
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  min={6}
                  max={10}
                  step={0.25}
                  placeholder="0.00"
                  value={scores[attr.key]}
                  onChange={(e) => onChange(attr.key, e.target.value)}
                  className="rounded-none border-dashed h-8 w-20 text-right font-mono text-sm"
                />
                <span className="text-xs text-muted-foreground w-8 shrink-0">/ 10</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5">Score each attribute from 6.00 to 10.00 in 0.25 increments.</p>
      </div>

      {/* Per-cup checks */}
      <div>
        <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-3">
          Per-Cup Checks <span className="font-normal text-muted-foreground normal-case">· 5 cups, 2 pts each</span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200 border border-dashed border-neutral-200">
          {PER_CUP.map((check) => (
            <div key={check.key} className="bg-white p-3 space-y-2">
              <p className="text-sm text-neutral-700">{check.label}</p>
              <div className="flex gap-1 flex-wrap">
                {PER_CUP_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => onChange(check.key, String(opt))}
                    className={`font-mono text-xs px-2.5 py-1 border transition-colors ${
                      scores[check.key] === String(opt)
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Defects */}
      <div>
        <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-3">Defects</p>
        <div className="grid grid-cols-2 gap-px bg-neutral-200 border border-dashed border-neutral-200">
          <div className="bg-white p-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-neutral-700">Taints</p>
              <p className="text-[10px] text-muted-foreground">−2 pts each</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                min={0}
                max={5}
                step={1}
                value={scores.taints}
                onChange={(e) => onChange("taints", e.target.value)}
                className="rounded-none border-dashed h-8 w-16 text-right font-mono text-sm"
              />
            </div>
          </div>
          <div className="bg-white p-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-neutral-700">Faults</p>
              <p className="text-[10px] text-muted-foreground">−4 pts each</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                min={0}
                max={5}
                step={1}
                value={scores.faults}
                onChange={(e) => onChange("faults", e.target.value)}
                className="rounded-none border-dashed h-8 w-16 text-right font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-3">Notes</p>
        <textarea
          value={scores.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          placeholder="Tasting notes, impressions, comparisons…"
          rows={3}
          className="w-full border border-dashed border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-neutral-500 resize-none"
        />
      </div>

      {/* Save */}
      <div className="flex items-center gap-3 pt-1 border-t border-dashed border-neutral-200">
        <Button
          onClick={onSave}
          disabled={!allAttrsFilled}
          className="h-9 gap-2"
        >
          Save Session
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground text-xs" onClick={onBack}>
          Discard
        </Button>
        {!allAttrsFilled && (
          <p className="text-xs text-muted-foreground">Fill all 7 attributes to save.</p>
        )}
      </div>
    </div>
  );
}
