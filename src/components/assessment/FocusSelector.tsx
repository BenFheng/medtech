"use client";

import { PrimaryFocus, useAssessmentStore } from "@/stores/assessment";

const focusOptions: {
  id: PrimaryFocus;
  label: string;
  icon: string;
}[] = [
  { id: "cognitive-endurance", label: "Cognitive Endurance", icon: "psychology" },
  { id: "stress-sleep", label: "Stress & Sleep", icon: "nights_stay" },
  { id: "cellular-longevity", label: "Cellular Longevity", icon: "cell_tower" },
  { id: "skin-radiance", label: "Skin & Radiance", icon: "face_5" },
];

export default function FocusSelector() {
  const { primaryFocus, setPrimaryFocus } = useAssessmentStore();

  return (
    <div className="space-y-16">
      <div className="space-y-4 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed/30 text-primary rounded-full">
          <span className="material-symbols-outlined text-[18px]">biotech</span>
          <span className="text-xs font-bold tracking-widest uppercase font-body">
            Step 01 / 04
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-extrabold text-on-background tracking-tight leading-tight">
          What is your primary focus for your professional lifestyle?
        </h1>
        <p className="text-on-surface-variant text-lg max-w-xl font-body">
          Select the metabolic path that aligns most closely with your current
          performance objectives.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {focusOptions.map((option) => {
          const isSelected = primaryFocus === option.id;
          return (
            <button
              key={option.id}
              onClick={() => setPrimaryFocus(option.id)}
              className={`group relative flex items-center justify-between p-6 rounded-full transition-all duration-300 active:scale-[0.98] ${
                isSelected
                  ? "bg-primary-fixed shadow-sm"
                  : "bg-surface-container-lowest hover:bg-surface-container-high"
              }`}
            >
              <div className="flex items-center gap-6">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-high text-outline group-hover:bg-primary/10 group-hover:text-primary"
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={
                      isSelected
                        ? { fontVariationSettings: "'FILL' 1" }
                        : undefined
                    }
                  >
                    {option.icon}
                  </span>
                </div>
                <span
                  className={`text-xl md:text-2xl font-headline font-bold ${
                    isSelected
                      ? "text-primary"
                      : "text-on-surface-variant group-hover:text-on-background"
                  }`}
                >
                  {option.label}
                </span>
              </div>
              {isSelected ? (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary text-sm">
                    check
                  </span>
                </div>
              ) : (
                <span className="material-symbols-outlined text-outline opacity-0 group-hover:opacity-100 transition-opacity">
                  arrow_forward
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
