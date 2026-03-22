import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | Vanguard",
  description: "Terms of service for the Vanguard Health Sciences platform.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-screen-lg mx-auto px-4 sm:px-8 py-24">
        <h1 className="font-headline font-extrabold text-4xl text-on-surface mb-2">Terms of Service</h1>
        <p className="text-on-surface-variant mb-10">Last updated: March 21, 2026</p>

        <div className="prose-sm space-y-8 text-on-surface-variant leading-relaxed">
          <section>
            <h2 className="font-headline font-bold text-xl text-on-surface mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Vanguard platform, you agree to be bound by these Terms of Service.
              If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="font-headline font-bold text-xl text-on-surface mb-3">2. Service Description</h2>
            <p>
              Vanguard provides personalized supplement recommendations based on user-provided health assessments.
              Our platform generates supplement stacks using an algorithmic scoring system validated by
              medical professionals.
            </p>
          </section>

          <section>
            <h2 className="font-headline font-bold text-xl text-on-surface mb-3">3. Subscriptions & Billing</h2>
            <p>
              Subscriptions are billed monthly through Stripe. You may pause or cancel your subscription
              at any time through your dashboard. Refunds are available within 30 days of your first order.
            </p>
          </section>

          <section>
            <h2 className="font-headline font-bold text-xl text-on-surface mb-3">4. User Responsibilities</h2>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Provide accurate health information during assessment</li>
              <li>Disclose all current medications and medical conditions</li>
              <li>Consult with your physician before starting any supplement regimen</li>
              <li>Report any adverse reactions immediately</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline font-bold text-xl text-on-surface mb-3">5. Limitation of Liability</h2>
            <p>
              Vanguard supplements are dietary supplements, not medications. We make no claims to diagnose,
              treat, cure, or prevent any disease. Our liability is limited to the amount you paid for
              our services in the 12 months preceding any claim.
            </p>
          </section>

          <section>
            <h2 className="font-headline font-bold text-xl text-on-surface mb-3">6. Intellectual Property</h2>
            <p>
              All content, algorithms, and branding on the Vanguard platform are proprietary.
              Unauthorized reproduction or distribution is prohibited.
            </p>
          </section>

          <section>
            <h2 className="font-headline font-bold text-xl text-on-surface mb-3">7. Governing Law</h2>
            <p>
              These terms are governed by the laws of the jurisdiction in which Vanguard Health Sciences
              is incorporated, without regard to conflict of law provisions.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
