"use client";

import { useState } from "react";
import Link from "next/link";
import type { Supplement } from "@/lib/types";
import { getSynergies, checkConflicts } from "@/lib/stack";
import SwapModal from "./SwapModal";
import supplementsData from "@/data/supplements.json";

const allSupplements = supplementsData as Supplement[];

interface StackViewProps {
  stackName: string;
  version: string;
  am: Supplement[];
  pm: Supplement[];
  onSwap?: (removeId: string, newSupplement: Supplement) => void;
  onRemove?: (id: string) => void;
  onAdd?: (supplement: Supplement) => void;
}

function SupplementCard({
  supplement,
  scheduleLabel,
  synergies,
  antagonisms,
  editing,
  onDelete,
}: {
  supplement: Supplement;
  scheduleLabel: string;
  synergies: string[];
  antagonisms: string[];
  editing: boolean;
  onDelete: () => void;
}) {
  const iconMap: Record<string, string> = {
    cognitive: "psychology",
    "sleep-stress": "bedtime",
    longevity: "bolt",
    "skin-radiance": "face_5",
    foundation: "shield",
    performance: "fitness_center",
  };

  const icon = iconMap[supplement.category] || "medication";
  const isAM = scheduleLabel === "AM";

  return (
    <div className="bg-surface-container-low p-4 rounded-lg transition-all hover:bg-surface-container hover:translate-y-[-2px] flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined text-lg ${isAM ? "text-amber-500" : "text-indigo-400"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
            {isAM ? "light_mode" : "dark_mode"}
          </span>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wide">
            {scheduleLabel}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            supplement.evidence.level === "A"
              ? "bg-emerald-100 text-emerald-700"
              : supplement.evidence.level === "B"
              ? "bg-amber-100 text-amber-700"
              : "bg-slate-100 text-slate-500"
          }`}>
            {supplement.evidence.level === "A" ? "Strong Evidence" : supplement.evidence.level === "B" ? "Moderate Evidence" : "Emerging Evidence"}
          </span>
        </div>
        {editing && (
          <button
            onClick={onDelete}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-error/10 text-error hover:bg-error hover:text-on-error transition-all"
            aria-label="Remove"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>
      <h3 className="text-base font-headline font-bold text-on-surface mb-1">
        {supplement.name}
      </h3>
      <p className="text-sm text-on-surface-variant font-body mb-3">
        Targeting {supplement.targets.slice(0, 2).join(" & ").replace(/-/g, " ")}
      </p>

      {/* Synergy Indicators */}
      {synergies.length > 0 && (
        <div className="mb-2">
          {synergies.map((s, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-primary mt-1">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>link</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}

      {/* Antagonism Warnings */}
      {antagonisms.length > 0 && (
        <div className="mb-2">
          {antagonisms.map((a, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-tertiary mt-1">
              <span className="material-symbols-outlined text-sm">warning</span>
              <span>{a}</span>
            </div>
          ))}
        </div>
      )}

      <div className="pt-4 border-t border-outline-variant/10 space-y-3 mt-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-primary">Dosage:</span>
          <span className="text-xs text-on-surface">
            {supplement.dosage.amount}
            {supplement.dosage.unit}
          </span>
        </div>
        <div className="flex justify-end">
          <Link
            href={`/shop/${supplement.id}`}
            className="flex items-center gap-0.5 text-xs font-headline font-bold text-primary hover:text-primary-container transition-colors"
          >
            View
            <span className="material-symbols-outlined text-xs">chevron_right</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function StackView({ stackName, version, am, pm, onSwap, onRemove, onAdd }: StackViewProps) {
  const [swapTarget, setSwapTarget] = useState<Supplement | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid");
  const [editing, setEditing] = useState(false);
  const [addSearch, setAddSearch] = useState("");
  const allStack = [...am, ...pm.filter((p) => !am.some((a) => a.id === p.id))];

  const synergyStrings = getSynergies(allStack);
  const conflictStrings = checkConflicts(allStack);

  function getSupplementSynergies(supp: Supplement): string[] {
    return synergyStrings.filter((s) => s.includes(supp.name)).map((s) => {
      const match = s.match(/(.+?): (.+)/);
      return match ? match[1].replace(supp.name + " + ", "").replace(" + " + supp.name, "") : s;
    });
  }

  function getSupplementAntagonisms(supp: Supplement): string[] {
    return conflictStrings.filter((c) => c.includes(supp.name)).map((c) => {
      const match = c.match(/(.+?): (.+)/);
      return match ? `${match[1].replace(supp.name, "").replace(" ↔ ", "").trim()}: ${match[2]}` : c;
    });
  }

  const handleSwap = (newSupplement: Supplement) => {
    if (swapTarget && onSwap) {
      onSwap(swapTarget.id, newSupplement);
    }
    setSwapTarget(null);
  };

  return (
    <div className="space-y-8 overflow-hidden">
      <section className="bg-surface-container-lowest rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-primary uppercase font-body">
            Current Configuration
          </span>
          <h2 className="text-xl sm:text-2xl font-headline font-bold text-on-surface mt-1">
            {stackName} {version}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-surface-container rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === "grid" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === "timeline" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant"
              }`}
            >
              Timeline
            </button>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-headline font-bold transition-all ${
              editing
                ? "bg-primary text-on-primary"
                : "bg-surface-container text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-base">{editing ? "check" : "edit"}</span>
            {editing ? "Done" : "Edit"}
          </button>
        </div>
        </div>

        {/* Add supplement search bar */}
        {editing && (
          <div className="mt-4 bg-surface-container-low rounded-lg p-4">
            <div className="relative">
              <span className="material-symbols-outlined text-lg text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2">search</span>
              <input
                type="text"
                placeholder="Search supplements to add..."
                value={addSearch}
                onChange={(e) => setAddSearch(e.target.value)}
                className="w-full rounded-lg border border-outline-variant bg-surface pl-10 pr-4 py-2.5 text-sm font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="mt-3 max-h-48 overflow-y-auto space-y-1">
                {allSupplements
                  .filter((s) =>
                    (addSearch.length === 0 || s.name.toLowerCase().includes(addSearch.toLowerCase())) &&
                    !am.some((a) => a.id === s.id) &&
                    !pm.some((p) => p.id === s.id)
                  )
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        onAdd?.(s);
                        setAddSearch("");
                      }}
                      className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-left hover:bg-surface-container transition-colors"
                    >
                      <div>
                        <span className="text-sm font-headline font-bold text-on-surface">{s.name}</span>
                        <span className="text-xs text-on-surface-variant ml-2">{s.schedule} · ${s.pricePerMonth}/mo</span>
                      </div>
                      <span className="material-symbols-outlined text-primary text-lg">add_circle</span>
                    </button>
                  ))}
                {allSupplements.filter((s) =>
                  (addSearch.length === 0 || s.name.toLowerCase().includes(addSearch.toLowerCase())) &&
                  !am.some((a) => a.id === s.id) &&
                  !pm.some((p) => p.id === s.id)
                ).length === 0 && (
                  <p className="text-sm text-on-surface-variant text-center py-3">No supplements found.</p>
                )}
              </div>
          </div>
        )}
      </section>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ...pm.map((s) => ({ supplement: s, schedule: "PM" as const })),
            ...am.map((s) => ({ supplement: s, schedule: "AM" as const })),
          ].map(({ supplement, schedule }) => (
            <SupplementCard
              key={supplement.id}
              supplement={supplement}
              scheduleLabel={schedule}
              synergies={getSupplementSynergies(supplement)}
              antagonisms={getSupplementAntagonisms(supplement)}
              editing={editing}
              onDelete={() => onRemove?.(supplement.id)}
            />
          ))}
        </div>
      ) : (
        /* AM/PM Timeline View */
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>light_mode</span>
              </div>
              <h3 className="font-headline font-bold text-lg text-on-surface">Morning Protocol</h3>
            </div>
            <div className="ml-5 border-l-2 border-secondary-fixed pl-6 space-y-4">
              {am.map((supp) => (
                <div key={supp.id} className="flex items-center gap-4 bg-surface-container-low p-4 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-primary -ml-[31px]" />
                  <div className="flex-1">
                    <h4 className="font-headline font-bold text-sm text-on-surface">{supp.name}</h4>
                    <p className="text-xs text-on-surface-variant">{supp.dosage.amount}{supp.dosage.unit}</p>
                  </div>
                  <span className="text-xs font-bold text-primary">${supp.pricePerMonth}/mo</span>
                  <Link href={`/shop/${supp.id}`} className="text-xs font-headline font-bold text-primary hover:text-primary-container transition-colors flex items-center gap-1">
                    View <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>dark_mode</span>
              </div>
              <h3 className="font-headline font-bold text-lg text-on-surface">Evening Protocol</h3>
            </div>
            <div className="ml-5 border-l-2 border-primary-fixed pl-6 space-y-4">
              {pm.map((supp) => (
                <div key={supp.id} className="flex items-center gap-4 bg-surface-container-low p-4 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-primary -ml-[31px]" />
                  <div className="flex-1">
                    <h4 className="font-headline font-bold text-sm text-on-surface">{supp.name}</h4>
                    <p className="text-xs text-on-surface-variant">{supp.dosage.amount}{supp.dosage.unit}</p>
                  </div>
                  <span className="text-xs font-bold text-primary">${supp.pricePerMonth}/mo</span>
                  <Link href={`/shop/${supp.id}`} className="text-xs font-headline font-bold text-primary hover:text-primary-container transition-colors flex items-center gap-1">
                    View <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {swapTarget && (
        <SwapModal
          current={swapTarget}
          stack={allStack}
          onSwap={handleSwap}
          onClose={() => setSwapTarget(null)}
        />
      )}
    </div>
  );
}
