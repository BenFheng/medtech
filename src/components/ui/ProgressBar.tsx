'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  label: string;
  value: number;
  className?: string;
}

export default function ProgressBar({ label, value, className = '' }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="font-body text-sm font-medium text-on-surface">
          {label}
        </span>
        <span className="font-body text-sm font-medium text-on-surface-variant">
          {clampedValue}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-container">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
