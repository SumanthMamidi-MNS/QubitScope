import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { BlochVector } from '../../types/quantum';

// =============================================================================
// INTERNAL 3D SCENE COMPONENT
// =============================================================================

interface BlochSphereSettings {
  animationSpeed: number;
  showLabels: boolean;
  showGrid: boolean;
}

interface BlochSphere3DProps {
  targetVector: BlochVector;
  settings: BlochSphereSettings;
}

const BlochSphere3D: React.FC<BlochSphere3DProps> = ({ targetVector, settings }) => {
  const vectorRef = useRef<THREE.Group>(null);
  const [currentVec, setCurrentVec] = useState<THREE.Vector3>(new THREE.Vector3(0, 1, 0)); // Start at |0>
  const [trailPoints, setTrailPoints] = useState<THREE.Vector3[]>([]);

  // Map quantum (x, y, z) to Three.js (x, z, y) where:
  // Three.js X = Quantum X
  // Three.js Y = Quantum Z (vertical)
  // Three.js Z = Quantum Y (depth)
  const targetThreeVec = new THREE.Vector3(
    targetVector.x,
    targetVector.z,
    targetVector.y
  );

  // Smoothly interpolate the state vector position on each frame
  useFrame((_, delta) => {
    let nextVec = targetThreeVec;
    
    if (settings.animationSpeed > 0) {
      const speed = Math.min(10 * settings.animationSpeed * delta, 0.15 * settings.animationSpeed);
      nextVec = currentVec.clone().lerp(targetThreeVec, speed);
      if (nextVec.length() > 0.001) {
        nextVec.normalize();
      }
    }
    
    setCurrentVec(nextVec);

    // Update the state vector group rotation and position
    if (vectorRef.current) {
      // Rotate the group to point along nextVec
      // The default cylinder/cone points along Y-axis, so we rotate from (0, 1, 0) to nextVec
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        nextVec
      );
      vectorRef.current.setRotationFromQuaternion(quaternion);
    }
  });

  // Manage the trail history
  useEffect(() => {
    setTrailPoints((prev) => {
      const nextPoints = [...prev, currentVec.clone()];
      // Keep only the last 60 points for the trail
      if (nextPoints.length > 60) {
        nextPoints.shift();
      }
      return nextPoints;
    });
  }, [currentVec]);

  // Convert trail points to Three.js coordinates array for R3F Line
  const trailCoords = trailPoints.map(p => [p.x, p.y, p.z] as [number, number, number]);

  // Circle generator
  const createCirclePoints = (axis: 'x' | 'y' | 'z', segments = 120) => {
    const points: [number, number, number][] = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      if (axis === 'x') points.push([0, cos, sin]); // Y-Z plane
      else if (axis === 'y') points.push([cos, 0, sin]); // X-Z plane (Equator in Three.js)
      else points.push([cos, sin, 0]); // X-Y plane
    }
    return points;
  };

  return (
    <>
      {/* Ambient Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1.5} />
      <directionalLight position={[-5, 5, -5]} intensity={0.8} />

      {/* Main Bloch Sphere Globe */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#0e1b30"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sphere Outer Wireframe Outline */}
      <mesh>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color="#1e293b"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Equator & Meridians */}
      {settings.showGrid && (
        <>
          {/* Equator (X-Y Quantum Plane = X-Z Three.js Plane) */}
          <Line
            points={createCirclePoints('y')}
            color="#334155"
            lineWidth={1}
            transparent
            opacity={0.6}
          />
          {/* Meridian 1 (X-Z Quantum Plane = X-Y Three.js Plane) */}
          <Line
            points={createCirclePoints('z')}
            color="#334155"
            lineWidth={0.5}
            transparent
            opacity={0.3}
          />
          {/* Meridian 2 (Y-Z Quantum Plane = Y-Z Three.js Plane) */}
          <Line
            points={createCirclePoints('x')}
            color="#334155"
            lineWidth={0.5}
            transparent
            opacity={0.3}
          />
        </>
      )}

      {/* Coordinate Axes */}
      {/* X Axis (Red) */}
      <Line points={[[-1.3, 0, 0], [1.3, 0, 0]]} color="#f43f5e" lineWidth={2} />
      {/* Y Axis (Green) */}
      <Line points={[[0, 0, -1.3], [0, 0, 1.3]]} color="#10b981" lineWidth={2} />
      {/* Z Axis (Blue) */}
      <Line points={[[0, -1.3, 0], [0, 1.3, 0]]} color="#3b82f6" lineWidth={2} />

      {/* Axis & State Labels using Glassmorphic HTML badges */}
      {settings.showLabels && (
        <>
          {/* Z Poles: |0⟩ and |1⟩ */}
          <Html position={[0, 1.15, 0]} center zIndexRange={[10, 0]}>
            <div className="px-2 py-0.5 rounded-md bg-slate-900/90 text-sky-400 text-xs font-semibold border border-sky-500/20 shadow-lg select-none">
              |0⟩
            </div>
          </Html>
          <Html position={[0, -1.15, 0]} center zIndexRange={[10, 0]}>
            <div className="px-2 py-0.5 rounded-md bg-slate-900/90 text-coral-400 text-xs font-semibold border border-coral-500/20 shadow-lg select-none">
              |1⟩
            </div>
          </Html>

          {/* X Poles: |+⟩ and |-⟩ */}
          <Html position={[1.4, 0, 0]} center zIndexRange={[10, 0]}>
            <div className="text-[10px] text-rose-400 font-bold select-none">X (+)</div>
          </Html>
          <Html position={[-1.4, 0, 0]} center zIndexRange={[10, 0]}>
            <div className="text-[10px] text-rose-500 font-bold select-none">-X</div>
          </Html>

          {/* Y Poles: |i+⟩ and |i-⟩ */}
          <Html position={[0, 0, 1.4]} center zIndexRange={[10, 0]}>
            <div className="text-[10px] text-emerald-400 font-bold select-none">Y (+)</div>
          </Html>
          <Html position={[0, 0, -1.4]} center zIndexRange={[10, 0]}>
            <div className="text-[10px] text-emerald-500 font-bold select-none">-Y</div>
          </Html>
        </>
      )}

      {/* State Vector Trail Line */}
      {trailCoords.length > 1 && (
        <Line
          points={trailCoords}
          color="#f97316"
          lineWidth={2}
          transparent
          opacity={0.4}
        />
      )}

      {/* State Vector Arrow */}
      <group ref={vectorRef}>
        {/* Vector Shaft */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.9, 8]} />
          <meshBasicMaterial color="#f97316" />
        </mesh>
        
        {/* Vector Arrowhead (Cone) */}
        <mesh position={[0, 0.92, 0]}>
          <coneGeometry args={[0.05, 0.12, 16]} />
          <meshBasicMaterial color="#f97316" />
        </mesh>

        {/* Tip Glow Sphere */}
        <mesh position={[0, 0.98, 0]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color="#fdba74" />
        </mesh>
      </group>

      {/* Active Vector Value Indicator Badge with perfect pill corners */}
      <Html position={[currentVec.x * 1.15, currentVec.y * 1.15, currentVec.z * 1.15]} center zIndexRange={[10, 0]}>
        <div className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] tracking-wider shadow-lg border border-amber-300 select-none pointer-events-none">
          |ψ⟩
        </div>
      </Html>
    </>
  );
};

// =============================================================================
// EXPORTED CONTAINER CANVAS COMPONENT
// =============================================================================

interface BlochSphereProps {
  blochVector: BlochVector;
  settings?: BlochSphereSettings;
}

export const BlochSphere: React.FC<BlochSphereProps> = ({
  blochVector,
  settings = { animationSpeed: 1.0, showLabels: true, showGrid: true }
}) => {
  return (
    <div className="w-full h-[320px] md:h-[450px] lg:h-[500px] relative rounded-2xl overflow-hidden glass-panel border border-white/5 canvas-container bg-slate-950/20">
      
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-radial-gradient from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Three.js R3F Canvas */}
      <Canvas
        camera={{ position: [2.2, 1.8, 2.2], fov: 45 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#070a13']} />
        
        <BlochSphere3D targetVector={blochVector} settings={settings} />
        
        {/* Controls to rotate the view */}
        <OrbitControls
          enableZoom={true}
          maxDistance={4.5}
          minDistance={1.8}
          enablePan={false}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Floating Instructions HUD */}
      <div className="absolute bottom-4 left-4 pointer-events-none select-none">
        <div className="px-2 py-1 rounded bg-slate-900/80 border border-white/5 text-[10px] text-slate-400 backdrop-blur-sm flex items-center gap-1.5 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Drag to rotate · Scroll to zoom</span>
        </div>
      </div>
    </div>
  );
};
