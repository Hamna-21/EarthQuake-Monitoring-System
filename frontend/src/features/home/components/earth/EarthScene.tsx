import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import CameraController from '@/features/home/components/earth/CameraController';
import Earth from '@/features/home/components/earth/Earth';
import Lighting from '@/features/home/components/earth/Lighting';
import Stars from '@/features/home/components/earth/Stars';

/** Owns the landing-page Three.js canvas and pauses its render loop when it leaves the viewport. */
export default function EarthScene() {
  const host = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(true);

  // IntersectionObserver avoids rendering the animated Earth while the landing section is off screen.
  useEffect(() => {
    if (!host.current || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={host} className="h-full w-full">
      <Canvas
        aria-label="Animated 3D Earth with live seismic pulses"
        camera={{ position: [0, 0, 12], fov: 38 }}
        dpr={[1, 1.25]}
        frameloop={visible ? 'always' : 'never'}
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
    </div>
  );
}
