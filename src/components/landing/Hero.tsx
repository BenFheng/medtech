import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-surface-container-lowest overflow-hidden min-h-[870px] flex items-center">
      <div className="max-w-screen-lg mx-auto px-4 sm:px-8 py-20 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="max-w-2xl">
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface leading-[1.1] mb-6">
            Doctor-Formulated,{" "}
            <span className="vitality-gradient-text">
              Data-Driven Performance Stacks.
            </span>
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
            We bridge the gap between clinical research and daily peak
            performance. Precision bio-optimization for those who demand more
            from their biology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/assessment"
              className="vitality-gradient text-on-primary px-8 py-4 rounded-xl font-headline font-bold text-lg shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 group"
            >
              Start Your Assessment
              <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
            <Link
              href="/protocols"
              className="bg-surface-container-high text-primary px-8 py-4 rounded-xl font-headline font-bold text-lg hover:bg-surface-container-highest transition-colors text-center"
            >
              Explore Protocols
            </Link>
          </div>
        </div>
        <div className="relative hidden md:block">
          <div className="absolute -inset-4 bg-primary-fixed/20 blur-3xl rounded-full" />
          <div className="relative z-10 w-full aspect-square rounded-full bg-gradient-to-br from-primary/20 via-primary-fixed/30 to-secondary-fixed/40 flex items-center justify-center border-8 border-surface-container-lowest shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary-fixed/20" />
            <div className="relative text-center p-12">
              <span className="material-symbols-outlined text-primary text-8xl mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>
                biotech
              </span>
              <p className="text-primary font-headline font-bold text-xl tracking-tight">
                Cellular Optimization
              </p>
              <p className="text-on-surface-variant text-sm mt-2">
                Precision-engineered for your biology
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
