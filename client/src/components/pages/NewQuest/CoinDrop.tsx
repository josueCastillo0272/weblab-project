import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import * as THREE from "three";

interface CoinDropProps {
  onLanded: () => void;
}

const TARGET_SCALE = 3.35;

export default function CoinDrop({ onLanded }: CoinDropProps) {
  const coinRef = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    if (!coinRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => onLanded(),
      });

      if (!coinRef.current) return () => ctx.revert();
      gsap.set(coinRef.current.scale, { x: 0.1, y: 0.1, z: 0.1 });
      gsap.set(coinRef.current.rotation, {
        x: Math.random() * Math.PI * 4,
        y: Math.random() * Math.PI * 4,
        z: Math.random() * Math.PI * 4,
      });

      tl.to(
        coinRef.current.rotation,
        {
          x: 0,
          y: 0,
          z: 0,
          duration: 3,
          ease: "power2.inOut",
        },
        0
      );

      tl.to(
        coinRef.current.scale,
        {
          x: TARGET_SCALE,
          y: TARGET_SCALE,
          z: TARGET_SCALE,
          duration: 1.5,
          delay: 1.5,
          ease: "expo.inOut",
        },
        0
      );
    }, coinRef);

    return () => ctx.revert();
  }, [onLanded]);

  return (
    <>
      <ambientLight intensity={2} />
      <directionalLight position={[2, 5, 5]} intensity={1.5} />

      <group ref={coinRef}>
        <mesh>
          <torusGeometry args={[1, 0.015, 32, 100]} />
          <meshStandardMaterial color="#000000" roughness={0.2} metalness={0.8} />
        </mesh>
      </group>
    </>
  );
}
