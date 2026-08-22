"use client";

import dynamic from "next/dynamic";

// Three.js uses browser APIs; ssr: false must live in a client component.
const PlanetHero = dynamic(
  () => import("@/components/ui/PlanetHero").then((m) => ({ default: m.PlanetHero })),
  { ssr: false },
);

export function PlanetHeroLoader() {
  return <PlanetHero />;
}
