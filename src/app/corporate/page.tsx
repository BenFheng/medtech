"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const tiers = [
  {
    name: "Starter",
    employees: "10-50",
    price: "$29",
    features: ["Assessment for all employees", "Pre-built stack bundles", "Monthly delivery", "Basic analytics dashboard"],
  },
  {
    name: "Growth",
    employees: "51-250",
    price: "$24",
    popular: true,
    features: ["Everything in Starter", "Custom stack personalization", "Quarterly wellness reports", "Dedicated account manager", "Bulk discount pricing"],
  },
  {
    name: "Enterprise",
    employees: "250+",
    price: "Custom",
    features: ["Everything in Growth", "On-site wellness workshops", "Wearable data integration", "Custom formulation options", "Priority support", "Executive health assessments"],
  },
];

export default function CorporatePage() {
  const [form, setForm] = useState({ company: "", name: "", email: "", employees: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-primary py-24">
          <div className="max-w-screen-lg mx-auto px-4 sm:px-8 text-center">
            <span className="text-xs font-bold tracking-widest text-primary-fixed uppercase">Corporate Wellness</span>
            <h1 className="font-headline font-extrabold text-5xl md:text-6xl text-on-primary mt-4 tracking-tight">
              Elevate Your Team&apos;s Performance
            </h1>
            <p className="text-on-primary-container text-lg mt-6 max-w-2xl mx-auto leading-relaxed opacity-90">
              Personalized supplement protocols for every employee. Reduce burnout, boost cognitive output,
              and invest in your team&apos;s cellular health.
            </p>
          </div>
        </section>

        {/* Value Props */}
        <section className="max-w-screen-lg mx-auto px-4 sm:px-8 py-24">
          <h2 className="font-headline font-bold text-3xl text-on-surface mb-12 text-center">
            Why HR Leaders Choose Vanguard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "trending_up", title: "Boost Productivity", desc: "Employees on cognitive stacks report 23% improvement in sustained focus and afternoon energy levels." },
              { icon: "favorite", title: "Reduce Sick Days", desc: "Foundation supplement stacks support immune function, reducing average sick days by 15%." },
              { icon: "groups", title: "Attract Top Talent", desc: "Comprehensive wellness benefits are the #2 factor in employee retention for high-performers." },
            ].map((prop) => (
              <div key={prop.title} className="bg-surface-container-lowest rounded-xl p-8">
                <span className="material-symbols-outlined text-primary text-3xl">{prop.icon}</span>
                <h3 className="font-headline font-bold text-xl text-on-surface mt-4">{prop.title}</h3>
                <p className="text-sm text-on-surface-variant mt-3 leading-relaxed">{prop.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="bg-surface-container-low py-24">
          <div className="max-w-screen-lg mx-auto px-4 sm:px-8">
            <h2 className="font-headline font-bold text-3xl text-on-surface mb-12 text-center">
              Corporate Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tiers.map((tier) => (
                <div key={tier.name} className={`rounded-xl p-8 ${
                  tier.popular
                    ? "bg-primary text-on-primary ring-4 ring-primary/20 scale-105"
                    : "bg-surface-container-lowest"
                }`}>
                  {tier.popular && (
                    <span className="text-[10px] font-bold bg-on-primary/20 text-on-primary px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <h3 className={`font-headline font-bold text-2xl mt-4 ${tier.popular ? "text-on-primary" : "text-on-surface"}`}>
                    {tier.name}
                  </h3>
                  <p className={`text-sm mt-1 ${tier.popular ? "text-on-primary-container" : "text-on-surface-variant"}`}>
                    {tier.employees} employees
                  </p>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className={`text-3xl font-black ${tier.popular ? "text-on-primary" : "text-primary"}`}>
                      {tier.price}
                    </span>
                    {tier.price !== "Custom" && <span className={`text-sm ${tier.popular ? "text-on-primary/70" : "text-on-surface-variant"}`}>/employee/mo</span>}
                  </div>
                  <ul className="mt-6 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className={`flex items-start gap-2 text-sm ${tier.popular ? "text-on-primary-container" : "text-on-surface-variant"}`}>
                        <span className={`material-symbols-outlined text-base mt-0.5 ${tier.popular ? "text-on-primary" : "text-primary"}`}>check</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies Placeholder */}
        <section className="max-w-screen-lg mx-auto px-4 sm:px-8 py-24">
          <h2 className="font-headline font-bold text-3xl text-on-surface mb-12 text-center">
            Case Studies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { company: "TechCorp Asia", result: "32% reduction in afternoon productivity dip across 200 employees", industry: "Technology" },
              { company: "Summit Capital", result: "Executive team reported 40% improvement in sleep quality scores", industry: "Finance" },
            ].map((study) => (
              <div key={study.company} className="bg-surface-container-lowest rounded-xl p-8">
                <span className="text-xs font-bold text-primary uppercase">{study.industry}</span>
                <h3 className="font-headline font-bold text-xl text-on-surface mt-2">{study.company}</h3>
                <p className="text-sm text-on-surface-variant mt-3 leading-relaxed">&ldquo;{study.result}&rdquo;</p>
                <button className="text-primary font-bold text-sm mt-4 flex items-center gap-1">
                  Read Full Case Study <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Demo Request Form */}
        <section className="bg-surface-container-low py-24">
          <div className="max-w-screen-lg mx-auto px-4 sm:px-8">
            <h2 className="font-headline font-bold text-3xl text-on-surface mb-8 text-center">
              Request a Demo
            </h2>
            {submitted ? (
              <div className="bg-primary-fixed/20 rounded-xl p-8 text-center">
                <span className="material-symbols-outlined text-primary text-4xl mb-3">check_circle</span>
                <h3 className="font-headline font-bold text-lg text-on-surface">Request Received</h3>
                <p className="text-sm text-on-surface-variant mt-2">Our corporate team will contact you within 1 business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-xl p-8 space-y-4">
                <input type="text" placeholder="Company name" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-surface-container text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <input type="text" placeholder="Your name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-surface-container text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <input type="email" placeholder="Work email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-surface-container text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <select value={form.employees} onChange={(e) => setForm({ ...form, employees: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-surface-container text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">Number of employees</option>
                  <option value="10-50">10-50</option>
                  <option value="51-250">51-250</option>
                  <option value="250+">250+</option>
                </select>
                <textarea placeholder="Tell us about your wellness goals" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-surface-container text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                <button type="submit" className="w-full vitality-gradient text-on-primary font-headline font-bold py-3 rounded-lg transition-all active:scale-95">
                  Request Demo
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
