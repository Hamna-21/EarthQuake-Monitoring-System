import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import cloudsMapSrc from '../../../../assets/earth/clouds.png';

export default function Clouds() {
  const clouds = useRef<THREE.Mesh>(null);
  const cloudsMap = useTexture(cloudsMapSrc);

  useFrame((_, delta) => {
    if (clouds.current) clouds.current.rotation.y += delta * 0.065;
  });

  return (
    <mesh ref={clouds} scale={1.012}>
      <sphereGeometry args={[2, 96, 96]} />
      <meshPhongMaterial
        map={cloudsMap}
        transparent
        opacity={0.34}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
