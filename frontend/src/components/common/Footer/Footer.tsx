import React from 'react';
import { Activity, Heart } from 'lucide-react';
import FooterLinksGroup from './components/FooterLinksGroup';
import SystemStatusBox from './components/SystemStatusBox';

export default function Footer() {
  const navigationLinks = [
    { label: 'Home', href: '#' },
    { label: 'Live Map', href: '#' },
    { label: 'Dashboard', href: '#' },
    { label: 'Analytics', href: '#' },
  ];

  const resourceLinks = [
    { label: 'USGS', href: 'https://earthquake.usgs.gov/', external: true },
    { label: 'EMSC', href: 'https://www.emsc-csem.org/', external: true },
    { label: 'NASA Earth', href: 'https://earthobservatory.nasa.gov/', external: true },
  ];

  return (
    <footer className="relative z-10 mt-24 overflow-hidden border-t border-red-900/20 bg-gradient-to-b from-[#1A0F0D]/70 to-[#120B0A] backdrop-blur-2xl">
      {/* Top Glow */}
      <div className="absolute left-1/2 top-0 h-40 w-[700px] -translate-x-1/2 rounded-none bg-red-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-red-500 animate-pulse" />
              <h2 className="text-2xl font-black tracking-widest bg-gradient-to-r from-white via-red-200 to-orange-400 bg-clip-text text-transparent">
                GeoPulse
              </h2>
            </div>
            <p className="font-light italic mt-5 text-sm leading-7 text-red-100/65">
              Professional earthquake monitoring platform providing
              real-time seismic intelligence, historical earthquake
              records and advanced analytics.
            </p>
          </div>

          {/* Navigation */}
          <FooterLinksGroup title="Navigation" links={navigationLinks} />

          {/* Resources */}
          <FooterLinksGroup title="Resources" links={resourceLinks} />

          {/* Live Status */}
          <SystemStatusBox />
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-red-700/40 to-transparent" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <div className="flex items-center gap-3">
            <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            <span className="font-light italic text-sm text-red-100/70">
              Built for research, disaster preparedness and public awareness.
            </span>
          </div>

          <div className="text-center">
            <p className="font-black leading-none text-sm text-red-100/60">
              GeoPulse The Earthquake Monitoring System
            </p>
            <p className="font-light italic mt-1 text-xs tracking-widest uppercase text-red-200/40">
              Powered by ------------------
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
