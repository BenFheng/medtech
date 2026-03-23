"use client";

import type { Supplement, FocusMetric } from "@/lib/types";
import type { FrictionPoint } from "@/stores/assessment";
import { getSynergies } from "@/lib/stack";

interface ProtocolInsightsProps {
  stack: Supplement[];
  frictionPoints: FrictionPoint[];
  metrics: FocusMetric[];
}

const frictionLabels: Record<FrictionPoint, string> = {
  "afternoon-crash": "Afternoon Energy Crash",
  "brain-fog": "Brain Fog",
  "poor-sleep": "Poor Sleep Quality",
  "low-energy": "Low Energy",
  "skin-dullness": "Skin Dullness",
  "joint-stiffness": "Joint Stiffness",
  "stress-anxiety": "Stress & Anxiety",
  "slow-recovery": "Slow Recovery",
};

export default function ProtocolInsights({ stack, frictionPoints, metrics }: ProtocolInsightsProps) {
  const synergies = getSynergies(stack);

  return (
    <div className="space-y-8 overflow-hidden">
      {/* Why Each Supplement Was Chosen */}
      <section className="bg-surface-container-lowest rounded-xl p-4">
        <h3 className="font-headline font-bold text-xl text-on-surface mb-6">
          Why These Compounds Were Selected
        </h3>
        <div className="space-y-4">
          {stack.map((supp) => {
            const matchedFrictions = frictionPoints.filter((fp) => {
              const symptoms = supp.symptoms.map((s) => s.toLowerCase());
              const frictionKey = fp.replace(/-/g, " ");
              return symptoms.some(
                (s) => s.includes(frictionKey) || frictionKey.includes(s.split(" ")[0])
              );
            });

            return (
              <div key={supp.id} className="bg-surface-container-low rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-headline font-bold text-on-surface">{supp.name}</h4>
                    <p className="text-sm text-on-surface-variant mt-1 truncate">
                      {supp.dosage.amount}{supp.dosage.unit} — {supp.dosage.form.split(" ").slice(0, 4).join(" ")}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
                    supp.evidence.level === "A"
                      ? "bg-emerald-100 text-emerald-700"
                      : supp.evidence.level === "B"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {supp.evidence.level === "A" ? "Strong Evidence" : supp.evidence.level === "B" ? "Moderate Evidence" : "Emerging Evidence"} | {supp.evidence.citations}
                  </span>
                </div>
                {matchedFrictions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs text-on-surface-variant">Addresses:</span>
                    {matchedFrictions.map((fp) => (
                      <span key={fp} className="text-xs bg-primary-fixed/30 text-primary px-2 py-0.5 rounded-full">
                        {frictionLabels[fp]}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-on-surface-variant mt-2 truncate">
                  Targets: {supp.targets.map((t) => t.replace(/-/g, " ")).join(" | ")}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interaction Map */}
      <section className="bg-surface-container-lowest rounded-xl p-4">
        <h3 className="font-headline font-bold text-xl text-on-surface mb-6">
          Synergy Map
        </h3>
        {synergies.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No synergies detected in current stack.</p>
        ) : (
          <div className="space-y-3">
            {synergies.map((synergy, i) => (
              <div key={i} className="flex items-start gap-3 bg-primary-fixed/10 rounded-lg p-4">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                  link
                </span>
                <p className="text-sm text-on-surface">{synergy}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Evidence Cards */}
      <section className="bg-surface-container-lowest rounded-xl p-4">
        <h3 className="font-headline font-bold text-xl text-on-surface mb-6">
          Evidence Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stack.map((supp) => (
            <div key={supp.id} className="bg-surface-container-low rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${
                  supp.evidence.level === "A"
                    ? "bg-emerald-500 text-white"
                    : supp.evidence.level === "B"
                    ? "bg-amber-500 text-white"
                    : "bg-slate-400 text-white"
                }`}>
                  {supp.evidence.level}
                </div>
                <div>
                  <h4 className="font-headline font-bold text-sm text-on-surface">{supp.name}</h4>
                  <p className="text-[10px] text-on-surface-variant">{supp.evidence.citations} peer-reviewed citations</p>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {supp.symptoms.slice(0, 2).join(", ")} support via {supp.targets[0]?.replace(/-/g, " ")} pathway
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
