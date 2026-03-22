import { NextRequest } from "next/server";
import supplementsData from "@/data/supplements.json";
import type { Supplement } from "@/lib/types";

const supplements = supplementsData as Supplement[];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ids = searchParams.get("supplements")?.split(",") ?? [];

  if (ids.length === 0) {
    return Response.json({ error: "Provide supplement IDs via ?supplements=id1,id2" }, { status: 400 });
  }

  const selected = supplements.filter((s) => ids.includes(s.id));
  const synergies: { a: string; b: string; reason: string }[] = [];
  const antagonisms: { a: string; b: string; reason: string; timingSeparation?: string }[] = [];

  for (let i = 0; i < selected.length; i++) {
    for (let j = i + 1; j < selected.length; j++) {
      const a = selected[i];
      const b = selected[j];

      const aSynergy = a.interactions.synergies.find((s) => s.compound === b.id);
      const bSynergy = b.interactions.synergies.find((s) => s.compound === a.id);
      if (aSynergy) synergies.push({ a: a.id, b: b.id, reason: aSynergy.reason });
      else if (bSynergy) synergies.push({ a: b.id, b: a.id, reason: bSynergy.reason });

      const aAntagonism = a.interactions.antagonisms.find((ant) => ant.compound === b.id);
      const bAntagonism = b.interactions.antagonisms.find((ant) => ant.compound === a.id);
      if (aAntagonism) {
        antagonisms.push({
          a: a.id,
          b: b.id,
          reason: aAntagonism.reason,
          timingSeparation: getTimingSeparation(a.id, b.id),
        });
      } else if (bAntagonism) {
        antagonisms.push({
          a: b.id,
          b: a.id,
          reason: bAntagonism.reason,
          timingSeparation: getTimingSeparation(b.id, a.id),
        });
      }
    }
  }

  return Response.json({ synergies, antagonisms });
}

function getTimingSeparation(aId: string, bId: string): string | undefined {
  const rules: Record<string, string> = {
    "zinc-picolinate:magnesium-bisglycinate": "Take at least 2 hours apart",
    "magnesium-bisglycinate:zinc-picolinate": "Take at least 2 hours apart",
    "ashwagandha-ksm-66:rhodiola-rosea": "Use one at a time, or take Rhodiola AM and Ashwagandha PM",
    "rhodiola-rosea:ashwagandha-ksm-66": "Use one at a time, or take Rhodiola AM and Ashwagandha PM",
  };
  return rules[`${aId}:${bId}`];
}
