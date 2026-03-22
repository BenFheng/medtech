import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Whitepapers | Vanguard Science",
  description:
    "Doctor-authored research publications on NAD+ optimization, cognitive stacks, sleep architecture, and mineral timing.",
  openGraph: {
    title: "Whitepapers | Vanguard Science",
    description: "Doctor-authored research publications on supplement science.",
  },
};

const whitepapers = [
  {
    title: "NAD+ Optimization: NMN and Resveratrol Synergy in Cellular Longevity",
    authors: "Dr. Sarah Chen, MD | Dr. James Park, PhD",
    date: "February 2026",
    abstract: "A comprehensive review of nicotinamide mononucleotide and trans-resveratrol co-supplementation for sirtuin activation and mitochondrial function.",
    tags: ["Longevity", "NAD+", "Sirtuins"],
  },
  {
    title: "The Cognitive Stack: Evidence-Based Nootropic Combinations for Sustained Mental Performance",
    authors: "Dr. James Park, PhD | Dr. Sarah Chen, MD",
    date: "January 2026",
    abstract: "Clinical analysis of L-Theanine, Alpha-GPC, Lion's Mane, and Bacopa Monnieri combinations for cognitive endurance in high-performing professionals.",
    tags: ["Cognitive", "Nootropics", "Performance"],
  },
  {
    title: "Sleep Architecture Optimization Through Targeted Supplementation",
    authors: "Dr. Sarah Chen, MD",
    date: "December 2025",
    abstract: "How magnesium bisglycinate, glycine, apigenin, and L-tryptophan work through complementary GABAergic and serotonergic pathways to improve sleep quality.",
    tags: ["Sleep", "GABA", "Serotonin"],
  },
  {
    title: "Mineral Interaction Matrix: Timing Optimization for Zinc, Magnesium, and Selenium",
    authors: "Dr. James Park, PhD",
    date: "November 2025",
    abstract: "Practical guidelines for separating competing minerals to maximize absorption and prevent deficiency-inducing interactions.",
    tags: ["Minerals", "Absorption", "Timing"],
  },
];

export default function WhitepapersPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-screen-lg mx-auto px-4 sm:px-8 py-24">
        <span className="text-xs font-bold tracking-widest text-primary uppercase">Whitepapers</span>
        <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-on-surface mt-4 tracking-tight">
          Research Publications
        </h1>
        <p className="text-on-surface-variant text-lg mt-6 max-w-2xl leading-relaxed">
          Doctor-authored deep dives into the science powering our protocols.
        </p>

        <div className="mt-12 space-y-6">
          {whitepapers.map((paper, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-xl p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {paper.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-bold bg-primary-fixed text-primary px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="font-headline font-bold text-xl text-on-surface">{paper.title}</h3>
              <p className="text-sm text-on-surface-variant mt-1">{paper.authors} | {paper.date}</p>
              <p className="text-sm text-on-surface-variant mt-4 leading-relaxed">{paper.abstract}</p>
              <button className="mt-6 flex items-center gap-2 text-primary font-headline font-bold text-sm hover:opacity-80 transition-all">
                <span className="material-symbols-outlined text-lg">download</span>
                Download PDF
              </button>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
