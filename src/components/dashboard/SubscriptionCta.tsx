"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart";
import type { Supplement } from "@/lib/types";

const durationOptions = [
  { label: "1 Day", multiplier: 1 / 30 },
  { label: "2 Weeks", multiplier: 14 / 30 },
  { label: "1 Month", multiplier: 1 },
  { label: "Monthly Subscription", multiplier: 1 },
];

interface SubscriptionCtaProps {
  totalPrice: number;
  stack: Supplement[];
  stackName?: string;
}

export default function SubscriptionCta({ totalPrice, stack, stackName }: SubscriptionCtaProps) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const [duration, setDuration] = useState("Monthly Subscription");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const multiplier = durationOptions.find((d) => d.label === duration)?.multiplier || 1;
  const price = (totalPrice * multiplier).toFixed(2);
  const displayPrice = parseFloat(price) % 1 === 0 ? parseInt(price).toString() : price;

  const handleBeginProtocol = () => {
    for (const supp of stack) {
      addItem({
        productId: supp.id,
        name: supp.name,
        pricePerMonth: supp.pricePerMonth,
        duration,
        durationMultiplier: multiplier,
        dosageAmount: supp.dosage.amount,
        dosageUnit: supp.dosage.unit,
        timingSchedule: supp.schedule,
        isProtocol: true,
        protocolName: stackName || "Your Protocol",
      });
    }
    router.push("/cart");
  };

  return (
    <section className="vitality-gradient rounded-xl p-4 text-white relative">
      <div className="relative z-10">
        <h3 className="text-2xl font-headline font-bold mb-2">
          Ready to ship?
        </h3>
        <p className="text-on-primary-container text-sm mb-6">
          Confirm your custom stack and begin your clinical-grade journey.
        </p>

        <div className="mb-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black font-headline">
                  ${displayPrice}
                </span>
                {duration === "Monthly Subscription" && (
                  <span className="text-lg font-medium opacity-80">/mo</span>
                )}
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-60 mt-1">
                {duration === "Monthly Subscription" ? "Recurring · Cancel Anytime" : "One-Time Purchase"}
              </p>
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-lg bg-on-primary/20 text-on-primary border-0 px-3 py-2 text-xs font-headline font-bold cursor-pointer"
              >
                {duration}
                <span className={`material-symbols-outlined text-sm transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 rounded-lg bg-white border border-outline-variant shadow-lg py-1 z-50 w-48" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                  {durationOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => { setDuration(opt.label); setDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm font-body transition-colors ${
                        duration === opt.label
                          ? "text-primary font-semibold bg-primary-fixed/30"
                          : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={handleBeginProtocol}
          className="w-full bg-primary-fixed text-on-primary-fixed font-headline font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:brightness-105 transition-all shadow-xl active:scale-95"
        >
          Begin Protocol
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
        <p className="text-[10px] text-center mt-4 opacity-70">
          Cancel or pause any time. 100% money-back quality guarantee.
        </p>
      </div>
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
    </section>
  );
}
