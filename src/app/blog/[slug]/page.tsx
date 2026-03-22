import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NewsletterSignup from "@/components/ui/NewsletterSignup";

const posts: Record<string, { title: string; category: string; date: string; readTime: string; content: string[] }> = {
  "how-to-fix-brain-fog-at-3pm": {
    title: "How to Fix Brain Fog at 3 PM",
    category: "Cognitive Performance",
    date: "March 15, 2026",
    readTime: "5 min read",
    content: [
      "That familiar afternoon fog isn't just about what you had for lunch. It's a predictable dip in your brain's energy metabolism, driven by circadian adenosine accumulation and post-prandial blood glucose fluctuations.",
      "By 2-3 PM, adenosine — the neurotransmitter responsible for sleep pressure — has accumulated to levels that directly compete with excitatory neurotransmission. Meanwhile, your post-lunch insulin response redirects blood flow to your digestive system, temporarily reducing cerebral perfusion.",
      "The conventional solution is caffeine, which blocks adenosine receptors. But this only masks the problem and can disrupt evening sleep architecture, creating a vicious cycle.",
      "A more targeted approach combines L-Theanine (200mg) with Alpha-GPC (300mg) taken 30 minutes before your typical slump. L-Theanine promotes alpha brain wave activity — the neural signature of calm alertness — while Alpha-GPC provides the acetylcholine precursor your brain needs for sustained attention.",
      "For longer-term resilience against afternoon crashes, Lion's Mane (1000mg daily) supports nerve growth factor synthesis, while Creatine Monohydrate (5g daily) maintains your brain's phosphocreatine reserves for rapid ATP regeneration during demanding cognitive tasks.",
      "The key insight: brain fog isn't a willpower problem. It's a substrate problem. Give your neurons the raw materials they need, and the fog lifts.",
    ],
  },
  "the-science-of-sleep-stacks": {
    title: "The Science of Sleep Stacks",
    category: "Sleep",
    date: "March 8, 2026",
    readTime: "7 min read",
    content: [
      "Modern sleep science has moved beyond melatonin. The most effective sleep stacks work through complementary mechanisms — GABAergic pathways, core body temperature regulation, and serotonin synthesis — to improve both sleep onset and sleep architecture.",
      "Magnesium Bisglycinate (400mg) serves dual duty: the magnesium ion supports GABA receptor function, while the glycinate moiety provides additional inhibitory neurotransmission. Take it 60 minutes before bed.",
      "Apigenin (50mg), derived from chamomile, acts as a positive allosteric modulator at GABA-A receptors. Unlike benzodiazepines, apigenin enhances GABA signaling without the tolerance, dependence, or hangover effects.",
      "Glycine (3g) works through a unique mechanism: it lowers core body temperature by increasing blood flow to the extremities. This peripheral vasodilation signals your hypothalamus that it's time to sleep, reducing sleep onset latency and improving next-day alertness.",
      "L-Tryptophan (500mg) is the rate-limiting amino acid for serotonin and melatonin synthesis. Unlike supplemental melatonin (which can suppress your body's own production), tryptophan supports your natural production pathway. Critical note: take with carbohydrates, not protein, and never combine with SSRIs.",
      "The synergy between these compounds is what makes a stack more effective than any single ingredient. Each targets a different node in the sleep regulation network.",
    ],
  },
  "supplements-for-screen-fatigue": {
    title: "Supplements for Screen Fatigue",
    category: "Digital Wellness",
    date: "March 1, 2026",
    readTime: "4 min read",
    content: [
      "Digital eye strain — clinically termed Computer Vision Syndrome — affects an estimated 65% of professionals who spend 6+ hours daily in front of screens. Symptoms include dry eyes, headaches, blurred vision, and a distinctive heaviness behind the eyes.",
      "Astaxanthin (12mg daily) is the standout compound for screen-related eye fatigue. This carotenoid crosses the blood-retinal barrier and accumulates in the ciliary body and retina, where it protects photoreceptors from blue light-induced oxidative damage.",
      "Omega-3 fatty acids (2000mg EPA/DHA) support the tear film's lipid layer, reducing dry eye symptoms that worsen with prolonged screen use. The anti-inflammatory properties of EPA also help reduce the low-grade inflammation that accompanies chronic eye strain.",
      "Combined, astaxanthin and omega-3s create a synergistic antioxidant shield: astaxanthin protects the omega-3 fatty acids from lipid peroxidation, while the omega-3s provide the lipid vehicle that enhances astaxanthin absorption.",
    ],
  },
  "nad-plus-the-longevity-molecule": {
    title: "NAD+: The Longevity Molecule Explained",
    category: "Longevity",
    date: "February 22, 2026",
    readTime: "8 min read",
    content: [
      "Nicotinamide adenine dinucleotide (NAD+) is a coenzyme present in every living cell. It's essential for energy metabolism, DNA repair, and cellular signaling. By age 60, your NAD+ levels have declined by approximately 50% from their peak.",
      "This decline isn't just a biomarker — it's a driver. Reduced NAD+ directly impairs mitochondrial function, slows DNA repair, and decreases the activity of sirtuins, a family of proteins linked to longevity in multiple organisms.",
      "NMN (Nicotinamide Mononucleotide) at 500mg daily is the most efficient precursor for raising NAD+ levels. It's converted to NAD+ via the enzyme NMNAT, bypassing the rate-limiting step that constrains other precursors like nicotinamide riboside.",
      "The real power emerges when NMN is combined with Trans-Resveratrol (500mg). Resveratrol activates SIRT1, the most-studied sirtuin, which requires NAD+ as a cofactor. NMN ensures the substrate is available; resveratrol ensures it's being used for longevity-promoting enzymatic activity.",
      "CoQ10 Ubiquinol (200mg) complements this stack by optimizing the mitochondrial electron transport chain. As NAD+ levels rise and mitochondrial function improves, CoQ10 ensures each mitochondrion is operating at peak efficiency.",
      "Take NMN in the morning on an empty stomach to align with your body's natural NAD+ circadian rhythm. Add resveratrol with a small fat-containing meal for absorption.",
    ],
  },
  "mineral-timing-guide": {
    title: "The Complete Mineral Timing Guide",
    category: "Fundamentals",
    date: "February 15, 2026",
    readTime: "6 min read",
    content: [
      "Minerals are the most commonly mismanaged supplements. Many people take their entire mineral stack at once, not realizing that zinc, iron, calcium, magnesium, and selenium all compete for the same intestinal transporters.",
      "The key insight: divalent cations (minerals with a +2 charge) share transport mechanisms in your gut. When you take zinc and iron together, they compete for the DMT1 transporter, reducing absorption of both by up to 50%.",
      "The optimal schedule separates competing minerals by at least 2 hours. Morning: Zinc Picolinate with breakfast. Midday: Selenium with lunch. Evening: Magnesium Bisglycinate before bed.",
      "Vitamin D3 and K2 should be taken together with a fat-containing meal — they're synergistic, not competitive. D3 promotes calcium absorption; K2 directs that calcium to bones and away from arteries.",
      "If you're taking Zinc above 25mg daily long-term, supplement 1-2mg of copper to prevent zinc-induced copper deficiency. High zinc upregulates metallothionein in your enterocytes, which sequesters copper and prevents its absorption.",
      "Pro tip: Omega-3 fish oil serves as an excellent vehicle for fat-soluble supplements. Take your D3, K2, CoQ10, and astaxanthin alongside your morning fish oil capsule for enhanced absorption of all four.",
    ],
  },
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="max-w-screen-lg mx-auto px-4 sm:px-8 py-24 text-center">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">article</span>
          <h1 className="font-headline font-bold text-3xl text-on-surface mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-primary font-bold">Back to Blog</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-screen-lg mx-auto px-4 sm:px-8 py-24">
        <Link href="/blog" className="inline-flex items-center gap-1 text-primary font-bold text-sm mb-8 hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to Blog
        </Link>

        <span className="text-xs font-bold text-primary uppercase">{post.category}</span>
        <h1 className="font-headline font-extrabold text-4xl text-on-surface mt-2 tracking-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 mt-4 text-on-surface-variant text-sm">
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>

        <article className="mt-12 space-y-6">
          {post.content.map((paragraph, i) => (
            <p key={i} className="text-on-surface-variant leading-relaxed">{paragraph}</p>
          ))}
        </article>

        {/* Newsletter CTA */}
        <section className="bg-surface-container-lowest rounded-xl p-8 mt-16 text-center">
          <h3 className="font-headline font-bold text-lg text-on-surface">
            Want more evidence-based insights?
          </h3>
          <p className="text-on-surface-variant text-sm mt-2">
            Join our weekly newsletter for the latest in supplementation science.
          </p>
          <div className="mt-4">
            <NewsletterSignup compact />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
