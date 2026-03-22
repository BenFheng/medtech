import { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    userId,
    protocolName,
    primaryFocus,
    frictionPoints,
    assessmentAnswers,
    recommendedStack,
    totalPrice,
  } = body as {
    userId: string;
    protocolName: string;
    primaryFocus: string;
    frictionPoints: string[];
    assessmentAnswers: Record<string, unknown>;
    recommendedStack: string[];
    totalPrice: number;
  };

  if (!userId || !primaryFocus) {
    return Response.json({ error: "userId and primaryFocus are required" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("user_protocols")
    .insert({
      user_id: userId,
      protocol_name: protocolName,
      primary_focus: primaryFocus,
      friction_points: frictionPoints,
      assessment_answers: assessmentAnswers,
      recommended_stack: recommendedStack,
      total_price: totalPrice,
    })
    .select()
    .single();

  if (error) {
    console.error("Save protocol error:", error);
    return Response.json({ error: "Failed to save protocol" }, { status: 500 });
  }

  return Response.json({ protocol: data });
}
