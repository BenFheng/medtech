import { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return Response.json({ error: "Clerk webhook not configured" }, { status: 503 });
  }

  const body = await request.json();
  const eventType = body.type as string;

  if (eventType === "user.created" || eventType === "user.updated") {
    const userData = body.data;
    const email =
      userData.email_addresses?.[0]?.email_address ?? "";

    if (!email) {
      return Response.json({ error: "No email found on user" }, { status: 400 });
    }

    const supabase = createServerClient();

    const { error } = await supabase.from("users").upsert(
      {
        user_id: userData.id,
        email,
        first_name: userData.first_name || null,
        last_name: userData.last_name || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (error) {
      console.error("Clerk→Supabase sync error:", error);
      return Response.json({ error: "Database sync failed" }, { status: 500 });
    }

    return Response.json({ synced: true, event: eventType });
  }

  return Response.json({ ignored: true, event: eventType });
}
