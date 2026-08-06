"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

interface BottleProps {
  liquidColor?: string;
  capColor?: string;
  autoRotate?: boolean;
}

export function Bottle({
  liquidColor = "#C9A227",
  capColor = "#0B0B0C",
  autoRotate = true,
}: BottleProps) {
  const group = useRef<THREE.Group>(null);
  const liquid = useRef<THREE.Mesh>(null);

  const bottleShape = useMemo(() => {
    // Lathe-generated silhouette for an elegant tapered flacon
    const points = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.62, 0.0),
      new THREE.Vector2(0.62, 0.08),
      new THREE.Vector2(0.68, 0.16),
      new THREE.Vector2(0.7, 1.3),
      new THREE.Vector2(0.66, 1.55),
      new THREE.Vector2(0.5, 1.66),
      new THREE.Vector2(0.5, 1.86),
      new THREE.Vector2(0.28, 1.9),
      new THREE.Vector2(0.28, 2.0),
      new THREE.Vector2(0.0, 2.0),
    ];
    return points;
  }, []);

  useFrame((state) => {
    if (autoRotate && group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.25;
    }
    if (liquid.current) {
      liquid.current.rotation.y = state.clock.elapsedTime * 0.12;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.6}>
      <group ref={group} position={[0, -1, 0]}>
        {/* Glass bottle body */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <latheGeometry args={[bottleShape, 64]} />
          <MeshTransmissionMaterial
            samples={6}
            resolution={512}
            thickness={0.35}
            roughness={0.04}
            transmission={1}
            ior={1.5}
            chromaticAberration={0.03}
            anisotropy={0.1}
            distortion={0.05}
            distortionScale={0.2}
            temporalDistortion={0.1}
            color="#ffffff"
            attenuationColor="#F6F1E7"
            attenuationDistance={1.2}
          />
        </mesh>

        {/* Liquid inside */}
        <mesh ref={liquid} position={[0, 0.05, 0]} scale={[0.9, 0.86, 0.9]}>
          <latheGeometry args={[bottleShape.slice(0, 6), 48]} />
          <meshPhysicalMaterial
            color={liquidColor}
            transmission={0.55}
            roughness={0.15}
            thickness={0.6}
            ior={1.35}
            metalness={0}
            clearcoat={0.4}
          />
        </mesh>

        {/* Gold cap */}
        <mesh position={[0, 2.08, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.32, 0.36, 32]} />
          <meshStandardMaterial color={capColor} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 2.28, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.14, 0.12, 32]} />
          <meshStandardMaterial color="#C9A227" metalness={1} roughness={0.15} />
        </mesh>

        {/* Ambient mist / sparkle particles */}
        <Sparkles
          count={40}
          scale={[2, 3, 2]}
          size={2}
          speed={0.3}
          opacity={0.35}
          color="#E4C767"
          position={[0, 1, 0]}
        />
      </group>
    </Float>
  );
}
