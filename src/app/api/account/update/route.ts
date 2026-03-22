import { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const supabase = createServerClient();

  const row: Record<string, unknown> = {
    user_id: userId,
    email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
    updated_at: new Date().toISOString(),
  };

  if ("firstName" in body) {
    row.first_name = body.firstName || null;
    row.last_name = body.lastName || null;
  }

  if ("phoneCode" in body) {
    row.phone_code = body.phoneCode || "+65";
    row.phone_number = body.phoneNumber || null;
  }

  if ("postalCode" in body) {
    row.address_postal = body.postalCode || null;
    row.address_block = body.block || null;
    row.address_street = body.street || null;
    row.address_unit = body.unitNumber || null;
    row.address_building = body.building || null;
  }

  const { error } = await supabase
    .from("users")
    .upsert(row, { onConflict: "user_id" });

  if (error) {
    console.error("Account update error:", error);
    return Response.json({ error: "Failed to update" }, { status: 500 });
  }

  return Response.json({ success: true });
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("users")
    .select("first_name, last_name, phone_code, phone_number, address_postal, address_block, address_street, address_unit, address_building")
    .eq("user_id", userId)
    .single();

  if (error) {
    return Response.json({
      firstName: "", lastName: "",
      phoneCode: "+65", phoneNumber: "",
      postalCode: "", block: "", street: "", unitNumber: "", building: "",
    });
  }

  return Response.json({
    firstName: data?.first_name || "",
    lastName: data?.last_name || "",
    phoneCode: data?.phone_code || "+65",
    phoneNumber: data?.phone_number || "",
    postalCode: data?.address_postal || "",
    block: data?.address_block || "",
    street: data?.address_street || "",
    unitNumber: data?.address_unit || "",
    building: data?.address_building || "",
  });
}
