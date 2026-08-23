import { useState } from 'react';
import SectionShell from '@/features/home/components/landing/SectionShell';

const faqs = [
  ['What is Earthquake?', 'A sudden release of energy in the Earth that creates seismic waves.'],
  ['What is Magnitude?', 'A measurement of earthquake energy released at the source.'],
  ['What is Earthquake depth?', 'Depth is how far below the Earth’s surface an earthquake begins.'],
  ['What is Epicenter?', 'The epicenter is the point on the Earth’s surface directly above where an earthquake begins.'],
  ['How accurate is Earthquake Monitoring System?', 'Earthquake Monitoring System organizes official seismic records and turns them into readable intelligence.'],
  ['Can I monitor nearby Earthquakes?', 'Yes. The dashboard includes nearby awareness tools and location-based views.'],
  ['How often is data updated?', 'The platform is designed around live monitoring and refreshable records.'],
  ['Can Earthquake Monitoring System predict Earthquakes?', 'Earthquake Monitoring System provides risk insights from available seismic and environmental data, not guaranteed earthquake predictions.'],
  ['What does Earthquake risk mean?', 'Risk indicates potential seismic concern based on available location, activity, and related data.'],
  ['How does GeoBot work?', 'GeoBot explains terms, safety steps, and navigation in plain language.'],
  ['What should I do during an Earthquake?', 'Drop, cover, hold on, and stay away from glass or unstable objects.'],
  ['What should I keep in an Emergency kit?', 'Keep water, food, medicine, a flashlight, first-aid supplies, and important contact information.'],
  ['What should I do after an Earthquake?', 'Check for injuries and hazards, expect aftershocks, and follow official safety guidance.'],
  ['What are Aftershocks?', 'Aftershocks are smaller earthquakes that can occur after the main earthquake.'],
  ['Does Earthquake Monitoring System cover Pakistan?', 'Yes. Earthquake Monitoring System includes global seismic information with dedicated views for Pakistan.'],
];

/** Maintains one open FAQ answer at a time so the landing content stays compact. */
export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <SectionShell
      eyebrow="FAQ"
      title="Clear answers before decisions."
      subtitle="Clear guidance for people who need earthquake information."
    >
      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {faqs.map(([question, answer], index) => (
          <button
            key={question}
            type="button"
            onClick={() => setOpen(open === index ? null : index)}
            className="flex h-full flex-col border border-white/10 bg-white/[0.06] px-3 py-2.5 text-left backdrop-blur-xl transition hover:border-cyan-200/30"
          >
            <div className="flex min-h-10 items-start justify-between gap-3">
              <span className="text-sm font-black leading-5 text-white">
                {question}
              </span>

              <span className="shrink-0 text-sm text-cyan-200">
                {open === index ? '−' : '+'}
              </span>
            </div>

            {open === index && (
              <p className="mt-1.5 flex-1 text-xs leading-5 text-slate-300">
                {answer}
              </p>
            )}
          </button>
        ))}
      </div>
    </SectionShell>
  );
}
