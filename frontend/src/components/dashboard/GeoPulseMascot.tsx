import owlMascot from '../../assets/mascot/geopulse-owl.png';

interface GeoPulseMascotProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 'h-9 w-9', md: 'h-14 w-14', lg: 'h-28 w-28' };

export default function GeoPulseMascot({ size = 'md', className = '' }: GeoPulseMascotProps) {
  return (
    <span className={`relative inline-grid place-items-center ${sizes[size]} ${className}`}>
      <span className="absolute inset-2 rounded-full bg-orange-400/20 blur-xl" />
      <img
        src={owlMascot}
        alt="GeoPulse owl assistant"
        loading="lazy"
        decoding="async"
        className="relative h-full w-full object-contain drop-shadow-[0_10px_22px_rgba(249,115,22,0.30)]"
      />
    </span>
  );
}
