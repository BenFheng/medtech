import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("health_metrics")
    .select("id, metric_type, value, unit, recorded_at")
    .eq("user_id", userId)
    .order("recorded_at", { ascending: true });

  if (error) {
    console.error("Metrics fetch error:", error);
    return Response.json({ entries: [] });
  }

  return Response.json({
    entries: (data || []).map((d) => ({
      id: d.id,
      type: d.metric_type,
      value: Number(d.value),
      unit: d.unit,
      date: d.recorded_at,
    })),
  });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { type, value, unit } = body as { type: string; value: number; unit?: string };

  const supabase = createServerClient();

  const { error } = await supabase.from("health_metrics").insert({
    user_id: userId,
    metric_type: type,
    value,
    unit: unit || null,
    source: "manual",
  });

  if (error) {
    console.error("Metrics insert error:", error);
    return Response.json({ error: "Failed to log metric" }, { status: 500 });
  }

  return Response.json({ success: true });
}
