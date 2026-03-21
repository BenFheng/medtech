export default function ValueProps() {
  return (
    <>
      {/* The Unfair Advantage Section */}
      <section className="bg-surface py-14 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-on-surface mb-4">
              The Unfair Advantage
            </h2>
            <p className="text-on-surface-variant font-body max-w-xl mx-auto text-sm sm:text-base">
              Where clinical rigour meets architectural precision to define the
              next era of longevity.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-surface-container-low p-6 sm:p-10 rounded-xl flex flex-col items-start space-y-5 sm:space-y-6 group hover:bg-surface-container-lowest transition-colors">
              <div className="w-16 h-16 bg-primary-container/10 flex items-center justify-center rounded-full text-primary">
                <span
                  className="material-symbols-outlined text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  medical_services
                </span>
              </div>
              <div>
                <h3 className="font-headline text-xl sm:text-2xl font-bold text-primary mb-2">
                  Clinical Authority
                </h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Led by world-class General Practitioners and Aesthetic
                  Physicians specializing in cellular regenerative therapies and
                  hormone optimization.
                </p>
              </div>
              <div className="pt-4 flex gap-2">
                <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-outline uppercase tracking-widest">
                  Medical Board
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-outline uppercase tracking-widest">
                  MD Verified
                </span>
              </div>
            </div>

            <div className="bg-surface-container-low p-6 sm:p-10 rounded-xl flex flex-col items-start space-y-5 sm:space-y-6 group hover:bg-surface-container-lowest transition-colors">
              <div className="w-16 h-16 bg-primary-container/10 flex items-center justify-center rounded-full text-primary">
                <span
                  className="material-symbols-outlined text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  architecture
                </span>
              </div>
              <div>
                <h3 className="font-headline text-xl sm:text-2xl font-bold text-primary mb-2">
                  Engineering Precision
                </h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Built by software architects and system designers applying
                  algorithmic rigor to biological inputs for consistent,
                  measurable outcomes.
                </p>
              </div>
              <div className="pt-4 flex gap-2">
                <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-outline uppercase tracking-widest">
                  Data Driven
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-outline uppercase tracking-widest">
                  Systems Design
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-surface-container-low py-14 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl">
              <span className="material-symbols-outlined text-primary text-4xl mb-6 block">
                biotech
              </span>
              <h4 className="font-headline text-xl font-bold text-on-surface mb-3">
                Medically Vetted Compounds
              </h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Every ingredient in our stacks is selected based on
                peer-reviewed clinical data and pharmaceutical-grade purity
                standards.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl">
              <span className="material-symbols-outlined text-primary text-4xl mb-6 block">
                insights
              </span>
              <h4 className="font-headline text-xl font-bold text-on-surface mb-3">
                Dynamic Data Integration
              </h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                We don&apos;t just guess. Your stack evolves with your
                biomarkers, wearable data, and periodic clinical reassessments.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl">
              <span className="material-symbols-outlined text-primary text-4xl mb-6 block">
                auto_awesome
              </span>
              <h4 className="font-headline text-xl font-bold text-on-surface mb-3">
                Frictionless Routine
              </h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Optimizing your biology shouldn&apos;t be a chore. We provide a
                streamlined delivery and tracking system that fits into
                high-performance lifestyles.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
