"use client";

import { FrictionPoint, useAssessmentStore } from "@/stores/assessment";

const frictionOptions: {
  id: FrictionPoint;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    id: "afternoon-crash",
    label: "Afternoon Energy Crash",
    description: "I consistently lose focus and energy after 2-3 PM",
    icon: "battery_low",
  },
  {
    id: "brain-fog",
    label: "Brain Fog & Focus",
    description: "Difficulty maintaining mental clarity during demanding tasks",
    icon: "blur_on",
  },
  {
    id: "poor-sleep",
    label: "Poor Sleep Quality",
    description: "Trouble falling asleep or waking up unrefreshed",
    icon: "bedtime_off",
  },
  {
    id: "low-energy",
    label: "Low Baseline Energy",
    description: "General fatigue that persists throughout the day",
    icon: "speed",
  },
  {
    id: "skin-dullness",
    label: "Skin Dullness & Aging",
    description: "Noticeable decline in skin elasticity or radiance",
    icon: "face_retouching_off",
  },
  {
    id: "joint-stiffness",
    label: "Joint & Muscle Stiffness",
    description: "Reduced mobility or recovery after physical activity",
    icon: "accessibility_new",
  },
  {
    id: "stress-anxiety",
    label: "Chronic Stress & Anxiety",
    description: "Elevated cortisol affecting daily performance",
    icon: "psychology_alt",
  },
  {
    id: "slow-recovery",
    label: "Slow Recovery",
    description: "Extended recovery time after workouts or illness",
    icon: "healing",
  },
];

export default function FrictionPoints() {
  const { frictionPoints, toggleFrictionPoint } = useAssessmentStore();

  return (
    <div className="space-y-16">
      <div className="space-y-4 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed/30 text-primary rounded-full">
          <span className="material-symbols-outlined text-[18px]">
            troubleshoot
          </span>
          <span className="text-xs font-bold tracking-widest uppercase font-body">
            Step 02 / 04
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-extrabold text-on-background tracking-tight leading-tight">
          What friction points are holding you back?
        </h1>
        <p className="text-on-surface-variant text-lg max-w-xl font-body">
          Select all that apply. This helps us target specific cellular pathways
          in your protocol.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {frictionOptions.map((option) => {
          const isSelected = frictionPoints.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => toggleFrictionPoint(option.id)}
              className={`group flex items-start gap-4 p-6 rounded-xl transition-all duration-300 active:scale-[0.98] text-left ${
                isSelected
                  ? "bg-primary-fixed/60"
                  : "bg-surface-container-lowest hover:bg-surface-container-high"
              }`}
            >
              <div
                className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center transition-colors ${
                  isSelected
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-high text-outline"
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {option.icon}
                </span>
              </div>
              <div className="flex-1">
                <h3
                  className={`font-headline font-bold text-lg ${
                    isSelected ? "text-primary" : "text-on-surface"
                  }`}
                >
                  {option.label}
                </h3>
                <p className="text-on-surface-variant text-sm mt-1">
                  {option.description}
                </p>
              </div>
              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                  <span className="material-symbols-outlined text-on-primary text-xs">
                    check
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
