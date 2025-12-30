'use client';
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Dodecahedron } from '@react-three/drei';

function Organ({ type, position, color, label }: { type: 'heart' | 'lung', position: [number, number, number], color: string, label: string }) {
    const meshRef = useRef<any>(null);
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Heartbeat or Breathing animation
            const time = state.clock.getElapsedTime();
            if (type === 'heart') {
                const scale = 1 + Math.sin(time * 10) * 0.1; // Fast beat
                meshRef.current.scale.set(scale, scale, scale);
            } else {
                const scale = 1 + Math.sin(time * 2) * 0.1; // Slow breath
                meshRef.current.scale.set(scale, scale * 1.5, scale); // Elongated lung
            }

            // Gentle float
            meshRef.current.rotation.y += delta * 0.1;
        }
    });

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onClick={() => setActive(!active)}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                {type === 'heart' ? (
                    <Dodecahedron args={[0.8]} />
                ) : (
                    <Sphere args={[0.7, 32, 32]} />
                )}
                <meshStandardMaterial
                    color={hovered ? '#ff4081' : color}
                    roughness={0.3}
                    metalness={0.1}
                    transparent
                    opacity={0.9}
                />
            </mesh>
            <Text
                position={[0, 1.5, 0]}
                fontSize={0.25}
                color="#2a2a2a"
                font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff" // Using a standard serif font URL or fallback
                anchorX="center"
                anchorY="middle"
            >
                {label}
            </Text>
        </group >
    );
}

export default function AnatomyViewer() {
    return (
        <div className="w-full h-80 bg-[#f9f7f1] border-2 border-dashed border-[#d4cfc0] overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/notebook-dark.png')]" />
            <div className="absolute top-4 left-4 z-10 bg-[#e3e0d5] px-4 py-1.5 shadow-sm border border-[#d4cfc0] flex items-center gap-2 transform -rotate-1">
                <span className="text-lg grayscale contrast-125">🫁</span>
                <span className="text-xs font-serif font-bold text-[#2a2a2a] tracking-wider uppercase">Fig 1.1: Anatomy</span>
            </div>
            <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className="text-[10px] text-[#8b8682] font-serif bg-[#f4f1ea] px-3 py-1 border border-[#d4cfc0] shadow-sm transform rotate-1">Interactive Plate</span>
            </div>

            {/* Ink Tone Filters applied to entire canvas */}
            <div className="w-full h-full filter sepia-[0.4] contrast-[1.1] brightness-[1.1] grayscale-[0.3]">
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                    <ambientLight intensity={1.2} />
                    <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1.5} castShadow />
                    <pointLight position={[-10, -5, -10]} color="#fff" intensity={0.5} />

                    <group position={[0, -0.5, 0]}>
                        {/* Colors adjusted to look like colored ink washes */}
                        <Organ type="lung" position={[-1.6, 0.2, 0]} color="#d6b4b4" label="Right Lung" />
                        <Organ type="heart" position={[0, -0.1, 0.5]} color="#c96a6a" label="Heart" />
                        <Organ type="lung" position={[1.6, 0.2, 0]} color="#d6b4b4" label="Left Lung" />
                    </group>

                    <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />
                </Canvas>
            </div>
        </div>
    );
}
