"use client";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({
  currentStep,
  totalSteps,
}: StepIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full h-1.5 bg-surface-container fixed top-[72px] left-0 z-40">
      <div
        className="h-full vitality-accent-gradient transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
