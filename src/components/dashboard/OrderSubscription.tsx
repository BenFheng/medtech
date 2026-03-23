"use client";

import { useState } from "react";
import type { Supplement } from "@/lib/types";
import supplementsData from "@/data/supplements.json";

const allSupplements = supplementsData as Supplement[];

interface OrderSubscriptionProps {
  stack: Supplement[];
  totalPrice: number;
}

export default function OrderSubscription({ stack: initialStack, totalPrice: initialPrice }: OrderSubscriptionProps) {
  const [editing, setEditing] = useState(false);
  const [paused, setPaused] = useState(false);
  const [stack, setStack] = useState(initialStack);
  const [addSearch, setAddSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [evidenceFilter, setEvidenceFilter] = useState<string | null>(null);

  const totalPrice = stack.reduce((sum, s) => sum + s.pricePerMonth, 0);

  const handleRemove = (id: string) => {
    setStack(stack.filter((s) => s.id !== id));
  };

  const handleAdd = (supp: Supplement) => {
    if (!stack.some((s) => s.id === supp.id)) {
      setStack([...stack, supp]);
      setAddSearch("");
    }
  };

  return (
    <div className="space-y-8">
      {/* Manage Subscription */}
      <section className="bg-surface-container-lowest rounded-xl p-4">
        <h3 className="font-headline font-bold text-xl text-on-surface mb-6">
          Manage Subscription
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setEditing(!editing)}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-headline font-bold text-sm transition-all ${
              editing
                ? "bg-primary text-on-primary"
                : "bg-surface-container-low text-on-surface hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-lg">{editing ? "check" : "edit"}</span>
            {editing ? "Done Editing" : "Edit Subscription"}
          </button>
          <button
            onClick={() => setPaused(!paused)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-headline font-bold text-sm hover:bg-surface-container transition-all"
          >
            <span className="material-symbols-outlined text-lg">{paused ? "play_arrow" : "pause"}</span>
            {paused ? "Resume Subscription" : "Pause Subscription"}
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-headline font-bold text-sm hover:bg-surface-container transition-all">
            <span className="material-symbols-outlined text-lg">credit_card</span>
            Update Payment
          </button>
        </div>
      </section>

      {/* Monthly Subscription + Cost Breakdown */}
      <section className="bg-surface-container-lowest rounded-xl p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6 flex-wrap">
            <h3 className="font-headline font-bold text-xl text-on-surface">Monthly Subscription</h3>
            <span className="text-sm text-on-surface-variant">Next delivery: {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="font-headline font-bold text-lg text-primary">${totalPrice}/mo</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${paused ? "bg-amber-100 text-amber-700" : "bg-primary-fixed text-primary"}`}>
              {paused ? "Paused" : "Active"}
            </span>
          </div>
        </div>

        {/* Search bar + filters when editing */}
        {editing && (
          <div className="mb-4 bg-surface-container-low rounded-lg p-4">
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <span className="material-symbols-outlined text-lg text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2">search</span>
                <input
                  type="text"
                  placeholder="Search supplements..."
                  value={addSearch}
                  onChange={(e) => setAddSearch(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant bg-surface pl-10 pr-4 py-2 text-sm font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <select
                value={categoryFilter || ""}
                onChange={(e) => setCategoryFilter(e.target.value || null)}
                className="rounded-lg border border-outline-variant bg-surface px-2 py-2 text-xs font-headline font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">All Categories</option>
                {["cognitive", "sleep-stress", "longevity", "skin-radiance", "foundation", "performance"].map((cat) => (
                  <option key={cat} value={cat}>{cat.replace("-", " & ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                ))}
              </select>
              <select
                value={evidenceFilter || ""}
                onChange={(e) => setEvidenceFilter(e.target.value || null)}
                className="rounded-lg border border-outline-variant bg-surface px-2 py-2 text-xs font-headline font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">All Evidence</option>
                <option value="A">Strong</option>
                <option value="B">Moderate</option>
                <option value="C">Emerging</option>
              </select>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {allSupplements
                .filter((s) =>
                  (addSearch.length === 0 || s.name.toLowerCase().includes(addSearch.toLowerCase())) &&
                  (!categoryFilter || s.category === categoryFilter) &&
                  (!scheduleFilter || s.schedule === scheduleFilter) &&
                  (!evidenceFilter || s.evidence.level === evidenceFilter) &&
                  !stack.some((existing) => existing.id === s.id)
                )
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleAdd(s)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-left hover:bg-surface-container transition-colors"
                  >
                    <div>
                      <span className="text-sm font-headline font-bold text-on-surface">{s.name}</span>
                      <span className="text-xs text-on-surface-variant ml-2">{s.schedule} · ${s.pricePerMonth}/mo</span>
                    </div>
                    <span className="material-symbols-outlined text-primary text-lg">add_circle</span>
                  </button>
                ))}
              {allSupplements.filter((s) =>
                (addSearch.length === 0 || s.name.toLowerCase().includes(addSearch.toLowerCase())) &&
                (!categoryFilter || s.category === categoryFilter) &&
                (!scheduleFilter || s.schedule === scheduleFilter) &&
                (!evidenceFilter || s.evidence.level === evidenceFilter) &&
                !stack.some((existing) => existing.id === s.id)
              ).length === 0 && (
                <p className="text-sm text-on-surface-variant text-center py-3">No supplements found.</p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {stack.map((supp) => (
            <div key={supp.id} className="flex items-center justify-between py-3 border-b border-surface-container last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-surface-container rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-sm">medication</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{supp.name}</p>
                  <p className="text-xs text-on-surface-variant">
                    {supp.dosage.amount}{supp.dosage.unit} daily · {supp.schedule}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-on-surface">${supp.pricePerMonth}</span>
                {editing && (
                  <button
                    onClick={() => handleRemove(supp.id)}
                    className="flex items-center justify-center w-6 h-6 rounded-full bg-error/10 text-error hover:bg-error hover:text-on-error transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Order History */}
      <section className="bg-surface-container-lowest rounded-xl p-4">
        <h3 className="font-headline font-bold text-xl text-on-surface mb-6">Order History</h3>
        <div className="text-center py-12 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2">receipt_long</span>
          <p className="text-sm">No orders yet. Start your protocol to see order history.</p>
        </div>
      </section>
    </div>
  );
}
