'use client';

import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { useGLTF, Stars } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import Loader from "./loader";
import TextOverlay from "./text-overlay";

type ModelProps = {
  onLoaded: () => void;
};

function CameraAnimation({ onAnimationComplete }: { onAnimationComplete: () => void }) {
  const { camera, size } = useThree();
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
      
      // Calculate lookAtOffsetX dynamically based on screen aspect ratio
      const pCamera = camera as THREE.PerspectiveCamera;
      const vFOV = THREE.MathUtils.degToRad(pCamera.fov);
      const height = 2 * Math.tan(vFOV / 2) * endZ;
      const aspect = size.width / size.height;
      const width = height * aspect;
      const lookAtOffsetX = width / 4;

      // Interpolate camera position with easing
      const currentZ = THREE.MathUtils.lerp(startZ, endZ, eased);
      const currentLookAtX = THREE.MathUtils.lerp(0, lookAtOffsetX, eased);
      camera.position.set(0, 0, currentZ);
      camera.lookAt(currentLookAtX, 0, 0);
    }
  });

  return null;
}

function TransitionAnimation({ onAnimationComplete }: { onAnimationComplete: () => void }) {
  const { camera, size } = useThree();
  const animationProgress = useRef(0);
  const isAnimating = useRef(true);
  const hasCalledComplete = useRef(false);

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  useFrame((state, delta) => {
    if (isAnimating.current) {
      const duration = 3;
      animationProgress.current += delta / duration;

      if (animationProgress.current >= 1) {
        animationProgress.current = 1;
        isAnimating.current = false;
        if (!hasCalledComplete.current) {
          hasCalledComplete.current = true;
          onAnimationComplete();
        }
      }

      const eased = easeInOutCubic(animationProgress.current);

      // Calculate lookAt offset
      const pCamera = camera as THREE.PerspectiveCamera;
      const vFOV = THREE.MathUtils.degToRad(pCamera.fov);
      const height = 2 * Math.tan(vFOV / 2) * 50; // distance is 50
      const aspect = size.width / size.height;
      const width = height * aspect;
      const lookAtOffset = width / 4;

      // Start: Sun view (0, 0, 50) looking at (lookAtOffset, 0, 0)
      // End: Earth view (150, 0, 50) looking at (150 + lookAtOffset, 0, 0)
      
      const startPos = new THREE.Vector3(0, 0, 50);
      const endPos = new THREE.Vector3(150, 0, 50);
      
      const startLookAt = new THREE.Vector3(lookAtOffset, 0, 0);
      const endLookAt = new THREE.Vector3(150 + lookAtOffset, 0, 0);

      const currentPos = new THREE.Vector3().lerpVectors(startPos, endPos, eased);
      const currentLookAt = new THREE.Vector3().lerpVectors(startLookAt, endLookAt, eased);

      camera.position.copy(currentPos);
      camera.lookAt(currentLookAt);
    }
  });

  return null;
}

function TransitionToComputerAnimation({ onAnimationComplete }: { onAnimationComplete: () => void }) {
  const { camera, size } = useThree();
  const animationProgress = useRef(0);
  const isAnimating = useRef(true);
  const hasCalledComplete = useRef(false);

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  useFrame((state, delta) => {
    if (isAnimating.current) {
      const duration = 3;
      animationProgress.current += delta / duration;

      if (animationProgress.current >= 1) {
        animationProgress.current = 1;
        isAnimating.current = false;
        if (!hasCalledComplete.current) {
          hasCalledComplete.current = true;
          onAnimationComplete();
        }
      }

      const eased = easeInOutCubic(animationProgress.current);

      // Calculate lookAt offset
      const pCamera = camera as THREE.PerspectiveCamera;
      const vFOV = THREE.MathUtils.degToRad(pCamera.fov);
      const height = 2 * Math.tan(vFOV / 2) * 50; // distance is 50
      const aspect = size.width / size.height;
      const width = height * aspect;
      const lookAtOffset = width / 4;

      // Start: Earth view (150, 0, 50) looking at (150 + lookAtOffset, 0, 0)
      // End: Computer view (300, 0, 50) looking at (300 + lookAtOffset, 0, 0)
      
      const startPos = new THREE.Vector3(150, 0, 50);
      const endPos = new THREE.Vector3(300, 0, 50);
      
      const startLookAt = new THREE.Vector3(150 + lookAtOffset, 0, 0);
      const endLookAt = new THREE.Vector3(300 + lookAtOffset, 0, 0);

      const currentPos = new THREE.Vector3().lerpVectors(startPos, endPos, eased);
      const currentLookAt = new THREE.Vector3().lerpVectors(startLookAt, endLookAt, eased);

      camera.position.copy(currentPos);
      camera.lookAt(currentLookAt);
    }
  });

  return null;
}

function SunModel({ onLoaded }: ModelProps) {
  const { scene } = useGLTF("/sun.glb");
  const modelRef = useRef<THREE.Object3D>(null);
  const [hovered, setHover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const previousMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (dragging) {
      document.body.style.cursor = 'grabbing';
      const onMove = (e: PointerEvent) => {
        if (modelRef.current) {
            const deltaX = e.clientX - previousMouse.current.x;
            const deltaY = e.clientY - previousMouse.current.y;
            modelRef.current.rotation.y += deltaX * 0.005;
            modelRef.current.rotation.x += deltaY * 0.005;
            previousMouse.current = { x: e.clientX, y: e.clientY };
        }
      };
      const onUp = () => {
        setDragging(false);
      };
      
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      return () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };
    } else {
      document.body.style.cursor = hovered ? 'grab' : 'auto';
    }
  }, [dragging, hovered]);

  useEffect(() => {
    if (scene) {
      onLoaded();
    }
  }, [scene]);

  // Rotate the model slowly
  useFrame((state, delta) => {
    if (modelRef.current && !dragging) {
      modelRef.current.rotation.y += delta * 0.2; // Adjust speed by changing the multiplier
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setDragging(true);
        previousMouse.current = { x: e.clientX, y: e.clientY };
      }}
    />
  );
}

function EarthModel({ onLoaded }: ModelProps) {
  const { scene } = useGLTF("/earth.glb");
  const modelRef = useRef<THREE.Object3D>(null);
  const [hovered, setHover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const previousMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (dragging) {
      document.body.style.cursor = 'grabbing';
      const onMove = (e: PointerEvent) => {
        if (modelRef.current) {
            const deltaX = e.clientX - previousMouse.current.x;
            const deltaY = e.clientY - previousMouse.current.y;
            modelRef.current.rotation.y += deltaX * 0.005;
            modelRef.current.rotation.x += deltaY * 0.005;
            previousMouse.current = { x: e.clientX, y: e.clientY };
        }
      };
      const onUp = () => {
        setDragging(false);
      };
      
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      return () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };
    } else {
      document.body.style.cursor = hovered ? 'grab' : 'auto';
    }
  }, [dragging, hovered]);

  useEffect(() => {
    if (scene) {
      onLoaded();
    }
  }, [scene]);

  useFrame((state, delta) => {
    if (modelRef.current && !dragging) {
      modelRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      position={[150, 0, 0]}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setDragging(true);
        previousMouse.current = { x: e.clientX, y: e.clientY };
      }}
    />
  );
}

function ComputerModel({ onLoaded }: ModelProps) {
  const { scene } = useGLTF("/computer.glb");
  const modelRef = useRef<THREE.Object3D>(null);
  const [hovered, setHover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const previousMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (dragging) {
      document.body.style.cursor = 'grabbing';
      const onMove = (e: PointerEvent) => {
        if (modelRef.current) {
            const deltaX = e.clientX - previousMouse.current.x;
            const deltaY = e.clientY - previousMouse.current.y;
            modelRef.current.rotation.y += deltaX * 0.005;
            modelRef.current.rotation.x += deltaY * 0.005;
            previousMouse.current = { x: e.clientX, y: e.clientY };
        }
      };
      const onUp = () => {
        setDragging(false);
      };
      
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      return () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };
    } else {
      document.body.style.cursor = hovered ? 'grab' : 'auto';
    }
  }, [dragging, hovered]);

  useEffect(() => {
    if (scene) {
      onLoaded();
    }
  }, [scene]);

  return (
    <primitive
      ref={modelRef}
      object={scene}
      position={[300, 0, 0]}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setDragging(true);
        previousMouse.current = { x: e.clientX, y: e.clientY };
      }}
    />
  );
}

export default function Viewer() {
  const [sunLoaded, setSunLoaded] = useState(false);
  const [earthLoaded, setEarthLoaded] = useState(false);
  const [computerLoaded, setComputerLoaded] = useState(false);
  const isLoading = !sunLoaded || !earthLoaded || !computerLoaded;
  const [stage, setStage] = useState<'sun' | 'transitionToEarth' | 'earth' | 'transitionToComputer' | 'computer'>('sun');
  const [cameraAnimationComplete, setCameraAnimationComplete] = useState(false);

  const handleSunContinue = () => {
    setStage('transitionToEarth');
  };

  const handleEarthContinue = () => {
    setStage('transitionToComputer');
  };

  const handleComputerContinue = () => {
    window.location.href = "/user";
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {isLoading && <Loader />}
      <Canvas
        style={{ height: "100vh", background: "#000" }}
        camera={{ position: [0, 0, 50], fov: 50, far: 5000, near: 0.1 }}
      >
        <ambientLight intensity={1} />
        <Stars radius={2000} depth={500} count={9000} factor={4} saturation={0} fade={false} speed={1} />
        <SunModel onLoaded={() => setSunLoaded(true)} />
        <EarthModel onLoaded={() => setEarthLoaded(true)} />
        <ComputerModel onLoaded={() => setComputerLoaded(true)} />
        
        {stage === 'sun' && (
          <CameraAnimation onAnimationComplete={() => setCameraAnimationComplete(true)} />
        )}
        
        {stage === 'transitionToEarth' && (
          <TransitionAnimation onAnimationComplete={() => setStage('earth')} />
        )}

        {stage === 'transitionToComputer' && (
          <TransitionToComputerAnimation onAnimationComplete={() => setStage('computer')} />
        )}
      </Canvas>
      
      {!isLoading && cameraAnimationComplete && stage === 'sun' && (
        <TextOverlay stage="sun" onContinue={handleSunContinue} />
      )}
      
      {!isLoading && stage === 'earth' && (
        <TextOverlay stage="earth" onContinue={handleEarthContinue} />
      )}

      {!isLoading && stage === 'computer' && (
        <TextOverlay stage="computer" onContinue={handleComputerContinue} />
      )}
    </div>
  );
}
