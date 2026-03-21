"use client";

import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/stores/assessment";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StepIndicator from "@/components/assessment/StepIndicator";
import FocusSelector from "@/components/assessment/FocusSelector";
import FrictionPoints from "@/components/assessment/FrictionPoints";
import Biometrics from "@/components/assessment/Biometrics";
import CurrentSupplements from "@/components/assessment/CurrentSupplements";

const TOTAL_STEPS = 4;

export default function AssessmentPage() {
  const router = useRouter();
  const { currentStep, setStep, primaryFocus, frictionPoints, biometrics, completeAssessment } =
    useAssessmentStore();

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return primaryFocus !== null;
      case 2:
        return frictionPoints.length > 0;
      case 3:
        return (
          biometrics.ageRange !== null &&
          biometrics.biologicalSex !== null &&
          biometrics.activityLevel !== null
        );
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setStep(currentStep + 1);
    } else {
      completeAssessment();
      router.push("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <FocusSelector />;
      case 2:
        return <FrictionPoints />;
      case 3:
        return <Biometrics />;
      case 4:
        return <CurrentSupplements />;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      <main className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl space-y-16">
          {renderStep()}

          {/* Navigation */}
          <div className="pt-8 flex justify-between items-center">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 text-on-surface-variant font-headline font-bold hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">
                    arrow_back
                  </span>
                  Back
                </button>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-8 py-4 rounded-lg font-headline font-bold shadow-lg transition-all active:scale-95 ${
                  canProceed()
                    ? "vitality-gradient text-on-primary shadow-primary/20 hover:opacity-90"
                    : "bg-surface-container-high text-outline cursor-not-allowed"
                }`}
              >
                {currentStep === TOTAL_STEPS
                  ? "Generate My Protocol"
                  : "Continue"}
                <span className="material-symbols-outlined">
                  arrow_forward
                </span>
              </button>
              {currentStep < TOTAL_STEPS && (
                <span className="text-on-surface-variant text-sm font-medium hidden md:block">
                  Press{" "}
                  <kbd className="px-2 py-1 bg-surface-container-high rounded text-xs font-mono">
                    ENTER
                  </kbd>{" "}
                  to proceed
                </span>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Trust Section (visible on step 1) */}
      {currentStep === 1 && (
        <section className="bg-surface-container-low py-24 px-6">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-headline font-bold tracking-tight text-on-background">
                  Why focus matters.
                </h2>
                <p className="text-on-surface-variant mt-4 text-lg">
                  Our clinical approach targets specific cellular markers unique
                  to your primary lifestyle demand.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-container-lowest p-8 rounded-xl space-y-6">
                <div className="w-12 h-12 vitality-accent-gradient rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">
                    analytics
                  </span>
                </div>
                <h3 className="text-xl font-headline font-bold text-on-background">
                  Bio-Marker Tracking
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Continuous assessment of 42 metabolic markers to adjust your
                  protocol in real-time.
                </p>
              </div>
              <div className="bg-primary p-8 rounded-xl space-y-6 md:scale-105 shadow-2xl shadow-primary/10">
                <div className="w-12 h-12 bg-primary-container rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary-container">
                    science
                  </span>
                </div>
                <h3 className="text-xl font-headline font-bold text-on-primary">
                  Evidence-Based
                </h3>
                <p className="text-on-primary-container text-sm leading-relaxed opacity-90">
                  Every recommendation is backed by peer-reviewed research in
                  cellular longevity and mitochondrial health.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-8 rounded-xl space-y-6">
                <div className="w-12 h-12 vitality-accent-gradient rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">
                    security
                  </span>
                </div>
                <h3 className="text-xl font-headline font-bold text-on-background">
                  Clinical Privacy
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Your genetic data is encrypted and managed with medical-grade
                  security protocols.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
