import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "The Science Behind Vanguard",
  description:
    "Evidence-based supplement selection with physician oversight. Learn about our A/B/C evidence rating system and clinical methodology.",
  openGraph: {
    title: "The Science Behind Vanguard",
    description: "Evidence-based supplement selection with physician oversight.",
  },
};

export default function SciencePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-primary py-24">
          <div className="max-w-screen-lg mx-auto px-4 sm:px-8 text-center">
            <span className="text-xs font-bold tracking-widest text-primary-fixed uppercase">Evidence-Driven</span>
            <h1 className="font-headline font-extrabold text-5xl md:text-6xl text-on-primary mt-4 tracking-tight">
              The Science Behind Vanguard
            </h1>
            <p className="text-on-primary-container text-lg mt-6 max-w-2xl mx-auto leading-relaxed opacity-90">
              Every compound in your protocol is selected through a rigorous, evidence-based pipeline.
              Our founding team includes two physicians specializing in integrative and functional medicine.
            </p>
          </div>
        </section>

        {/* Evidence Tiers */}
        <section className="max-w-screen-lg mx-auto px-4 sm:px-8 py-24">
          <h2 className="font-headline font-bold text-3xl text-on-surface mb-12 text-center">
            Our Evidence Rating System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                tier: "A",
                label: "Strong Evidence",
                color: "bg-primary text-on-primary",
                desc: "Multiple randomized controlled trials (RCTs), systematic reviews, or meta-analyses supporting efficacy. Consistent results across populations.",
              },
              {
                tier: "B",
                label: "Moderate Evidence",
                color: "bg-secondary text-on-secondary",
                desc: "Limited RCTs or strong mechanistic evidence with supportive clinical data. Promising results requiring further validation.",
              },
              {
                tier: "C",
                label: "Emerging Evidence",
                color: "bg-outline text-white",
                desc: "Preliminary studies, animal models, or traditional use with scientific rationale. Included only when risk profile is favorable.",
              },
            ].map((tier) => (
              <div key={tier.tier} className="bg-surface-container-lowest rounded-xl p-8 text-center">
                <div className={`w-16 h-16 ${tier.color} rounded-2xl flex items-center justify-center mx-auto text-2xl font-black`}>
                  {tier.tier}
                </div>
                <h3 className="font-headline font-bold text-xl text-on-surface mt-6">{tier.label}</h3>
                <p className="text-sm text-on-surface-variant mt-4 leading-relaxed">{tier.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Clinical Authority */}
        <section className="bg-surface-container-low py-24">
          <div className="max-w-screen-lg mx-auto px-4 sm:px-8">
            <h2 className="font-headline font-bold text-3xl text-on-surface mb-12 text-center">
              Clinical Authority
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-surface-container-lowest rounded-xl p-8">
                <span className="material-symbols-outlined text-primary text-3xl">stethoscope</span>
                <h3 className="font-headline font-bold text-xl text-on-surface mt-4">
                  Physician-Led Formulation
                </h3>
                <p className="text-sm text-on-surface-variant mt-3 leading-relaxed">
                  Our founding medical team reviews every compound selection, dosage recommendation,
                  and interaction flag. No supplement enters a protocol without clinical sign-off.
                </p>
              </div>
              <div className="bg-surface-container-lowest rounded-xl p-8">
                <span className="material-symbols-outlined text-primary text-3xl">biotech</span>
                <h3 className="font-headline font-bold text-xl text-on-surface mt-4">
                  Algorithmic Precision
                </h3>
                <p className="text-sm text-on-surface-variant mt-3 leading-relaxed">
                  Our recommendation engine scores supplements against your assessment profile,
                  checks for interactions and contraindications, and assembles an optimized stack
                  in seconds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Links */}
        <section className="max-w-screen-lg mx-auto px-4 sm:px-8 py-24">
          <h2 className="font-headline font-bold text-3xl text-on-surface mb-12 text-center">
            Explore Our Research
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { href: "/science/methodology", icon: "schema", title: "Methodology", desc: "How our supplement selection algorithm works" },
              { href: "/science/studies", icon: "menu_book", title: "Evidence Library", desc: "Browse supplements by evidence level and citations" },
              { href: "/science/whitepapers", icon: "description", title: "Whitepapers", desc: "Doctor-authored deep dives on key compounds" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="group bg-surface-container-lowest rounded-xl p-8 hover:bg-surface-container transition-all">
                <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-110 transition-transform inline-block">
                  {link.icon}
                </span>
                <h3 className="font-headline font-bold text-xl text-on-surface mt-4">{link.title}</h3>
                <p className="text-sm text-on-surface-variant mt-2">{link.desc}</p>
                <span className="inline-flex items-center gap-1 text-primary font-bold text-sm mt-4">
                  Learn more <span className="material-symbols-outlined text-base">arrow_forward</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
