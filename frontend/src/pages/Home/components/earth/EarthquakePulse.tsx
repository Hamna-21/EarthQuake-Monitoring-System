import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EarthquakePulseProps {
  lat: number;
  lng: number;
  magnitude: number;
}

function getPulseColor(magnitude: number) {
  if (magnitude >= 7) return '#ef4444';
  if (magnitude >= 6) return '#f97316';
  if (magnitude >= 5) return '#facc15';
  return '#22c55e';
}

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export default function EarthquakePulse({ lat, lng, magnitude }: EarthquakePulseProps) {
  const ring = useRef<THREE.Mesh>(null);
  const color = getPulseColor(magnitude);
  const position = useMemo(() => latLngToVector3(lat, lng, 2.04), [lat, lng]);
  const quaternion = useMemo(() => {
    return new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      position.clone().normalize()
    );
  }, [position]);

  useFrame(({ clock }) => {
    if (!ring.current) return;
    const progress = (clock.getElapsedTime() % 2.4) / 2.4;
    ring.current.scale.setScalar(0.45 + progress * 2.25);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.72 * (1 - progress);
  });

  return (
    <group position={position} quaternion={quaternion}>
      <mesh>
        <circleGeometry args={[0.035, 24]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.055, 0.075, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
