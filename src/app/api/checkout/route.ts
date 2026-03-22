import { NextRequest } from "next/server";

function getStripe() {
  // Dynamic import to avoid build-time initialization without API key
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
  const body = await request.json();
  const { items, customerEmail, successUrl, cancelUrl } = body as {
    items: { name: string; pricePerMonth: number; quantity: number }[];
    customerEmail?: string;
    successUrl?: string;
    cancelUrl?: string;
  };

  if (!items || items.length === 0) {
    return Response.json({ error: "No items provided" }, { status: 400 });
  }

  const lineItems = items.map((item: { name: string; pricePerMonth: number; quantity: number }) => ({
    price_data: {
      currency: "usd",
      product_data: { name: item.name },
      unit_amount: Math.round(item.pricePerMonth * 100),
      recurring: { interval: "month" },
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: customerEmail,
    line_items: lineItems,
    success_url: successUrl ?? `${request.nextUrl.origin}/dashboard?checkout=success`,
    cancel_url: cancelUrl ?? `${request.nextUrl.origin}/checkout?cancelled=true`,
  });

  return Response.json({ sessionId: session.id, url: session.url });
}
