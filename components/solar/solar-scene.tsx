'use client';

import { useRef, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { FocusId, ModelKey, Phase } from '@/data/planets';
import SolarSystem from './solar-system';
import CameraRig from './camera-rig';
import type { ScreenPower } from './computer-screen';

interface SolarSceneProps {
  focus: FocusId;
  phase: Phase;
  orbitTime: RefObject<number>;
  screenPower: ScreenPower;
  onSelect: (id: FocusId) => void;
  onLoaded: (key: ModelKey) => void;
  onArrive: () => void;
}

/**
 * Warm cabin light riding with the camera, after the instrument glow in 2001: whatever faces
 * the viewer picks up a soft amber wash while the sun still lights the day side.
 */
function CabinLight({ color, intensity }: { color: string; intensity: number }) {
  const ref = useRef<THREE.PointLight>(null);
  useFrame(({ camera }) => {
    ref.current?.position.copy(camera.position);
  });
  return <pointLight ref={ref} color={color} intensity={intensity} decay={0} />;
}

export default function SolarScene({ focus, phase, orbitTime, screenPower, onSelect, onLoaded, onArrive }: SolarSceneProps) {
  const isSmall = useMediaQuery('(max-width: 768px)');
  const screenRef = useRef<THREE.Object3D | null>(null);

  return (
    <Canvas
      style={{ position: 'absolute', inset: 0, background: '#070501' }}
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 50, near: 0.5, far: 5000, position: [0, 0, 900] }}
    >
      <ambientLight intensity={0.2} color="#ffcf8f" />
      <hemisphereLight intensity={0.16} color="#ffb347" groundColor="#140f04" />
      <CabinLight color="#ffab3d" intensity={0.32} />
      <Stars radius={2000} depth={500} count={isSmall ? 3000 : 7000} factor={4} saturation={0} fade={false} speed={1} />
      <SolarSystem
        focus={focus}
        phase={phase}
        orbitTime={orbitTime}
        screenRef={screenRef}
        screenPower={screenPower}
        onSelect={onSelect}
        onLoaded={onLoaded}
      />
      <CameraRig focus={focus} phase={phase} orbitTime={orbitTime} screenRef={screenRef} onArrive={onArrive} />
    </Canvas>
  );
}
