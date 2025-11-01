'use client';

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

interface SceneProject {
  imageUrl: string;
  accentColor: string;
}

interface FloatingProjectsSceneProps {
  items: SceneProject[];
}

function FloatingCard({
  texture,
  position,
  offset,
  accent,
}: {
  texture: THREE.Texture;
  position: THREE.Vector3;
  offset: number;
  accent: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const frameRef = useRef(0);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const elapsed = clock.getElapsedTime() + offset;
    meshRef.current.position.y = position.y + Math.sin(elapsed * 1.1) * 0.25;
    meshRef.current.rotation.y = 0.35 * Math.sin(elapsed * 0.6);
    meshRef.current.rotation.x = 0.18 * Math.cos(elapsed * 0.4);
    frameRef.current = elapsed;
  });

  const material = useMemo(() => new THREE.MeshStandardMaterial({ map: texture, roughness: 0.32, metalness: 0.12 }), [texture]);
  const frameMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(accent),
        metalness: 0.6,
        roughness: 0.3,
        emissive: new THREE.Color(accent).multiplyScalar(0.2),
        emissiveIntensity: 3,
      }),
    [accent]
  );

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow>
        <planeGeometry args={[2.2, 1.4, 20, 20]} />
        <primitive object={material} attach="material" />
      </mesh>
      <mesh position-z={-0.02} scale={[1.1, 1.12, 1]}>
        <planeGeometry args={[2.2, 1.4]} />
        <primitive object={frameMaterial} attach="material" />
      </mesh>
    </group>
  );
}

function SceneContent({ items }: FloatingProjectsSceneProps) {
  const textures = useLoader(THREE.TextureLoader, items.map((item) => item.imageUrl));
  textures.forEach((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 16;
  });

  const positions = useMemo(
    () => [
      new THREE.Vector3(-1.8, 0.2, -0.4),
      new THREE.Vector3(0.9, -0.1, 0.2),
      new THREE.Vector3(-0.3, -0.6, 0.9),
    ],
    []
  );

  return (
    <group>
      <ambientLight intensity={0.65} />
      <directionalLight position={[6, 8, 8]} intensity={1.2} color={0xffffff} castShadow />
      <pointLight position={[-6, -4, -6]} intensity={0.7} color={0x84ccf7} />
      {textures.map((texture, index) => (
        <FloatingCard
          key={items[index].imageUrl}
          texture={texture}
          position={positions[index % positions.length]}
          offset={index * 1.4}
          accent={items[index].accentColor}
        />
      ))}
    </group>
  );
}

export function FloatingProjectsScene({ items }: FloatingProjectsSceneProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-[2rem] border border-border/60 bg-background/60">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.25),transparent_60%)]" />
      {mounted ? (
        <Canvas
          camera={{ position: [0, 0, 5], fov: 42 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true }}
          shadows
        >
          <Suspense fallback={null}>
            <SceneContent items={items} />
          </Suspense>
        </Canvas>
      ) : (
        <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.28em] text-muted-foreground">
          Synthesising 3D preview...
        </div>
      )}
    </div>
  );
}
