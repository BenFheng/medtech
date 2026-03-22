"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const posts = [
  {
    slug: "how-to-fix-brain-fog-at-3pm",
    title: "How to Fix Brain Fog at 3 PM",
    excerpt: "That afternoon slump isn't just in your head. Here's the cellular science behind it and the exact supplement stack that targets post-lunch cognitive decline.",
    category: "Cognitive Performance",
    date: "March 15, 2026",
    readTime: "5 min read",
  },
  {
    slug: "the-science-of-sleep-stacks",
    title: "The Science of Sleep Stacks",
    excerpt: "Why magnesium, glycine, and apigenin work through complementary GABAergic pathways to improve sleep architecture without morning grogginess.",
    category: "Sleep",
    date: "March 8, 2026",
    readTime: "7 min read",
  },
  {
    slug: "supplements-for-screen-fatigue",
    title: "Supplements for Screen Fatigue",
    excerpt: "Digital eye strain affects 65% of professionals. Astaxanthin, omega-3, and targeted antioxidants can protect your vision and reduce fatigue.",
    category: "Digital Wellness",
    date: "March 1, 2026",
    readTime: "4 min read",
  },
  {
    slug: "nad-plus-the-longevity-molecule",
    title: "NAD+: The Longevity Molecule Explained",
    excerpt: "A deep dive into nicotinamide mononucleotide (NMN), sirtuin activation, and why NAD+ levels decline with age — plus what you can do about it.",
    category: "Longevity",
    date: "February 22, 2026",
    readTime: "8 min read",
  },
  {
    slug: "mineral-timing-guide",
    title: "The Complete Mineral Timing Guide",
    excerpt: "Zinc competes with iron. Calcium blocks magnesium. Here's the definitive schedule for taking minerals without sabotaging absorption.",
    category: "Fundamentals",
    date: "February 15, 2026",
    readTime: "6 min read",
  },
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-screen-lg mx-auto px-4 sm:px-8 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold tracking-widest text-primary uppercase">The Lab</span>
            <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-on-surface mt-4 tracking-tight">
              Research & Insights
            </h1>
            <p className="text-on-surface-variant text-lg mt-4 max-w-xl leading-relaxed">
              Evidence-based articles on supplementation, performance, and cellular health.
            </p>
          </div>
        </div>

        {/* Featured Post */}
        <Link href={`/blog/${posts[0].slug}`} className="block bg-primary rounded-2xl p-8 md:p-12 mb-12 group">
          <span className="text-xs font-bold text-primary-fixed uppercase">{posts[0].category}</span>
          <h2 className="font-headline font-extrabold text-3xl md:text-4xl text-on-primary mt-4 group-hover:opacity-90 transition-opacity">
            {posts[0].title}
          </h2>
          <p className="text-on-primary-container text-sm mt-4 max-w-xl leading-relaxed opacity-90">
            {posts[0].excerpt}
          </p>
          <div className="flex items-center gap-4 mt-6 text-on-primary/70 text-sm">
            <span>{posts[0].date}</span>
            <span>{posts[0].readTime}</span>
          </div>
        </Link>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.slice(1).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-surface-container-lowest rounded-xl p-8 hover:bg-surface-container transition-all"
            >
              <span className="text-[10px] font-bold text-primary uppercase">{post.category}</span>
              <h3 className="font-headline font-bold text-xl text-on-surface mt-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-on-surface-variant mt-3 leading-relaxed">{post.excerpt}</p>
              <div className="flex items-center gap-4 mt-4 text-on-surface-variant text-xs">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter Signup */}
        <section className="bg-surface-container-lowest rounded-2xl p-8 md:p-12 mt-16 text-center">
          <span className="material-symbols-outlined text-primary text-3xl">mail</span>
          <h2 className="font-headline font-bold text-2xl text-on-surface mt-4">
            Stay at the frontier
          </h2>
          <p className="text-on-surface-variant text-sm mt-2 max-w-md mx-auto">
            Weekly insights on supplementation science, new research, and protocol optimization.
          </p>
          <form className="flex gap-3 max-w-md mx-auto mt-6" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-surface-container text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button type="submit" className="vitality-gradient text-on-primary font-headline font-bold px-6 py-3 rounded-lg transition-all active:scale-95">
              Subscribe
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
