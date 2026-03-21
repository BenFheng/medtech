"use client";

import type { Supplement } from "@/lib/types";

interface StackViewProps {
  stackName: string;
  version: string;
  am: Supplement[];
  pm: Supplement[];
}

function SupplementCard({ supplement, scheduleLabel }: { supplement: Supplement; scheduleLabel: string }) {
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
    <div className="bg-surface-container-low p-6 rounded-lg transition-all hover:bg-surface-container hover:translate-y-[-2px]">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${isAM ? "bg-secondary-fixed" : "bg-primary-fixed"} text-primary`}>
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        </div>
        <span className="text-[10px] font-bold bg-white px-2 py-1 rounded-full text-outline uppercase tracking-wide">
          {scheduleLabel} Schedule
        </span>
      </div>
      <h3 className="text-lg font-headline font-bold text-on-surface mb-1">
        {supplement.name}
      </h3>
      <p className="text-sm text-on-surface-variant font-body mb-4">
        Targeting {supplement.targets.slice(0, 2).join(" & ").replace(/-/g, " ")}
      </p>
      <div className="flex items-center gap-2 pt-4 border-t border-outline-variant/10">
        <span className="text-xs font-bold text-primary">Dosage:</span>
        <span className="text-xs text-on-surface">
          {supplement.dosage.amount}
          {supplement.dosage.unit} {supplement.dosage.form.split(" ").slice(0, 2).join(" ")}
        </span>
      </div>
    </div>
  );
}

export default function StackView({ stackName, version, am, pm }: StackViewProps) {
  const allSupplements = [
    ...pm.map((s) => ({ supplement: s, schedule: "PM" as const })),
    ...am.map((s) => ({ supplement: s, schedule: "AM" as const })),
  ];

  return (
    <section className="bg-surface-container-lowest rounded-xl p-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="text-xs font-bold tracking-widest text-primary uppercase font-body">
            Current Configuration
          </span>
          <h2 className="text-3xl font-headline font-bold text-on-surface mt-1">
            {stackName} {version}
          </h2>
        </div>
        <div className="flex items-center gap-2 text-primary font-semibold">
          <span className="material-symbols-outlined">verified_user</span>
          <span className="text-sm">Clinical Grade</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allSupplements.map(({ supplement, schedule }) => (
          <SupplementCard
            key={supplement.id}
            supplement={supplement}
            scheduleLabel={schedule}
          />
        ))}
      </div>
    </section>
  );
}
