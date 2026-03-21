import supplementsData from "@/data/supplements.json";
import type { Supplement, RecommendedStack, FocusMetric } from "./types";
import type { PrimaryFocus, FrictionPoint } from "@/stores/assessment";

const supplements = supplementsData as Supplement[];

const focusToCategories: Record<PrimaryFocus, string[]> = {
  "cognitive-endurance": ["cognitive", "performance"],
  "stress-sleep": ["sleep-stress"],
  "cellular-longevity": ["longevity"],
  "skin-radiance": ["skin-radiance"],
};

const frictionToSymptoms: Record<FrictionPoint, string[]> = {
  "afternoon-crash": ["afternoon energy crash", "mental fatigue", "low energy"],
  "brain-fog": ["brain fog", "difficulty concentrating", "poor concentration", "mental sluggishness"],
  "poor-sleep": ["insomnia", "poor sleep quality", "difficulty falling asleep", "restless sleep"],
  "low-energy": ["chronic fatigue", "low energy", "mitochondrial dysfunction"],
  "skin-dullness": ["skin dullness", "dull skin", "aging skin", "fine lines"],
  "joint-stiffness": ["joint stiffness", "muscle stiffness", "slow recovery"],
  "stress-anxiety": ["chronic stress", "anxiety", "elevated cortisol", "stress-induced brain fog"],
  "slow-recovery": ["slow recovery", "exercise recovery", "muscle soreness", "immune weakness"],
};

const focusToMetrics: Record<PrimaryFocus, FocusMetric[]> = {
  "cognitive-endurance": [
    { label: "Cognitive Performance", value: 0, icon: "psychology" },
    { label: "Neuroprotection", value: 0, icon: "neurology" },
    { label: "Focus & Clarity", value: 0, icon: "center_focus_strong" },
  ],
  "stress-sleep": [
    { label: "Sleep Architecture", value: 0, icon: "bedtime" },
    { label: "Stress Resilience", value: 0, icon: "spa" },
    { label: "Neural Calm", value: 0, icon: "self_improvement" },
  ],
  "cellular-longevity": [
    { label: "Mitochondrial Health", value: 0, icon: "bolt" },
    { label: "Telomere Protection", value: 0, icon: "shield" },
    { label: "Cellular Repair", value: 0, icon: "healing" },
  ],
  "skin-radiance": [
    { label: "Dermal Elasticity", value: 0, icon: "face" },
    { label: "Collagen Synthesis", value: 0, icon: "water_drop" },
    { label: "Antioxidant Defense", value: 0, icon: "verified_user" },
  ],
};

const stackNames: Record<PrimaryFocus, string> = {
  "cognitive-endurance": "The Cognition Stack",
  "stress-sleep": "The Resilience Stack",
  "cellular-longevity": "The Longevity Stack",
  "skin-radiance": "The Radiance Stack",
};

interface AssessmentInput {
  primaryFocus: PrimaryFocus;
  frictionPoints: FrictionPoint[];
  currentSupplements: string[];
  currentMedications: string[];
}

export function generateRecommendation(input: AssessmentInput): RecommendedStack {
  const { primaryFocus, frictionPoints, currentMedications } = input;
  const warnings: string[] = [];

  // 1. Score each supplement based on relevance
  const scored = supplements.map((supp) => {
    let score = 0;

    // Primary focus category match (highest weight)
    const focusCategories = focusToCategories[primaryFocus];
    if (focusCategories.includes(supp.category)) {
      score += 10;
    }

    // Foundation supplements always get a baseline score
    if (supp.category === "foundation") {
      score += 3;
    }

    // Friction point symptom matching
    for (const fp of frictionPoints) {
      const relevantSymptoms = frictionToSymptoms[fp];
      const matchCount = supp.symptoms.filter((s) =>
        relevantSymptoms.some((rs) => s.toLowerCase().includes(rs.toLowerCase()) || rs.toLowerCase().includes(s.toLowerCase()))
      ).length;
      score += matchCount * 2;
    }

    // Evidence level bonus
    if (supp.evidence.level === "A") score += 2;
    if (supp.evidence.level === "B") score += 1;

    return { supplement: supp, score };
  });

  // 2. Sort by score and take top candidates
  scored.sort((a, b) => b.score - a.score);
  const candidates = scored
    .filter((s) => s.score > 0)
    .map((s) => s.supplement);

  // 3. Build stack with interaction validation
  const stack: Supplement[] = [];
  const MAX_STACK_SIZE = 8;

  for (const candidate of candidates) {
    if (stack.length >= MAX_STACK_SIZE) break;

    // Check for antagonisms with existing stack members
    let hasConflict = false;
    for (const existing of stack) {
      const isAntagonist = existing.interactions.antagonisms.some(
        (a) => a.compound === candidate.id
      );
      const candidateAntagonist = candidate.interactions.antagonisms.some(
        (a) => a.compound === existing.id
      );
      if (isAntagonist || candidateAntagonist) {
        hasConflict = true;
        break;
      }
    }

    if (!hasConflict) {
      stack.push(candidate);
    }
  }

  // 4. Check medication interactions
  if (currentMedications.some((m) => m.includes("Blood thinners"))) {
    const omega = stack.find((s) => s.id === "omega-3-epa-dha");
    if (omega) {
      warnings.push(
        "Omega-3 may enhance the effect of blood thinners. Consult your physician before starting this protocol."
      );
    }
  }

  if (currentMedications.some((m) => m.includes("SSRI"))) {
    const trypto = stack.find((s) => s.id === "l-tryptophan");
    if (trypto) {
      warnings.push(
        "L-Tryptophan combined with SSRIs may increase serotonin levels. Medical supervision recommended."
      );
      // Remove from stack for safety
      const idx = stack.indexOf(trypto);
      if (idx > -1) stack.splice(idx, 1);
    }
  }

  if (currentMedications.some((m) => m.includes("Thyroid"))) {
    warnings.push(
      "Some supplements may affect thyroid hormone absorption. Take supplements 4 hours apart from thyroid medication."
    );
  }

  // 5. Split into AM/PM
  const am = stack.filter((s) => s.schedule === "AM" || s.schedule === "AM/PM");
  const pm = stack.filter((s) => s.schedule === "PM" || s.schedule === "AM/PM");

  // 6. Calculate focus metrics
  const metrics = focusToMetrics[primaryFocus].map((metric) => ({
    ...metric,
    value: Math.min(
      98,
      Math.max(
        55,
        60 + stack.length * 4 + frictionPoints.length * 2 + Math.floor(Math.random() * 10)
      )
    ),
  }));

  // 7. Calculate total price
  const totalPrice = stack.reduce((sum, s) => sum + s.pricePerMonth, 0);

  return {
    stackName: stackNames[primaryFocus],
    version: "v.1.0",
    am,
    pm,
    focusMetrics: metrics,
    totalPrice: Math.max(totalPrice, 149),
    warnings,
  };
}
