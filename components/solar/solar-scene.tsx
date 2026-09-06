'use client';

import type { RefObject } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { FocusId, ModelKey, Phase } from '@/data/planets';
import SolarSystem from './solar-system';
import CameraRig from './camera-rig';

interface SolarSceneProps {
  focus: FocusId;
  phase: Phase;
  orbitTime: RefObject<number>;
  onSelect: (id: FocusId) => void;
  onLoaded: (key: ModelKey) => void;
  onArrive: () => void;
}

export default function SolarScene({ focus, phase, orbitTime, onSelect, onLoaded, onArrive }: SolarSceneProps) {
  const isSmall = useMediaQuery('(max-width: 768px)');

  return (
    <Canvas
      style={{ position: 'absolute', inset: 0, background: '#000' }}
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 50, near: 0.5, far: 5000, position: [0, 0, 900] }}
    >
      <ambientLight intensity={0.25} />
      <hemisphereLight intensity={0.15} color="#bcd0ff" groundColor="#000000" />
      <Stars radius={2000} depth={500} count={isSmall ? 3000 : 7000} factor={4} saturation={0} fade={false} speed={1} />
      <SolarSystem focus={focus} phase={phase} orbitTime={orbitTime} onSelect={onSelect} onLoaded={onLoaded} />
      <CameraRig focus={focus} phase={phase} orbitTime={orbitTime} onArrive={onArrive} />
    </Canvas>
  );
}
