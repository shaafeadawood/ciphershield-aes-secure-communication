import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Preload } from '@react-three/drei';
import * as THREE from 'three';

interface DataNodeProps {
  count: number;
  speed: number;
}

const DataNodes: React.FC<DataNodeProps> = ({ count = 5000, speed = 0.5 }) => {
  const ref = useRef<THREE.Points>(null);
  const { size } = useThree();

  useEffect(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 2000;
      positions[i + 1] = (Math.random() - 0.5) * 2000;
      positions[i + 2] = (Math.random() - 0.5) * 2000;
    }
    if (ref.current) {
      ref.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }
  }, [count]);

  useFrame(() => {
    if (ref.current && ref.current.rotation) {
      ref.current.rotation.x += 0.0001 * speed;
      ref.current.rotation.y += 0.0001 * speed;
    }
  });

  return (
    <Points ref={ref} limit={count} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#00d9ff" size={2} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
};

interface CyberSpaceProps {
  isActive?: boolean;
}

export const CyberSpace: React.FC<CyberSpaceProps> = ({ isActive = true }) => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 1200], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <color attach="background" args={['#000000']} />
        
        {/* Ambient Light */}
        <ambientLight intensity={0.4} color={0x00d9ff} />
        
        {/* Point Light */}
        <pointLight position={[500, 500, 500]} intensity={1} color={0x00d9ff} />
        <pointLight position={[-500, -500, -500]} intensity={0.5} color={0xff006e} />

        {/* Data Nodes Visualization */}
        <DataNodes count={isActive ? 5000 : 1000} speed={isActive ? 1 : 0.3} />

        {/* Grid Floor */}
        <GridFloor />

        <Preload all />
      </Canvas>
    </div>
  );
};

const GridFloor: React.FC = () => {
  const gridHelper = new THREE.GridHelper(2000, 50, 0x00d9ff, 0x1a1a2e);
  gridHelper.position.y = -800;
  
  return <primitive object={gridHelper} />;
};
