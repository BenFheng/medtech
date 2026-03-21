export default function BiomarkerStatus() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      <div className="sm:col-span-2 bg-surface-container-low rounded-xl p-4 sm:p-6 flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-on-surface uppercase font-body">
            Cellular Refresh
          </h4>
          <p className="text-on-surface-variant text-sm">
            Next metabolic update in 14 days.
          </p>
        </div>
        <div className="h-12 w-12 rounded-full border-4 border-primary-fixed border-t-primary animate-spin" style={{ animationDuration: "3s" }} />
      </div>
      <div className="bg-surface-container-highest rounded-xl p-4 sm:p-6 flex flex-col justify-center items-center text-center">
        <span className="material-symbols-outlined text-primary mb-2">
          labs
        </span>
        <span className="text-xs font-bold uppercase text-on-surface-variant">
          Biomarkers
        </span>
        <span className="text-xl font-bold text-on-surface">Optimal</span>
      </div>
    </div>
  );
}
