"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshDistortMaterial, Float } from "@react-three/drei";
import type { Mesh } from "three";

function AbstractShape() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#f4dbd6"
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.1}
          roughness={0.4}
          distort={0.4}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

export function Hero3D() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#f5e0e1" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#e5d0f5" />
        <Environment preset="apartment" />
        <AbstractShape />
      </Canvas>
    </div>
  );
}
