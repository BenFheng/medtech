"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/cart";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type FilterOption = { label: string; count: number };

type Product = {
  product_id: string;
  name: string;
  description: string;
  unit_cost: number;
  category_tags: string[];
  benefit_categories: string[];
  timing_schedule: string;
  evidence_level: string;
  citation_count: number;
  dosage_amount: number;
  dosage_unit: string;
  dosage_form: string;
  price_per_month: number;
  product_type: string;
  safe_for: string[];
  in_stock: boolean;
};

type Filters = {
  benefits: FilterOption[];
  productType: FilterOption[];
  safeFor: FilterOption[];
};

function formatTag(tag: string) {
  return tag
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .replace(/ And /g, " & ");
}

const durationOptions = [
  { label: "1 Day", multiplier: 1 / 30 },
  { label: "2 Weeks", multiplier: 14 / 30 },
  { label: "1 Month", multiplier: 1 },
  { label: "Monthly Subscription", multiplier: 1 },
];

function ProductCard({ product }: { product: Product }) {
  const [duration, setDuration] = useState("1 Month");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { addItem, items } = useCartStore();
  const isInCart = items.some((i) => i.productId === product.product_id);
  const multiplier = durationOptions.find((d) => d.label === duration)?.multiplier || 1;
  const price = (product.price_per_month * multiplier).toFixed(2);
  const displayPrice = parseFloat(price) % 1 === 0 ? parseInt(price).toString() : price;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 flex flex-col hover:border-primary/30 hover:shadow-sm transition-all">
      {/* Badge row */}
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-block rounded-full bg-primary-fixed px-2.5 py-0.5 text-xs font-headline font-bold text-on-primary-fixed">
          {product.timing_schedule}
        </span>
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-headline font-bold ${
          product.evidence_level === 'A'
            ? 'bg-primary/10 text-primary'
            : 'bg-surface-container-high text-on-surface-variant'
        }`}>
          Evidence: {product.evidence_level}
        </span>
        {product.in_stock === false && (
          <span className="inline-block rounded-full bg-error/10 px-2.5 py-0.5 text-xs font-headline font-bold text-error">
            Out of stock
          </span>
        )}
      </div>

      {/* Name & description */}
      <Link href={`/shop/${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`} className="hover:text-primary transition-colors">
        <h3 className="font-headline font-bold text-lg text-on-surface mb-2">{product.name}</h3>
      </Link>
      <p className="text-sm text-on-surface-variant font-body mb-4 line-clamp-2 flex-1">
        {product.description}
      </p>

      {/* Dosage */}
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary text-lg">medication</span>
        <span className="text-sm text-on-surface-variant">
          {product.dosage_amount} {product.dosage_unit} / day
        </span>
      </div>

      {/* Duration selector */}
      <div className="mb-4 relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center justify-between rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          {duration}
          <span className={`material-symbols-outlined text-lg text-on-surface-variant transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
        </button>
        {dropdownOpen && (
          <div className="absolute left-0 right-0 z-10 rounded-lg bg-white border border-outline-variant shadow-lg py-1"
            style={{ bottom: '50%', transform: 'translateY(50%)' }}
          >
            {durationOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => { setDuration(opt.label); setDropdownOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm font-body transition-colors ${
                  duration === opt.label
                    ? 'text-primary font-semibold bg-primary-fixed/30'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price & CTA */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant">
        <div>
          <span className="font-headline font-extrabold text-xl text-on-surface">
            ${displayPrice}
          </span>
        </div>
        {isInCart || added ? (
          <Link
            href="/cart"
            className="flex items-center justify-center gap-1 h-9 px-5 rounded-lg border border-primary text-primary font-headline font-bold text-sm hover:bg-primary-fixed/20 transition-all"
          >
            <span className="material-symbols-outlined text-sm">check</span>
            In Stack
          </Link>
        ) : (
          <button
            disabled={product.in_stock === false}
            onClick={() => {
              addItem({
                productId: product.product_id,
                name: product.name,
                pricePerMonth: product.price_per_month,
                duration,
                durationMultiplier: multiplier,
                dosageAmount: product.dosage_amount,
                dosageUnit: product.dosage_unit,
                timingSchedule: product.timing_schedule,
              });
              setAdded(true);
            }}
            className="vitality-gradient text-on-primary h-9 px-5 rounded-lg font-headline font-bold text-sm hover:opacity-90 transition-all disabled:opacity-40"
          >
            Add to Stack
          </button>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filters>({ benefits: [], productType: [], safeFor: [] });
  const safeBenefits = filters.benefits || [];
  const safeProductType = filters.productType || [];
  const safeSafeFor = filters.safeFor || [];
  const [loading, setLoading] = useState(true);

  // Selected filters
  const [selectedBenefits, setSelectedBenefits] = useState<Set<string>>(new Set());
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [selectedSafeFor, setSelectedSafeFor] = useState<Set<string>>(new Set());
  const [selectedEvidence, setSelectedEvidence] = useState<Set<string>>(new Set());
  const [inStockOnly, setInStockOnly] = useState(false);

  // Benefits search
  const [benefitsSearch, setBenefitsSearch] = useState("");

  // Collapsible filter sections
  const [benefitsOpen, setBenefitsOpen] = useState(false);
  const [typesOpen, setTypesOpen] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [safeForOpen, setSafeForOpen] = useState(false);

  // Mobile filter drawer
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    fetch("/api/shop")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setFilters(data.filters || { benefits: [], productType: [], safeFor: [] });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleFilter = (set: Set<string>, value: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  // Filter products
  const filtered = products.filter((p) => {
    if (inStockOnly && p.in_stock === false) return false;

    if (selectedBenefits.size > 0) {
      if (![...selectedBenefits].some((b) => (p.benefit_categories || []).includes(b))) return false;
    }

    if (selectedTypes.size > 0) {
      if (!selectedTypes.has(p.product_type || "Individual Supplements")) return false;
    }

    if (selectedEvidence.size > 0) {
      if (!selectedEvidence.has(p.evidence_level)) return false;
    }

    if (selectedSafeFor.size > 0) {
      if (![...selectedSafeFor].some((s) => (p.safe_for || []).includes(s))) return false;
    }

    return true;
  });

  const activeFilterCount = selectedBenefits.size + selectedTypes.size + selectedEvidence.size + selectedSafeFor.size + (inStockOnly ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedBenefits(new Set());
    setSelectedTypes(new Set());
    setSelectedEvidence(new Set());
    setSelectedSafeFor(new Set());
    setInStockOnly(false);
  };

  const filterSidebar = (
    <div className="space-y-6">
      {/* Benefits */}
      <div className="border-b border-outline-variant pb-6">
        <button
          onClick={() => setBenefitsOpen(!benefitsOpen)}
          className="flex items-center justify-between w-full"
        >
          <h3 className="font-headline font-bold text-base text-on-surface">Benefits</h3>
          <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-primary text-on-primary transition-transform ${benefitsOpen ? '' : 'rotate-180'}`}>
            <span className="material-symbols-outlined text-lg">expand_less</span>
          </span>
        </button>
        {benefitsOpen && (
          <div className="mt-4 space-y-3">
            <div className="relative">
              <span className="material-symbols-outlined text-lg text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2">search</span>
              <input
                type="text"
                placeholder="Search benefits..."
                value={benefitsSearch}
                onChange={(e) => setBenefitsSearch(e.target.value)}
                className="w-full rounded-lg border border-outline-variant bg-surface pl-9 pr-3 py-2 text-sm font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="space-y-2.5 max-h-64 overflow-y-auto">
            {safeBenefits.filter((opt) => opt.label.toLowerCase().includes(benefitsSearch.toLowerCase())).map((opt) => (
              <label key={opt.label} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedBenefits.has(opt.label)}
                  onChange={() => toggleFilter(selectedBenefits, opt.label, setSelectedBenefits)}
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/40 accent-primary"
                />
                <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                  {opt.label} ({opt.count})
                </span>
              </label>
            ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Type */}
      <div className="border-b border-outline-variant pb-6">
        <button
          onClick={() => setTypesOpen(!typesOpen)}
          className="flex items-center justify-between w-full"
        >
          <h3 className="font-headline font-bold text-base text-on-surface">Product Type</h3>
          <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-primary text-on-primary transition-transform ${typesOpen ? '' : 'rotate-180'}`}>
            <span className="material-symbols-outlined text-lg">expand_less</span>
          </span>
        </button>
        {typesOpen && (
          <div className="mt-4 space-y-2.5">
            {safeProductType.map((opt) => (
              <label key={opt.label} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedTypes.has(opt.label)}
                  onChange={() => toggleFilter(selectedTypes, opt.label, setSelectedTypes)}
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/40 accent-primary"
                />
                <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                  {opt.label} ({opt.count})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Evidence */}
      <div className="border-b border-outline-variant pb-6">
        <button
          onClick={() => setEvidenceOpen(!evidenceOpen)}
          className="flex items-center justify-between w-full"
        >
          <h3 className="font-headline font-bold text-base text-on-surface">Evidence</h3>
          <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-primary text-on-primary transition-transform ${evidenceOpen ? '' : 'rotate-180'}`}>
            <span className="material-symbols-outlined text-lg">expand_less</span>
          </span>
        </button>
        {evidenceOpen && (
          <div className="mt-4 space-y-2.5">
            {[
              { key: "A", label: "A — Strong" },
              { key: "B", label: "B — Moderate" },
              { key: "C", label: "C — Emerging" },
            ].map((opt) => (
              <label key={opt.key} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedEvidence.has(opt.key)}
                  onChange={() => toggleFilter(selectedEvidence, opt.key, setSelectedEvidence)}
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/40 accent-primary"
                />
                <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Safe For */}
      {safeSafeFor.length > 0 && (
        <div className="border-b border-outline-variant pb-6">
          <button
            onClick={() => setSafeForOpen(!safeForOpen)}
            className="flex items-center justify-between w-full"
          >
            <h3 className="font-headline font-bold text-base text-on-surface">Safe for</h3>
            <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-primary text-on-primary transition-transform ${safeForOpen ? '' : 'rotate-180'}`}>
              <span className="material-symbols-outlined text-lg">expand_less</span>
            </span>
          </button>
          {safeForOpen && (
            <div className="mt-4 space-y-2.5">
              {safeSafeFor.map((opt) => (
                <label key={opt.label} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedSafeFor.has(opt.label)}
                    onChange={() => toggleFilter(selectedSafeFor, opt.label, setSelectedSafeFor)}
                    className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/40 accent-primary"
                  />
                  <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                    {opt.label} ({opt.count})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* In Stock Only */}
      <div className="border-b border-outline-variant pb-6">
        <div className="flex items-center justify-between">
          <h3 className="font-headline font-bold text-base text-on-surface">In Stock</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={() => setInStockOnly(!inStockOnly)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-surface-container-high rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="max-w-screen-lg mx-auto px-4 sm:px-8 py-12">
        {loading && (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="h-12 w-12 rounded-full border-4 border-primary-fixed border-t-primary animate-spin" style={{ animationDuration: "1.5s" }} />
          </div>
        )}

        {!loading && <>
        {/* Header */}
        <header className="mb-10">
          <h1 className="font-headline font-extrabold text-5xl tracking-tight text-on-surface mb-2">
            Shop
          </h1>
          <p className="text-lg text-on-surface-variant font-body">
            Browse our full range of evidence-based supplements.
          </p>
        </header>

        {/* Mobile filter bar — sticky below navbar */}
        <div className="md:hidden sticky top-[72px] z-40 -mx-4 sm:-mx-8 px-4 sm:px-8 py-3 bg-white/80 backdrop-blur-xl border-b border-outline-variant mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-outline-variant font-headline font-semibold text-sm text-on-surface hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-lg">tune</span>
              Filters
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-on-primary text-xs font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <p className="text-sm text-on-surface-variant font-body">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Mobile filter drawer */}
        {mobileFiltersOpen && (
          <div className="md:hidden mb-6 bg-surface-container-lowest rounded-2xl border border-outline-variant p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline font-bold text-lg text-on-surface">Filters</h2>
              {activeFilterCount > 0 && (
                <button onClick={clearAllFilters} className="text-sm text-primary font-semibold">
                  Clear all
                </button>
              )}
            </div>
            {filterSidebar}
          </div>
        )}

        <div className="flex gap-8 lg:gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-56 lg:w-64 flex-shrink-0">
            <div className="sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline font-bold text-lg text-on-surface">Filters</h2>
                {activeFilterCount > 0 && (
                  <button onClick={clearAllFilters} className="text-sm text-primary font-semibold">
                    Clear all
                  </button>
                )}
              </div>
              {filterSidebar}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-on-surface-variant font-body">
                {loading ? "Loading..." : `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 min-h-[60vh]">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">search_off</span>
                <p className="text-on-surface-variant font-headline font-semibold">No products match your filters.</p>
                <button onClick={clearAllFilters} className="mt-4 text-primary font-semibold text-sm">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
        </>}
      </main>
      <Footer />
    </>
  );
}
