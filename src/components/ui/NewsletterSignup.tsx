"use client";

export default function NewsletterSignup({ compact }: { compact?: boolean }) {
  return (
    <form className={`flex gap-3 ${compact ? "max-w-sm" : "max-w-md"} mx-auto`} onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        placeholder="Enter your email"
        className={`flex-1 px-4 ${compact ? "py-2.5" : "py-3"} rounded-lg bg-surface-container text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30`}
      />
      <button type="submit" className={`vitality-gradient text-on-primary font-headline font-bold ${compact ? "px-5 py-2.5 text-sm" : "px-6 py-3"} rounded-lg transition-all active:scale-95`}>
        Subscribe
      </button>
    </form>
  );
}
