"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import supplementsData from "@/data/supplements.json";
import type { Supplement } from "@/lib/types";

const supplements = supplementsData as Supplement[];

export default function StudiesPage() {
  const [search, setSearch] = useState("");

  const filtered = supplements
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()) || s.targets.some((t) => t.replace(/-/g, " ").toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => b.evidence.citations - a.evidence.citations);

  return (
    <>
      <Navbar />
      <main className="mx-auto px-4 sm:px-8 py-12" style={{maxWidth: '1024px', width: '100%'}}>
        <span className="text-xs font-bold tracking-widest text-primary uppercase">Evidence Library</span>
        <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-on-surface mt-4 tracking-tight">
          Clinical Studies
        </h1>
        <p className="text-on-surface-variant text-lg mt-6 max-w-2xl leading-relaxed">
          Browse our supplement database sorted by evidence strength and citation count.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-12">
          <div className="bg-surface-container-lowest rounded-xl p-6 text-center">
            <p className="text-3xl font-black text-primary">{supplements.length}</p>
            <p className="text-xs font-bold text-on-surface-variant uppercase mt-1">Compounds</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-6 text-center">
            <p className="text-3xl font-black text-primary">
              {supplements.reduce((sum, s) => sum + s.evidence.citations, 0)}
            </p>
            <p className="text-xs font-bold text-on-surface-variant uppercase mt-1">Total Citations</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-6 text-center">
            <p className="text-3xl font-black text-primary">
              {supplements.filter((s) => s.evidence.level === "A").length}
            </p>
            <p className="text-xs font-bold text-on-surface-variant uppercase mt-1">Grade A Compounds</p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-10 relative">
          <span className="material-symbols-outlined text-lg text-on-surface-variant absolute left-4 top-1/2 -translate-y-1/2">search</span>
          <input
            type="text"
            placeholder="Search by supplement name, category, or target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest pl-12 pr-4 py-3.5 text-sm font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Supplement List */}
        <div className="mt-8 bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto divide-y divide-outline-variant">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
              <p className="text-sm">No supplements match your search.</p>
            </div>
          ) : (
            filtered.map((supp) => (
              <div key={supp.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-black ${
                    supp.evidence.level === "A"
                      ? "bg-emerald-500 text-white"
                      : supp.evidence.level === "B"
                      ? "bg-amber-500 text-white"
                      : "bg-slate-400 text-white"
                  }`}>
                    {supp.evidence.level}
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-on-surface">{supp.name}</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {supp.category.replace("-", " ")} | {supp.targets.slice(0, 3).map((t) => t.replace(/-/g, " ")).join(", ")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-primary">{supp.evidence.citations} citations</p>
                  <p className="text-xs text-on-surface-variant">
                    {supp.dosage.amount}{supp.dosage.unit} | {supp.schedule}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
