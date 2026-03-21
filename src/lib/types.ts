export interface Supplement {
  id: string;
  name: string;
  category: string;
  schedule: "AM" | "PM" | "AM/PM";
  dosage: {
    amount: number;
    unit: string;
    form: string;
  };
  targets: string[];
  symptoms: string[];
  interactions: {
    synergies: { compound: string; reason: string }[];
    antagonisms: { compound: string; reason: string }[];
  };
  evidence: {
    level: "A" | "B" | "C";
    citations: number;
  };
  pricePerMonth: number;
}

export interface RecommendedStack {
  stackName: string;
  version: string;
  am: Supplement[];
  pm: Supplement[];
  focusMetrics: FocusMetric[];
  totalPrice: number;
  warnings: string[];
}

export interface FocusMetric {
  label: string;
  value: number;
  icon: string;
}
