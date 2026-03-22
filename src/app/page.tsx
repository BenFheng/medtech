import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import ValueProps from "@/components/landing/ValueProps";
import CtaSection from "@/components/landing/CtaSection";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  openGraph: {
    title: "Vanguard | Cellular Optimization Defined",
    description:
      "Doctor-formulated, data-driven supplement stacks for high-performing professionals.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <Navbar />
      <main>
        <Hero />
        <ValueProps />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
