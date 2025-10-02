'use client';

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import Loader from "./loader";
import styles from "./viewer.module.css";

type ModelProps = {
  onLoaded: () => void;
};

function CameraAnimation() {
  const { camera } = useThree();
  
  useEffect(() => {
    // Set initial camera position (zoomed out)
    camera.position.set(0, 0, 350);
    camera.lookAt(0, 0, 0);
  }, []);

  useFrame((state, delta) => {
    if (camera.position.z > 50) {
      // Smooth zoom in
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 8, delta * 1.5);
    }
  });

  return null;
}

function Model({ onLoaded }: ModelProps) {
  const { scene } = useGLTF("/sun.glb");
  const modelRef = useRef<THREE.Object3D>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (scene) {
      onLoaded();
    }
  }, [scene]);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'grab' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

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
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    />
  );
}

export default function Viewer() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div>
      {isLoading && <Loader />}
      <Canvas 
        style={{ height: "100vh", background: "#000" }}
        camera={{ position: [0, 0, 50], fov: 50 }}
      >
        <ambientLight intensity={0.5} />
        <Model onLoaded={() => setIsLoading(false)} />
        <CameraAnimation />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI - Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}
