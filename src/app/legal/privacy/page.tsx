import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Vanguard",
  description: "How Vanguard Health Sciences collects, uses, and protects your data. PDPA/GDPR compliant.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-screen-lg mx-auto px-4 sm:px-8 py-24">
        <h1 className="font-headline font-extrabold text-4xl text-on-surface mb-2">Privacy Policy</h1>
        <p className="text-on-surface-variant mb-10">Last updated: March 21, 2026</p>

        <div className="prose-sm space-y-8 text-on-surface-variant leading-relaxed">
          <section>
            <h2 className="font-headline font-bold text-xl text-on-surface mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly, including:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Account information (name, email, password via Clerk authentication)</li>
              <li>Assessment data (health goals, friction points, biometrics, current supplements and medications)</li>
              <li>Payment information (processed securely via Stripe — we do not store card details)</li>
              <li>Delivery address for subscription shipments</li>
              <li>Health metrics you voluntarily log (sleep, energy, mood, weight, skin quality)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline font-bold text-xl text-on-surface mb-3">2. How We Use Your Information</h2>
            <p>Your data is used to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Generate personalized supplement recommendations</li>
              <li>Process and fulfill subscription orders</li>
              <li>Track your health metrics and protocol effectiveness</li>
              <li>Improve our recommendation algorithm</li>
              <li>Communicate important updates about your protocol</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline font-bold text-xl text-on-surface mb-3">3. Data Protection</h2>
            <p>
              We implement industry-standard security measures including encryption at rest and in transit,
              row-level security in our database, and secure authentication via Clerk. Your health data
              is treated with the same confidentiality standards as medical records.
            </p>
          </section>

          <section>
            <h2 className="font-headline font-bold text-xl text-on-surface mb-3">4. Data Sharing</h2>
            <p>
              We do not sell your personal data. We share information only with service providers necessary
              for platform operation (Clerk for authentication, Stripe for payments, shipping providers for delivery).
            </p>
          </section>

          <section>
            <h2 className="font-headline font-bold text-xl text-on-surface mb-3">5. Your Rights</h2>
            <p>
              Under GDPR and PDPA, you have the right to access, correct, delete, or export your data.
              Contact support@vanguardhealth.com to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="font-headline font-bold text-xl text-on-surface mb-3">6. Cookies</h2>
            <p>
              We use essential cookies for authentication and session management. Analytics cookies are used
              with your consent to improve our service.
            </p>
          </section>

          <section>
            <h2 className="font-headline font-bold text-xl text-on-surface mb-3">7. Contact</h2>
            <p>
              For privacy inquiries, contact our Data Protection Officer at privacy@vanguardhealth.com.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
