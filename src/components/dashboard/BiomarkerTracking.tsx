"use client";

import { useState, useRef, useEffect } from "react";

interface MetricEntry {
  type: string;
  value: number;
  date: string;
}

const metricConfig = [
  { type: "mood", label: "Mood", unit: "/10", icon: "mood", min: 0, max: 10, defaultValue: 5 },
  { type: "energy", label: "Energy Level", unit: "/10", icon: "bolt", min: 0, max: 10, defaultValue: 5 },
  { type: "sleep", label: "Sleep Hours", unit: "hrs", icon: "bedtime", min: 0, max: 14, defaultValue: 8 },
  { type: "skin_quality", label: "Skin Quality", unit: "/10", icon: "face", min: 0, max: 10, defaultValue: 5 },
  { type: "weight", label: "Weight", unit: "kg", icon: "monitor_weight", min: 30, max: 200, defaultValue: 70 },
];

export default function BiomarkerTracking({ protocolStartDate }: { protocolStartDate?: string }) {
  const [entries, setEntries] = useState<MetricEntry[]>([]);
  const [activeMetric, setActiveMetric] = useState("mood");
  const [inputValue, setInputValue] = useState("5");
  const [weightUnit, setWeightUnit] = useState("kg");
  const chartScrollRef = useRef<HTMLDivElement>(null);

  // Load metrics from database
  useEffect(() => {
    fetch("/api/metrics")
      .then((res) => res.json())
      .then((data) => {
        if (data.entries?.length) setEntries(data.entries);
      })
      .catch(() => {});
  }, []);

  // Auto-scroll chart to latest entry
  useEffect(() => {
    if (chartScrollRef.current) {
      chartScrollRef.current.scrollLeft = chartScrollRef.current.scrollWidth;
    }
  }, [entries, activeMetric]);

  const startDate = protocolStartDate ? new Date(protocolStartDate) : new Date();
  const now = new Date();
  const daysElapsed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const cellularRefreshDays = Math.max(0, 90 - daysElapsed);

  const handleLog = async () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return;
    // Skip if last entry is same metric, same value, within last minute
    const lastEntry = [...entries].reverse().find((e) => e.type === activeMetric);
    if (lastEntry && lastEntry.value === val && Date.now() - new Date(lastEntry.date).getTime() < 60000) return;

    const newEntry = { type: activeMetric, value: val, date: new Date().toISOString() };
    setEntries([...entries, newEntry]);

    // Save to database
    fetch("/api/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: activeMetric,
        value: val,
        unit: activeMetric === "weight" ? weightUnit : currentConfig.unit,
      }),
    }).catch(() => {});
  };

  const metricEntries = entries.filter((e) => e.type === activeMetric);
  const currentConfig = metricConfig.find((m) => m.type === activeMetric)!;

  return (
    <div className="space-y-8">
      {/* Cellular Refresh Countdown */}
      <section className="bg-surface-container-lowest rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline font-bold text-xl text-on-surface">Cellular Refresh</h3>
            <p className="text-sm text-on-surface-variant mt-1">
              Your protocol has been active for {daysElapsed} days
            </p>
          </div>
          <div className="text-center">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="var(--color-surface-container)" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="34" fill="none" stroke="var(--color-primary)" strokeWidth="6"
                  strokeDasharray={`${(daysElapsed / 90) * 213.6} 213.6`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-primary">
                {cellularRefreshDays}d
              </span>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-1 font-bold uppercase">Remaining</p>
          </div>
        </div>
      </section>

      {/* Metric Tabs */}
      <section className="bg-surface-container-lowest rounded-xl p-4">
        <h3 className="font-headline font-bold text-xl text-on-surface mb-6">Log Your Metrics</h3>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {metricConfig.map((m) => (
            <button
              key={m.type}
              onClick={() => { setActiveMetric(m.type); setInputValue(String(metricConfig.find(c => c.type === m.type)?.defaultValue || m.min)); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                activeMetric === m.type
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <span className="material-symbols-outlined text-base">{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>

        {/* Input */}
        {activeMetric === "weight" ? (
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg bg-surface-container text-sm font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value)}
                className="rounded-lg border border-outline-variant bg-surface-container px-3 py-2.5 text-sm font-headline font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 h-[42px]"
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
              <button
                onClick={handleLog}
                className="px-5 py-2.5 rounded-lg vitality-gradient text-on-primary font-headline font-bold text-sm transition-all active:scale-95 whitespace-nowrap"
              >
                Log
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6 space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-6" />
              <div className="flex-1 text-center">
                <span className="font-headline font-extrabold text-2xl text-primary">
                  {inputValue || currentConfig.defaultValue}{currentConfig.unit}
                </span>
              </div>
              <span className="w-6" />
              <span className="w-[52px]" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-on-surface-variant font-bold w-6 text-center">{currentConfig.min}</span>
              <input
                type="range"
                min={currentConfig.min}
                max={currentConfig.max}
                step={currentConfig.max > 20 ? 1 : 0.5}
                value={inputValue || currentConfig.defaultValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary"
              />
              <span className="text-xs text-on-surface-variant font-bold w-6 text-center">{currentConfig.max}</span>
              <button
                onClick={handleLog}
                className="px-5 py-2.5 rounded-lg vitality-gradient text-on-primary font-headline font-bold text-sm transition-all active:scale-95 whitespace-nowrap"
              >
                Log
              </button>
            </div>
          </div>
        )}

        {/* Line Chart */}
        <div className="bg-surface-container-low rounded-lg p-6">
          <h4 className="text-sm font-bold text-on-surface mb-4">Trend — {currentConfig.label}</h4>
          {metricEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2">show_chart</span>
              <p className="text-sm">No data yet. Start logging to see trends.</p>
            </div>
          ) : (() => {
            const recent = metricEntries;
            const values = recent.map((e) => e.value);
            const minVal = Math.min(...values);
            const maxVal = Math.max(...values);
            const range = maxVal === minVal ? 1 : maxVal - minVal;
            const yMin = minVal - range * 0.15;
            const yMax = maxVal + range * 0.15;
            const chartH = 160;
            const pointSpacing = 80;
            const chartW = Math.max(300, (recent.length - 1) * pointSpacing);

            const getY = (val: number) => chartH - ((val - yMin) / (yMax - yMin)) * chartH;

            const yLabels = [
              Math.round(yMin * 10) / 10,
              Math.round(((yMin + yMax) / 2) * 10) / 10,
              Math.round(yMax * 10) / 10,
            ];

            return (
              <div className="flex gap-2">
                {/* Y axis */}
                <div className="flex flex-col justify-between text-xs text-on-surface-variant font-bold w-10 text-right flex-shrink-0" style={{ height: chartH }}>
                  <span>{yLabels[2]}</span>
                  <span>{yLabels[1]}</span>
                  <span>{yLabels[0]}</span>
                </div>
                {/* Scrollable chart area */}
                <div className="flex-1 overflow-x-auto" ref={chartScrollRef}>
                  <div style={{ width: chartW + 40, minWidth: '100%' }}>
                    <svg width={chartW + 40} height={chartH + 60} className="block">
                      {/* Grid lines */}
                      {[0, 0.5, 1].map((pct) => (
                        <line key={pct} x1="20" y1={chartH * (1 - pct)} x2={chartW + 20} y2={chartH * (1 - pct)} stroke="#e0e0e0" strokeWidth="1" strokeDasharray="4 4" />
                      ))}
                      {/* Area */}
                      <path
                        d={`M ${20} ${getY(recent[0].value)} ${recent.map((e, i) => `L ${20 + i * pointSpacing} ${getY(e.value)}`).join(" ")} L ${20 + (recent.length - 1) * pointSpacing} ${chartH} L 20 ${chartH} Z`}
                        fill="var(--color-primary-fixed)" opacity="0.2"
                      />
                      {/* Line */}
                      <polyline
                        points={recent.map((e, i) => `${20 + i * pointSpacing},${getY(e.value)}`).join(" ")}
                        fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      />
                      {/* Points + labels */}
                      {recent.map((e, i) => {
                        const cx = 20 + i * pointSpacing;
                        const cy = getY(e.value);
                        const nodeColor = activeMetric === "mood" || activeMetric === "energy"
                          ? e.value <= 3 ? "#ef4444" : e.value <= 6 ? "#eab308" : "#22c55e"
                          : "var(--color-primary)";
                        return (
                          <g key={i}>
                            <circle cx={cx} cy={cy} r="5" fill="white" stroke={nodeColor} strokeWidth="2" />
                            <text x={cx} y={cy - 14} textAnchor="middle" fill={nodeColor} fontSize="14" fontWeight="bold">{e.value}</text>
                            <text x={cx} y={chartH + 20} textAnchor="middle" fontSize="12" fill="#777">
                              {new Date(e.date).toLocaleDateString("en", { day: "numeric", month: "short" })}
                            </text>
                            <text x={cx} y={chartH + 34} textAnchor="middle" fontSize="11" fill="#999">
                              {new Date(e.date).toLocaleTimeString("en", { hour: "numeric", minute: "2-digit" })}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Goal Tracking */}
      <section className="bg-surface-container-lowest rounded-xl p-4">
        <h3 className="font-headline font-bold text-xl text-on-surface mb-6">Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Sleep 7+ hours", target: 7, current: metricEntries.find((e) => e.type === "sleep")?.value ?? 0, icon: "bedtime" },
            { label: "Energy 7+/10", target: 7, current: metricEntries.find((e) => e.type === "energy")?.value ?? 0, icon: "bolt" },
            { label: "Mood 7+/10", target: 7, current: metricEntries.find((e) => e.type === "mood")?.value ?? 0, icon: "mood" },
          ].map((goal) => (
            <div key={goal.label} className="bg-surface-container-low rounded-lg p-4 text-center">
              <span className="material-symbols-outlined text-primary text-2xl">{goal.icon}</span>
              <h4 className="font-headline font-bold text-sm text-on-surface mt-2">{goal.label}</h4>
              <p className="text-xs text-on-surface-variant mt-1">
                {goal.current > 0 ? `Current: ${goal.current}` : "No data yet"}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
