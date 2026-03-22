import { NextRequest } from "next/server";

// Scaffold for wearable & health data integrations
export async function GET() {
  return Response.json({
    available_integrations: [
      {
        id: "apple_health",
        name: "Apple Health",
        status: "coming_soon",
        metrics: ["sleep", "steps", "hrv", "weight"],
      },
      {
        id: "oura",
        name: "Oura Ring",
        status: "coming_soon",
        metrics: ["sleep", "hrv", "readiness", "activity"],
      },
      {
        id: "garmin",
        name: "Garmin Connect",
        status: "coming_soon",
        metrics: ["steps", "hrv", "stress", "sleep"],
      },
      {
        id: "manual",
        name: "Manual Entry",
        status: "active",
        metrics: ["sleep", "weight", "mood", "energy", "skin_quality"],
      },
    ],
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { metric_type, value, unit, source } = body as {
    metric_type: string;
    value: number;
    unit?: string;
    source?: string;
  };

  if (!metric_type || value === undefined) {
    return Response.json({ error: "metric_type and value are required" }, { status: 400 });
  }

  // TODO: Write to Supabase health_metrics table with authenticated user_id
  return Response.json({
    success: true,
    metric: { metric_type, value, unit, source: source ?? "manual", recorded_at: new Date().toISOString() },
  });
}
