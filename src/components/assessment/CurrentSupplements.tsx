"use client";

import { useState } from "react";
import { useAssessmentStore } from "@/stores/assessment";

const commonSupplements = [
  "Multivitamin",
  "Vitamin D",
  "Fish Oil / Omega-3",
  "Magnesium",
  "Protein Powder",
  "Creatine",
  "Probiotics",
  "Vitamin C",
  "Zinc",
  "Iron",
  "Collagen",
  "B-Complex",
];

const medicationCategories = [
  "Blood thinners (Warfarin, Aspirin)",
  "SSRIs / Antidepressants",
  "Blood pressure medication",
  "Thyroid medication",
  "Statins (Cholesterol)",
  "Diabetes medication",
  "Hormonal birth control",
  "None of the above",
];

export default function CurrentSupplements() {
  const {
    currentSupplements,
    setCurrentSupplements,
    currentMedications,
    setCurrentMedications,
  } = useAssessmentStore();
  const [customSupplement, setCustomSupplement] = useState("");

  const toggleSupplement = (supp: string) => {
    if (currentSupplements.includes(supp)) {
      setCurrentSupplements(currentSupplements.filter((s) => s !== supp));
    } else {
      setCurrentSupplements([...currentSupplements, supp]);
    }
  };

  const toggleMedication = (med: string) => {
    if (med === "None of the above") {
      setCurrentMedications(
        currentMedications.includes(med) ? [] : ["None of the above"]
      );
      return;
    }
    const filtered = currentMedications.filter(
      (m) => m !== "None of the above"
    );
    if (filtered.includes(med)) {
      setCurrentMedications(filtered.filter((m) => m !== med));
    } else {
      setCurrentMedications([...filtered, med]);
    }
  };

  const addCustomSupplement = () => {
    const trimmed = customSupplement.trim();
    if (trimmed && !currentSupplements.includes(trimmed)) {
      setCurrentSupplements([...currentSupplements, trimmed]);
      setCustomSupplement("");
    }
  };

  return (
    <div className="space-y-16">
      <div className="space-y-4 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed/30 text-primary rounded-full">
          <span className="material-symbols-outlined text-[18px]">
            medication
          </span>
          <span className="text-xs font-bold tracking-widest uppercase font-body">
            Step 04 / 04
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-extrabold text-on-background tracking-tight leading-tight">
          What are you currently taking?
        </h1>
        <p className="text-on-surface-variant text-lg max-w-xl font-body">
          This safety screen helps us avoid interactions and prevent
          redundancies in your protocol.
        </p>
      </div>

      <div className="space-y-12">
        {/* Current Supplements */}
        <div className="space-y-4">
          <h3 className="font-headline font-bold text-xl text-on-surface">
            Current Supplements
          </h3>
          <p className="text-on-surface-variant text-sm">
            Select any supplements you&apos;re already taking regularly.
          </p>
          <div className="flex flex-wrap gap-3">
            {commonSupplements.map((supp) => (
              <button
                key={supp}
                onClick={() => toggleSupplement(supp)}
                className={`px-5 py-2.5 rounded-full font-body font-medium text-sm transition-all active:scale-95 ${
                  currentSupplements.includes(supp)
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {supp}
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <input
              type="text"
              value={customSupplement}
              onChange={(e) => setCustomSupplement(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomSupplement()}
              placeholder="Add another supplement..."
              className="flex-1 px-4 py-3 bg-surface-container-lowest rounded-lg text-on-surface font-body border-b-2 border-transparent focus:border-primary focus:outline-none transition-colors"
            />
            <button
              onClick={addCustomSupplement}
              className="px-4 py-3 bg-surface-container-high text-primary rounded-lg font-headline font-bold hover:bg-surface-container-highest transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Medications */}
        <div className="space-y-4">
          <h3 className="font-headline font-bold text-xl text-on-surface">
            Current Medications
          </h3>
          <div className="bg-tertiary-fixed/20 p-4 rounded-xl flex items-start gap-3">
            <span className="material-symbols-outlined text-tertiary text-xl mt-0.5">
              warning
            </span>
            <p className="text-on-surface-variant text-sm">
              <strong className="text-on-surface">Important:</strong> Some
              supplements can interact with medications. This information is
              used solely for safety screening and is protected under our
              clinical privacy policy.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {medicationCategories.map((med) => (
              <button
                key={med}
                onClick={() => toggleMedication(med)}
                className={`p-4 rounded-xl text-left font-body text-sm transition-all active:scale-[0.98] ${
                  currentMedications.includes(med)
                    ? med === "None of the above"
                      ? "bg-primary-fixed/40 text-primary font-semibold"
                      : "bg-tertiary-fixed/30 text-on-surface font-semibold"
                    : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {med}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
