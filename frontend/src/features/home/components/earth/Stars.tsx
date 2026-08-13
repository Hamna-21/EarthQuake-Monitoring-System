import { Stars as DreiStars } from '@react-three/drei';

export default function Stars() {
  return (
    <DreiStars
      radius={120}
      depth={70}
      count={1800}
      factor={4}
      saturation={0}
      fade
      speed={0.35}
    />
  );
}
