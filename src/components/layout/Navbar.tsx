'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Show, SignInButton, SignUpButton, useUser } from '@clerk/nextjs';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Our Science', href: '/science' },
  { label: 'Protocols', href: '/protocols' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/');
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="font-headline font-black tracking-tighter text-2xl text-on-surface">
          MEDTECH
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setActiveLink(link.href)}
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
              {user?.firstName ? `${user.firstName}'s Protocol` : "My Protocol"}
            </Link>
            <Link
              href="/account"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-container-high text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-colors"
              aria-label="Account"
            >
              <span className="material-symbols-outlined text-xl">person</span>
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
                    setActiveLink(link.href);
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
                {user?.firstName ? `${user.firstName}'s Protocol` : "My Protocol"}
              </Link>
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg bg-surface-container-high px-6 py-3 text-center font-headline font-bold text-on-surface text-sm transition-all active:scale-95"
              >
                Account
              </Link>
            </Show>
          </div>
        </div>
      )}
    </header>
  );
}
