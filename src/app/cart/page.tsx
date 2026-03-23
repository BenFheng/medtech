"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCartStore, type CartItem } from "@/stores/cart";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const durationOptions = [
  { label: "1 Day", multiplier: 1 / 30 },
  { label: "2 Weeks", multiplier: 14 / 30 },
  { label: "1 Month", multiplier: 1 },
  { label: "Monthly Subscription", multiplier: 1 },
];

function DurationDropdown({ value, onChange }: { value: string; onChange: (label: string, multiplier: number) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-1 rounded-lg border border-outline-variant bg-surface px-2 sm:px-3 py-2 text-xs sm:text-sm font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        {value}
        <span className={`material-symbols-outlined text-lg text-on-surface-variant transition-transform ${open ? "rotate-180" : ""}`}>expand_more</span>
      </button>
      {open && (
        <div className="absolute left-0 right-0 z-50 rounded-lg bg-white border border-outline-variant shadow-lg py-1 mt-1">
          {durationOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => { onChange(opt.label, opt.multiplier); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm font-body transition-colors ${
                value === opt.label
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
  );
}

function CartItemRow({ item, hideDropdownLabel, useNativeSelect }: { item: CartItem; hideDropdownLabel?: boolean; useNativeSelect?: boolean }) {
  const { removeItem, updateDuration } = useCartStore();
  const price = (item.pricePerMonth * item.durationMultiplier).toFixed(2);
  const displayPrice = parseFloat(price) % 1 === 0 ? parseInt(price).toString() : price;

  return (
    <div className="bg-surface-container-lowest p-6 flex items-center gap-6">
      <div className="flex-1">
        <Link href={`/shop/${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`} className="hover:text-primary transition-colors">
          <h3 className="font-headline font-bold text-lg text-on-surface">{item.name}</h3>
        </Link>
        <p className="text-sm text-on-surface-variant mt-1">
          {item.dosageAmount} {item.dosageUnit} / day &middot; {item.timingSchedule}
        </p>
      </div>

      {!hideDropdownLabel ? (
        useNativeSelect ? (
          <select
            value={item.duration}
            onChange={(e) => {
              const opt = durationOptions.find((d) => d.label === e.target.value);
              if (opt) updateDuration(item.productId, opt.label, opt.multiplier);
            }}
            className="rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {durationOptions.map((opt) => (
              <option key={opt.label} value={opt.label}>{opt.label}</option>
            ))}
          </select>
        ) : (
          <DurationDropdown
            value={item.duration}
            onChange={(label, multiplier) => updateDuration(item.productId, label, multiplier)}
          />
        )
      ) : null}

      <span className="font-headline font-extrabold text-lg text-on-surface w-20 text-right">
        ${displayPrice}
      </span>

      <button
        onClick={() => removeItem(item.productId)}
        className="text-on-surface-variant hover:text-error transition-colors"
        aria-label="Remove"
      >
        <span className="material-symbols-outlined text-xl">close</span>
      </button>
    </div>
  );
}

export default function CartPage() {
  const { items, removeItem, clearCart, totalPrice, updateDuration } = useCartStore();

  const protocolItems = items.filter((i) => i.isProtocol);
  const otherItems = items.filter((i) => !i.isProtocol);

  const protocolTotal = protocolItems.reduce((sum, i) => sum + i.pricePerMonth * i.durationMultiplier, 0);
  const otherTotal = otherItems.reduce((sum, i) => sum + i.pricePerMonth * i.durationMultiplier, 0);

  return (
    <>
      <Navbar />
      <main className="mx-auto px-4 sm:px-8 py-12" style={{maxWidth: '1024px', width: '100%'}}>
        <h1 className="font-headline font-extrabold text-4xl text-on-surface mb-10">Your Stack</h1>

        {items.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6">
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2">local_mall</span>
              <p className="font-headline font-semibold text-sm text-on-surface-variant mb-4">Your stack is empty.</p>
              <Link href="/shop" className="vitality-gradient text-on-primary px-6 py-2.5 rounded-lg font-headline font-bold text-sm hover:opacity-90 transition-all">
                Browse Supplements
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Protocol Section */}
            {protocolItems.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4 gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-primary flex-shrink-0">science</span>
                    <h2 className="font-headline font-bold text-lg sm:text-xl text-on-surface whitespace-nowrap">Your Protocol</h2>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <DurationDropdown
                      value={protocolItems[0]?.duration || "Monthly Subscription"}
                      onChange={(label, multiplier) => {
                        protocolItems.forEach((item) => updateDuration(item.productId, label, multiplier));
                      }}
                    />
                    <button
                      onClick={() => protocolItems.forEach((item) => removeItem(item.productId))}
                      className="text-on-surface-variant hover:text-error transition-colors"
                      aria-label="Remove all protocol items"
                    >
                      <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                  </div>
                </div>
                <div className="rounded-2xl border border-outline-variant overflow-hidden">
                  <div className="divide-y divide-outline-variant">
                    {protocolItems.map((item) => (
                      <CartItemRow key={item.productId} item={item} hideDropdownLabel />
                    ))}
                  </div>
                  <div className="flex items-center justify-between px-6 py-4 bg-surface-container-low">
                    <span className="text-sm font-headline font-bold text-on-surface-variant">Protocol Total</span>
                    <span className="font-headline font-extrabold text-lg text-on-surface">
                      ${protocolTotal.toFixed(2)}{protocolItems[0]?.duration === "Monthly Subscription" ? "/mo" : ""}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Individual Items Section */}
            {otherItems.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary">local_mall</span>
                  <h2 className="font-headline font-bold text-xl text-on-surface">Individual Items</h2>
                </div>
                <div className="rounded-2xl border border-outline-variant overflow-hidden">
                  <div className="divide-y divide-outline-variant">
                    {otherItems.map((item) => (
                      <CartItemRow key={item.productId} item={item} useNativeSelect />
                    ))}
                  </div>
                  <div className="flex items-center justify-between px-6 py-4 bg-surface-container-low">
                    <span className="text-sm font-headline font-bold text-on-surface-variant">Subtotal</span>
                    <span className="font-headline font-extrabold text-lg text-on-surface">${otherTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="mt-8 bg-surface-container-lowest rounded-2xl border border-outline-variant p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="font-headline font-bold text-lg text-on-surface">Total</span>
                <span className="font-headline font-extrabold text-2xl text-on-surface">
                  ${totalPrice().toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/checkout"
                  className="flex-1 vitality-gradient text-on-primary font-headline font-bold py-4 rounded-lg text-center transition-all active:scale-95"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={() => { clearCart(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="flex-1 bg-surface-container text-on-surface font-headline font-bold py-4 rounded-lg text-center hover:bg-surface-container-high transition-all"
                >
                  Clear Stack
                </button>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
