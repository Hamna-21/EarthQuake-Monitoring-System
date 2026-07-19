import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { Suspense } from 'react';
import CameraController from './CameraController';
import Earth from './Earth';
import Lighting from './Lighting';
import Stars from './Stars';

export default function EarthScene() {
  return (
    <Canvas
      aria-label="Animated 3D Earth with live seismic pulses"
      camera={{ position: [0, 0, 12], fov: 38 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={['#020612']} />
        <Stars />
        <Lighting />
        <Earth />
        <CameraController />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
