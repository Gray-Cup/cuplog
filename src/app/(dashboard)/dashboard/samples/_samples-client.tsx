"use client";

import { useState, useRef, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ArrowLeft, FlaskConical, ImageIcon, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { SampleRow } from "./actions";
import {
  createSample,
  saveCuppingSession,
  deleteSample,
} from "./actions";
import { useUploadThing } from "@/lib/uploadthing";

// ─── Types ────────────────────────────────────────────────────────────────────

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

const MAX_PHOTOS = 5;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computeScore(scores: Scores): number | null {
  const attrs = [
    scores.fragrance, scores.flavor, scores.aftertaste,
    scores.acidity, scores.body, scores.balance, scores.overall,
  ];
  if (attrs.some((v) => v === "" || isNaN(parseFloat(v)))) return null;
  const attrSum = attrs.reduce((acc, v) => acc + parseFloat(v), 0);
  const checks =
    parseFloat(scores.uniformity) +
    parseFloat(scores.cleanCup) +
    parseFloat(scores.sweetness);
  const defects =
    parseInt(scores.taints) * 2 + parseInt(scores.faults) * 4;
  return attrSum + checks - defects;
}

function scoreTier(score: number): { label: string; className: string } {
  if (score >= 90) return { label: "Outstanding", className: "text-neutral-900 font-semibold" };
  if (score >= 85) return { label: "Excellent", className: "text-neutral-700 font-semibold" };
  if (score >= 80) return { label: "Very Good", className: "text-neutral-500 font-semibold" };
  return { label: "Not specialty", className: "text-neutral-400" };
}

// ─── Photo Upload Component ───────────────────────────────────────────────────

function PhotoUploader({
  photos,
  onChange,
}: {
  photos: string[];
  onChange: (photos: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { startUpload } = useUploadThing("samplePhoto");

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    const remaining = MAX_PHOTOS - photos.length;
    const toUpload = Array.from(files).slice(0, remaining);
    if (!toUpload.length) return;

    setUploading(true);
    try {
      const uploaded = await startUpload(toUpload);
      if (!uploaded) throw new Error("Upload failed");
      const urls = uploaded.map((f) => f.ufsUrl);
      onChange([...photos, ...urls]);
    } catch {
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs text-neutral-500">
          Photos <span className="text-neutral-400">({photos.length}/{MAX_PHOTOS})</span>
        </label>
        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-800 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <ImageIcon className="size-3" />
            )}
            Add photo
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {photos.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {photos.map((url, i) => (
            <div key={i} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Sample photo ${i + 1}`}
                className="size-16 object-cover rounded border border-neutral-200"
              />
              <button
                type="button"
                onClick={() => onChange(photos.filter((_, j) => j !== i))}
                className="absolute -top-1 -right-1 bg-white border border-neutral-200 rounded-full size-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="size-2.5 text-neutral-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export function SamplesClient({ initialSamples }: { initialSamples: SampleRow[] }) {
  const [samples, setSamples] = useState<SampleRow[]>(initialSamples);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);
  const [scores, setScores] = useState<Scores>(DEFAULT_SCORES);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newSample, setNewSample] = useState({
    name: "", origin: "", variety: "", process: "", roast: "",
  });
  const [newPhotos, setNewPhotos] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const activeSample = samples.find((s) => s.id === activeSampleId) ?? null;

  function startCupping(id: string) {
    const s = samples.find((x) => x.id === id);
    if (!s) return;
    setActiveSampleId(id);
    setScores({
      fragrance: s.fragrance ?? "",
      flavor: s.flavor ?? "",
      aftertaste: s.aftertaste ?? "",
      acidity: s.acidity ?? "",
      body: s.body ?? "",
      balance: s.balance ?? "",
      overall: s.overall ?? "",
      uniformity: s.uniformity ?? "10",
      cleanCup: s.cleanCup ?? "10",
      sweetness: s.sweetness ?? "10",
      taints: s.taints ?? "0",
      faults: s.faults ?? "0",
      notes: s.notes ?? "",
    });
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

    startTransition(async () => {
      await saveCuppingSession(activeSampleId, scores, score);
      setSamples((prev) =>
        prev.map((s) =>
          s.id === activeSampleId
            ? { ...s, ...scores, status: "complete", finalScore: String(score) }
            : s
        )
      );
      setActiveSampleId(null);
      setScores(DEFAULT_SCORES);
      toast.success("Session saved");
    });
  }

  function handleLogSample() {
    if (!newSample.name.trim()) return;
    startTransition(async () => {
      const row = await createSample({ ...newSample, photos: newPhotos });
      setSamples((prev) => [row, ...prev]);
      setNewSample({ name: "", origin: "", variety: "", process: "", roast: "" });
      setNewPhotos([]);
      setShowNewForm(false);
      toast.success("Sample logged");
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteSample(id);
      setSamples((prev) => prev.filter((s) => s.id !== id));
      toast.success("Sample deleted");
    });
  }

  if (activeSample) {
    return (
      <CuppingForm
        sample={activeSample}
        scores={scores}
        onChange={handleScoreChange}
        onBack={handleBack}
        onSave={handleSaveSession}
        saving={isPending}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-neutral-900">Samples</h1>
          <p className="text-sm text-neutral-500 mt-1">
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
        <div className="border border-neutral-100 rounded-md p-5 space-y-4 bg-neutral-50">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">New Sample</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="text-xs text-neutral-500 mb-1.5 block">Sample name *</label>
              <Input
                placeholder="e.g. Yirgacheffe Kochere"
                value={newSample.name}
                onChange={(e) => setNewSample((p) => ({ ...p, name: e.target.value }))}
                className="h-8 text-sm border-neutral-200"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1.5 block">Origin</label>
              <Input
                placeholder="e.g. Ethiopia"
                value={newSample.origin}
                onChange={(e) => setNewSample((p) => ({ ...p, origin: e.target.value }))}
                className="h-8 text-sm border-neutral-200"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1.5 block">Variety</label>
              <Input
                placeholder="e.g. Heirloom"
                value={newSample.variety}
                onChange={(e) => setNewSample((p) => ({ ...p, variety: e.target.value }))}
                className="h-8 text-sm border-neutral-200"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1.5 block">Process</label>
              <Input
                placeholder="e.g. Washed"
                value={newSample.process}
                onChange={(e) => setNewSample((p) => ({ ...p, process: e.target.value }))}
                className="h-8 text-sm border-neutral-200"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1.5 block">Roast</label>
              <Input
                placeholder="e.g. Light"
                value={newSample.roast}
                onChange={(e) => setNewSample((p) => ({ ...p, roast: e.target.value }))}
                className="h-8 text-sm border-neutral-200"
              />
            </div>
            <div className="md:col-span-2">
              <PhotoUploader photos={newPhotos} onChange={setNewPhotos} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-7 text-xs"
              onClick={handleLogSample}
              disabled={!newSample.name.trim() || isPending}
            >
              {isPending ? <Loader2 className="size-3 animate-spin" /> : "Add to queue"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs text-neutral-400"
              onClick={() => { setShowNewForm(false); setNewPhotos([]); }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Sample list */}
      {samples.length === 0 ? (
        <div className="py-16 text-center">
          <FlaskConical className="size-6 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-neutral-600 mb-1">No samples yet</p>
          <p className="text-xs text-neutral-400">Log a received sample to start a cupping session.</p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-100">
          {samples.map((s) => (
            <SampleRow
              key={s.id}
              sample={s}
              onStartCupping={() => startCupping(s.id)}
              onDelete={() => handleDelete(s.id)}
              deleting={isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Sample Row ───────────────────────────────────────────────────────────────

function SampleRow({
  sample: s,
  onStartCupping,
  onDelete,
  deleting,
}: {
  sample: SampleRow;
  onStartCupping: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  const photos = (s.photos ?? []) as string[];
  return (
    <div className="py-4 flex items-start justify-between gap-4">
      <div className="space-y-1.5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm text-neutral-900">{s.name}</span>
          <Badge
            variant="outline"
            className={`text-[10px] font-medium px-1.5 py-0 border ${
              s.status === "pending"
                ? "text-amber-600 border-amber-200 bg-amber-50"
                : "text-neutral-400 border-neutral-200 bg-transparent"
            }`}
          >
            {s.status === "pending" ? "Pending" : "Cupped"}
          </Badge>
        </div>
        <p className="text-xs text-neutral-400">
          {s.origin} · {s.variety} · {s.process} · {s.roast}
        </p>
        <p className="text-xs text-neutral-400">
          Received{" "}
          {new Date(s.dateReceived).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          })}
        </p>
        {photos.length > 0 && (
          <div className="flex gap-1.5 flex-wrap pt-1">
            {photos.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={url}
                alt={`Sample photo ${i + 1}`}
                className="size-10 object-cover rounded border border-neutral-200"
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {s.status === "complete" && s.finalScore !== null && s.finalScore !== undefined && (
          <div className="text-right">
            <p className="font-mono font-bold text-lg text-neutral-900">
              {parseFloat(s.finalScore).toFixed(2)}
            </p>
            <p className={`text-xs ${scoreTier(parseFloat(s.finalScore)).className}`}>
              {scoreTier(parseFloat(s.finalScore)).label}
            </p>
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          {s.status === "pending" && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1.5 border-neutral-200"
              onClick={onStartCupping}
            >
              <FlaskConical className="size-3.5" />
              Start Cupping
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs text-neutral-300 hover:text-red-500"
            onClick={onDelete}
            disabled={deleting}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Cupping Form ─────────────────────────────────────────────────────────────

function CuppingForm({
  sample: s,
  scores,
  onChange,
  onBack,
  onSave,
  saving,
}: {
  sample: SampleRow;
  scores: Scores;
  onChange: (key: keyof Scores, value: string) => void;
  onBack: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  const liveScore = computeScore(scores);
  const allAttrsFilled = SCA_ATTRS.every(
    (a) => scores[a.key] !== "" && !isNaN(parseFloat(scores[a.key]))
  );
  const photos = (s.photos ?? []) as string[];

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700 mb-3 transition-colors"
          >
            <ArrowLeft className="size-3" />
            Back to samples
          </button>
          <h1 className="text-2xl font-bold font-heading text-neutral-900">{s.name}</h1>
          <p className="text-sm text-neutral-400 mt-1">
            {s.origin} · {s.variety} · {s.process} · {s.roast}
          </p>
          {photos.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-3">
              {photos.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={url}
                  alt={`Sample photo ${i + 1}`}
                  className="size-14 object-cover rounded border border-neutral-200"
                />
              ))}
            </div>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-neutral-400 mb-0.5">Final score</p>
          <p className="font-mono font-bold text-4xl text-neutral-900 leading-none">
            {liveScore !== null ? liveScore.toFixed(2) : "—"}
          </p>
          {liveScore !== null && (
            <p className={`text-xs mt-1 ${scoreTier(liveScore).className}`}>
              {scoreTier(liveScore).label}
            </p>
          )}
        </div>
      </div>

      {/* SCA Attributes */}
      <div>
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-4">
          SCA Attributes
        </p>
        <div className="divide-y divide-neutral-100">
          {SCA_ATTRS.map((attr) => (
            <div key={attr.key} className="flex items-center justify-between py-2.5">
              <label className="text-sm text-neutral-700">{attr.label}</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={6}
                  max={10}
                  step={0.25}
                  placeholder="—"
                  value={scores[attr.key]}
                  onChange={(e) => onChange(attr.key, e.target.value)}
                  className="h-8 w-20 text-right font-mono text-sm border-neutral-200"
                />
                <span className="text-xs text-neutral-300 w-6">/ 10</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-neutral-400 mt-2">6.00 – 10.00 in 0.25 increments.</p>
      </div>

      {/* Per-cup checks */}
      <div>
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-4">
          Per-Cup Checks <span className="font-normal normal-case">· 5 cups × 2 pts each</span>
        </p>
        <div className="space-y-4">
          {PER_CUP.map((check) => (
            <div key={check.key} className="flex items-center justify-between">
              <p className="text-sm text-neutral-700">{check.label}</p>
              <div className="flex gap-1">
                {PER_CUP_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => onChange(check.key, String(opt))}
                    className={`font-mono text-xs w-8 h-7 border transition-colors ${
                      scores[check.key] === String(opt)
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-neutral-800"
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
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-4">Defects</p>
        <div className="space-y-3">
          {[
            { key: "taints", label: "Taints", note: "−2 pts each" },
            { key: "faults", label: "Faults", note: "−4 pts each" },
          ].map(({ key, label, note }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-700">{label}</p>
                <p className="text-xs text-neutral-400">{note}</p>
              </div>
              <Input
                type="number"
                min={0}
                max={5}
                step={1}
                value={scores[key as keyof Scores]}
                onChange={(e) => onChange(key as keyof Scores, e.target.value)}
                className="h-8 w-16 text-right font-mono text-sm border-neutral-200"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">Notes</p>
        <textarea
          value={scores.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          placeholder="Tasting notes, impressions, comparisons…"
          rows={3}
          className="w-full border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 resize-none rounded-md"
        />
      </div>

      {/* Save */}
      <div className="flex items-center gap-3 pt-2 border-t border-neutral-100">
        <Button onClick={onSave} disabled={!allAttrsFilled || saving} className="h-8 gap-2 text-sm">
          {saving ? <Loader2 className="size-3.5 animate-spin" /> : "Save Session"}
        </Button>
        <Button variant="ghost" size="sm" className="text-neutral-400 text-xs" onClick={onBack}>
          Discard
        </Button>
        {!allAttrsFilled && (
          <p className="text-xs text-neutral-400">Fill all 7 attributes to save.</p>
        )}
      </div>
    </div>
  );
}
