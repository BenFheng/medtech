import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Methodology | Vanguard Science",
  description:
    "How our supplement selection algorithm works: Assessment, Scoring, Conflict Detection, and Stack Assembly.",
  openGraph: {
    title: "Methodology | Vanguard Science",
    description: "How our supplement selection algorithm works.",
  },
};

const pipelineSteps = [
  {
    step: 1,
    title: "Assessment",
    icon: "assignment",
    desc: "You complete a 4-step assessment covering your primary focus area, friction points, biometrics, and current supplements/medications.",
  },
  {
    step: 2,
    title: "Scoring",
    icon: "calculate",
    desc: "Each of our 28 supplements is scored based on relevance to your focus area, symptom matching with your friction points, and evidence strength.",
  },
  {
    step: 3,
    title: "Conflict Detection",
    icon: "warning",
    desc: "Our interaction engine checks for antagonisms between candidate supplements and flags medication interactions. Conflicting compounds are separated or removed.",
  },
  {
    step: 4,
    title: "Stack Assembly",
    icon: "layers",
    desc: "The top-scoring, conflict-free supplements are assembled into your personalized AM/PM protocol with optimized timing and dosage recommendations.",
  },
];

export default function MethodologyPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-screen-lg mx-auto px-4 sm:px-8 py-24">
        <span className="text-xs font-bold tracking-widest text-primary uppercase">Methodology</span>
        <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-on-surface mt-4 tracking-tight">
          How Our Algorithm Works
        </h1>
        <p className="text-on-surface-variant text-lg mt-6 max-w-2xl leading-relaxed">
          From assessment to personalized stack — a transparent look at the pipeline that powers
          every Vanguard protocol.
        </p>

        {/* Pipeline */}
        <div className="mt-16 space-y-0">
          {pipelineSteps.map((step, i) => (
            <div key={step.step} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full vitality-gradient flex items-center justify-center text-on-primary font-black text-lg">
                  {step.step}
                </div>
                {i < pipelineSteps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-primary/20 my-2" />
                )}
              </div>
              <div className="pb-12">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">{step.icon}</span>
                  <h3 className="font-headline font-bold text-xl text-on-surface">{step.title}</h3>
                </div>
                <p className="text-on-surface-variant mt-3 leading-relaxed max-w-xl">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Doctor Oversight */}
        <section className="bg-surface-container-lowest rounded-xl p-8 mt-16">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-primary text-3xl">verified</span>
            <div>
              <h3 className="font-headline font-bold text-xl text-on-surface">Doctor Oversight</h3>
              <p className="text-on-surface-variant mt-3 leading-relaxed">
                Every algorithmic recommendation is validated against clinical guidelines established by our
                medical advisory board. Dosage ranges, interaction flags, and contraindication rules are
                reviewed quarterly against the latest published research.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
