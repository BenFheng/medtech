"use client";

import type { Supplement } from "@/lib/types";

interface OrderSubscriptionProps {
  stack: Supplement[];
  totalPrice: number;
}

export default function OrderSubscription({ stack, totalPrice }: OrderSubscriptionProps) {
  return (
    <div className="space-y-8">
      {/* Subscription Status */}
      <section className="bg-surface-container-lowest rounded-xl p-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline font-bold text-xl text-on-surface">Subscription</h3>
          <span className="text-xs font-bold bg-primary-fixed text-primary px-3 py-1 rounded-full">
            Active
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-low rounded-lg p-4">
            <span className="material-symbols-outlined text-primary">calendar_today</span>
            <p className="text-sm font-bold text-on-surface mt-2">Next Delivery</p>
            <p className="text-xs text-on-surface-variant mt-1">
              {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="bg-surface-container-low rounded-lg p-4">
            <span className="material-symbols-outlined text-primary">payments</span>
            <p className="text-sm font-bold text-on-surface mt-2">Monthly Total</p>
            <p className="text-xs text-on-surface-variant mt-1">${totalPrice}/mo</p>
          </div>
          <div className="bg-surface-container-low rounded-lg p-4">
            <span className="material-symbols-outlined text-primary">autorenew</span>
            <p className="text-sm font-bold text-on-surface mt-2">Frequency</p>
            <p className="text-xs text-on-surface-variant mt-1">Monthly</p>
          </div>
        </div>
      </section>

      {/* Cost Breakdown */}
      <section className="bg-surface-container-lowest rounded-xl p-4">
        <h3 className="font-headline font-bold text-xl text-on-surface mb-6">
          Monthly Cost Breakdown
        </h3>
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
                    {supp.dosage.amount}{supp.dosage.unit} daily
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-on-surface">${supp.pricePerMonth}</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-4 border-t-2 border-primary/20">
            <span className="font-headline font-bold text-on-surface">Total</span>
            <span className="font-headline font-bold text-primary text-lg">${totalPrice}/mo</span>
          </div>
        </div>
      </section>

      {/* Subscription Controls */}
      <section className="bg-surface-container-lowest rounded-xl p-4">
        <h3 className="font-headline font-bold text-xl text-on-surface mb-6">
          Manage Subscription
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-headline font-bold text-sm hover:bg-surface-container transition-all">
            <span className="material-symbols-outlined text-lg">pause</span>
            Pause Subscription
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-headline font-bold text-sm hover:bg-surface-container transition-all">
            <span className="material-symbols-outlined text-lg">credit_card</span>
            Update Payment
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-headline font-bold text-sm hover:bg-surface-container transition-all">
            <span className="material-symbols-outlined text-lg">schedule</span>
            Change Frequency
          </button>
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
