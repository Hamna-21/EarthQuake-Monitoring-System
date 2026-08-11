export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <hemisphereLight args={['#8bd8ff', '#130a08', 0.7]} />
      <directionalLight position={[-4, 2.5, 5]} intensity={3.1} color="#ffffff" />
      <pointLight position={[4, -2, 3]} intensity={22} distance={10} color="#ef4444" />
      <pointLight position={[-5, 3, -4]} intensity={8} distance={12} color="#38bdf8" />
    </>
  );
}
