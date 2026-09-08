import * as THREE from 'three';
import { SYSTEM_RADIUS, type PlanetConfig, type ScreenConfig } from '@/data/planets';

export interface Layout {
  /** Aspect < 1: orbits are compressed and bodies enlarged so the system reads on a phone. */
  portrait: boolean;
  orbitScale: number;
  bodyScale: number;
}

export function getLayout(aspect: number): Layout {
  return aspect < 1
    ? { portrait: true, orbitScale: 0.72, bodyScale: 1.5 }
    : { portrait: false, orbitScale: 1, bodyScale: 1 };
}

export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const X_AXIS = new THREE.Vector3(1, 0, 0);
const UP = new THREE.Vector3(0, 1, 0);
const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const tmpC = new THREE.Vector3();
const tmpD = new THREE.Vector3();

/** Position of a planet on its orbit at orbit-clock time `t`. Sun is at the origin, orbits lie in XZ. */
export function planetPosition(cfg: PlanetConfig, t: number, layout: Layout, out: THREE.Vector3): THREE.Vector3 {
  const angle = cfg.phase0 + t * cfg.orbitSpeed;
  const r = cfg.orbitRadius * layout.orbitScale;
  out.set(r * Math.cos(angle), 0, r * Math.sin(angle));
  if (cfg.tilt) out.applyAxisAngle(X_AXIS, cfg.tilt);
  return out;
}

/** Orbit-plane extremes used to fit the overview: (±R,0,0) and (0,0,±R). */
const FIT_POINTS: [number, number, number][] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 0, 1],
  [0, 0, -1],
];

/**
 * Smallest camera distance (along a direction elevated by `elevation` above the orbit plane,
 * looking at the origin) at which every ring extreme projects inside ±usableX / ±usableY NDC.
 * Solved by bisection; cheap enough to run every frame.
 */
function fitDistance(R: number, elevation: number, halfV: number, aspect: number, usableX: number, usableY: number): number {
  const tanV = Math.tan(halfV);
  const tanH = tanV * aspect;
  const sinE = Math.sin(elevation);
  const cosE = Math.cos(elevation);
  let lo = R;
  let hi = R * 20;
  for (let i = 0; i < 24; i++) {
    const D = (lo + hi) / 2;
    let fits = true;
    for (const [px, py, pz] of FIT_POINTS) {
      const dx = px * R;
      const dy = py * R - D * sinE;
      const dz = pz * R - D * cosE;
      const depth = -(dy * sinE + dz * cosE);
      const sx = dx / (depth * tanH);
      const sy = (dy * cosE - dz * sinE) / (depth * tanV);
      if (depth <= 0 || Math.abs(sx) > usableX || Math.abs(sy) > usableY) {
        fits = false;
        break;
      }
    }
    if (fits) hi = D;
    else lo = D;
  }
  return hi;
}

/**
 * Camera that fits the whole system in view, elevated above the orbital plane and slowly
 * circling it. Usable NDC margins leave room for planet labels and the bottom nav.
 */
export function overviewCamera(
  aspect: number,
  fovDeg: number,
  elapsed: number,
  layout: Layout,
  outPos: THREE.Vector3,
  outLook: THREE.Vector3
): void {
  const R = SYSTEM_RADIUS * layout.orbitScale;
  const halfV = THREE.MathUtils.degToRad(fovDeg) / 2;
  const elevation = THREE.MathUtils.degToRad(layout.portrait ? 40 : 24);
  const distance = layout.portrait
    ? fitDistance(R, elevation, halfV, aspect, 0.68, 0.6)
    : fitDistance(R, elevation, halfV, aspect, 0.88, 0.82);
  const azimuth = elapsed * 0.03;
  outPos.set(
    distance * Math.cos(elevation) * Math.sin(azimuth),
    distance * Math.sin(elevation),
    distance * Math.cos(elevation) * Math.cos(azimuth)
  );
  // Look slightly below the sun on phones so the system sits above the bottom nav.
  outLook.set(0, layout.portrait ? -R * 0.06 : 0, 0);
}

/**
 * Camera framing a body of `radius` at `bodyPos`. Distance comes from how much of the viewport
 * the body should fill; the approach direction blends sunward + tangent + up so the lit face
 * shows; then the look point is shifted so the body sits off-center (left half on desktop,
 * upper area in portrait) leaving room for the content panel.
 */
export function planetCamera(
  radius: number,
  bodyPos: THREE.Vector3,
  aspect: number,
  fovDeg: number,
  layout: Layout,
  outPos: THREE.Vector3,
  outLook: THREE.Vector3,
  dirOverride?: THREE.Vector3
): void {
  const tanV = Math.tan(THREE.MathUtils.degToRad(fovDeg) / 2);
  const fillH = layout.portrait ? 0.22 : 0.36;
  const fillW = layout.portrait ? 0.5 : 0.28;
  const dist = Math.max(radius / (fillH * tanV), radius / (fillW * tanV * aspect));

  let dir: THREE.Vector3;
  if (dirOverride) {
    dir = tmpC.copy(dirOverride).normalize();
  } else {
    const toSun = tmpA.copy(bodyPos).negate().normalize();
    const tangent = tmpB.crossVectors(UP, toSun).normalize();
    dir = tmpC.copy(toSun).multiplyScalar(0.55).addScaledVector(tangent, 0.7).addScaledVector(UP, 0.45).normalize();
  }
  outPos.copy(bodyPos).addScaledVector(dir, dist);

  const ndcX = layout.portrait ? 0 : -0.5;
  const ndcY = layout.portrait ? 0.5 : 0;
  const forward = tmpA.subVectors(bodyPos, outPos).normalize();
  const right = tmpB.crossVectors(forward, UP).normalize();
  const camUp = tmpD.crossVectors(right, forward);
  const halfHeight = tanV * dist;
  const halfWidth = halfHeight * aspect;
  outLook.copy(bodyPos).addScaledVector(right, -ndcX * halfWidth).addScaledVector(camUp, -ndcY * halfHeight);
}

const screenQuat = new THREE.Quaternion();
const screenScale = new THREE.Vector3();

/**
 * Camera looking straight at the CRT glass along its normal, close enough that the whole
 * glass fills `fill` of the viewport's limiting dimension. Because the anchor's up is world Y
 * and the normal is horizontal, the page lands on screen as an upright, undistorted rectangle.
 */
export function screenCamera(
  anchor: THREE.Object3D,
  screen: ScreenConfig,
  aspect: number,
  fovDeg: number,
  layout: Layout,
  outPos: THREE.Vector3,
  outLook: THREE.Vector3
): void {
  anchor.getWorldPosition(outLook);
  anchor.getWorldQuaternion(screenQuat);
  anchor.getWorldScale(screenScale);
  const normal = tmpA.set(0, 0, 1).applyQuaternion(screenQuat);
  const halfW = (screen.width * screenScale.x) / 2;
  const halfH = (screen.height * screenScale.y) / 2;
  const tanV = Math.tan(THREE.MathUtils.degToRad(fovDeg) / 2);
  const fill = layout.portrait ? 0.9 : 0.8;
  const dist = Math.max(halfH / (tanV * fill), halfW / (tanV * aspect * fill));
  outPos.copy(outLook).addScaledVector(normal, dist);
}
