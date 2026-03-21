"use client";

import {
  AgeRange,
  BiologicalSex,
  ActivityLevel,
  useAssessmentStore,
} from "@/stores/assessment";

const ageRanges: AgeRange[] = [
  "25-30",
  "31-35",
  "36-40",
  "41-45",
  "46-50",
  "51-60",
  "60+",
];

const sexOptions: { id: BiologicalSex; label: string }[] = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "prefer-not-to-say", label: "Prefer not to say" },
];

const activityOptions: { id: ActivityLevel; label: string; description: string }[] = [
  { id: "sedentary", label: "Sedentary", description: "Desk work, minimal exercise" },
  { id: "moderate", label: "Moderate", description: "3-4 sessions per week" },
  { id: "active", label: "Active", description: "5+ sessions per week" },
  { id: "athletic", label: "Athletic", description: "Competitive or intensive training" },
];

export default function Biometrics() {
  const { biometrics, setBiometrics } = useAssessmentStore();

  return (
    <div className="space-y-10 md:space-y-16">
      <div className="space-y-4 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed/30 text-primary rounded-full">
          <span className="material-symbols-outlined text-[18px]">
            monitoring
          </span>
          <span className="text-xs font-bold tracking-widest uppercase font-body">
            Step 03 / 04
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-headline font-extrabold text-on-background tracking-tight leading-tight">
          Tell us about your biology.
        </h1>
        <p className="text-on-surface-variant text-base md:text-lg max-w-xl font-body">
          These baseline metrics help us calibrate dosage ranges and compound
          selection for your physiology.
        </p>
      </div>

      <div className="space-y-8 md:space-y-12">
        {/* Age Range */}
        <div className="space-y-4">
          <h3 className="font-headline font-bold text-lg md:text-xl text-on-surface">
            Age Range
          </h3>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {ageRanges.map((age) => (
              <button
                key={age}
                onClick={() => setBiometrics({ ageRange: age })}
                className={`px-5 py-3 rounded-full font-headline font-bold transition-all active:scale-95 min-h-[44px] min-w-[56px] ${
                  biometrics.ageRange === age
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>

        {/* Biological Sex */}
        <div className="space-y-4">
          <h3 className="font-headline font-bold text-lg md:text-xl text-on-surface">
            Biological Sex
          </h3>
          <p className="text-on-surface-variant text-sm">
            Used for hormone-sensitive compound adjustments only.
          </p>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {sexOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setBiometrics({ biologicalSex: option.id })}
                className={`px-5 py-3 rounded-full font-headline font-bold transition-all active:scale-95 min-h-[44px] ${
                  biometrics.biologicalSex === option.id
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Level */}
        <div className="space-y-4">
          <h3 className="font-headline font-bold text-lg md:text-xl text-on-surface">
            Activity Level
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {activityOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setBiometrics({ activityLevel: option.id })}
                className={`p-4 md:p-5 rounded-xl text-left transition-all active:scale-[0.98] min-h-[56px] ${
                  biometrics.activityLevel === option.id
                    ? "bg-primary-fixed/60"
                    : "bg-surface-container-lowest hover:bg-surface-container-high"
                }`}
              >
                <span
                  className={`font-headline font-bold text-base md:text-lg block ${
                    biometrics.activityLevel === option.id
                      ? "text-primary"
                      : "text-on-surface"
                  }`}
                >
                  {option.label}
                </span>
                <span className="text-on-surface-variant text-sm">
                  {option.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
