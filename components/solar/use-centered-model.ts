'use client';

import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Loads a GLB and returns the offset/scale that recenters it on the origin and normalizes its
 * bounding sphere to `radius`. Render as:
 *   <group scale={scale}><group position={offset}><primitive object={scene} /></group></group>
 */
export function useCenteredModel(url: string, radius: number) {
  const { scene } = useGLTF(url);

  return useMemo(() => {
    scene.updateWorldMatrix(true, true);
    const sphere = new THREE.Box3().setFromObject(scene).getBoundingSphere(new THREE.Sphere());
    const scale = sphere.radius > 0 ? radius / sphere.radius : 1;
    const offset = sphere.center.clone().negate();
    return { scene, scale, offset };
  }, [scene, radius]);
}
