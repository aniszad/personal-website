"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "motion/react";

/* ─────────────────────────────────── shaders ─────────────────────────────── */
/* Atmosphere-only: a soft Fresnel haze in Venus's real pale-gold cloud tone. */

const ATMO_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewPos = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const ATMO_FRAG = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPos;
  void main() {
    vec3 vd = normalize(vViewPos);
    float fr = pow(1.0 - abs(dot(vNormal, vd)), 4.0);
    gl_FragColor = vec4(1.0, 0.87, 0.65, fr * 0.38);
  }
`;

/* ──────────────────────────────── section data ───────────────────────────── */

type Section = {
  href:  string;
  label: string;
  color: string;
  pos:   THREE.Vector3;
  phase: number;
};

// Front hemisphere (z > 0) = visible at start; back (z < 0) = found by rotating.
const SECTIONS: Section[] = [
  { href: "/about",      label: "About",      color: "#d6b27c", pos: new THREE.Vector3(-0.58,  0.46,  0.67), phase: 0 },
  { href: "/experience", label: "Experience", color: "#d6b27c", pos: new THREE.Vector3( 0.65,  0.37,  0.66), phase: 1 },
  { href: "/contact",    label: "Contact",    color: "#d6b27c", pos: new THREE.Vector3( 0.18, -0.64,  0.75), phase: 2 },
  { href: "/projects",   label: "Projects",   color: "#d6b27c", pos: new THREE.Vector3( 0.72,  0.38, -0.58), phase: 3 },
  { href: "/education",  label: "Education",  color: "#d6b27c", pos: new THREE.Vector3(-0.54, -0.52, -0.66), phase: 4 },
  { href: "/skills",     label: "Skills",     color: "#d6b27c", pos: new THREE.Vector3(-0.12,  0.79, -0.60), phase: 5 },
].map((s) => ({ ...s, pos: s.pos.clone().normalize() }));

/* ─────────────────────────────── sub-components ─────────────────────────── */

function Planet() {
  // Real Magellan/Venera/Pioneer global mosaic, courtesy of NASA/JPL's
  // Solar System Simulator (space.jpl.nasa.gov/tmaps) — public domain.
  const texture = useTexture("/textures/venus.jpg");
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={texture} roughness={1} metalness={0} />
    </mesh>
  );
}

function Atmosphere() {
  return (
    <mesh scale={1.14}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        vertexShader={ATMO_VERT}
        fragmentShader={ATMO_FRAG}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function SectionPoint({ section }: { section: Section }) {
  const router = useRouter();
  const { camera } = useThree();
  const [hovered, setHovered] = useState(false);

  const dotRef   = useRef<THREE.Mesh>(null!);
  const glowRef  = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const labelRef = useRef<HTMLSpanElement | null>(null);

  // Surface position slightly above sphere (avoids z-fighting)
  const pos = section.pos.clone().multiplyScalar(1.03);

  useFrame(({ clock }) => {
    // Front-hemisphere check: dot product of camera direction with point normal.
    // When positive the point faces the camera; when negative it's on the far side.
    const camDir = camera.position.clone().normalize();
    const facing = section.pos.dot(camDir);
    const visible = facing > -0.05;

    if (groupRef.current) groupRef.current.visible = visible;
    if (labelRef.current) {
      labelRef.current.style.opacity        = visible ? "1" : "0";
      labelRef.current.style.pointerEvents  = visible ? "auto" : "none";
    }

    const t = clock.elapsedTime + section.phase * 1.1;
    const pulse = 1 + Math.sin(t * 2.5) * 0.15;

    if (dotRef.current)  dotRef.current.scale.setScalar(hovered ? 1.6 : pulse);
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        hovered ? 0.35 : 0.1 + Math.sin(t * 2.5) * 0.06;
      glowRef.current.scale.setScalar(hovered ? 3.2 : 2.2 + Math.sin(t * 2.5) * 0.4);
    }
  });

  return (
    <group ref={groupRef} position={pos}>
      {/* Pulsing glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshBasicMaterial color={section.color} transparent depthWrite={false} />
      </mesh>

      {/* Solid dot — receives pointer events */}
      <mesh
        ref={dotRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
        onClick={(e) => {
          e.stopPropagation();
          void router.push(section.href);
        }}
      >
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshBasicMaterial color={section.color} />
      </mesh>

      {/* HTML label — positioned above the dot.
          No distanceFactor so the element renders at natural CSS pixel size. */}
      <Html center style={{ pointerEvents: "none" }}>
        <span
          ref={labelRef}
          onClick={() => void router.push(section.href)}
          style={{
            display: "inline-block",
            marginTop: "-22px",
            padding: "2px 8px",
            borderRadius: "20px",
            border: `1px solid ${hovered ? section.color : "rgba(100,255,218,0.22)"}`,
            background: hovered ? `${section.color}18` : "rgba(10,25,47,0.80)",
            color: hovered ? section.color : "rgba(200,230,255,0.75)",
            fontSize: "10px",
            fontWeight: hovered ? 600 : 400,
            fontFamily: "system-ui,-apple-system,sans-serif",
            whiteSpace: "nowrap",
            transition: "border 0.2s, color 0.2s, background 0.2s",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            cursor: "pointer",
            pointerEvents: "auto",
            userSelect: "none",
          }}
        >
          {section.label}
        </span>
      </Html>
    </group>
  );
}

function Scene({ autoRotate }: { autoRotate: boolean }) {
  return (
    <>
      <Stars radius={60} depth={60} count={2500} factor={3} saturation={0} fade speed={0.4} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 2, 4]} intensity={2.4} />
      <Suspense fallback={null}>
        <Planet />
        <Atmosphere />
      </Suspense>
      {SECTIONS.map((s) => (
        <SectionPoint key={s.href} section={s} />
      ))}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={autoRotate}
        autoRotateSpeed={0.4}
        dampingFactor={0.08}
        enableDamping
        rotateSpeed={0.6}
        minPolarAngle={Math.PI * 0.1}
        maxPolarAngle={Math.PI * 0.9}
      />
    </>
  );
}

/* ────────────────────────────── exported component ──────────────────────── */

export function PlanetHero() {
  const reduced = useReducedMotion() ?? false;

  return (
    <div
      role="img"
      aria-label="Interactive Venus globe showing portfolio sections — drag to rotate, click a point to navigate"
      style={{
        width: "100%",
        aspectRatio: "1",
        maxWidth: "480px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.4], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene autoRotate={!reduced} />
      </Canvas>
    </div>
  );
}
