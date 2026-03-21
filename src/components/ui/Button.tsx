'use client';

import Link from 'next/link';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  icon?: string;
}

const variantStyles: Record<string, string> = {
  primary: 'vitality-gradient text-on-primary font-headline font-bold rounded-lg',
  secondary: 'bg-surface-container-high text-primary font-headline font-bold rounded-lg',
  tertiary: 'text-primary underline',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3',
  lg: 'px-8 py-4 text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  onClick,
  href,
  icon,
}: ButtonProps) {
  const classes = [
    'inline-flex items-center justify-center gap-2 transition-all active:scale-95',
    variantStyles[variant],
    sizeStyles[size],
    variant === 'primary' ? 'hover:opacity-90' : '',
    variant === 'secondary' ? 'hover:bg-surface-container' : '',
    variant === 'tertiary' ? 'hover:opacity-70' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {icon && (
        <span className="material-symbols-outlined text-[1.2em]">{icon}</span>
      )}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      {content}
    </button>
  );
}
