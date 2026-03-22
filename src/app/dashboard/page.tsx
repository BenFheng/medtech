"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useAssessmentStore } from "@/stores/assessment";
import { generateRecommendation } from "@/lib/recommend";
import { swapCompound, recalculatePrice } from "@/lib/stack";
import type { RecommendedStack, Supplement } from "@/lib/types";
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

  useEffect(() => {
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
  }, [isComplete, primaryFocus, frictionPoints, currentSupplements, currentMedications, router, user?.id]);

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

  if (!stack) {
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
            Welcome back, {user?.firstName || "there"}.
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
              <StackView
                stackName={stack.stackName}
                version={stack.version}
                am={stack.am}
                pm={stack.pm}
                onSwap={handleSwap}
                onRemove={handleRemove}
                onAdd={handleAdd}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProtocolFocus metrics={stack.focusMetrics} warnings={stack.warnings} />
                <SubscriptionCta totalPrice={stack.totalPrice} stack={allSupps} />
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
            <OrderSubscription stack={allSupps} totalPrice={stack.totalPrice} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
