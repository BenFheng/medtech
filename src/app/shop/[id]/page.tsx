"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import supplementsData from "@/data/supplements.json";
import type { Supplement } from "@/lib/types";

const supplements = supplementsData as Supplement[];

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const supp = supplements.find((s) => s.id === id) ||
    supplements.find((s) => s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === id);

  if (!supp) {
    return (
      <>
        <Navbar />
        <main className="max-w-screen-lg mx-auto px-4 sm:px-8 py-24 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">search_off</span>
          <h1 className="font-headline font-bold text-2xl text-on-surface mb-2">Product not found</h1>
          <p className="text-on-surface-variant mb-8">The supplement you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/shop" className="text-primary font-semibold">Back to Shop</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-screen-lg mx-auto px-4 sm:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">
          <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-on-surface font-semibold">{supp.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Product visual placeholder */}
          <div className="bg-surface-container-low rounded-2xl flex items-center justify-center aspect-square">
            <div className="text-center">
              <span className="material-symbols-outlined text-7xl text-primary/30">medication</span>
              <p className="text-sm text-on-surface-variant mt-4">{supp.dosage.form}</p>
            </div>
          </div>

          {/* Right: Product details */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block rounded-full bg-primary-fixed px-3 py-1 text-xs font-headline font-bold text-on-primary-fixed">
                {supp.schedule}
              </span>
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-headline font-bold ${
                supp.evidence.level === "A"
                  ? "bg-primary/10 text-primary"
                  : "bg-surface-container-high text-on-surface-variant"
              }`}>
                Evidence Grade {supp.evidence.level}
              </span>
            </div>

            <h1 className="font-headline font-extrabold text-4xl text-on-surface mb-3">
              {supp.name}
            </h1>

            <p className="text-on-surface-variant font-body leading-relaxed mb-6">
              {supp.dosage.form}
            </p>

            <div className="flex items-baseline gap-2 mb-8">
              <span className="font-headline font-extrabold text-3xl text-on-surface">
                ${supp.pricePerMonth}
              </span>
              <span className="text-on-surface-variant">/mo</span>
            </div>

            <button className="w-full vitality-gradient text-on-primary px-8 py-4 rounded-xl font-headline font-bold text-sm hover:opacity-90 transition-all active:scale-95 mb-4">
              Add to Stack
            </button>

            {/* Details */}
            <div className="space-y-6 mt-8">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
                <h3 className="font-headline font-bold text-base text-on-surface mb-4">Dosage</h3>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">medication</span>
                  <span className="text-sm text-on-surface">{supp.dosage.amount} {supp.dosage.unit} daily</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
                <h3 className="font-headline font-bold text-base text-on-surface mb-4">Targets</h3>
                <div className="flex flex-wrap gap-2">
                  {supp.targets.map((t) => (
                    <span key={t} className="inline-block rounded-full bg-surface-container px-3 py-1 text-xs font-semibold text-on-surface-variant">
                      {t.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
                <h3 className="font-headline font-bold text-base text-on-surface mb-4">Evidence</h3>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-headline font-bold text-sm ${
                      supp.evidence.level === "A" ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"
                    }`}>
                      {supp.evidence.level}
                    </span>
                    <p className="text-[10px] text-on-surface-variant mt-1">Grade</p>
                  </div>
                  <div className="text-center">
                    <span className="font-headline font-bold text-2xl text-on-surface">{supp.evidence.citations}</span>
                    <p className="text-[10px] text-on-surface-variant">Citations</p>
                  </div>
                </div>
              </div>

              {/* Synergies */}
              {supp.interactions.synergies.length > 0 && (
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
                  <h3 className="font-headline font-bold text-base text-on-surface mb-4">Works well with</h3>
                  <div className="space-y-3">
                    {supp.interactions.synergies.map((syn) => (
                      <div key={syn.compound} className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary text-lg mt-0.5">add_circle</span>
                        <div>
                          <p className="text-sm font-semibold text-on-surface">{syn.compound}</p>
                          <p className="text-xs text-on-surface-variant">{syn.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Antagonisms */}
              {supp.interactions.antagonisms.length > 0 && (
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
                  <h3 className="font-headline font-bold text-base text-on-surface mb-4">Caution with</h3>
                  <div className="space-y-3">
                    {supp.interactions.antagonisms.map((ant) => (
                      <div key={ant.compound} className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-error text-lg mt-0.5">warning</span>
                        <div>
                          <p className="text-sm font-semibold text-on-surface">{ant.compound}</p>
                          <p className="text-xs text-on-surface-variant">{ant.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
