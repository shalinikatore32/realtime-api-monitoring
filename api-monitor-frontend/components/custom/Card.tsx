"use client";

import { Canvas } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";

export default function ThreeCard() {
  return (
    <div className="w-[420px] h-[350px]">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <Environment preset="city" />

        <Float speed={2} rotationIntensity={1.2} floatIntensity={2.2}>
          <mesh>
            <boxGeometry args={[3, 2, 0.3]} />
            <meshStandardMaterial
              color="#1E1E28"
              metalness={0.6}
              roughness={0.24}
              envMapIntensity={1.1}
            />
          </mesh>
        </Float>
      </Canvas>
    </div>
  );
}
