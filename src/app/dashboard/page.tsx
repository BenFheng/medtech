"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useAssessmentStore } from "@/stores/assessment";
import { generateRecommendation } from "@/lib/recommend";
import type { RecommendedStack } from "@/lib/types";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StackView from "@/components/dashboard/StackView";
import ProtocolFocus from "@/components/dashboard/ProtocolFocus";
import SubscriptionCta from "@/components/dashboard/SubscriptionCta";
import BiomarkerStatus from "@/components/dashboard/BiomarkerStatus";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const { isComplete, primaryFocus, frictionPoints, currentSupplements, currentMedications } =
    useAssessmentStore();
  const [stack, setStack] = useState<RecommendedStack | null>(null);

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
  }, [isComplete, primaryFocus, frictionPoints, currentSupplements, currentMedications, router]);

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

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Header */}
        <header className="mb-16">
          <h1 className="font-headline font-extrabold text-5xl tracking-tight text-on-surface mb-4">
            Welcome back, {user?.firstName || "there"}.
          </h1>
          <p className="text-xl text-on-surface-variant max-w-2xl font-body leading-relaxed">
            Your cellular analysis is complete. We&apos;ve generated an optimized
            protocol based on your assessment, targeting your primary focus areas
            with clinically validated compounds.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Stack & Data */}
          <div className="lg:col-span-8 space-y-8">
            <StackView
              stackName={stack.stackName}
              version={stack.version}
              am={stack.am}
              pm={stack.pm}
            />
            <BiomarkerStatus />
          </div>

          {/* Right Column: Focus & CTA */}
          <div className="lg:col-span-4 space-y-8">
            <ProtocolFocus
              metrics={stack.focusMetrics}
              warnings={stack.warnings}
            />
            <SubscriptionCta totalPrice={stack.totalPrice} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
