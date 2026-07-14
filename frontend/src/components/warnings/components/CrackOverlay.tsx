import React from 'react';

interface CrackOverlayProps {
  showCrack: boolean;
}

export default function CrackOverlay({ showCrack }: CrackOverlayProps) {
  if (!showCrack) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none animate-crack z-50">
      <img
        src="/images/crack.png"
        alt="crack"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        onError={(e) => {
          // Hide image if it has mime type issues or fails, falling back to crisp inline vector
          e.currentTarget.style.display = 'none';
        }}
      />
      {/* Super crisp responsive SVG crack vectors matching the seismic theme */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="none"
      >
        <path
          d="M 400,0 L 410,80 L 380,150 L 420,230 L 390,320 L 430,410 L 400,500 L 415,600 M 390,320 L 250,300 L 180,350 L 100,320 L 0,340 M 420,230 L 550,260 L 630,220 L 720,280 L 800,270 M 380,150 L 500,100 L 580,120 L 650,80 M 430,410 L 300,480 L 220,460 L 150,520 M 400,500 L 520,540 L 600,520 L 700,560"
          stroke="rgba(239, 68, 68, 0.45)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M 400,0 L 410,80 L 380,150 L 420,230 L 390,320 L 430,410 L 400,500 L 415,600 M 390,320 L 250,300 L 180,350 L 100,320 L 0,340 M 420,230 L 550,260 L 630,220 L 720,280 L 800,270 M 380,150 L 500,100 L 580,120 L 650,80 M 430,410 L 300,480 L 220,460 L 150,520 M 400,500 L 520,540 L 600,520 L 700,560"
          stroke="#0d0403"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M 380,150 L 350,180 L 360,210 M 430,410 L 460,430 L 450,470 M 250,300 L 240,260 M 630,220 L 660,250"
          stroke="rgba(249, 115, 22, 0.8)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
