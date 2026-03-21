interface SubscriptionCtaProps {
  totalPrice: number;
}

export default function SubscriptionCta({ totalPrice }: SubscriptionCtaProps) {
  return (
    <section className="vitality-gradient rounded-xl p-8 text-white relative overflow-hidden">
      <div className="relative z-10">
        <h3 className="text-2xl font-headline font-bold mb-2">
          Ready to ship?
        </h3>
        <p className="text-on-primary-container text-sm mb-8">
          Confirm your custom stack and begin your clinical-grade journey.
        </p>
        <div className="mb-8">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black font-headline">
              ${totalPrice}
            </span>
            <span className="text-lg font-medium opacity-80">/mo</span>
          </div>
          <p className="text-[10px] uppercase font-bold tracking-widest opacity-60 mt-1">
            Full Clinical Access
          </p>
        </div>
        <button className="w-full bg-primary-fixed text-on-primary-fixed font-headline font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:brightness-105 transition-all shadow-xl active:scale-95">
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
