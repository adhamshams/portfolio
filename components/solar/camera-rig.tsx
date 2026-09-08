'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PLANET_BY_ID, SUN_RADIUS, type FocusId, type Phase } from '@/data/planets';
import { easeInOutCubic, getLayout, overviewCamera, planetCamera, planetPosition, screenCamera } from './camera-math';

interface CameraRigProps {
  focus: FocusId;
  phase: Phase;
  orbitTime: RefObject<number>;
  /** The computer's screen anchor; null until its model has loaded. */
  screenRef: RefObject<THREE.Object3D | null>;
  onArrive: () => void;
}

const SUN_VIEW_DIR = new THREE.Vector3(0, 0.25, 1).normalize();
const ORIGIN = new THREE.Vector3();
const goalPos = new THREE.Vector3();
const goalLook = new THREE.Vector3();
const bodyPos = new THREE.Vector3();

const INTRO_DURATION = 3.5;
const LOADING_DISTANCE_FACTOR = 3.5;
const FOLLOW_LAMBDA = 8;

function computeGoal(
  focus: FocusId,
  fovDeg: number,
  aspect: number,
  elapsed: number,
  orbitT: number,
  screenAnchor: THREE.Object3D | null
): void {
  const layout = getLayout(aspect);
  if (focus === 'overview') {
    overviewCamera(aspect, fovDeg, elapsed, layout, goalPos, goalLook);
    return;
  }
  if (focus === 'sun') {
    planetCamera(SUN_RADIUS, ORIGIN, aspect, fovDeg, layout, goalPos, goalLook, SUN_VIEW_DIR);
    return;
  }
  const xp = PLANET_BY_ID.xp;
  if (focus === 'screen' && xp.screen && screenAnchor) {
    screenCamera(screenAnchor, xp.screen, aspect, fovDeg, layout, goalPos, goalLook);
    return;
  }
  // Until the computer model is in, a screen focus frames the planet like any other.
  const cfg = focus === 'screen' ? xp : PLANET_BY_ID[focus];
  planetPosition(cfg, orbitT, layout, bodyPos);
  planetCamera(cfg.radius * layout.bodyScale, bodyPos, aspect, fovDeg, layout, goalPos, goalLook);
}

/**
 * Owns the camera. In `loading` it parks far out; in `intro`/`flying` it tweens from a snapshot
 * toward the live goal (so a moving planet is still hit exactly); in `idle` it follows the goal
 * with damping so orbit drift, the overview auto-orbit and resizes are absorbed smoothly.
 */
export default function CameraRig({ focus, phase, orbitTime, screenRef, onArrive }: CameraRigProps) {
  const onArriveRef = useRef(onArrive);
  const look = useRef(new THREE.Vector3());
  const flight = useRef({
    pending: false,
    active: false,
    progress: 0,
    duration: 1,
    fromPos: new THREE.Vector3(),
    fromLook: new THREE.Vector3(),
  });

  useEffect(() => {
    onArriveRef.current = onArrive;
  }, [onArrive]);

  useEffect(() => {
    if (phase === 'flying' || phase === 'intro') flight.current.pending = true;
  }, [focus, phase]);

  useFrame((state, delta) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const aspect = state.size.width / state.size.height;
    computeGoal(focus, camera.fov, aspect, state.clock.elapsedTime, orbitTime.current, screenRef.current);

    const f = flight.current;
    const lookAt = look.current;

    if (phase === 'loading') {
      camera.position.copy(goalPos).multiplyScalar(LOADING_DISTANCE_FACTOR);
      lookAt.copy(goalLook);
    } else if (phase === 'intro' || phase === 'flying') {
      if (f.pending) {
        f.pending = false;
        f.active = true;
        f.progress = 0;
        f.fromPos.copy(camera.position);
        f.fromLook.copy(lookAt);
        f.duration = phase === 'intro' ? INTRO_DURATION : THREE.MathUtils.clamp(f.fromPos.distanceTo(goalPos) / 110, 1.6, 3);
      }
      if (f.active) {
        f.progress = Math.min(1, f.progress + delta / f.duration);
        const eased = easeInOutCubic(f.progress);
        camera.position.lerpVectors(f.fromPos, goalPos, eased);
        lookAt.lerpVectors(f.fromLook, goalLook, eased);
        if (f.progress >= 1) {
          f.active = false;
          onArriveRef.current();
        }
      } else {
        camera.position.copy(goalPos);
        lookAt.copy(goalLook);
      }
    } else {
      const k = 1 - Math.exp(-FOLLOW_LAMBDA * delta);
      camera.position.lerp(goalPos, k);
      lookAt.lerp(goalLook, k);
    }

    camera.lookAt(lookAt);
  });

  return null;
}
