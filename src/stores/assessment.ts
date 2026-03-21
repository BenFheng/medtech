import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PrimaryFocus =
  | "cognitive-endurance"
  | "stress-sleep"
  | "cellular-longevity"
  | "skin-radiance";

export type FrictionPoint =
  | "afternoon-crash"
  | "brain-fog"
  | "poor-sleep"
  | "low-energy"
  | "skin-dullness"
  | "joint-stiffness"
  | "stress-anxiety"
  | "slow-recovery";

export type BiologicalSex = "male" | "female" | "prefer-not-to-say";

export type AgeRange =
  | "25-30"
  | "31-35"
  | "36-40"
  | "41-45"
  | "46-50"
  | "51-60"
  | "60+";

export type ActivityLevel = "sedentary" | "moderate" | "active" | "athletic";

interface AssessmentState {
  currentStep: number;
  primaryFocus: PrimaryFocus | null;
  frictionPoints: FrictionPoint[];
  biometrics: {
    ageRange: AgeRange | null;
    biologicalSex: BiologicalSex | null;
    activityLevel: ActivityLevel | null;
  };
  currentSupplements: string[];
  currentMedications: string[];
  isComplete: boolean;

  // Actions
  setStep: (step: number) => void;
  setPrimaryFocus: (focus: PrimaryFocus) => void;
  toggleFrictionPoint: (point: FrictionPoint) => void;
  setBiometrics: (bio: Partial<AssessmentState["biometrics"]>) => void;
  setCurrentSupplements: (supplements: string[]) => void;
  setCurrentMedications: (medications: string[]) => void;
  completeAssessment: () => void;
  reset: () => void;
}

const initialState = {
  currentStep: 1,
  primaryFocus: null as PrimaryFocus | null,
  frictionPoints: [] as FrictionPoint[],
  biometrics: {
    ageRange: null as AgeRange | null,
    biologicalSex: null as BiologicalSex | null,
    activityLevel: null as ActivityLevel | null,
  },
  currentSupplements: [] as string[],
  currentMedications: [] as string[],
  isComplete: false,
};

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set) => ({
      ...initialState,

      setStep: (step) => set({ currentStep: step }),

      setPrimaryFocus: (focus) => set({ primaryFocus: focus }),

      toggleFrictionPoint: (point) =>
        set((state) => ({
          frictionPoints: state.frictionPoints.includes(point)
            ? state.frictionPoints.filter((p) => p !== point)
            : [...state.frictionPoints, point],
        })),

      setBiometrics: (bio) =>
        set((state) => ({
          biometrics: { ...state.biometrics, ...bio },
        })),

      setCurrentSupplements: (supplements) =>
        set({ currentSupplements: supplements }),

      setCurrentMedications: (medications) =>
        set({ currentMedications: medications }),

      completeAssessment: () => set({ isComplete: true }),

      reset: () => set(initialState),
    }),
    {
      name: "medtech-assessment",
    }
  )
);
