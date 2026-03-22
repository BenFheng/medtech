import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Medical Disclaimer | Vanguard",
  description: "Important medical disclaimer about Vanguard supplement recommendations and drug interactions.",
};

export default function DisclaimerPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-screen-lg mx-auto px-4 sm:px-8 py-24">
        <h1 className="font-headline font-extrabold text-4xl text-on-surface mb-2">Medical Disclaimer</h1>
        <p className="text-on-surface-variant mb-10">Last updated: March 21, 2026</p>

        <div className="bg-tertiary-fixed/10 rounded-xl p-6 mb-10 flex gap-4">
          <span className="material-symbols-outlined text-tertiary text-2xl mt-0.5">warning</span>
          <div>
            <p className="font-headline font-bold text-on-surface">Important Notice</p>
            <p className="text-sm text-on-surface-variant mt-1">
              The information and products provided by Vanguard Health Sciences are not intended to
              diagnose, treat, cure, or prevent any disease. Always consult your physician before
              starting any supplement regimen.
            </p>
          </div>
        </div>

        <div className="prose-sm space-y-8 text-on-surface-variant leading-relaxed">
          <section>
            <h2 className="font-headline font-bold text-xl text-on-surface mb-3">Not Medical Advice</h2>
            <p>
              Vanguard provides structure/function claims about dietary supplements based on published
              research. Our recommendations are informational and educational in nature. They are not
              a substitute for professional medical advice, diagnosis, or treatment.
            </p>
          </section>

          <section>
            <h2 className="font-headline font-bold text-xl text-on-surface mb-3">Consult Your Physician</h2>
            <p>
              You should consult a qualified healthcare provider before starting any supplement program,
              particularly if you:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Are currently taking prescription medications</li>
              <li>Have a diagnosed medical condition</li>
              <li>Are pregnant or nursing</li>
              <li>Are under 18 years of age</li>
              <li>Have known allergies to any supplement ingredients</li>
              <li>Are scheduled for surgery (some supplements affect bleeding/anesthesia)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline font-bold text-xl text-on-surface mb-3">Drug Interactions</h2>
            <p>
              Our platform screens for common drug-supplement interactions, but this screening is not
              exhaustive. Critical interactions we flag include:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>L-Tryptophan + SSRIs/SNRIs/MAOIs:</strong> Risk of serotonin syndrome</li>
              <li><strong>Vitamin K2 + Warfarin:</strong> Opposes anticoagulant mechanism</li>
              <li><strong>Omega-3 (&gt;3g/day) + Blood thinners:</strong> Increased bleeding risk</li>
              <li><strong>Ashwagandha + Thyroid medications:</strong> May alter thyroid hormone levels</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline font-bold text-xl text-on-surface mb-3">Clinical Team Credentials</h2>
            <p>
              Our supplement protocols are developed under the guidance of licensed physicians and
              researchers specializing in integrative medicine, functional nutrition, and cellular biology.
              Our medical advisory board reviews all formulation decisions and interaction flags.
            </p>
          </section>

          <section>
            <h2 className="font-headline font-bold text-xl text-on-surface mb-3">FDA Disclosure</h2>
            <p>
              These statements have not been evaluated by the Food and Drug Administration. Our products
              are not intended to diagnose, treat, cure, or prevent any disease. Dietary supplements
              are regulated under the Dietary Supplement Health and Education Act (DSHEA) of 1994.
            </p>
          </section>

          <section>
            <h2 className="font-headline font-bold text-xl text-on-surface mb-3">Adverse Reactions</h2>
            <p>
              If you experience any adverse reaction to a supplement in your protocol, discontinue use
              immediately and contact your healthcare provider. You may also report adverse events
              to the FDA MedWatch program.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
