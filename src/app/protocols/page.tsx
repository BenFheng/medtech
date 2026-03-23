"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart";
import { useProtocolStore } from "@/stores/protocols";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ProductJsonLd } from "@/components/seo/JsonLd";
import supplementsData from "@/data/supplements.json";
import type { Supplement } from "@/lib/types";

const supplements = supplementsData as Supplement[];

const durationOptions = [
  { label: "1 Day", multiplier: 1 / 30 },
  { label: "2 Weeks", multiplier: 14 / 30 },
  { label: "1 Month", multiplier: 1 },
  { label: "Monthly Subscription", multiplier: 1 },
];

const stacks = [
  {
    name: "Deep Work",
    tagline: "Ages 25-40",
    desc: "Engineered for sustained cognitive output. Enhance focus, memory consolidation, and mental stamina through synergistic nootropic and adaptogenic compounds.",
    icon: "psychology",
    color: "from-[#00535b] to-[#006d77]",
    supplementIds: [
      "l-theanine", "alpha-gpc", "lions-mane", "bacopa-monnieri",
      "rhodiola-rosea", "vitamin-b-complex-methylated", "omega-3-epa-dha", "creatine-monohydrate",
    ],
  },
  {
    name: "Executive Resilience",
    tagline: "Ages 36-50",
    desc: "Built for leaders under pressure. Optimize stress response, sleep architecture, and cellular defense for sustained high-level performance.",
    icon: "shield",
    color: "from-[#3c475d] to-[#545e76]",
    supplementIds: [
      "ashwagandha-ksm-66", "magnesium-bisglycinate", "nmn", "coq10-ubiquinol",
      "omega-3-epa-dha", "vitamin-d3", "vitamin-k2-mk7", "vitamin-b-complex-methylated",
    ],
  },
  {
    name: "Boardroom Radiance",
    tagline: "Ages 40+",
    desc: "Premium skin and longevity protocol. Support collagen synthesis, dermal hydration, and mitochondrial function for visible vitality.",
    icon: "face_5",
    color: "from-[#8c2500] to-[#b1380e]",
    supplementIds: [
      "collagen-peptides", "vitamin-c-liposomal", "phytoceramides", "hyaluronic-acid",
      "astaxanthin", "nmn", "omega-3-epa-dha", "coq10-ubiquinol",
    ],
  },
];

function StackCard({ stack }: { stack: typeof stacks[number] }) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { addProtocol } = useProtocolStore();
  const [duration, setDuration] = useState("1 Month");
  const multiplier = durationOptions.find((d) => d.label === duration)?.multiplier || 1;

  const stackSupps = stack.supplementIds
    .map((id) => supplements.find((s) => s.id === id))
    .filter(Boolean) as Supplement[];
  const individualTotal = stackSupps.reduce((sum, s) => sum + s.pricePerMonth, 0);
  const bundleMonthly = Math.round(individualTotal * 0.85);
  const bundlePrice = (bundleMonthly * multiplier).toFixed(2);
  const displayBundle = parseFloat(bundlePrice) % 1 === 0 ? parseInt(bundlePrice).toString() : bundlePrice;
  const originalPrice = (individualTotal * multiplier).toFixed(2);
  const displayOriginal = parseFloat(originalPrice) % 1 === 0 ? parseInt(originalPrice).toString() : originalPrice;

  return (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden">
      {/* Stack Header */}
      <div className={`bg-gradient-to-r ${stack.color} p-8 md:p-12`}>
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-on-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            {stack.icon}
          </span>
          <span className="text-xs font-bold tracking-widest text-on-primary/70 uppercase">
            {stack.tagline}
          </span>
        </div>
        <h2 className="font-headline font-extrabold text-3xl md:text-4xl text-on-primary">
          The &ldquo;{stack.name}&rdquo; Stack
        </h2>
        <p className="text-on-primary-container text-sm mt-3 max-w-xl leading-relaxed opacity-90">
          {stack.desc}
        </p>
        <div className="flex items-center gap-4 mt-6">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-on-primary">${displayBundle}</span>
            <span className="text-sm line-through text-on-primary/50">${displayOriginal}</span>
            <span className="text-xs font-bold bg-on-primary/20 text-on-primary px-2 py-0.5 rounded-full">
              Save 15%
            </span>
          </div>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="rounded-lg bg-on-primary/20 text-on-primary border-0 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-headline font-bold focus:outline-none focus:ring-2 focus:ring-on-primary/40 cursor-pointer max-w-[140px] sm:max-w-none"
          >
            {durationOptions.map((opt) => (
              <option key={opt.label} value={opt.label} className="text-on-surface bg-white">{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Supplements Grid */}
      <div className="p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stackSupps.map((supp) => {
            const suppPrice = (supp.pricePerMonth * multiplier).toFixed(2);
            const displaySuppPrice = parseFloat(suppPrice) % 1 === 0 ? parseInt(suppPrice).toString() : suppPrice;
            const isAM = supp.schedule === "AM" || supp.schedule === "AM/PM";
            return (
              <Link key={supp.id} href={`/shop/${supp.id}`} className="bg-surface-container-low rounded-lg p-4 hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`material-symbols-outlined text-sm ${isAM ? "text-amber-500" : "text-indigo-400"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isAM ? "light_mode" : "dark_mode"}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    supp.evidence.level === "A"
                      ? "bg-emerald-100 text-emerald-700"
                      : supp.evidence.level === "B"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {supp.evidence.level === "A" ? "Strong" : supp.evidence.level === "B" ? "Moderate" : "Emerging"}
                  </span>
                </div>
                <h4 className="font-headline font-bold text-sm text-on-surface">
                  {supp.name}
                </h4>
                <p className="text-xs text-on-surface-variant mt-1">
                  {supp.dosage.amount}{supp.dosage.unit}
                </p>
                <span className="text-[10px] text-on-surface-variant mt-2 block">${displaySuppPrice}</span>
              </Link>
            );
          })}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => {
              stackSupps.forEach((supp) => {
                addItem({
                  productId: supp.id,
                  name: supp.name,
                  pricePerMonth: supp.pricePerMonth,
                  duration: "Monthly Subscription",
                  durationMultiplier: multiplier,
                  dosageAmount: supp.dosage.amount,
                  dosageUnit: supp.dosage.unit,
                  timingSchedule: supp.schedule,
                  isProtocol: true,
                  protocolName: `The "${stack.name}" Stack`,
                });
              });
              router.push("/cart");
            }}
            className="flex-1 vitality-gradient text-on-primary font-headline font-bold py-4 rounded-lg text-center transition-all active:scale-95"
          >
            Subscribe to This Stack
          </button>
          <button
            onClick={() => {
              addProtocol(`The "${stack.name}" Stack`, stackSupps);
              router.push("/dashboard");
            }}
            className="flex-1 bg-surface-container text-on-surface font-headline font-bold py-4 rounded-lg text-center hover:bg-surface-container-high transition-all"
          >
            Customize This Stack
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProtocolsPage() {
  return (
    <>
      {stacks.map((stack) => {
        const stackSupps = stack.supplementIds
          .map((id) => supplements.find((s) => s.id === id))
          .filter(Boolean) as Supplement[];
        const bundlePrice = Math.round(stackSupps.reduce((sum, s) => sum + s.pricePerMonth, 0) * 0.85);
        return (
          <ProductJsonLd
            key={stack.name}
            name={`Vanguard "${stack.name}" Stack`}
            description={stack.desc}
            price={bundlePrice}
          />
        );
      })}
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-primary py-24">
          <div className="max-w-screen-lg mx-auto px-4 sm:px-8 text-center">
            <span className="text-xs font-bold tracking-widest text-primary-fixed uppercase">Pre-Built Protocols</span>
            <h1 className="font-headline font-extrabold text-5xl md:text-6xl text-on-primary mt-4 tracking-tight">
              Flagship Stacks
            </h1>
            <p className="text-on-primary-container text-lg mt-6 max-w-2xl mx-auto leading-relaxed opacity-90">
              Doctor-designed, ready to ship. Each stack targets a specific performance profile
              with clinically validated compound synergies.
            </p>
          </div>
        </section>

        {/* Stacks */}
        <section className="max-w-screen-lg mx-auto px-4 sm:px-8 py-24">
          <div className="space-y-16">
            {stacks.map((stack) => (
              <StackCard key={stack.name} stack={stack} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-surface-container-low py-24 text-center">
          <div className="max-w-screen-lg mx-auto px-4 sm:px-8">
          <h2 className="font-headline font-bold text-3xl text-on-surface mb-4">
            Not sure which stack is right?
          </h2>
          <p className="text-on-surface-variant max-w-lg mx-auto mb-8">
            Take our 2-minute assessment and we&apos;ll build a custom protocol based on your unique biology and goals.
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 vitality-gradient text-on-primary font-headline font-bold px-8 py-4 rounded-lg transition-all active:scale-95"
          >
            Start Assessment
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
