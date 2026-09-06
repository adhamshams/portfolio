'use client';

import { Suspense, useEffect, useMemo, useRef, useState, type Ref } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { MODEL_URLS, type ModelKey, type PlanetConfig, type PlanetId } from '@/data/planets';
import { useCenteredModel } from './use-centered-model';
import { getGlowTexture } from './glow-texture';
import styles from './solar.module.css';

interface PlanetProps {
  config: PlanetConfig;
  interactive: boolean;
  showLabel: boolean;
  onSelect: (id: PlanetId) => void;
  onLoaded: (key: ModelKey) => void;
  groupRef: Ref<THREE.Group>;
}

function PlanetModel({
  modelKey,
  radius,
  onLoaded,
}: {
  modelKey: Exclude<ModelKey, 'sun'>;
  radius: number;
  onLoaded: (key: ModelKey) => void;
}) {
  const { scene, scale, offset } = useCenteredModel(MODEL_URLS[modelKey], radius);

  useEffect(() => {
    onLoaded(modelKey);
  }, [onLoaded, modelKey]);

  return (
    <group scale={scale}>
      <group position={offset}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

function PlanetSphere({
  config,
  materialRef,
}: {
  config: PlanetConfig;
  materialRef?: Ref<THREE.MeshStandardMaterial>;
}) {
  return (
    <mesh>
      <sphereGeometry args={[config.radius, 48, 48]} />
      <meshStandardMaterial
        ref={materialRef}
        color={config.color}
        emissive={config.color}
        emissiveIntensity={0}
        roughness={0.85}
        metalness={0}
      />
    </mesh>
  );
}

export default function Planet({ config, interactive, showLabel, onSelect, onLoaded, groupRef }: PlanetProps) {
  const bodyRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const glow = useMemo(() => (config.atmosphere ? getGlowTexture() : null), [config.atmosphere]);
  const highlight = hovered && interactive;

  useEffect(() => {
    if (!highlight) return;
    document.body.style.cursor = 'pointer';
    return () => {
      document.body.style.cursor = '';
    };
  }, [highlight]);

  useFrame((_, delta) => {
    if (spinRef.current && config.spin) spinRef.current.rotation.y += delta * config.spin;
    if (bodyRef.current) {
      const s = THREE.MathUtils.damp(bodyRef.current.scale.x, highlight ? 1.12 : 1, 8, delta);
      bodyRef.current.scale.setScalar(s);
    }
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = THREE.MathUtils.damp(
        materialRef.current.emissiveIntensity,
        highlight ? 0.35 : 0,
        8,
        delta
      );
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (interactive) onSelect(config.id);
  };

  const r = config.radius;

  return (
    <group ref={groupRef}>
      <group ref={bodyRef}>
        <group ref={spinRef}>
          {config.model ? (
            <Suspense fallback={<PlanetSphere config={config} />}>
              <PlanetModel modelKey={config.model} radius={r} onLoaded={onLoaded} />
            </Suspense>
          ) : (
            <PlanetSphere config={config} materialRef={materialRef} />
          )}
        </group>
        {config.ring && (
          <mesh rotation={[-Math.PI / 2 + config.ring.tilt, 0, 0]}>
            <ringGeometry args={[r * config.ring.inner, r * config.ring.outer, 96]} />
            <meshBasicMaterial color={config.ring.color} side={THREE.DoubleSide} transparent opacity={0.55} depthWrite={false} />
          </mesh>
        )}
        {glow && (
          <sprite scale={[r * 3.4, r * 3.4, 1]}>
            <spriteMaterial map={glow} color={config.atmosphere} blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.4} />
          </sprite>
        )}
      </group>
      <mesh
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[Math.max(r * 1.6, 6), 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <Html center position={[0, r * 1.7, 0]} zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
        <button
          type="button"
          className={`${styles.label} ${showLabel ? styles.labelVisible : ''} ${highlight ? styles.labelActive : ''}`}
          tabIndex={showLabel ? 0 : -1}
          onClick={() => onSelect(config.id)}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
        >
          {config.label}
        </button>
      </Html>
    </group>
  );
}
