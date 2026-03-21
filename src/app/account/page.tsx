"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type Tab = "details" | "purchases" | "notes";

const mockPurchases = [
  { id: "ORD-2024-001", date: "2026-03-01", stack: "The Longevity Stack v2.4", amount: 189, status: "Delivered" },
  { id: "ORD-2024-002", date: "2026-02-01", stack: "The Longevity Stack v2.3", amount: 189, status: "Delivered" },
  { id: "ORD-2024-003", date: "2026-01-01", stack: "The Cognitive Stack v1.8", amount: 169, status: "Delivered" },
];

const mockNotes = [
  {
    id: 1,
    date: "2026-03-10",
    doctor: "Dr. Sarah Chen",
    summary: "Quarterly review — mitochondrial markers improved. Recommend continuing CoQ10 protocol. Consider adding PQQ next cycle.",
  },
  {
    id: 2,
    date: "2026-01-15",
    doctor: "Dr. Sarah Chen",
    summary: "Initial consultation. Patient reports afternoon fatigue and poor sleep architecture. Baseline bloodwork ordered. Starting with foundational stack.",
  },
];

export default function AccountPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("details");
  const [postalCode, setPostalCode] = useState("");
  const [block, setBlock] = useState("");
  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [postalError, setPostalError] = useState("");
  const [postalLoading, setPostalLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

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
        const match = data.results?.find(
          (r: { POSTAL: string }) => r.POSTAL === postalCode
        );
        if (match) {
          setBlock(match.BLK_NO || "");
          setStreet(match.ROAD_NAME || "");
          setBuilding(match.BUILDING === "NIL" ? "" : match.BUILDING || "");
          setPostalError("");
        } else {
          setBlock("");
          setStreet("");
          setBuilding("");
          setPostalError("No address found for this postal code.");
        }
      } catch {
        setPostalError("Unable to verify postal code. Please try again.");
      } finally {
        setPostalLoading(false);
      }
    };

    lookup();
  }, [postalCode]);

  if (!isLoaded || !user) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="h-12 w-12 rounded-full border-4 border-primary-fixed border-t-primary animate-spin" style={{ animationDuration: "1.5s" }} />
        </main>
      </>
    );
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "details", label: "Account Details", icon: "person" },
    { key: "purchases", label: "Purchase History", icon: "receipt_long" },
    { key: "notes", label: "Doctor Notes", icon: "clinical_notes" },
  ];

  return (
    <>
      <Navbar />

      {/* Toast notification */}
      {saveMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:bottom-auto md:top-20 md:left-auto md:translate-x-0 md:right-6 z-50 animate-[slideIn_0.3s_ease-out] w-[calc(100%-3rem)] md:w-auto">
          <div
            className={`flex items-center gap-3 rounded-xl px-5 py-3 shadow-lg font-headline font-semibold text-sm ${
              saveMessage.type === "success"
                ? "bg-primary text-on-primary"
                : "bg-error text-on-error"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {saveMessage.type === "success" ? "check_circle" : "error"}
            </span>
            {saveMessage.text}
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-8 md:px-6 md:py-12">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <h1 className="font-headline font-extrabold text-3xl md:text-5xl tracking-tight text-on-surface mb-2">
            Your Account
          </h1>
          <p className="text-lg text-on-surface-variant font-body">
            Manage your profile, review past orders, and access your clinical notes.
          </p>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 md:mb-10 border-b border-outline-variant overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 font-headline font-semibold text-sm transition-colors border-b-2 -mb-px shrink-0 ${
                activeTab === tab.key
                  ? "text-primary border-primary"
                  : "text-on-surface-variant border-transparent hover:text-primary hover:border-primary/30"
              }`}
            >
              <span className="material-symbols-outlined text-xl">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content — fixed height container */}
        <div className="min-h-[600px]">
        {activeTab === "details" && (
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant">
            <div className="p-5 md:p-8 space-y-6">
              <h2 className="font-headline font-bold text-xl text-on-surface">Personal Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user.firstName || ""}
                    className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user.lastName || ""}
                    className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue={user.primaryEmailAddress?.emailAddress || ""}
                  disabled
                  className="w-full rounded-xl border border-outline-variant bg-surface-container px-4 py-3 font-body text-on-surface-variant cursor-not-allowed"
                />
                <p className="text-xs text-on-surface-variant mt-1">Managed by your authentication provider.</p>
              </div>

              <div>
                <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">
                  Phone Number
                </label>
                <div className="flex rounded-xl border border-outline-variant bg-surface overflow-hidden focus-within:ring-2 focus-within:ring-primary/40">
                  <select
                    defaultValue="+65"
                    className="bg-surface-container border-r border-outline-variant px-3 py-3 font-body text-on-surface text-sm focus:outline-none cursor-pointer"
                  >
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+60">🇲🇾 +60</option>
                    <option value="+62">🇮🇩 +62</option>
                    <option value="+63">🇵🇭 +63</option>
                    <option value="+66">🇹🇭 +66</option>
                    <option value="+84">🇻🇳 +84</option>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+81">🇯🇵 +81</option>
                    <option value="+82">🇰🇷 +82</option>
                    <option value="+86">🇨🇳 +86</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+1">🇺🇸 +1</option>
                  </select>
                  <input
                    type="tel"
                    inputMode="numeric"
                    className="flex-1 px-4 py-3 font-body text-on-surface focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setSaveMessage({ type: "success", text: "Personal information updated successfully." });
                  setTimeout(() => setSaveMessage(null), 4000);
                }}
                className="vitality-gradient text-on-primary w-full md:w-auto px-8 py-3 rounded-xl font-headline font-bold text-sm hover:opacity-90 transition-all"
              >
                Save Changes
              </button>
            </div>

            <hr className="border-outline-variant" />

            <div className="p-5 md:p-8 space-y-6">
              <h2 className="font-headline font-bold text-xl text-on-surface">Shipping Address</h2>

              <div>
                <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">
                  Postal Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ""))}
                    className={`w-full rounded-xl border bg-surface px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                      postalError ? "border-error" : "border-outline-variant"
                    }`}
                  />
                  {postalLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="h-5 w-5 rounded-full border-2 border-primary-fixed border-t-primary animate-spin" />
                    </div>
                  )}
                </div>
                {postalError && (
                  <p className="text-xs text-error mt-1">{postalError}</p>
                )}
                {!postalError && (
                  <p className="text-xs text-on-surface-variant mt-1">Enter a 6-digit postal code to auto-fill your address.</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">
                    Block
                  </label>
                  <input
                    type="text"
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    className="w-full rounded-xl border border-outline-variant bg-surface-container px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">
                    Unit Number
                  </label>
                  <input
                    type="text"
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(e.target.value)}
                    className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">
                  Street Address
                </label>
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

              <button
                type="button"
                onClick={() => {
                  if (postalCode.length !== 6 || postalError) {
                    setSaveMessage({ type: "error", text: "Please enter a valid 6-digit postal code." });
                    setTimeout(() => setSaveMessage(null), 4000);
                    return;
                  }
                  setSaveMessage({ type: "success", text: "Shipping address updated successfully." });
                  setTimeout(() => setSaveMessage(null), 4000);
                }}
                className="vitality-gradient text-on-primary w-full md:w-auto px-8 py-3 rounded-xl font-headline font-bold text-sm hover:opacity-90 transition-all"
              >
                Update Address
              </button>
            </div>
          </section>
        )}

        {activeTab === "purchases" && (
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden">
            {/* Desktop table — hidden on mobile */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container">
                    <th className="text-left px-6 py-4 font-headline font-bold text-sm text-on-surface">Order ID</th>
                    <th className="text-left px-6 py-4 font-headline font-bold text-sm text-on-surface">Date</th>
                    <th className="text-left px-6 py-4 font-headline font-bold text-sm text-on-surface">Protocol</th>
                    <th className="text-left px-6 py-4 font-headline font-bold text-sm text-on-surface">Amount</th>
                    <th className="text-left px-6 py-4 font-headline font-bold text-sm text-on-surface">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPurchases.map((order) => (
                    <tr key={order.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4 font-body text-sm text-primary font-semibold">{order.id}</td>
                      <td className="px-6 py-4 font-body text-sm text-on-surface-variant">{order.date}</td>
                      <td className="px-6 py-4 font-body text-sm text-on-surface">{order.stack}</td>
                      <td className="px-6 py-4 font-body text-sm text-on-surface font-semibold">${order.amount}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block rounded-full bg-primary-fixed px-3 py-1 text-xs font-headline font-bold text-on-primary-fixed">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards — hidden on desktop */}
            <div className="flex flex-col gap-4 md:hidden p-5">
              {mockPurchases.map((order) => (
                <div key={order.id} className="rounded-xl border border-outline-variant p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-primary font-semibold">{order.id}</span>
                    <span className="inline-block rounded-full bg-primary-fixed px-3 py-1 text-xs font-headline font-bold text-on-primary-fixed">
                      {order.status}
                    </span>
                  </div>
                  <p className="font-body text-sm text-on-surface">{order.stack}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-on-surface-variant">{order.date}</span>
                    <span className="font-body text-sm text-on-surface font-semibold">${order.amount}</span>
                  </div>
                </div>
              ))}
            </div>

            {mockPurchases.length === 0 && (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">shopping_bag</span>
                <p className="text-on-surface-variant font-headline font-semibold">No purchases yet.</p>
              </div>
            )}
          </section>
        )}

        {activeTab === "notes" && (
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 md:p-8 space-y-6 overflow-hidden">
            {mockNotes.map((note) => (
              <div
                key={note.id}
                className="rounded-xl border border-outline-variant p-5 md:p-6"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">stethoscope</span>
                    <span className="font-headline font-bold text-on-surface">{note.doctor}</span>
                  </div>
                  <span className="text-sm text-on-surface-variant font-body pl-9 sm:pl-0">{note.date}</span>
                </div>
                <p className="font-body text-on-surface-variant leading-relaxed">{note.summary}</p>
              </div>
            ))}

            {mockNotes.length === 0 && (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">clinical_notes</span>
                <p className="text-on-surface-variant font-headline font-semibold">No doctor notes on file.</p>
              </div>
            )}
          </section>
        )}

        </div>

        {/* Logout */}
        <div className="mt-10 md:mt-16 pt-8 border-t border-outline-variant">
          <button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="flex items-center gap-2 rounded-xl border border-error px-6 py-3 font-headline font-bold text-sm text-error hover:bg-error hover:text-on-error transition-colors"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            Sign Out
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
