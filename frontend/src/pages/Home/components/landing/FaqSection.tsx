import { useState } from 'react';
import SectionShell from './SectionShell';

const faqs = [
  ['What is an earthquake?', 'A sudden release of energy in the Earth that creates seismic waves.'],
  ['What is magnitude?', 'A measurement of earthquake energy released at the source.'],
  ['How accurate is GeoPulse?', 'GeoPulse organizes official seismic records and turns them into readable intelligence.'],
  ['Can I monitor nearby earthquakes?', 'Yes. The dashboard includes nearby awareness tools and location-based views.'],
  ['How often is data updated?', 'The platform is designed around live monitoring and refreshable records.'],
  ['How does the AI assistant work?', 'GeoBot explains terms, safety steps, and platform navigation in plain language.'],
  ['What should I do during an earthquake?', 'Drop, cover, hold on, and stay away from glass or unstable objects.'],
  ['Can I use GeoPulse on mobile?', 'Yes. The interface is responsive across desktop and mobile screens.'],
];

export default function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <SectionShell
      eyebrow="FAQ"
      title="Clear answers before decisions."
      subtitle="Professional guidance for people who need seismic information without friction."
    >
      <div className="grid gap-3">
        {faqs.map(([question, answer], index) => (
          <button
            key={question}
            onClick={() => setOpen(open === index ? -1 : index)}
            className="border border-white/10 bg-white/[0.06] p-5 text-left backdrop-blur-xl transition hover:border-cyan-200/30"
          >
            <span className="text-lg font-black text-white">{question}</span>
            {open === index && <p className="mt-3 leading-7 text-slate-300">{answer}</p>}
          </button>
        ))}
      </div>
    </SectionShell>
  );
}
