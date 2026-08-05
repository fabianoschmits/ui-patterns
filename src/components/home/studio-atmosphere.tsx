"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { PointMaterial, Points } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Points as ThreePoints } from "three";
import * as THREE from "three";

const FULL_COUNT = 1600;
const REDUCED_COUNT = 360;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);
    const onChange = () => setReduced(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

function useScrollOffset() {
  const offset = useRef(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      offset.current = max > 0 ? window.scrollY / max : 0;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return offset;
}

function SandField({ reduced }: { reduced: boolean }) {
  const pointsRef = useRef<ThreePoints>(null);
  const scroll = useScrollOffset();
  const count = reduced ? REDUCED_COUNT : FULL_COUNT;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      const radius = 0.5 + Math.random() * 4.6;
      const theta = Math.random() * Math.PI * 2;
      const ySpread = (Math.random() - 0.5) * 6.4;

      arr[i3] = Math.cos(theta) * radius * (0.7 + Math.random() * 0.5);
      arr[i3 + 1] = ySpread;
      arr[i3 + 2] = Math.sin(theta) * radius * (0.55 + Math.random() * 0.6);
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    const cloud = pointsRef.current;
    if (!cloud) return;

    const t = state.clock.elapsedTime;
    const s = scroll.current;

    if (reduced) {
      cloud.rotation.set(0.06 + s * 0.1, s * 0.2, 0.02);
      cloud.position.y = s * -0.3;
      return;
    }

    cloud.rotation.y = t * 0.03 + s * 0.45;
    cloud.rotation.x = Math.sin(t * 0.12) * 0.06 + s * 0.16;
    cloud.rotation.z = Math.cos(t * 0.08) * 0.025;
    cloud.position.y = Math.sin(t * 0.1) * 0.1 + s * -1.05;
    cloud.position.x = Math.cos(t * 0.07) * 0.14;
  });

  return (
    <Points
      ref={pointsRef}
      positions={positions}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color="#d4c4a4"
        size={reduced ? 0.045 : 0.06}
        sizeAttenuation
        depthWrite={false}
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function AccentDust({ reduced }: { reduced: boolean }) {
  const pointsRef = useRef<ThreePoints>(null);
  const scroll = useScrollOffset();

  const positions = useMemo(() => {
    const count = reduced ? 120 : 420;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      arr[i3] = (Math.random() - 0.5) * 8;
      arr[i3 + 1] = (Math.random() - 0.5) * 7;
      arr[i3 + 2] = (Math.random() - 0.5) * 4 - 0.5;
    }
    return arr;
  }, [reduced]);

  useFrame((state) => {
    const cloud = pointsRef.current;
    if (!cloud) return;
    const t = state.clock.elapsedTime;
    const s = scroll.current;
    cloud.rotation.y = reduced ? s * -0.12 : t * -0.018 + s * -0.28;
    cloud.position.y = s * -0.55;
  });

  return (
    <Points
      ref={pointsRef}
      positions={positions}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color="#7eb9a5"
        size={reduced ? 0.03 : 0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.55}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export function StudioAtmosphere() {
  const reduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="studio-atmosphere" aria-hidden="true">
      <div className="studio-atmosphere-wash" />
      {mounted ? (
        <Canvas
          className="studio-atmosphere-canvas"
          dpr={[1, 1.4]}
          camera={{ position: [0, 0.15, 5.2], fov: 42, near: 0.1, far: 40 }}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "low-power",
          }}
          style={{ pointerEvents: "none" }}
        >
          <SandField reduced={reduced} />
          <AccentDust reduced={reduced} />
        </Canvas>
      ) : null}
    </div>
  );
}
