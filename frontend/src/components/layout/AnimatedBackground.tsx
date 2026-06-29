import { Canvas } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

function FloatingShape({ position, color, speed }: {
  position: [number, number, number];
  color: string;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * speed * 0.3;
      ref.current.rotation.y += delta * speed * 0.2;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={2}>
      <mesh ref={ref} position={position}>
        <icosahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>
    </Float>
  );
}

function ParticleField() {
  const count = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#6c5ce7" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#6c5ce7" />
        <Stars radius={100} depth={50} count={1000} factor={3} saturation={0} fade speed={0.5} />
        <ParticleField />
        <FloatingShape position={[-4, 2, -3]} color="#6c5ce7" speed={1.5} />
        <FloatingShape position={[3, -2, -4]} color="#00cec9" speed={1} />
        <FloatingShape position={[5, 3, -5]} color="#a29bfe" speed={0.8} />
        <FloatingShape position={[-3, -3, -2]} color="#00b894" speed={1.2} />
      </Canvas>
    </div>
  );
}
