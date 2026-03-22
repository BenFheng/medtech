import { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase";

function getStripe() {
  const Stripe = require("stripe").default;
  return new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
    apiVersion: "2025-03-31.basil",
  });
}

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return Response.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const stripe = getStripe();
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") ?? "";

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServerClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const customerEmail = session.customer_email;

      // Look up user by email
      const { data: user } = await supabase
        .from("users")
        .select("user_id")
        .eq("email", customerEmail)
        .single();

      if (user) {
        await supabase.from("orders").insert({
          user_id: user.user_id,
          product_ids: [], // Will be populated from session metadata in production
          total_cost: (session.amount_total ?? 0) / 100,
          delivery_status: "pending",
          stripe_session_id: session.id,
          stripe_subscription_id: session.subscription,
          subscription_status: "active",
        });
      }

      console.log("Checkout completed:", session.id);
      break;
    }
    case "invoice.paid": {
      const invoice = event.data.object;
      console.log("Invoice paid:", invoice.id);
      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const status = subscription.status === "active" ? "active" : "paused";

      await supabase
        .from("orders")
        .update({ subscription_status: status, updated_at: new Date().toISOString() })
        .eq("stripe_subscription_id", subscription.id);

      console.log("Subscription updated:", subscription.id, "→", status);
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object;

      await supabase
        .from("orders")
        .update({ subscription_status: "cancelled", updated_at: new Date().toISOString() })
        .eq("stripe_subscription_id", subscription.id);

      console.log("Subscription cancelled:", subscription.id);
      break;
    }
    default:
      console.log("Unhandled event:", event.type);
  }

  return Response.json({ received: true });
}
