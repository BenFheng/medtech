"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useCartStore } from "@/stores/cart";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useUser();
  const { items, totalPrice } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneCode, setPhoneCode] = useState("+65");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [block, setBlock] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");
  const [postalLoading, setPostalLoading] = useState(false);
  const [postalError, setPostalError] = useState("");

  // Pre-fill from Clerk user
  useEffect(() => {
    if (user) {
      if (user.firstName) setFirstName(user.firstName);
      if (user.lastName) setLastName(user.lastName);
      if (user.primaryEmailAddress?.emailAddress) setEmail(user.primaryEmailAddress.emailAddress);
    }
  }, [user, user?.primaryEmailAddress?.emailAddress]);

  // Pre-fill address and phone from account DB
  useEffect(() => {
    fetch("/api/account/update")
      .then((res) => res.json())
      .then((data) => {
        if (data.firstName) setFirstName(data.firstName);
        if (data.lastName) setLastName(data.lastName);
        if (data.phoneCode) setPhoneCode(data.phoneCode);
        if (data.phoneNumber) setPhone(data.phoneNumber);
        setPostalCode(data.postalCode || "");
        setBlock(data.block || "");
        setUnitNumber(data.unitNumber || "");
        setStreet(data.street || "");
        setBuilding(data.building || "");
      })
      .catch(() => {});
  }, []);

  // OneMap auto-fill on postal code
  useEffect(() => {
    if (postalCode.length !== 6) {
      setPostalError("");
      return;
    }
    const lookup = async () => {
      setPostalLoading(true);
      setPostalError("");
      try {
        const res = await fetch(
          `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${postalCode}&returnGeom=N&getAddrDetails=Y`
        );
        const data = await res.json();
        const match = data.results?.find((r: { POSTAL: string }) => r.POSTAL === postalCode);
        if (match) {
          setBlock(match.BLK_NO || "");
          setStreet(match.ROAD_NAME || "");
          setBuilding(match.BUILDING === "NIL" ? "" : match.BUILDING || "");
        } else {
          setPostalError("No address found for this postal code.");
        }
      } catch {
        setPostalError("Unable to verify postal code.");
      } finally {
        setPostalLoading(false);
      }
    };
    lookup();
  }, [postalCode]);

  const protocolItems = items.filter((i) => i.isProtocol);
  const otherItems = items.filter((i) => !i.isProtocol);
  const total = totalPrice();

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="max-w-screen-lg mx-auto px-4 sm:px-8 py-24 text-center">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">local_mall</span>
          <h1 className="font-headline font-bold text-3xl text-on-surface mb-4">Your stack is empty</h1>
          <p className="text-on-surface-variant mb-8">Add supplements to your stack before checking out.</p>
          <Link
            href="/shop"
            className="vitality-gradient text-on-primary px-8 py-3 rounded-lg font-headline font-bold transition-all active:scale-95"
          >
            Browse Supplements
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            name: i.name,
            pricePerMonth: i.pricePerMonth,
            duration: i.duration,
            durationMultiplier: i.durationMultiplier,
            quantity: 1,
          })),
          successUrl: `${window.location.origin}/dashboard?checkout=success`,
          cancelUrl: `${window.location.origin}/checkout?cancelled=true`,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto px-4 sm:px-8 py-12" style={{ maxWidth: "1024px", width: "100%" }}>
        <h1 className="font-headline font-extrabold text-4xl text-on-surface mb-2">Checkout</h1>
        <p className="text-on-surface-variant mb-10">Review your stack and complete your order.</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Items + Address */}
          <div className="lg:col-span-7 space-y-8">
            {/* Protocol Items */}
            {protocolItems.length > 0 && (
              <section className="bg-surface-container-lowest rounded-xl p-6">
                <h2 className="font-headline font-bold text-xl text-on-surface mb-4">Your Protocol for {protocolItems[0]?.duration}</h2>
                <div className="space-y-3">
                  {protocolItems.map((item) => {
                    const price = (item.pricePerMonth * item.durationMultiplier).toFixed(2);
                    const displayPrice = parseFloat(price) % 1 === 0 ? parseInt(price).toString() : price;
                    return (
                      <div key={item.productId} className="flex items-center justify-between py-3 border-b border-surface-container last:border-0">
                        <div>
                          <p className="font-headline font-bold text-sm text-on-surface">{item.name}</p>
                          <p className="text-xs text-on-surface-variant">
                            {item.dosageAmount} {item.dosageUnit} | {item.timingSchedule}
                          </p>
                        </div>
                        <span className="font-bold text-sm text-on-surface">${displayPrice}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Individual Items */}
            {otherItems.length > 0 && (
              <section className="bg-surface-container-lowest rounded-xl p-6">
                <h2 className="font-headline font-bold text-xl text-on-surface mb-4">Individual Items</h2>
                <div className="space-y-3">
                  {otherItems.map((item) => {
                    const price = (item.pricePerMonth * item.durationMultiplier).toFixed(2);
                    const displayPrice = parseFloat(price) % 1 === 0 ? parseInt(price).toString() : price;
                    return (
                      <div key={item.productId} className="flex items-center justify-between py-3 border-b border-surface-container last:border-0">
                        <div>
                          <p className="font-headline font-bold text-sm text-on-surface">{item.name}</p>
                          <p className="text-xs text-on-surface-variant">
                            {item.dosageAmount} {item.dosageUnit} | {item.duration}
                          </p>
                        </div>
                        <span className="font-bold text-sm text-on-surface">${displayPrice}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

          </div>

          {/* Right: Delivery Address + Order Summary */}
          <div className="lg:col-span-5 space-y-8">
            <section className="bg-surface-container-lowest rounded-xl p-6">
              <h2 className="font-headline font-bold text-xl text-on-surface mb-6">Contact</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant bg-surface-container px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant bg-surface-container px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">Phone Number</label>
                  <div className="flex gap-2">
                    <select
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value)}
                      className="rounded-xl border border-outline-variant bg-surface-container px-3 py-3 font-body text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="+65">🇸🇬 +65</option>
                      <option value="+60">🇲🇾 +60</option>
                      <option value="+62">🇮🇩 +62</option>
                      <option value="+66">🇹🇭 +66</option>
                      <option value="+63">🇵🇭 +63</option>
                      <option value="+84">🇻🇳 +84</option>
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+86">🇨🇳 +86</option>
                      <option value="+81">🇯🇵 +81</option>
                      <option value="+82">🇰🇷 +82</option>
                      <option value="+852">🇭🇰 +852</option>
                      <option value="+886">🇹🇼 +886</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+64">🇳🇿 +64</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+1">🇺🇸 +1</option>
                    </select>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ""))}
                      placeholder="Phone number"
                      className="flex-1 rounded-xl border border-outline-variant bg-surface-container px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-outline-variant bg-surface-container px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

              </div>
            </section>

            <section className="bg-surface-container-lowest rounded-xl p-6">
              <h2 className="font-headline font-bold text-xl text-on-surface mb-6">Delivery Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">Postal Code</label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ""))}
                      className={`w-full rounded-xl border bg-surface-container px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 ${postalError ? "border-error" : "border-outline-variant"}`}
                    />
                    {postalLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="h-5 w-5 rounded-full border-2 border-primary-fixed border-t-primary animate-spin" />
                      </div>
                    )}
                  </div>
                  {postalError && <p className="text-xs text-error mt-1">{postalError}</p>}
                  {!postalError && <p className="text-xs text-on-surface-variant mt-1">Enter a 6-digit postal code to auto-fill your address.</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">Block</label>
                    <input
                      type="text"
                      value={block}
                      onChange={(e) => setBlock(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant bg-surface-container px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">Unit Number</label>
                    <input
                      type="text"
                      value={unitNumber}
                      onChange={(e) => setUnitNumber(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">Street Address</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full rounded-xl border border-outline-variant bg-surface-container px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">
                    Building Name <span className="text-on-surface-variant/60 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    className="w-full rounded-xl border border-outline-variant bg-surface-container px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>
            </section>

            <div className="bg-surface-container-lowest rounded-xl p-6">
              <h2 className="font-headline font-bold text-xl text-on-surface mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {otherItems.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Items ({otherItems.length})</span>
                    <span className="font-bold text-on-surface">
                      ${otherItems.reduce((sum, i) => sum + i.pricePerMonth * i.durationMultiplier, 0).toFixed(2)}
                    </span>
                  </div>
                )}
                {protocolItems.some((i) => i.duration === "Monthly Subscription") && (
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Monthly Subscription</span>
                    <span className="font-bold text-on-surface">
                      ${protocolItems.reduce((sum, i) => sum + i.pricePerMonth * i.durationMultiplier, 0).toFixed(2)}
                    </span>
                  </div>
                )}
                {protocolItems.length > 0 && !protocolItems.some((i) => i.duration === "Monthly Subscription") && (
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Protocol ({protocolItems[0]?.duration})</span>
                    <span className="font-bold text-on-surface">
                      ${protocolItems.reduce((sum, i) => sum + i.pricePerMonth * i.durationMultiplier, 0).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Shipping</span>
                  <span className="font-bold text-primary">Free</span>
                </div>
                <div className="border-t-2 border-primary/20 pt-3 flex justify-between">
                  <span className="font-headline font-bold text-on-surface">Total</span>
                  <span className="font-headline font-bold text-primary text-xl">${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full vitality-gradient text-on-primary font-headline font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-xl disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-on-primary border-t-transparent animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Order
                    <span className="material-symbols-outlined">lock</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-on-surface-variant mt-4">
                Secured by Stripe. Cancel or pause any time.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
