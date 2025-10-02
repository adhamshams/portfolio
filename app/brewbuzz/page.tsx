// "use client";

// import styles from "./page.module.css";
// import Image from "next/image";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, useGLTF } from "@react-three/drei";
// import { Suspense, useMemo } from "react";

// function Model() {
//     const gltf = useGLTF("/Untitled.glb");
//     const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);
//     return <primitive object={scene} />;
// }

// useGLTF.preload("/Untitled.glb");

export default function BrewBuzz() {
    return(
        <div />
    )
//     return (
//         <div className={styles.page}>
//             <div className={styles.header}>
//                 <a href="/desktop">
//                     <Image
//                         src="/back.webp"
//                         alt="Back Button"
//                         width={40}
//                         height={40}
//                     />
//                 </a>
//                 <h2>Back</h2>
//             </div>
//             <div className={styles.heroSection}>
//                 <div style={{ width: "100%", height: 500 }}>
//                     <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
//                         <ambientLight intensity={0.5} />
//                         <directionalLight position={[3, 3, 3]} intensity={1} />
//                         <Suspense fallback={null}>
//                             <group scale={[5, 5, 5]}>
//                                 <Model />
//                             </group>
//                             <OrbitControls enableDamping />
//                         </Suspense>
//                     </Canvas>
//                 </div>
//             </div>
//         </div>
//     );
}
