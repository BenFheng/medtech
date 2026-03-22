import { createServerClient } from "@/lib/supabase";

// Map granular tags to broad benefit categories
const tagToCategory: Record<string, string> = {
  // Cognitive
  cognitive: "Cognitive", focus: "Cognitive", attention: "Cognitive", memory: "Cognitive",
  "memory-consolidation": "Cognitive", "working-memory": "Cognitive", learning: "Cognitive",
  "cognitive-performance": "Cognitive", neurogenesis: "Cognitive", neuroprotection: "Cognitive",
  "acetylcholine-synthesis": "Cognitive", "nerve-growth-factor": "Cognitive",
  "calm-alertness": "Cognitive", "brain-health": "Cognitive",
  "brain-fog": "Cognitive", "difficulty-concentrating": "Cognitive",
  "difficulty-learning-new-information": "Cognitive", "difficulty-multitasking": "Cognitive",
  "poor-concentration": "Cognitive", "poor-memory-recall": "Cognitive",
  "slow-cognitive-processing": "Cognitive", forgetfulness: "Cognitive",
  "cognitive-fatigue-during-demanding-tasks": "Cognitive",
  "mild-cognitive-decline": "Cognitive", "age-related-cognitive-decline": "Cognitive",
  "age-related-memory-decline": "Cognitive", "mental-fatigue": "Cognitive",
  "mental-fatigue-during-tasks": "Cognitive", "stress-induced-brain-fog": "Cognitive",
  "stress-related-memory-issues": "Cognitive",

  // Sleep & Stress
  "sleep-stress": "Sleep & Stress", "sleep-quality": "Sleep & Stress",
  "sleep-onset": "Sleep & Stress", "sleep-architecture": "Sleep & Stress",
  "gaba-modulation": "Sleep & Stress", "gaba-activity": "Sleep & Stress",
  anxiolysis: "Sleep & Stress", "mild-anxiety": "Sleep & Stress",
  "stress-reduction": "Sleep & Stress", "stress-resilience": "Sleep & Stress",
  "stress-adaptation": "Sleep & Stress", "cortisol-reduction": "Sleep & Stress",
  "cortisol-regulation": "Sleep & Stress", "elevated-cortisol": "Sleep & Stress",
  "chronic-stress": "Sleep & Stress", burnout: "Sleep & Stress",
  "difficulty-falling-asleep": "Sleep & Stress", "difficulty-reaching-deep-sleep": "Sleep & Stress",
  "difficulty-winding-down": "Sleep & Stress", "racing-thoughts-at-night": "Sleep & Stress",
  "non-restorative-sleep": "Sleep & Stress", "daytime-drowsiness": "Sleep & Stress",
  "restless-legs": "Sleep & Stress", "next-day-alertness": "Sleep & Stress",
  "core-body-temperature": "Sleep & Stress", "muscle-relaxation": "Sleep & Stress",
  "muscle-cramps": "Sleep & Stress", "poor-sleep-quality": "Sleep & Stress",
  "serotonin-synthesis": "Sleep & Stress", "melatonin-precursor": "Sleep & Stress",

  // Energy & Performance
  performance: "Energy & Performance", "physical-endurance": "Energy & Performance",
  "mental-stamina": "Energy & Performance", endurance: "Energy & Performance",
  strength: "Energy & Performance", "atp-regeneration": "Energy & Performance",
  "atp-production": "Energy & Performance", "oxygen-utilization": "Energy & Performance",
  "fatigue-resistance": "Energy & Performance", "lean-mass": "Energy & Performance",
  "exercise-fatigue": "Energy & Performance", "low-energy": "Energy & Performance",
  "persistent-fatigue": "Energy & Performance", "age-related-fatigue": "Energy & Performance",
  "altitude-related-fatigue": "Energy & Performance",
  "declining-exercise-capacity": "Energy & Performance",
  "physical-performance-plateau": "Energy & Performance",
  "strength-plateau": "Energy & Performance", "poor-exercise-endurance": "Energy & Performance",
  "poor-exercise-recovery": "Energy & Performance", "slow-recovery": "Energy & Performance",
  "reduced-vo2-max": "Energy & Performance", "statin-related-muscle-fatigue": "Energy & Performance",
  "creatine-monohydrate": "Energy & Performance", "respiratory-health": "Energy & Performance",
  "exercise-induced-oxidative-stress": "Energy & Performance",

  // Longevity & Cellular Health
  longevity: "Longevity", "mitochondrial-function": "Longevity",
  "mitochondrial-biogenesis": "Longevity", "cellular-energy": "Longevity",
  "nad-plus-biosynthesis": "Longevity", "sirtuin-activation": "Longevity",
  "dna-repair": "Longevity", "dna-protection": "Longevity",
  "antioxidant-defense": "Longevity", "cardiovascular-aging": "Longevity",
  "oxidative-stress": "Longevity", "oxidative-stress-markers": "Longevity",
  "chronic-inflammation": "Longevity", "chronic-low-grade-inflammation": "Longevity",

  // Skin, Hair & Beauty
  "skin-radiance": "Skin & Beauty", "skin-barrier": "Skin & Beauty",
  "skin-hydration": "Skin & Beauty", "skin-elasticity": "Skin & Beauty",
  "skin-protection": "Skin & Beauty", "skin-health": "Skin & Beauty",
  "skin-brightening": "Skin & Beauty", "anti-wrinkle": "Skin & Beauty",
  "collagen-synthesis": "Skin & Beauty", "hair-strength": "Skin & Beauty",
  "nail-growth": "Skin & Beauty", "dermal-volume": "Skin & Beauty",
  hydration: "Skin & Beauty", "eye-health": "Skin & Beauty",
  "dry-flaky-skin": "Skin & Beauty", "dull-skin-tone": "Skin & Beauty",
  "fine-lines": "Skin & Beauty", "skin-sagging": "Skin & Beauty",
  "skin-dehydration": "Skin & Beauty", "compromised-skin-barrier": "Skin & Beauty",
  "loss-of-skin-plumpness": "Skin & Beauty", "thinning-hair": "Skin & Beauty",
  "brittle-nails": "Skin & Beauty", "uv-skin-damage": "Skin & Beauty",
  "dry-eyes": "Skin & Beauty", "eye-fatigue": "Skin & Beauty",
  acne: "Skin & Beauty", phytoceramides: "Skin & Beauty",

  // Immune & Foundation
  foundation: "Immune & Foundation", "immune-function": "Immune & Foundation",
  "immune-modulation": "Immune & Foundation", "immune-support": "Immune & Foundation",
  "bone-density": "Immune & Foundation", "calcium-metabolism": "Immune & Foundation",
  "calcium-absorption": "Immune & Foundation", "cardiovascular-health": "Immune & Foundation",
  "cardiovascular-protection": "Immune & Foundation",
  "energy-metabolism": "Immune & Foundation", methylation: "Immune & Foundation",
  "homocysteine-regulation": "Immune & Foundation", "elevated-homocysteine": "Immune & Foundation",
  "poor-methylation": "Immune & Foundation",
  "thyroid-function": "Immune & Foundation", "thyroid-support": "Immune & Foundation",
  "thyroid-sluggishness": "Immune & Foundation",
  "frequent-colds": "Immune & Foundation", "frequent-illness": "Immune & Foundation",
  "weakened-immunity": "Immune & Foundation", "seasonal-mood-changes": "Immune & Foundation",
  "low-vitamin-d-levels": "Immune & Foundation", "bone-density-loss": "Immune & Foundation",
  "concern-about-calcium-deposits": "Immune & Foundation",
  "arterial-health": "Immune & Foundation", "arterial-stiffness": "Immune & Foundation",
  "high-triglycerides": "Immune & Foundation", selenium: "Immune & Foundation",

  // Mood & Hormones
  "mood-support": "Mood & Hormones", "low-mood": "Mood & Hormones",
  "testosterone-support": "Mood & Hormones", "anti-inflammatory": "Mood & Hormones",
  "joint-lubrication": "Mood & Hormones", "joint-health": "Mood & Hormones",
  "joint-stiffness": "Mood & Hormones", "wound-healing": "Mood & Hormones",
  "slow-wound-healing": "Mood & Hormones", "nervous-system-support": "Mood & Hormones",
  "cell-membrane-integrity": "Mood & Hormones",
  "carbohydrate-cravings": "Mood & Hormones",
};

function categorizeTags(tags: string[]): string[] {
  const categories = new Set<string>();
  for (const tag of tags) {
    const cat = tagToCategory[tag];
    if (cat) categories.add(cat);
  }
  return [...categories];
}

export async function GET() {
  const supabase = createServerClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("name");

  if (error) {
    console.error("Shop fetch error:", error);
    return Response.json({ products: [], filters: {} }, { status: 500 });
  }

  // Build dynamic filter options with counts
  const benefitsMap: Record<string, number> = {};
  const productTypeMap: Record<string, number> = {};
  const safeForMap: Record<string, number> = {};

  // Also attach broad categories to each product for client-side filtering
  const enrichedProducts = (products || []).map((p) => {
    const broadCategories = categorizeTags(p.category_tags || []);

    for (const cat of broadCategories) {
      benefitsMap[cat] = (benefitsMap[cat] || 0) + 1;
    }

    const type = p.product_type || "Individual Supplements";
    productTypeMap[type] = (productTypeMap[type] || 0) + 1;

    for (const s of p.safe_for || []) {
      safeForMap[s] = (safeForMap[s] || 0) + 1;
    }

    return { ...p, benefit_categories: broadCategories };
  });

  const sortEntries = (map: Record<string, number>) =>
    Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, count]) => ({ label, count }));

  return Response.json({
    products: enrichedProducts,
    filters: {
      benefits: sortEntries(benefitsMap),
      productType: sortEntries(productTypeMap),
      safeFor: sortEntries(safeForMap),
    },
  });
}
