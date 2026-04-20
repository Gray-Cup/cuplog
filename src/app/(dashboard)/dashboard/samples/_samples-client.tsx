"use client";

import { useState, useRef, useTransition, useEffect, useMemo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus, ArrowLeft, FlaskConical, ImageIcon, X, Loader2,
  Download, Search, ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import type { SampleRow } from "./actions";
import { createSample, saveCuppingSession, deleteSample } from "./actions";
import { useUploadThing } from "@/lib/uploadthing";
import { FlavorWheel } from "@/components/flavor-wheel";
import {
  DESCRIPTOR_FAMILIES,
  type DescriptorTag,
  type StoredDescriptor,
  chipClasses,
  familyColor,
  computeFamilyCounts,
  parseStoredDescriptors,
} from "@/lib/descriptors";

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
  { key: "fragrance", label: "Fragrance / Aroma", color: "#7C3AED" },
  { key: "flavor", label: "Flavor", color: "#D97706" },
  { key: "aftertaste", label: "Aftertaste", color: "#E11D48" },
  { key: "acidity", label: "Acidity", color: "#16A34A" },
  { key: "body", label: "Body", color: "#2563EB" },
  { key: "balance", label: "Balance", color: "#0D9488" },
  { key: "overall", label: "Overall", color: "#EA580C" },
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
  const defects = parseInt(scores.taints) * 2 + parseInt(scores.faults) * 4;
  return attrSum + checks - defects;
}

function scoreTier(score: number): { label: string; color: string } {
  if (score >= 90) return { label: "Outstanding", color: "#8B5CF6" };
  if (score >= 85) return { label: "Excellent", color: "#22C55E" };
  if (score >= 80) return { label: "Very Good", color: "#F59E0B" };
  return { label: "Not specialty", color: "#9ca3af" };
}

function sampleDescriptors(s: SampleRow): DescriptorTag[] {
  const raw = (s.descriptors ?? []) as StoredDescriptor[];
  return parseStoredDescriptors(raw);
}

// ─── Export Helpers ───────────────────────────────────────────────────────────

async function downloadPNG(el: HTMLElement, filename: string) {
  const { toPng } = await import("html-to-image");
  const dataUrl = await toPng(el, { quality: 0.98, pixelRatio: 2 });
  const a = document.createElement("a");
  a.download = filename;
  a.href = dataUrl;
  a.click();
}

async function downloadPDF(el: HTMLElement, filename: string) {
  const { toPng } = await import("html-to-image");
  const { jsPDF } = await import("jspdf");
  const dataUrl = await toPng(el, { quality: 0.98, pixelRatio: 2 });
  const img = new Image();
  img.src = dataUrl;
  await new Promise<void>((r) => { img.onload = () => r(); });
  const w = el.offsetWidth;
  const h = el.offsetHeight;
  const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [w, h] });
  pdf.addImage(dataUrl, "PNG", 0, 0, w, h);
  pdf.save(filename);
}

// ─── Export Card (off-screen, captured for download) ─────────────────────────

function ExportCard({
  sample: s,
  scores,
  descriptors,
  liveScore,
}: {
  sample: SampleRow;
  scores: Scores;
  descriptors: DescriptorTag[];
  liveScore: number | null;
}) {
  const familyCounts = useMemo(() => computeFamilyCounts(descriptors), [descriptors]);
  const finalScore = liveScore ?? (s.finalScore ? parseFloat(s.finalScore) : null);
  const topDescriptors = descriptors.slice(0, 6);
  const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const tier = finalScore ? scoreTier(finalScore) : null;

  return (
    <div
      style={{
        width: 480,
        background: "#ffffff",
        fontFamily: "Inter, system-ui, sans-serif",
        overflow: "hidden",
        borderRadius: 16,
      }}
    >
      {/* Header bar */}
      <div style={{ background: "#f8f7ff", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", letterSpacing: "-0.01em" }}>CupLog</span>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>{date}</span>
      </div>

      {/* Content */}
      <div style={{ padding: "28px 32px 32px" }}>
        {/* Coffee name */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <p style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4, lineHeight: 1.3 }}>
            {s.name}
          </p>
          <p style={{ fontSize: 13, color: "#9ca3af" }}>
            {[s.origin, s.variety, s.process, s.roast].filter(v => v && v !== "—").join(" · ")}
          </p>
        </div>

        {/* Flavor Wheel */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <FlavorWheel familyCounts={familyCounts} size={200} showLabels={true} />
        </div>

        {/* Descriptors */}
        {topDescriptors.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 24 }}>
            {topDescriptors.map((d) => (
              <span
                key={d.id}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 999,
                  border: "1px solid",
                  borderColor: familyColor(d.family) + "40",
                  backgroundColor: familyColor(d.family) + "18",
                  color: familyColor(d.family),
                }}
              >
                {d.label}
              </span>
            ))}
          </div>
        )}

        {/* Score */}
        {finalScore !== null && (
          <div style={{ textAlign: "center", padding: "20px 0", borderTop: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6" }}>
            <p style={{ fontSize: 11, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
              Final Score
            </p>
            <p style={{ fontSize: 52, fontWeight: 800, color: "#111827", lineHeight: 1, marginBottom: 6, fontVariantNumeric: "tabular-nums" }}>
              {finalScore.toFixed(2)}
            </p>
            {tier && (
              <p style={{ fontSize: 14, fontWeight: 600, color: tier.color }}>
                {tier.label}
              </p>
            )}
          </div>
        )}

        {/* SCA breakdown */}
        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px" }}>
          {SCA_ATTRS.map((attr) => {
            const val = scores[attr.key as keyof Scores];
            if (!val) return null;
            return (
              <div key={attr.key} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: "#6b7280" }}>{attr.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#111827", fontVariantNumeric: "tabular-nums" }}>
                  {parseFloat(val).toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Photo Uploader ───────────────────────────────────────────────────────────

function PhotoUploader({ photos, onChange }: { photos: string[]; onChange: (p: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { startUpload } = useUploadThing("samplePhoto");

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    const toUpload = Array.from(files).slice(0, MAX_PHOTOS - photos.length);
    if (!toUpload.length) return;
    setUploading(true);
    try {
      const uploaded = await startUpload(toUpload);
      if (!uploaded) throw new Error("Upload failed");
      onChange([...photos, ...uploaded.map((f) => f.ufsUrl)]);
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
            {uploading ? <Loader2 className="size-3 animate-spin" /> : <ImageIcon className="size-3" />}
            Add photo
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      {photos.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {photos.map((url, i) => (
            <div key={i} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`photo ${i + 1}`} className="size-16 object-cover rounded-lg border border-neutral-200" />
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

// ─── Descriptor Chip ──────────────────────────────────────────────────────────

function DescriptorChip({ descriptor, onRemove }: { descriptor: DescriptorTag; onRemove?: () => void }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${chipClasses(descriptor.family)}`}
    >
      {descriptor.label}
      {onRemove && (
        <button type="button" onClick={onRemove} className="opacity-60 hover:opacity-100 transition-opacity ml-0.5">
          <X className="size-2.5" />
        </button>
      )}
    </span>
  );
}

// ─── Descriptor Picker ────────────────────────────────────────────────────────

function DescriptorPicker({
  descriptors,
  onChange,
  buttonLabel = "Add descriptors",
}: {
  descriptors: DescriptorTag[];
  onChange: (d: DescriptorTag[]) => void;
  buttonLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFamily, setActiveFamily] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const selectedSet = useMemo(() => new Set(descriptors.map((d) => d.label)), [descriptors]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q && !activeFamily) return null;
    const results: { label: string; family: string; category: string }[] = [];
    for (const fam of DESCRIPTOR_FAMILIES) {
      if (activeFamily && fam.key !== activeFamily) continue;
      for (const group of fam.items) {
        for (const label of group.descriptors) {
          if (!q || label.toLowerCase().includes(q)) {
            results.push({ label, family: fam.key, category: group.category });
          }
        }
      }
    }
    return results;
  }, [search, activeFamily]);

  function addDescriptor(label: string, family: string) {
    if (selectedSet.has(label)) return;
    onChange([...descriptors, { id: crypto.randomUUID(), label, family }]);
  }

  function removeDescriptor(id: string) {
    onChange(descriptors.filter((d) => d.id !== id));
  }

  const displayFamily = activeFamily
    ? DESCRIPTOR_FAMILIES.find((f) => f.key === activeFamily)
    : null;

  return (
    <div ref={containerRef} className="relative">
      {/* Selected chips */}
      <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
        {descriptors.map((d) => (
          <DescriptorChip key={d.id} descriptor={d} onRemove={() => removeDescriptor(d.id)} />
        ))}
      </div>

      {/* Add button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 border border-dashed border-neutral-300 hover:border-neutral-400 rounded-full px-3 py-1 transition-colors"
      >
        <Plus className="size-3" />
        {buttonLabel}
        <ChevronDown className="size-3 opacity-60" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-1.5 z-50 bg-white border border-neutral-200 rounded-xl shadow-lg w-80 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-neutral-100">
            <div className="flex items-center gap-2 bg-neutral-50 rounded-lg px-2.5 py-1.5">
              <Search className="size-3.5 text-neutral-400 shrink-0" />
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search descriptors…"
                className="flex-1 text-xs bg-transparent outline-none text-neutral-800 placeholder:text-neutral-400"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-neutral-400 hover:text-neutral-600">
                  <X className="size-3" />
                </button>
              )}
            </div>
          </div>

          {/* Family tabs */}
          {!search && (
            <div className="flex gap-1 p-2 overflow-x-auto border-b border-neutral-100 no-scrollbar">
              <button
                onClick={() => setActiveFamily(null)}
                className={`shrink-0 text-[10px] font-medium px-2 py-1 rounded-full transition-colors ${
                  !activeFamily
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
                }`}
              >
                All
              </button>
              {DESCRIPTOR_FAMILIES.map((fam) => (
                <button
                  key={fam.key}
                  onClick={() => setActiveFamily(fam.key === activeFamily ? null : fam.key)}
                  className="shrink-0 text-[10px] font-medium px-2 py-1 rounded-full transition-colors"
                  style={{
                    background: activeFamily === fam.key ? fam.color : "transparent",
                    color: activeFamily === fam.key ? "white" : fam.color,
                    border: `1px solid ${fam.color}40`,
                  }}
                >
                  {fam.label}
                </button>
              ))}
            </div>
          )}

          {/* Descriptor list */}
          <div className="max-h-52 overflow-y-auto p-2 space-y-3">
            {filteredItems !== null ? (
              filteredItems.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {filteredItems.map((item) => {
                    const selected = selectedSet.has(item.label);
                    return (
                      <button
                        key={item.label}
                        onClick={() => addDescriptor(item.label, item.family)}
                        disabled={selected}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-all ${
                          selected
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:scale-105"
                        } ${chipClasses(item.family)}`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 text-center py-4">No matches for &ldquo;{search}&rdquo;</p>
              )
            ) : (
              DESCRIPTOR_FAMILIES.map((fam) => (
                <div key={fam.key}>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-wide mb-1.5"
                    style={{ color: fam.color }}
                  >
                    {fam.label}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {fam.items.flatMap((g) =>
                      g.descriptors.slice(0, 4).map((label) => {
                        const selected = selectedSet.has(label);
                        return (
                          <button
                            key={label}
                            onClick={() => addDescriptor(label, fam.key)}
                            disabled={selected}
                            className={`text-xs font-medium px-2 py-0.5 rounded-full border transition-all ${
                              selected ? "opacity-40 cursor-not-allowed" : "hover:scale-105"
                            } ${chipClasses(fam.key)}`}
                          >
                            {label}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {displayFamily && !search && (
            <div className="px-3 pb-3">
              <p className="text-[10px] text-neutral-400">
                Showing {displayFamily.label} · click All to see everything
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Sample Card ──────────────────────────────────────────────────────────────

function SampleCard({
  sample: s,
  onStartCupping,
  onDelete,
  onExport,
  deleting,
}: {
  sample: SampleRow;
  onStartCupping: () => void;
  onDelete: () => void;
  onExport: (type: "png" | "pdf") => void;
  deleting: boolean;
}) {
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const photos = (s.photos ?? []) as string[];
  const descriptors = sampleDescriptors(s);
  const familyCounts = useMemo(() => computeFamilyCounts(descriptors), [descriptors]);
  const topDescriptors = descriptors.slice(0, 3);
  const finalScore = s.finalScore ? parseFloat(s.finalScore) : null;
  const tier = finalScore ? scoreTier(finalScore) : null;

  useEffect(() => {
    if (!exportOpen) return;
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [exportOpen]);

  return (
    <div className="bg-white border border-neutral-100 rounded-xl p-4 hover:border-neutral-200 transition-colors">
      <div className="flex items-start justify-between gap-3">
        {/* Left: info */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-neutral-900 truncate">{s.name}</span>
            <Badge
              variant="outline"
              className={`text-[10px] font-medium px-1.5 py-0 border shrink-0 ${
                s.status === "pending"
                  ? "text-amber-600 border-amber-200 bg-amber-50"
                  : "text-emerald-600 border-emerald-200 bg-emerald-50"
              }`}
            >
              {s.status === "pending" ? "Pending" : "Cupped"}
            </Badge>
          </div>
          <p className="text-xs text-neutral-400 truncate">
            {[s.origin, s.variety, s.process, s.roast].filter(v => v && v !== "—").join(" · ") || "No details"}
          </p>

          {/* Descriptor chips */}
          {topDescriptors.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {topDescriptors.map((d) => (
                <DescriptorChip key={d.id} descriptor={d} />
              ))}
              {descriptors.length > 3 && (
                <span className="text-[10px] text-neutral-400 self-center">+{descriptors.length - 3} more</span>
              )}
            </div>
          )}

          {photos.length > 0 && (
            <div className="flex gap-1.5 pt-0.5">
              {photos.slice(0, 3).map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={url} alt={`photo ${i + 1}`} className="size-9 object-cover rounded-lg border border-neutral-200" />
              ))}
              {photos.length > 3 && (
                <div className="size-9 rounded-lg border border-neutral-200 bg-neutral-50 flex items-center justify-center text-[10px] text-neutral-400">
                  +{photos.length - 3}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: wheel + score + actions */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          {/* Mini wheel (only if complete) */}
          {s.status === "complete" && (
            <FlavorWheel familyCounts={familyCounts} size={72} showLabels={false} />
          )}

          {finalScore !== null && tier && (
            <div className="text-right">
              <p className="font-mono font-bold text-xl text-neutral-900 leading-none">
                {finalScore.toFixed(2)}
              </p>
              <p className="text-[11px] font-semibold mt-0.5" style={{ color: tier.color }}>
                {tier.label}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-1 items-end">
            {s.status === "pending" ? (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1.5 border-neutral-200"
                onClick={onStartCupping}
              >
                <FlaskConical className="size-3.5" />
                Start Cupping
              </Button>
            ) : (
              <div ref={exportRef} className="relative">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs gap-1.5 border-neutral-200"
                  onClick={() => setExportOpen((v) => !v)}
                >
                  <Download className="size-3.5" />
                  Download
                  <ChevronDown className="size-3 opacity-60" />
                </Button>
                {exportOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-20 overflow-hidden min-w-[100px]">
                    <button
                      onClick={() => { onExport("png"); setExportOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      Save as PNG
                    </button>
                    <button
                      onClick={() => { onExport("pdf"); setExportOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      Save as PDF
                    </button>
                  </div>
                )}
              </div>
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
    </div>
  );
}

// ─── Score Slider Card ────────────────────────────────────────────────────────

function ScoreSliderCard({
  label,
  color,
  value,
  onChange,
  descriptors,
  onDescriptorsChange,
}: {
  label: string;
  color: string;
  value: string;
  onChange: (v: string) => void;
  descriptors: DescriptorTag[];
  onDescriptorsChange: (d: DescriptorTag[]) => void;
}) {
  const isSet = value !== "" && !isNaN(parseFloat(value));
  const numVal = isSet ? parseFloat(value) : null;
  const sliderVal = isSet ? numVal! : 6;
  const pct = ((sliderVal - 6) / (10 - 6)) * 100;

  return (
    <div
      className="bg-white rounded-2xl p-4 transition-all border flex flex-col gap-3"
      style={{ borderColor: isSet ? color + "40" : "#f3f4f6" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-neutral-800 leading-tight">{label}</span>
        <span
          className="font-mono font-bold text-lg leading-none tabular-nums transition-colors"
          style={{ color: isSet ? color : "#d1d5db" }}
        >
          {isSet ? numVal!.toFixed(2) : "—"}
        </span>
      </div>

      {/* Descriptor picker */}
      <div>
        {descriptors.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {descriptors.map((d) => (
              <DescriptorChip key={d.id} descriptor={d} onRemove={() => onDescriptorsChange(descriptors.filter((x) => x.id !== d.id))} />
            ))}
          </div>
        )}
        <DescriptorPicker descriptors={descriptors} onChange={onDescriptorsChange} />
      </div>

      {/* Slider */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center w-full pointer-events-none">
          <div className="h-1.5 w-full rounded-full bg-neutral-100">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: isSet ? `${pct}%` : "0%",
                background: `linear-gradient(90deg, ${color}90, ${color})`,
              }}
            />
          </div>
        </div>
        <input
          type="range"
          min={6}
          max={10}
          step={0.25}
          value={sliderVal}
          onChange={(e) => onChange(e.target.value)}
          className="relative w-full appearance-none bg-transparent cursor-pointer h-5"
          style={{ "--thumb-color": color } as React.CSSProperties}
        />
      </div>

      <div className="flex justify-between -mt-1">
        {[6, 7, 8, 9, 10].map((v) => (
          <span key={v} className="text-[10px] font-mono" style={{ color: isSet && numVal! >= v ? color + "99" : "#d1d5db" }}>
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Cupping Form ─────────────────────────────────────────────────────────────

function CuppingForm({
  sample: s,
  scores,
  descriptors,
  onChange,
  onDescriptorsChange,
  onBack,
  onSave,
  saving,
  exportCardRef,
}: {
  sample: SampleRow;
  scores: Scores;
  descriptors: DescriptorTag[];
  onChange: (key: keyof Scores, value: string) => void;
  onDescriptorsChange: (d: DescriptorTag[]) => void;
  onBack: () => void;
  onSave: () => void;
  saving: boolean;
  exportCardRef: React.RefObject<HTMLDivElement | null>;
}) {
  const liveScore = computeScore(scores);
  const allAttrsFilled = SCA_ATTRS.every(
    (a) => scores[a.key] !== "" && !isNaN(parseFloat(scores[a.key]))
  );
  const familyCounts = useMemo(() => computeFamilyCounts(descriptors), [descriptors]);
  const topNotes = descriptors.slice(0, 4);
  const tier = liveScore ? scoreTier(liveScore) : null;
  const photos = (s.photos ?? []) as string[];

  function handleAttrDesc(attrKey: string, newTags: DescriptorTag[]) {
    const tagged = newTags.map((t) => ({ ...t, attrKey }));
    onDescriptorsChange([...descriptors.filter((d) => d.attrKey !== attrKey), ...tagged]);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700 mb-6 transition-colors"
      >
        <ArrowLeft className="size-3" />
        Back to samples
      </button>

      <div className="lg:grid lg:grid-cols-[1fr_272px] lg:gap-10">
        {/* ── Left: form ── */}
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold font-heading text-neutral-900">{s.name}</h1>
            <p className="text-sm text-neutral-400 mt-1">
              {[s.origin, s.variety, s.process, s.roast].filter(v => v && v !== "—").join(" · ")}
            </p>
            {photos.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-3">
                {photos.map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={url} alt={`photo ${i + 1}`} className="size-12 object-cover rounded-lg border border-neutral-200" />
                ))}
              </div>
            )}
          </div>

          {/* Flavor Wheel Banner */}
          <div className="flex items-center gap-5 bg-neutral-50 rounded-2xl p-5">
            <FlavorWheel familyCounts={familyCounts} size={96} showLabels={false} />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-1">Live Score</p>
              <p className="font-mono font-bold text-4xl text-neutral-900 leading-none tabular-nums">
                {liveScore !== null ? liveScore.toFixed(2) : "—"}
              </p>
              {tier && (
                <p className="text-xs font-semibold mt-1.5" style={{ color: tier.color }}>{tier.label}</p>
              )}
            </div>
            {topNotes.length > 0 && (
              <div className="hidden sm:flex flex-wrap gap-1.5 justify-end max-w-[160px]">
                {topNotes.map((d) => (
                  <DescriptorChip key={d.id} descriptor={d} />
                ))}
              </div>
            )}
          </div>

          {/* SCA Attributes */}
          <div>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-4">SCA Attributes</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SCA_ATTRS.map((attr) => (
                <ScoreSliderCard
                  key={attr.key}
                  label={attr.label}
                  color={attr.color}
                  value={scores[attr.key as keyof Scores]}
                  onChange={(v) => onChange(attr.key as keyof Scores, v)}
                  descriptors={descriptors.filter((d) => d.attrKey === attr.key)}
                  onDescriptorsChange={(tags) => handleAttrDesc(attr.key, tags)}
                />
              ))}
            </div>
            <p className="text-[11px] text-neutral-400 mt-3">6.00 – 10.00 in 0.25 increments. Drag to score.</p>
          </div>

          {/* Per-Cup Checks */}
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
                        onClick={() => onChange(check.key as keyof Scores, String(opt))}
                        className={`font-mono text-xs w-8 h-7 rounded transition-colors border ${
                          scores[check.key as keyof Scores] === String(opt)
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
              className="w-full border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 resize-none rounded-xl"
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

        {/* ── Right: export panel ── */}
        {liveScore !== null && (
          <div className="hidden lg:block">
            <div className="sticky top-6 space-y-2">
              <p className="text-[10px] text-neutral-400 uppercase tracking-wide text-center">Export</p>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    if (!exportCardRef.current) return;
                    toast.promise(downloadPNG(exportCardRef.current, `${s.name}.png`), {
                      loading: "Generating PNG…", success: "Downloaded!", error: "Export failed",
                    });
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs text-neutral-600 border border-neutral-200 rounded-lg h-8 hover:bg-neutral-50 transition-colors"
                >
                  <Download className="size-3" />
                  PNG
                </button>
                <button
                  onClick={async () => {
                    if (!exportCardRef.current) return;
                    toast.promise(downloadPDF(exportCardRef.current, `${s.name}.pdf`), {
                      loading: "Generating PDF…", success: "Downloaded!", error: "Export failed",
                    });
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs text-neutral-600 border border-neutral-200 rounded-lg h-8 hover:bg-neutral-50 transition-colors"
                >
                  <Download className="size-3" />
                  PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export function SamplesClient({ initialSamples }: { initialSamples: SampleRow[] }) {
  const [samples, setSamples] = useState<SampleRow[]>(initialSamples);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);
  const [scores, setScores] = useState<Scores>(DEFAULT_SCORES);
  const [descriptors, setDescriptors] = useState<DescriptorTag[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newSample, setNewSample] = useState({ name: "", origin: "", variety: "", process: "", roast: "" });
  const [newPhotos, setNewPhotos] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const exportCardRef = useRef<HTMLDivElement>(null);

  // Per-sample export card ref for the samples list view
  const [exportTarget, setExportTarget] = useState<{ sample: SampleRow; type: "png" | "pdf" } | null>(null);
  const listExportRef = useRef<HTMLDivElement>(null);

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
    setDescriptors(sampleDescriptors(s));
  }

  function handleBack() {
    setActiveSampleId(null);
    setScores(DEFAULT_SCORES);
    setDescriptors([]);
  }

  function handleScoreChange(key: keyof Scores, value: string) {
    setScores((prev) => ({ ...prev, [key]: value }));
  }

  function handleSaveSession() {
    if (!activeSampleId) return;
    const score = computeScore(scores);
    if (score === null) return;
    const storedDescriptors: StoredDescriptor[] = descriptors.map(({ label, family }) => ({ label, family }));

    startTransition(async () => {
      await saveCuppingSession(activeSampleId, scores, storedDescriptors, score);
      setSamples((prev) =>
        prev.map((s) =>
          s.id === activeSampleId
            ? { ...s, ...scores, descriptors: storedDescriptors, status: "complete", finalScore: String(score) }
            : s
        )
      );
      setActiveSampleId(null);
      setScores(DEFAULT_SCORES);
      setDescriptors([]);
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
      if (activeSampleId === id) handleBack();
      toast.success("Sample deleted");
    });
  }

  const handleExport = useCallback((sample: SampleRow, type: "png" | "pdf") => {
    setExportTarget({ sample, type });
  }, []);

  // Trigger export once exportTarget is set and ref is populated
  useEffect(() => {
    if (!exportTarget || !listExportRef.current) return;
    const el = listExportRef.current;
    const { sample, type } = exportTarget;
    const filename = `${sample.name.replace(/[^a-z0-9]/gi, "_")}.${type}`;

    if (type === "png") {
      toast.promise(downloadPNG(el, filename), {
        loading: "Generating PNG…", success: "Downloaded!", error: "Export failed",
      });
    } else {
      toast.promise(downloadPDF(el, filename), {
        loading: "Generating PDF…", success: "Downloaded!", error: "Export failed",
      });
    }
    setExportTarget(null);
  }, [exportTarget]);

  if (activeSample) {
    return (
      <>
        <CuppingForm
          sample={activeSample}
          scores={scores}
          descriptors={descriptors}
          onChange={handleScoreChange}
          onDescriptorsChange={setDescriptors}
          onBack={handleBack}
          onSave={handleSaveSession}
          saving={isPending}
          exportCardRef={exportCardRef}
        />
        {/* Hidden export card for cupping form downloads */}
        <div style={{ position: "fixed", left: -9999, top: 0, pointerEvents: "none" }}>
          <div ref={exportCardRef}>
            <ExportCard
              sample={activeSample}
              scores={scores}
              descriptors={descriptors}
              liveScore={computeScore(scores)}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-neutral-900">Samples</h1>
          <p className="text-sm text-neutral-500 mt-1">Log received samples and run cupping sessions.</p>
        </div>
        <Button size="sm" className="gap-2 h-8 text-sm shrink-0" onClick={() => setShowNewForm((v) => !v)}>
          <Plus className="size-3.5" />
          Log Sample
        </Button>
      </div>

      {/* New sample form */}
      {showNewForm && (
        <div className="border border-neutral-100 rounded-xl p-5 space-y-4 bg-neutral-50">
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
              <Input placeholder="e.g. Ethiopia" value={newSample.origin} onChange={(e) => setNewSample((p) => ({ ...p, origin: e.target.value }))} className="h-8 text-sm border-neutral-200" />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1.5 block">Variety</label>
              <Input placeholder="e.g. Heirloom" value={newSample.variety} onChange={(e) => setNewSample((p) => ({ ...p, variety: e.target.value }))} className="h-8 text-sm border-neutral-200" />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1.5 block">Process</label>
              <Input placeholder="e.g. Washed" value={newSample.process} onChange={(e) => setNewSample((p) => ({ ...p, process: e.target.value }))} className="h-8 text-sm border-neutral-200" />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1.5 block">Roast</label>
              <Input placeholder="e.g. Light" value={newSample.roast} onChange={(e) => setNewSample((p) => ({ ...p, roast: e.target.value }))} className="h-8 text-sm border-neutral-200" />
            </div>
            <div className="md:col-span-2">
              <PhotoUploader photos={newPhotos} onChange={setNewPhotos} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="h-7 text-xs" onClick={handleLogSample} disabled={!newSample.name.trim() || isPending}>
              {isPending ? <Loader2 className="size-3 animate-spin" /> : "Add to queue"}
            </Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs text-neutral-400" onClick={() => { setShowNewForm(false); setNewPhotos([]); }}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Sample grid */}
      {samples.length === 0 ? (
        <div className="py-16 text-center">
          <FlaskConical className="size-6 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-neutral-600 mb-1">No samples yet</p>
          <p className="text-xs text-neutral-400">Log a received sample to start a cupping session.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {samples.map((s) => (
            <SampleCard
              key={s.id}
              sample={s}
              onStartCupping={() => startCupping(s.id)}
              onDelete={() => handleDelete(s.id)}
              onExport={(type) => handleExport(s, type)}
              deleting={isPending}
            />
          ))}
        </div>
      )}

      {/* Hidden export card for list-view downloads */}
      {exportTarget && (
        <div style={{ position: "fixed", left: -9999, top: 0, pointerEvents: "none" }}>
          <div ref={listExportRef}>
            <ExportCard
              sample={exportTarget.sample}
              scores={{
                fragrance: exportTarget.sample.fragrance ?? "",
                flavor: exportTarget.sample.flavor ?? "",
                aftertaste: exportTarget.sample.aftertaste ?? "",
                acidity: exportTarget.sample.acidity ?? "",
                body: exportTarget.sample.body ?? "",
                balance: exportTarget.sample.balance ?? "",
                overall: exportTarget.sample.overall ?? "",
                uniformity: exportTarget.sample.uniformity ?? "10",
                cleanCup: exportTarget.sample.cleanCup ?? "10",
                sweetness: exportTarget.sample.sweetness ?? "10",
                taints: exportTarget.sample.taints ?? "0",
                faults: exportTarget.sample.faults ?? "0",
                notes: exportTarget.sample.notes ?? "",
              }}
              descriptors={sampleDescriptors(exportTarget.sample)}
              liveScore={exportTarget.sample.finalScore ? parseFloat(exportTarget.sample.finalScore) : null}
            />
          </div>
        </div>
      )}
    </div>
  );
}
