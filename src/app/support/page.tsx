"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const faqs = [
  {
    q: "How are supplements selected for my protocol?",
    a: "Our algorithm scores each supplement based on your assessment profile, checks for interactions with your current medications, and assembles an optimized stack. Every recommendation is validated against clinical guidelines.",
  },
  {
    q: "Can I modify my stack after subscribing?",
    a: "Yes. Visit your Dashboard and use the Swap button on any supplement card to explore alternatives. Changes take effect on your next delivery cycle.",
  },
  {
    q: "How is shipping handled?",
    a: "We ship monthly from our fulfillment center. Standard shipping is free for all subscriptions. You'll receive tracking information via email when your order ships.",
  },
  {
    q: "Can I pause or cancel my subscription?",
    a: "Absolutely. Go to Dashboard > Order & Subscription tab and click Pause or reach out to support. There are no cancellation fees.",
  },
  {
    q: "Are there any drug interactions I should know about?",
    a: "Our algorithm screens for major drug interactions during assessment. However, always consult your physician before starting any supplement regimen, especially if you take prescription medications.",
  },
  {
    q: "What's your return policy?",
    a: "We offer a 30-day money-back guarantee. If you're not satisfied with your protocol, contact support for a full refund.",
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main className="max-w-screen-lg mx-auto px-4 sm:px-8 py-24">
        <h1 className="font-headline font-extrabold text-4xl text-on-surface mb-2">Support</h1>
        <p className="text-on-surface-variant mb-12">Find answers or reach out to our team.</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* FAQ */}
          <div className="lg:col-span-7">
            <h2 className="font-headline font-bold text-2xl text-on-surface mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-surface-container-lowest rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left p-6 flex items-center justify-between"
                  >
                    <span className="font-headline font-bold text-sm text-on-surface pr-4">{faq.q}</span>
                    <span className={`material-symbols-outlined text-primary transition-transform ${openFaq === i ? "rotate-180" : ""}`}>
                      expand_more
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6">
                      <p className="text-sm text-on-surface-variant leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-5">
            <h2 className="font-headline font-bold text-2xl text-on-surface mb-6">Contact Us</h2>
            {submitted ? (
              <div className="bg-primary-fixed/20 rounded-xl p-8 text-center">
                <span className="material-symbols-outlined text-primary text-4xl mb-3">check_circle</span>
                <h3 className="font-headline font-bold text-lg text-on-surface">Message Sent</h3>
                <p className="text-sm text-on-surface-variant mt-2">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-xl p-8 space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-surface-container text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-surface-container text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <textarea
                  placeholder="How can we help?"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-surface-container text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
                <button
                  type="submit"
                  className="w-full vitality-gradient text-on-primary font-headline font-bold py-3 rounded-lg transition-all active:scale-95"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
