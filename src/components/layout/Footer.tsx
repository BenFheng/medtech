import Link from 'next/link';

const scienceLinks = [
  { label: 'Methodology', href: '/science/methodology' },
  { label: 'Clinical Studies', href: '/science/studies' },
  { label: 'Whitepapers', href: '/science/whitepapers' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/legal/privacy' },
  { label: 'Terms of Service', href: '/legal/terms' },
  { label: 'Medical Disclaimer', href: '/legal/disclaimer' },
];

const connectLinks = [
  { label: 'Twitter', href: 'https://twitter.com' },
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Contact Support', href: '/support' },
];

export default function Footer() {
  return (
    <footer className="bg-surface-container">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="font-headline font-black tracking-tighter text-2xl text-on-surface">
              MEDTECH
            </Link>
            <p className="mt-4 font-body text-sm leading-relaxed text-on-surface-variant">
              Precision supplements engineered from clinical evidence. Your biology, optimized.
            </p>
          </div>

          {/* Science */}
          <div>
            <h3 className="font-headline font-bold text-sm uppercase tracking-wide text-on-surface">
              Science
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {scienceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-on-surface-variant transition-colors hover:text-primary inline-block py-1 min-h-[44px] flex items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-headline font-bold text-sm uppercase tracking-wide text-on-surface">
              Legal
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-on-surface-variant transition-colors hover:text-primary inline-block py-1 min-h-[44px] flex items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-headline font-bold text-sm uppercase tracking-wide text-on-surface">
              Connect
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {connectLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-on-surface-variant transition-colors hover:text-primary inline-block py-1 min-h-[44px] flex items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 sm:mt-16 pt-6 sm:pt-8">
          <p className="font-body text-xs text-on-surface-variant">
            &copy; {new Date().getFullYear()} MedTech Health Sciences. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
