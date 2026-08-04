import { Stars as DreiStars } from '@react-three/drei';

export default function Stars() {
  return (
    <DreiStars
      radius={120}
      depth={70}
      count={4200}
      factor={4}
      saturation={0}
      fade
      speed={0.35}
    />
  );
}
