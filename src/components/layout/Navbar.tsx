'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Show, SignInButton, SignUpButton, useUser } from '@clerk/nextjs';
import { useCartStore } from '@/stores/cart';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Our Science', href: '/science' },
  { label: 'Protocols', href: '/protocols' },
];

const benefitCategories = [
  { label: 'Cognitive', href: '/shop?benefit=cognitive' },
  { label: 'Sleep & Stress', href: '/shop?benefit=sleep-stress' },
  { label: 'Longevity', href: '/shop?benefit=longevity' },
  { label: 'Skin Radiance', href: '/shop?benefit=skin-radiance' },
  { label: 'Foundation', href: '/shop?benefit=foundation' },
  { label: 'Performance', href: '/shop?benefit=performance' },
];

export default function Navbar() {
  const { user } = useUser();
  const cartCount = useCartStore((s) => s.items.length);
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeLink = pathname;
  const [shopOpen, setShopOpen] = useState(false);
  const [benefitsHover, setBenefitsHover] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [mobileBenefitsOpen, setMobileBenefitsOpen] = useState(false);
  const shopRef = useRef<HTMLLIElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) {
        setShopOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl">
      <nav className="max-w-screen-lg mx-auto flex items-center justify-between px-4 sm:px-8 py-4">
        {/* Logo */}
        <Link href="/" className="font-headline font-black tracking-tighter text-2xl text-on-surface">
          VANGUARD
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                                className={`font-headline font-semibold text-sm tracking-tight transition-colors ${
                  activeLink === link.href
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Shop with dropdown */}
          <li ref={shopRef} className="relative">
            <div className="flex items-center">
              <Link
                href="/shop"
                onClick={() => { setShopOpen(false); }}
                className={`font-headline font-semibold text-sm tracking-tight transition-colors ${
                  activeLink.startsWith('/shop')
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Shop
              </Link>
              <button
                onClick={() => setShopOpen(!shopOpen)}
                className="text-on-surface-variant hover:text-primary transition-colors flex items-center"
                aria-label="Shop menu"
              >
                <span className={`material-symbols-outlined text-lg leading-none transition-transform ${shopOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
            </div>

            {shopOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 rounded-xl bg-white border border-outline-variant shadow-lg py-2 z-50">
                <Link
                  href="/shop?sort=bestsellers"
                  onClick={() => { setShopOpen(false); }}
                  className="block px-4 py-2.5 font-headline font-semibold text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
                >
                  Bestsellers
                </Link>

                {/* By Benefits with submenu */}
                <div
                  className="relative"
                  onMouseEnter={() => setBenefitsHover(true)}
                  onMouseLeave={() => setBenefitsHover(false)}
                >
                  <button className="flex items-center justify-between w-full px-4 py-2.5 font-headline font-semibold text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">
                    By Benefits
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                  </button>
                  {benefitsHover && (
                    <div className="absolute left-full top-0 ml-1 w-48 rounded-xl bg-white border border-outline-variant shadow-lg py-2 z-50">
                      {benefitCategories.map((cat) => (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          onClick={() => { setShopOpen(false); setBenefitsHover(false); }}
                          className="block px-4 py-2.5 font-headline font-semibold text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
                        >
                          {cat.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href="/shop"
                  onClick={() => { setShopOpen(false); }}
                  className="block px-4 py-2.5 font-headline font-semibold text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
                >
                  Shop All
                </Link>
              </div>
            )}
          </li>
        </ul>

        {/* Desktop Auth & CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-primary font-headline font-semibold text-sm hover:text-primary-container transition-colors">
                Sign In
              </button>
            </SignInButton>
            <Link
              href="/assessment"
              className="rounded-lg vitality-gradient px-6 py-2.5 font-headline font-bold text-on-primary text-sm transition-all active:scale-95"
            >
              Start Assessment
            </Link>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="text-primary font-headline font-semibold text-sm hover:text-primary-container transition-colors"
            >
              {user?.firstName ? `${user.firstName}\u2019s Protocol` : "My Protocol"}
            </Link>
            <Link href="/cart" className="relative flex items-center justify-center w-9 h-9 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-2xl">local_mall</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-on-primary text-[10px] font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link href="/account" className="rounded-full overflow-hidden w-9 h-9 flex-shrink-0">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="Account" width={36} height={36} className="rounded-full" />
              ) : (
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-container-high text-on-surface-variant">
                  <span className="material-symbols-outlined text-xl">person</span>
                </span>
              )}
            </Link>
          </Show>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-on-surface-variant transition-colors hover:text-primary md:hidden"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-2xl">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="bg-surface-container-lowest px-6 pb-6 md:hidden">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => {
                    setMobileMenuOpen(false);
                  }}
                  className={`block font-headline font-semibold text-sm tracking-tight transition-colors ${
                    activeLink === link.href
                      ? 'text-primary'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Mobile Shop with expandable sub-items */}
            <li>
              <button
                onClick={() => setMobileShopOpen(!mobileShopOpen)}
                className={`flex items-center gap-1 font-headline font-semibold text-sm tracking-tight transition-colors ${
                  activeLink.startsWith('/shop') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Shop
                <span className={`material-symbols-outlined text-lg transition-transform ${mobileShopOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              {mobileShopOpen && (
                <ul className="ml-4 mt-2 flex flex-col gap-2">
                  <li>
                    <Link
                      href="/shop?sort=bestsellers"
                      onClick={() => { setMobileMenuOpen(false); }}
                      className="block font-headline font-semibold text-sm text-on-surface-variant hover:text-primary transition-colors"
                    >
                      Bestsellers
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => setMobileBenefitsOpen(!mobileBenefitsOpen)}
                      className="flex items-center gap-1 font-headline font-semibold text-sm text-on-surface-variant hover:text-primary transition-colors"
                    >
                      By Benefits
                      <span className={`material-symbols-outlined text-lg transition-transform ${mobileBenefitsOpen ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </button>
                    {mobileBenefitsOpen && (
                      <ul className="ml-4 mt-1 flex flex-col gap-1.5">
                        {benefitCategories.map((cat) => (
                          <li key={cat.href}>
                            <Link
                              href={cat.href}
                              onClick={() => { setMobileMenuOpen(false); }}
                              className="block font-headline font-semibold text-sm text-on-surface-variant hover:text-primary transition-colors"
                            >
                              {cat.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                  <li>
                    <Link
                      href="/shop"
                      onClick={() => { setMobileMenuOpen(false); }}
                      className="block font-headline font-semibold text-sm text-on-surface-variant hover:text-primary transition-colors"
                    >
                      Shop All
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>

          <div className="mt-6 flex flex-col gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="w-full rounded-lg bg-surface-container-high px-6 py-3 text-center font-headline font-bold text-primary text-sm transition-all active:scale-95">
                  Sign In
                </button>
              </SignInButton>
              <Link
                href="/assessment"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg vitality-gradient px-6 py-3 text-center font-headline font-bold text-on-primary text-sm transition-all active:scale-95"
              >
                Start Assessment
              </Link>
            </Show>
            <Show when="signed-in">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg vitality-gradient px-6 py-3 text-center font-headline font-bold text-on-primary text-sm transition-all active:scale-95"
              >
                {user?.firstName ? `${user.firstName}\u2019s Protocol` : "My Protocol"}
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg bg-surface-container-low px-6 py-3 text-center font-headline font-bold text-on-surface text-sm transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">local_mall</span>
                Cart
              </Link>
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg bg-surface-container-low px-6 py-3 text-center font-headline font-bold text-on-surface text-sm transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">person</span>
                Account
              </Link>
            </Show>
          </div>
        </div>
      )}
    </header>
  );
}
