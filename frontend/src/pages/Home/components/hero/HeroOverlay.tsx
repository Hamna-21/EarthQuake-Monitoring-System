export default function HeroOverlay() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(2,6,18,0.08),rgba(2,6,18,0.38)_48%,rgba(2,6,18,0.78)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-40 bg-gradient-to-b from-[#120B0A] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32 bg-gradient-to-t from-[#120B0A] to-transparent" />
    </>
  );
}
