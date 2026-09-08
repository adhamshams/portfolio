'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { ScreenConfig } from '@/data/planets';
import styles from './computer-screen.module.css';

/**
 * standby: page mounted but dark, loading while the panel is read.
 * warming: camera is flying in; still dark.
 * on:      CRT power-on flicker, then interactive.
 * off:     unmounted (after a power-off collapse if it was on).
 */
export type ScreenPower = 'off' | 'standby' | 'warming' | 'on';

interface ComputerScreenProps {
  config: ScreenConfig;
  power: ScreenPower;
}

const OFF_ANIMATION_MS = 500;
/**
 * The GLB paints a lit purple picture on the monitor, flush with the glass. A dark, glossy
 * rounded rectangle just in front of it keeps the tube black until the page is powered on.
 */
const TUBE_OFFSET = 0.25;
const TUBE_CORNER = 0.05;
const CORNERS: [number, number][] = [
  [-1, -1],
  [1, -1],
  [1, 1],
  [-1, 1],
];
const corner = new THREE.Vector3();

function roundedRect(width: number, height: number, radius: number): THREE.ShapeGeometry {
  const w = width / 2;
  const h = height / 2;
  const r = Math.min(radius, w, h);
  const shape = new THREE.Shape();
  shape.moveTo(-w + r, -h);
  shape.lineTo(w - r, -h);
  shape.quadraticCurveTo(w, -h, w, -h + r);
  shape.lineTo(w, h - r);
  shape.quadraticCurveTo(w, h, w - r, h);
  shape.lineTo(-w + r, h);
  shape.quadraticCurveTo(-w, h, -w, h - r);
  shape.lineTo(-w, -h + r);
  shape.quadraticCurveTo(-w, -h, -w + r, -h);
  return new THREE.ShapeGeometry(shape, 8);
}

/**
 * Old portfolio page rendered onto the CRT glass, placed inside the screen anchor group.
 *
 * The page is a DOM iframe laid out flat: every frame the glass rectangle is projected to
 * viewport pixels and the iframe is placed there with a 2D translate + scale. A true 3D CSS
 * transform (drei's `Html transform`) would track the glass at any angle, but Safari cannot
 * scroll anything inside an iframe under a perspective transform, and the page is only ever
 * visible once the camera is square on to the glass anyway.
 */
export default function ComputerScreen({ config, power }: ComputerScreenProps) {
  const gl = useThree((state) => state.gl);
  const groupRef = useRef<THREE.Group>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [el] = useState(() => document.createElement('div'));
  const rootRef = useRef<Root | null>(null);
  const [mounted, setMounted] = useState(power !== 'off');
  const [closing, setClosing] = useState(false);
  const [wasOn, setWasOn] = useState(false);

  useEffect(() => {
    if (power !== 'off') {
      setMounted(true);
      setClosing(false);
      if (power === 'on') setWasOn(true);
      return;
    }
    if (!wasOn) {
      setMounted(false);
      return;
    }
    setClosing(true);
    const timer = setTimeout(() => {
      setMounted(false);
      setClosing(false);
      setWasOn(false);
    }, OFF_ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [power, wasOn]);

  const tube = useMemo(
    () => roundedRect(config.width * config.inset, config.height * config.inset, config.height * TUBE_CORNER),
    [config.width, config.height, config.inset]
  );
  useEffect(() => () => tube.dispose(), [tube]);

  // The page lives in its own DOM root beside the canvas, like drei's Html does.
  useLayoutEffect(() => {
    const parent = gl.domElement.parentNode as HTMLElement | null;
    if (!parent) return;
    el.className = styles.layer;
    const root = createRoot(el);
    rootRef.current = root;
    parent.appendChild(el);
    return () => {
      rootRef.current = null;
      parent.removeChild(el);
      root.unmount();
    };
  }, [gl, el]);

  const [width, height] = config.viewport;
  const live = power === 'on' && !closing;
  const state = closing ? styles.off : power === 'on' ? styles.on : '';

  useLayoutEffect(() => {
    rootRef.current?.render(
      mounted ? (
        <div
          ref={(node) => {
            boxRef.current = node;
          }}
          className={`${styles.box} ${live ? styles.live : ''}`}
          style={{ width, height }}
        >
          <div className={`${styles.screen} ${state}`} style={{ width, height }}>
            <iframe className={styles.frame} src={config.url} aria-label="2025 Portfolio" loading="eager" />
            <div className={styles.tube} aria-hidden="true" />
          </div>
        </div>
      ) : null
    );
  });

  useFrame(({ camera, size }) => {
    const box = boxRef.current;
    const group = groupRef.current;
    if (!box || !group) return;
    camera.updateMatrixWorld();
    group.updateWorldMatrix(true, false);
    const hw = (config.width * config.inset) / 2;
    const hh = (config.height * config.inset) / 2;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const [sx, sy] of CORNERS) {
      corner.set(sx * hw, sy * hh, 0).applyMatrix4(group.matrixWorld).project(camera);
      if (corner.z > 1) {
        box.style.display = 'none';
        return;
      }
      const x = ((corner.x + 1) / 2) * size.width;
      const y = ((1 - corner.y) / 2) * size.height;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    box.style.display = '';
    box.style.transform = `translate(${minX}px, ${minY}px) scale(${(maxX - minX) / width}, ${(maxY - minY) / height})`;
  });

  return (
    <>
      <mesh geometry={tube} position={[0, 0, TUBE_OFFSET]}>
        <meshStandardMaterial color="#050505" roughness={0.3} metalness={0.1} />
      </mesh>
      <group ref={groupRef} position={[0, 0, TUBE_OFFSET + 0.02]} />
    </>
  );
}
