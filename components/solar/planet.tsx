'use client';

import { Suspense, useEffect, useMemo, useRef, useState, type Ref } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { MODEL_URLS, type ModelKey, type PlanetConfig, type PlanetId, type ScreenConfig } from '@/data/planets';
import { useCenteredModel } from './use-centered-model';
import { getGlowTexture } from './glow-texture';
import ComputerScreen, { type ScreenPower } from './computer-screen';
import styles from './solar.module.css';

/**
 * spin: idle self-rotation.
 * face: turn so the screen points at the camera (while the computer is focused or being flown to).
 * hold: keep the current heading so the framed screen stays perfectly still.
 */
export type Orientation = 'spin' | 'face' | 'hold';

interface PlanetProps {
  config: PlanetConfig;
  interactive: boolean;
  showLabel: boolean;
  orientation: Orientation;
  screenPower: ScreenPower;
  onSelect: (id: PlanetId) => void;
  onLoaded: (key: ModelKey) => void;
  groupRef: Ref<THREE.Group>;
  /** Receives the screen anchor object so the camera rig can frame the glass. */
  screenRef?: Ref<THREE.Object3D>;
}

function PlanetModel({
  modelKey,
  radius,
  screen,
  screenPower,
  screenRef,
  onLoaded,
}: {
  modelKey: Exclude<ModelKey, 'sun'>;
  radius: number;
  screen?: ScreenConfig;
  screenPower: ScreenPower;
  screenRef?: Ref<THREE.Object3D>;
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
        {screen && (
          <group ref={screenRef} position={screen.position} rotation={[0, screen.yaw, 0]}>
            <ComputerScreen config={screen} power={screenPower} />
          </group>
        )}
      </group>
    </group>
  );
}

const FACE_LAMBDA = 3;
const worldPos = new THREE.Vector3();
const toCamera = new THREE.Vector3();

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

export default function Planet({
  config,
  interactive,
  showLabel,
  orientation,
  screenPower,
  onSelect,
  onLoaded,
  groupRef,
  screenRef,
}: PlanetProps) {
  const bodyRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const anchorRef = useRef<THREE.Object3D | null>(null);
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

  useFrame((state, delta) => {
    const spin = spinRef.current;
    const anchor = anchorRef.current;
    if (spin && orientation === 'face' && config.screen && anchor) {
      // Yaw so the glass normal points at the camera. Measured from the glass itself, not the
      // planet center: the glass is off-axis, so aiming from the center would never settle.
      anchor.getWorldPosition(worldPos);
      toCamera.subVectors(state.camera.position, worldPos);
      const target = Math.atan2(toCamera.x, toCamera.z) - config.screen.yaw;
      const current = spin.rotation.y;
      const diff = Math.atan2(Math.sin(target - current), Math.cos(target - current));
      spin.rotation.y = THREE.MathUtils.damp(current, current + diff, FACE_LAMBDA, delta);
    } else if (spin && orientation === 'spin' && config.spin) {
      spin.rotation.y += delta * config.spin;
    }
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
              <PlanetModel
                modelKey={config.model}
                radius={r}
                screen={config.screen}
                screenPower={screenPower}
                screenRef={(object) => {
                  anchorRef.current = object;
                  if (typeof screenRef === 'function') screenRef(object);
                  else if (screenRef) screenRef.current = object;
                }}
                onLoaded={onLoaded}
              />
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
