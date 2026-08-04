import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import dayMapSrc from '../../../../assets/earth/earth-day.jpg';
import nightMapSrc from '../../../../assets/earth/earth-night.jpg';
import topologyMapSrc from '../../../../assets/earth/earth-topology.png';
import waterMapSrc from '../../../../assets/earth/earth-water.png';
import Atmosphere from './Atmosphere';
import Clouds from './Clouds';
import EarthquakePulse from './EarthquakePulse';

const quakeLocations = [
  { lat: 30.3753, lng: 69.3451, magnitude: 5.9 },
  { lat: 35.6762, lng: 139.6503, magnitude: 6.7 },
  { lat: -33.4489, lng: -70.6693, magnitude: 7.2 },
  { lat: 37.7749, lng: -122.4194, magnitude: 4.8 },
];

export default function Earth() {
  const group = useRef<THREE.Group>(null);
  const [dayMap, nightMap, topologyMap, waterMap] = useTexture([
    dayMapSrc,
    nightMapSrc,
    topologyMapSrc,
    waterMapSrc,
  ]);

  useEffect(() => {
    dayMap.colorSpace = THREE.SRGBColorSpace;
    nightMap.colorSpace = THREE.SRGBColorSpace;
    [dayMap, nightMap, topologyMap, waterMap].forEach((map) => {
      map.anisotropy = 8;
      map.needsUpdate = true;
    });
  }, [dayMap, nightMap, topologyMap, waterMap]);

  useFrame(({ pointer }, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.045;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -0.15 + pointer.y * 0.08, 0.04);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, pointer.x * -0.08, 0.04);
  });

  return (
    <group ref={group} position={[1.25, -0.05, 0]} rotation={[-0.15, -0.65, 0]} scale={1.28}>
      <mesh>
        <sphereGeometry args={[2, 128, 128]} />
        <meshPhongMaterial
          map={dayMap}
          bumpMap={topologyMap}
          bumpScale={0.045}
          specularMap={waterMap}
          specular="#7dd3fc"
          shininess={18}
          emissive="#dbeafe"
          emissiveMap={nightMap}
          emissiveIntensity={0.32}
        />
      </mesh>
      <Clouds />
      <Atmosphere />
      {quakeLocations.map((quake) => (
        <EarthquakePulse key={`${quake.lat}-${quake.lng}`} {...quake} />
      ))}
    </group>
  );
}
