import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const restingPosition = new THREE.Vector3(0, 0, 7.2);

export default function CameraController() {
  const arrived = useRef(false);

  useFrame(({ camera }) => {
    if (arrived.current) return;
    camera.position.lerp(restingPosition, 0.025);
    camera.lookAt(0.8, 0, 0);

    if (camera.position.distanceTo(restingPosition) < 0.06) {
      arrived.current = true;
    }
  });

  return null;
}
