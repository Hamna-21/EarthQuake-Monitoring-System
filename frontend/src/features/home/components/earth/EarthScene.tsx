import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import CameraController from '@/features/home/components/earth/CameraController';
import Earth from '@/features/home/components/earth/Earth';
import Lighting from '@/features/home/components/earth/Lighting';
import Stars from '@/features/home/components/earth/Stars';

export default function EarthScene() {
  return (
    <Canvas
      aria-label="Animated 3D Earth with live seismic pulses"
      camera={{ position: [0, 0, 12], fov: 38 }}
      dpr={[1, 1.25]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={['#020612']} />
        <Stars />
        <Lighting />
        <Earth />
        <CameraController />
      </Suspense>
    </Canvas>
  );
}
