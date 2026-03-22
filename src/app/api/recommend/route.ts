import { NextRequest } from "next/server";
import { generateRecommendation } from "@/lib/recommend";
import type { PrimaryFocus, FrictionPoint } from "@/stores/assessment";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { primaryFocus, frictionPoints, currentSupplements, currentMedications } = body as {
    primaryFocus: PrimaryFocus;
    frictionPoints: FrictionPoint[];
    currentSupplements: string[];
    currentMedications: string[];
  };

  if (!primaryFocus || !frictionPoints) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const recommendation = generateRecommendation({
    primaryFocus,
    frictionPoints,
    currentSupplements: currentSupplements ?? [],
    currentMedications: currentMedications ?? [],
  });

  // Add copper auto-include rule
  const zincInStack = [...recommendation.am, ...recommendation.pm].find(
    (s) => s.id === "zinc-picolinate"
  );
  if (zincInStack && zincInStack.dosage.amount > 25) {
    recommendation.warnings.push(
      "Your stack includes Zinc >25mg/day. Consider adding 1-2mg copper supplement to prevent copper deficiency."
    );
  }

  // Add timing separation rules
  const allSupps = [...recommendation.am, ...recommendation.pm];
  const hasZinc = allSupps.some((s) => s.id === "zinc-picolinate");
  const hasMag = allSupps.some((s) => s.id === "magnesium-bisglycinate");
  if (hasZinc && hasMag) {
    recommendation.warnings.push(
      "Zinc and Magnesium compete for absorption. Take at least 2 hours apart."
    );
  }

  // L-Tryptophan + SSRI hard block
  const hasTrypto = allSupps.some((s) => s.id === "l-tryptophan");
  const onSSRI = currentMedications?.some((m) => m.includes("SSRI"));
  if (hasTrypto && onSSRI) {
    recommendation.warnings.push(
      "CRITICAL: L-Tryptophan combined with SSRIs risks serotonin syndrome. L-Tryptophan has been removed from your stack."
    );
  }

  // Vitamin K2 + blood thinners hard block
  const hasK2 = allSupps.some((s) => s.id === "vitamin-k2-mk7");
  const onBloodThinners = currentMedications?.some((m) => m.includes("Blood thinners"));
  if (hasK2 && onBloodThinners) {
    recommendation.warnings.push(
      "CRITICAL: Vitamin K2 directly opposes blood thinner medications. Consult your physician before including K2 in your protocol."
    );
  }

  return Response.json(recommendation);
}
