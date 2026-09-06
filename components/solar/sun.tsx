'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { MODEL_URLS, SUN_RADIUS, type ModelKey } from '@/data/planets';
import { useCenteredModel } from './use-centered-model';
import { getGlowTexture } from './glow-texture';

interface SunProps {
  interactive: boolean;
  onSelect: () => void;
  onLoaded: (key: ModelKey) => void;
}

function SunModel({ onLoaded }: { onLoaded: (key: ModelKey) => void }) {
  const { scene, scale, offset } = useCenteredModel(MODEL_URLS.sun, SUN_RADIUS);
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    onLoaded('sun');
  }, [onLoaded]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.2;
  });

  return (
    <group ref={ref} scale={scale}>
      <group position={offset}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

export default function Sun({ interactive, onSelect, onLoaded }: SunProps) {
  const glow = useMemo(() => getGlowTexture(), []);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!hovered || !interactive) return;
    document.body.style.cursor = 'pointer';
    return () => {
      document.body.style.cursor = '';
    };
  }, [hovered, interactive]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (interactive) onSelect();
  };

  return (
    <group>
      <pointLight intensity={3} decay={0} />
      <Suspense fallback={null}>
        <SunModel onLoaded={onLoaded} />
      </Suspense>
      {glow && (
        <>
          <sprite scale={[SUN_RADIUS * 4.4, SUN_RADIUS * 4.4, 1]}>
            <spriteMaterial map={glow} color="#ff9a3c" blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.5} />
          </sprite>
          <sprite scale={[SUN_RADIUS * 2.6, SUN_RADIUS * 2.6, 1]}>
            <spriteMaterial map={glow} color="#fff1c2" blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.7} />
          </sprite>
        </>
      )}
      <mesh
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[SUN_RADIUS * 1.25, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
