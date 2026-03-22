"use client";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "stack", label: "My Stack", icon: "science" },
  { id: "insights", label: "Protocol Insights", icon: "insights" },
  { id: "biomarkers", label: "Biomarker Tracking", icon: "monitoring" },
  { id: "orders", label: "Subscription", icon: "sync" },
];

export default function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <div className="flex gap-1 bg-surface-container rounded-xl p-1 mb-8 overflow-x-auto max-w-full">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-5 py-3 rounded-lg font-headline font-bold text-sm whitespace-nowrap transition-all ${
            activeTab === tab.id
              ? "bg-white text-primary shadow-sm"
              : "text-on-surface-variant hover:text-primary hover:bg-white/50"
          }`}
        >
          <span className="material-symbols-outlined text-lg">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
