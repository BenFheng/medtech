"use client";

import { useState } from "react";
import supplementsData from "@/data/supplements.json";
import type { Supplement } from "@/lib/types";

const allSupplements = supplementsData as Supplement[];

interface SwapModalProps {
  current: Supplement;
  stack: Supplement[];
  onSwap: (newSupplement: Supplement) => void;
  onClose: () => void;
}

export default function SwapModal({ current, stack, onSwap, onClose }: SwapModalProps) {
  const [search, setSearch] = useState("");
  const stackIds = stack.map((s) => s.id);
  const alternatives = allSupplements.filter(
    (s) => !stackIds.includes(s.id) && s.category === current.category &&
      (search === "" || s.name.toLowerCase().includes(search.toLowerCase()))
  );

  // Also include supplements from other categories that target similar symptoms
  const crossCategory = allSupplements.filter(
    (s) =>
      !stackIds.includes(s.id) &&
      s.category !== current.category &&
      s.targets.some((t) => current.targets.includes(t)) &&
      (search === "" || s.name.toLowerCase().includes(search.toLowerCase()))
  );

  const suggestions = [...alternatives, ...crossCategory].slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-surface-container">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-headline font-bold text-lg text-on-surface">
                Swap {current.name}
              </h3>
              <p className="text-sm text-on-surface-variant mt-1">
                Choose an alternative compound
              </p>
            </div>
            <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <input
            type="text"
            placeholder="Search supplements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-4 w-full px-4 py-2.5 rounded-lg bg-surface-container text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="p-4 space-y-2">
          {suggestions.length === 0 ? (
            <p className="text-center text-on-surface-variant text-sm py-8">No alternatives found</p>
          ) : (
            suggestions.map((supp) => {
              const hasConflict = stack.some(
                (s) =>
                  s.interactions.antagonisms.some((a) => a.compound === supp.id) ||
                  supp.interactions.antagonisms.some((a) => a.compound === s.id)
              );
              return (
                <button
                  key={supp.id}
                  onClick={() => onSwap(supp)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    hasConflict
                      ? "bg-tertiary-fixed/10 hover:bg-tertiary-fixed/20"
                      : "bg-surface-container-low hover:bg-surface-container"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-headline font-bold text-sm text-on-surface">
                        {supp.name}
                      </span>
                      <p className="text-xs text-on-surface-variant mt-1">
                        {supp.dosage.amount}{supp.dosage.unit} | ${supp.pricePerMonth}/mo
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1">
                        Targets: {supp.targets.slice(0, 3).join(", ").replace(/-/g, " ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasConflict && (
                        <span className="text-xs font-bold text-tertiary bg-tertiary-fixed/20 px-2 py-0.5 rounded-full">
                          Conflict
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        supp.evidence.level === "A"
                          ? "bg-primary-fixed text-primary"
                          : "bg-surface-container text-on-surface-variant"
                      }`}>
                        Evidence {supp.evidence.level}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
