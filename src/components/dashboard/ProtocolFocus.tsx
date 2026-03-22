"use client";

import { motion } from "framer-motion";
import type { FocusMetric } from "@/lib/types";

interface ProtocolFocusProps {
  metrics: FocusMetric[];
  warnings: string[];
}

export default function ProtocolFocus({ metrics, warnings }: ProtocolFocusProps) {
  return (
    <section className="bg-white rounded-xl p-4">
      <h3 className="text-xl font-headline font-bold mb-6 text-on-surface">
        Protocol Focus
      </h3>
      <div className="space-y-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-on-surface font-body">
                {metric.label}
              </span>
              <span className="text-xs font-bold text-primary">
                {metric.value}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              />
            </div>
          </div>
        ))}
      </div>
      {warnings.length > 0 && (
        <div className="mt-8 pt-8 border-t border-surface-container">
          {warnings.map((warning, i) => (
            <div key={i} className="flex items-start gap-3 mb-3">
              <span className="material-symbols-outlined text-tertiary text-lg mt-0.5">
                warning
              </span>
              <p className="text-xs text-on-surface-variant">{warning}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
