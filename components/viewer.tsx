'use client';

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Stars } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import Loader from "./loader";
import TextOverlay from "./text-overlay";

type ModelProps = {
  onLoaded: () => void;
};

function CameraAnimation({ onAnimationComplete }: { onAnimationComplete: () => void }) {
  const { camera } = useThree();
  const animationProgress = useRef(0);
  const isAnimating = useRef(true);
  const hasCalledComplete = useRef(false);

  // Easing function: easeOutCubic for smooth deceleration
  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  useEffect(() => {
    // Set initial camera position (far away, cinematic start)
    camera.position.set(0, 0, 600);
    camera.lookAt(0, 0, 0);
    animationProgress.current = 0;
    isAnimating.current = true;
    hasCalledComplete.current = false;
  }, []);

  useFrame((state, delta) => {
    if (isAnimating.current) {
      // Animation duration in seconds
      const duration = 3;
      animationProgress.current += delta / duration;

      if (animationProgress.current >= 1) {
        animationProgress.current = 1;
        isAnimating.current = false;
        
        // Call completion callback only once
        if (!hasCalledComplete.current) {
          hasCalledComplete.current = true;
          onAnimationComplete();
        }
      }

      // Apply easing
      const eased = easeOutCubic(animationProgress.current);

      // Start and end positions
      const startZ = 600;
      const endZ = 50;
      // Offset the lookAt target to the right so sun appears on left side of screen
      const lookAtOffsetX = 20; // Adjust this value to control how far left the sun appears

      // Interpolate camera position with easing
      const currentZ = THREE.MathUtils.lerp(startZ, endZ, eased);
      const currentLookAtX = THREE.MathUtils.lerp(0, lookAtOffsetX, eased);
      camera.position.set(0, 0, currentZ);
      camera.lookAt(currentLookAtX, 0, 0);
    }
  });

  return null;
}

function Model({ onLoaded }: ModelProps) {
  const { scene } = useGLTF("/sun.glb");
  const modelRef = useRef<THREE.Object3D>(null);

  useEffect(() => {
    if (scene) {
      onLoaded();
    }
  }, [scene]);

  // Rotate the model slowly
  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.2; // Adjust speed by changing the multiplier
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
    />
  );
}

export default function Viewer() {
  const [isLoading, setIsLoading] = useState(true);
  const [cameraAnimationComplete, setCameraAnimationComplete] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {isLoading && <Loader />}
      <Canvas
        style={{ height: "100vh", background: "#000" }}
        camera={{ position: [0, 0, 50], fov: 50, far: 5000, near: 0.1 }}
      >
        <ambientLight intensity={0.5} />
        <Stars radius={2000} depth={500} count={9000} factor={4} saturation={0} fade={false} speed={1} />
        <Model onLoaded={() => setIsLoading(false)} />
        <CameraAnimation onAnimationComplete={() => setCameraAnimationComplete(true)} />
      </Canvas>
      {!isLoading && cameraAnimationComplete && <TextOverlay />}
    </div>
  );
}
