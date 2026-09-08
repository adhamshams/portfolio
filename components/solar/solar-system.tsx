'use client';

import { useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { MODEL_URLS, PLANETS, planetOfFocus, type FocusId, type ModelKey, type Phase, type PlanetId } from '@/data/planets';
import { getLayout, planetPosition } from './camera-math';
import Sun from './sun';
import Planet, { type Orientation } from './planet';
import type { ScreenPower } from './computer-screen';

useGLTF.preload(MODEL_URLS.sun);
useGLTF.preload(MODEL_URLS.computer);

interface SolarSystemProps {
  focus: FocusId;
  phase: Phase;
  /** Shared orbit clock, advanced here and read by the camera rig. */
  orbitTime: RefObject<number>;
  /** Filled with the computer's screen anchor once its model is in the scene. */
  screenRef: RefObject<THREE.Object3D | null>;
  screenPower: ScreenPower;
  onSelect: (id: FocusId) => void;
  onLoaded: (key: ModelKey) => void;
}

/** Orbit clock speed: full in the overview, a slow drift when a body is focused, frozen on the screen. */
function orbitSpeedFor(focus: FocusId): number {
  if (focus === 'overview') return 1;
  if (focus === 'screen') return 0;
  return 0.2;
}

function OrbitRing({ radius, tilt, dim }: { radius: number; tilt: number; dim: boolean }) {
  const points = useMemo(() => {
    const segments = 128;
    return Array.from({ length: segments + 1 }, (_, i) => {
      const a = (i / segments) * Math.PI * 2;
      return new THREE.Vector3(radius * Math.cos(a), 0, radius * Math.sin(a));
    });
  }, [radius]);

  return <Line points={points} color="#ffffff" lineWidth={1} transparent opacity={dim ? 0.06 : 0.18} rotation={[tilt, 0, 0]} />;
}

export default function SolarSystem({ focus, phase, orbitTime, screenRef, screenPower, onSelect, onLoaded }: SolarSystemProps) {
  const groupRefs = useRef<Partial<Record<PlanetId, THREE.Group | null>>>({});
  const ringsRef = useRef<THREE.Group>(null);
  const timeScale = useRef(1);
  const idle = phase === 'idle';
  const showLabels = idle && focus === 'overview';
  const focusedPlanet = planetOfFocus(focus);

  const orientationFor = (id: PlanetId): Orientation => {
    if (id !== focusedPlanet) return 'spin';
    return focus === 'screen' && idle ? 'hold' : 'face';
  };

  useFrame((state, delta) => {
    const layout = getLayout(state.size.width / state.size.height);
    // Planets keep drifting slowly while one is focused so the system never looks frozen.
    timeScale.current = THREE.MathUtils.damp(timeScale.current, orbitSpeedFor(focus), 2, delta);
    orbitTime.current += delta * timeScale.current;

    for (const planet of PLANETS) {
      const group = groupRefs.current[planet.id];
      if (!group) continue;
      planetPosition(planet, orbitTime.current, layout, group.position);
      group.scale.setScalar(layout.bodyScale);
    }
    if (ringsRef.current) ringsRef.current.scale.setScalar(layout.orbitScale);
  });

  return (
    <>
      <Sun interactive={idle && focus !== 'sun'} onSelect={() => onSelect('sun')} onLoaded={onLoaded} />
      <group ref={ringsRef}>
        {PLANETS.map((planet) => (
          <OrbitRing key={planet.id} radius={planet.orbitRadius} tilt={planet.tilt ?? 0} dim={focus !== 'overview'} />
        ))}
      </group>
      {PLANETS.map((planet) => (
        <Planet
          key={planet.id}
          config={planet}
          interactive={idle && focusedPlanet !== planet.id}
          showLabel={showLabels}
          orientation={orientationFor(planet.id)}
          screenPower={screenPower}
          onSelect={onSelect}
          onLoaded={onLoaded}
          groupRef={(group) => {
            groupRefs.current[planet.id] = group;
          }}
          screenRef={planet.screen ? screenRef : undefined}
        />
      ))}
    </>
  );
}
