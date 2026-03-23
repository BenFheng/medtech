"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useAssessmentStore } from "@/stores/assessment";
import { generateRecommendation } from "@/lib/recommend";
import { swapCompound, recalculatePrice } from "@/lib/stack";
import type { RecommendedStack, Supplement } from "@/lib/types";
import { useProtocolStore } from "@/stores/protocols";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import StackView from "@/components/dashboard/StackView";
import ProtocolFocus from "@/components/dashboard/ProtocolFocus";
import SubscriptionCta from "@/components/dashboard/SubscriptionCta";
import ProtocolInsights from "@/components/dashboard/ProtocolInsights";
import BiomarkerTracking from "@/components/dashboard/BiomarkerTracking";
import OrderSubscription from "@/components/dashboard/OrderSubscription";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const { isComplete, primaryFocus, frictionPoints, currentSupplements, currentMedications } =
    useAssessmentStore();
  const [stack, setStack] = useState<RecommendedStack | null>(null);
  const [activeTab, setActiveTab] = useState("stack");
  const { protocols, activeProtocolId, setActive: setActiveProtocol, removeProtocol } = useProtocolStore();
  const [hydrated, setHydrated] = useState(false);

  // Wait for zustand to hydrate from localStorage before checking
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (!isComplete || !primaryFocus) {
      router.push("/assessment");
      return;
    }

    const recommendation = generateRecommendation({
      primaryFocus,
      frictionPoints,
      currentSupplements,
      currentMedications,
    });
    setStack(recommendation);

    // Persist assessment results to Supabase
    if (user?.id) {
      const allSupps = [...recommendation.am, ...recommendation.pm];
      fetch("/api/protocols/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          protocolName: recommendation.stackName,
          primaryFocus,
          frictionPoints,
          assessmentAnswers: {
            currentSupplements,
            currentMedications,
          },
          recommendedStack: allSupps.map((s) => s.id),
          totalPrice: recommendation.totalPrice,
        }),
      }).catch(() => {
        // Silently fail — Supabase may not be configured yet
      });
    }
  }, [hydrated, isComplete, primaryFocus, frictionPoints, currentSupplements, currentMedications, router, user?.id]);

  const handleAdd = (supplement: Supplement) => {
    if (!stack) return;
    if (supplement.schedule === "AM" || supplement.schedule === "AM/PM") {
      setStack({ ...stack, am: [...stack.am, supplement] });
    } else {
      setStack({ ...stack, pm: [...stack.pm, supplement] });
    }
  };

  const handleRemove = (removeId: string) => {
    if (!stack) return;
    const newAm = stack.am.filter((s) => s.id !== removeId);
    const newPm = stack.pm.filter((s) => s.id !== removeId);
    const allNew = [...newAm, ...newPm.filter((p) => !newAm.some((a) => a.id === p.id))];
    const totalPrice = recalculatePrice(allNew);
    setStack({ ...stack, am: newAm, pm: newPm, totalPrice: Math.max(totalPrice, 0) });
  };

  const handleSwap = (removeId: string, newSupplement: Supplement) => {
    if (!stack) return;
    const allSupps = [...stack.am, ...stack.pm.filter((p) => !stack.am.some((a) => a.id === p.id))];
    const { stack: newStack } = swapCompound(allSupps, removeId, newSupplement);
    const am = newStack.filter((s) => s.schedule === "AM" || s.schedule === "AM/PM");
    const pm = newStack.filter((s) => s.schedule === "PM" || s.schedule === "AM/PM");
    const totalPrice = recalculatePrice(newStack);
    setStack({ ...stack, am, pm, totalPrice: Math.max(totalPrice, 149) });
  };

  if (!hydrated || !stack) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="h-12 w-12 rounded-full border-4 border-primary-fixed border-t-primary animate-spin mx-auto" style={{ animationDuration: "1.5s" }} />
            <p className="text-on-surface-variant font-headline font-bold">
              Generating your protocol...
            </p>
          </div>
        </main>
      </>
    );
  }

  const allSupps = [...stack.am, ...stack.pm.filter((p) => !stack.am.some((a) => a.id === p.id))];

  return (
    <>
      <Navbar />
      <main className="mx-auto px-4 sm:px-8 py-12" style={{maxWidth: '1024px', width: '100%'}}>
        {/* Welcome Header */}
        <header className="mb-10">
          <h1 className="font-headline font-extrabold text-5xl tracking-tight text-on-surface mb-4">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}.
          </h1>
          <p className="text-xl text-on-surface-variant max-w-2xl font-body leading-relaxed">
            Your cellular analysis is complete. We&apos;ve generated an optimized
            protocol based on your assessment.
          </p>
        </header>

        <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div style={{width: '100%', overflow: 'hidden'}}>
          {activeTab === "stack" && (
            <div className="space-y-8">
              {/* Protocol tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setActiveProtocol("")}
                  className={`px-4 py-2 rounded-lg text-sm font-headline font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                    !activeProtocolId || activeProtocolId === ""
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {stack?.stackName ? `${stack.stackName} ${stack.version}` : "My Assessment"}
                </button>
                {protocols.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveProtocol(p.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-headline font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                      activeProtocolId === p.id
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container text-on-surface-variant hover:text-primary"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>

              {/* Show saved protocol or assessment stack */}
              {activeProtocolId && protocols.find((p) => p.id === activeProtocolId) ? (
                (() => {
                  const activeProtocol = protocols.find((p) => p.id === activeProtocolId)!;
                  const protocolAm = activeProtocol.supplements.filter((s) => s.schedule === "AM" || s.schedule === "AM/PM");
                  const protocolPm = activeProtocol.supplements.filter((s) => s.schedule === "PM" || s.schedule === "AM/PM");
                  return (
                    <StackView
                      key={activeProtocol.id}
                      stackName={activeProtocol.name}
                      version=""
                      am={protocolAm}
                      pm={protocolPm}
                      onSwap={handleSwap}
                      onRemove={handleRemove}
                      onAdd={handleAdd}
                      onDeleteStack={() => removeProtocol(activeProtocol.id)}
                    />
                  );
                })()
              ) : (
              <StackView
                key="assessment"
                stackName={stack.stackName}
                version={stack.version}
                am={stack.am}
                pm={stack.pm}
                onSwap={handleSwap}
                onRemove={handleRemove}
                isActiveSubscription
                onAdd={handleAdd}
              />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(() => {
                  const activeProto = activeProtocolId ? protocols.find((p) => p.id === activeProtocolId) : null;
                  if (activeProto) {
                    // Derive focus metrics from protocol supplements
                    const cats = activeProto.supplements.map((s) => s.category);
                    const catCounts: Record<string, number> = {};
                    cats.forEach((c) => { catCounts[c] = (catCounts[c] || 0) + 1; });
                    const total = cats.length || 1;
                    const iconMap: Record<string, string> = {
                      cognitive: "psychology", "sleep-stress": "bedtime", longevity: "bolt",
                      "skin-radiance": "face_5", foundation: "shield", performance: "fitness_center",
                    };
                    const labelMap: Record<string, string> = {
                      cognitive: "Cognitive Performance", "sleep-stress": "Sleep & Stress",
                      longevity: "Longevity", "skin-radiance": "Skin Radiance",
                      foundation: "Foundation Health", performance: "Physical Performance",
                    };
                    const metrics = Object.entries(catCounts)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 3)
                      .map(([cat, count]) => ({
                        label: labelMap[cat] || cat, value: Math.round((count / total) * 100),
                        icon: iconMap[cat] || "science",
                      }));
                    return <ProtocolFocus metrics={metrics} warnings={[]} />;
                  }
                  return <ProtocolFocus metrics={stack.focusMetrics} warnings={stack.warnings} />;
                })()}
                {(() => {
                  const activeProto = activeProtocolId ? protocols.find((p) => p.id === activeProtocolId) : null;
                  const ctaStack = activeProto ? activeProto.supplements : allSupps;
                  const ctaPrice = activeProto ? activeProto.supplements.reduce((sum, s) => sum + s.pricePerMonth, 0) : stack.totalPrice;
                  const ctaName = activeProto ? activeProto.name : `${stack.stackName} ${stack.version}`;
                  return <SubscriptionCta totalPrice={ctaPrice} stack={ctaStack} stackName={ctaName} />;
                })()}
              </div>
            </div>
          )}

          {activeTab === "insights" && (
            <ProtocolInsights
              stack={allSupps}
              frictionPoints={frictionPoints}
              metrics={stack.focusMetrics}
            />
          )}

          {activeTab === "biomarkers" && (
            <BiomarkerTracking />
          )}

          {activeTab === "orders" && (
            <OrderSubscription stack={allSupps} totalPrice={stack.totalPrice} stackName={`${stack.stackName} ${stack.version}`} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
