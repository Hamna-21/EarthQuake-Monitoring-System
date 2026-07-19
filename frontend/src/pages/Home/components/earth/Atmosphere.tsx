import { useMemo } from 'react';
import * as THREE from 'three';

export default function Atmosphere() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: {
          glowColor: { value: new THREE.Color('#4fb8ff') },
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 glowColor;
          varying vec3 vNormal;
          void main() {
            float rim = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
            gl_FragColor = vec4(glowColor, rim * 1.35);
          }
        `,
      }),
    []
  );

  return (
    <mesh scale={2.18} material={material}>
      <sphereGeometry args={[1, 64, 64]} />
    </mesh>
  );
}
