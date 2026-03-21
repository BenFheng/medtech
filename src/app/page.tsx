import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import ValueProps from "@/components/landing/ValueProps";
import CtaSection from "@/components/landing/CtaSection";

export default function HomePage() {
  return (
    <>
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
