import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="py-14 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest">
      <div className="max-w-5xl mx-auto text-center bg-surface-container rounded-2xl sm:rounded-[2rem] p-8 sm:p-12 md:p-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary-fixed/30 blur-[100px] rounded-full" />
        <div className="relative z-10">
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface mb-6 sm:mb-8 tracking-tighter">
            Ready to architect your biological peak?
          </h2>
          <p className="text-on-surface-variant text-base sm:text-lg mb-8 sm:mb-12 max-w-2xl mx-auto">
            Join a community of high-performers who treat their longevity as a
            strategic asset.
          </p>
          <Link
            href="/assessment"
            className="vitality-gradient text-on-primary px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-headline font-bold text-lg sm:text-xl shadow-xl hover:scale-[1.02] transition-all inline-flex items-center justify-center min-h-[44px]"
          >
            Start Your Assessment Now
          </Link>
          <p className="mt-6 sm:mt-8 text-sm font-body text-outline font-medium tracking-widest uppercase">
            Clinical Privacy Guaranteed
          </p>
        </div>
      </div>
    </section>
  );
}
