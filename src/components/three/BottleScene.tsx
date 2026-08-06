"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  ContactShadows,
  PresentationControls,
} from "@react-three/drei";
import { Bottle } from "./Bottle";

interface BottleSceneProps {
  liquidColor?: string;
  interactive?: boolean;
  className?: string;
}

function Loader() {
  return null; // handled by parent Suspense fallback outside canvas for premium loading screen
}

export function BottleScene({
  liquidColor,
  interactive = true,
  className,
}: BottleSceneProps) {
  return (
    <Canvas
      className={className}
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.4, 5], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["transparent"]} />
      <ambientLight intensity={0.4} />
      <spotLight
        position={[3, 5, 4]}
        angle={0.35}
        penumbra={0.8}
        intensity={2.2}
        castShadow
        color="#F6F1E7"
      />
      <pointLight position={[-4, 1, -2]} intensity={0.6} color="#C9A227" />

      <Suspense fallback={<Loader />}>
        {interactive ? (
          <PresentationControls
            global
            snap
            rotation={[0, 0.3, 0]}
            polar={[-0.3, 0.4]}
            azimuth={[-1, 1]}
          >
            <Bottle liquidColor={liquidColor} />
          </PresentationControls>
        ) : (
          <Bottle liquidColor={liquidColor} autoRotate />
        )}
        <Environment preset="city" />
        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.5}
          scale={8}
          blur={2.5}
          far={2}
        />
      </Suspense>

      {interactive && (
        <OrbitControls
          enableZoom
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
        />
      )}
    </Canvas>
  );
}
