interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'highlighted';
  padding?: 'sm' | 'md' | 'lg';
}

const variantStyles: Record<string, string> = {
  default: 'bg-surface-container-lowest rounded-xl',
  elevated: 'bg-surface-container-low rounded-xl hover:bg-surface-container transition',
  highlighted: 'bg-primary text-on-primary rounded-xl',
};

const paddingStyles: Record<string, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
}: CardProps) {
  return (
    <div
      className={`${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
