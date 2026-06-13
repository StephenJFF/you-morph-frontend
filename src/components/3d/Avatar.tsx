import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { Suspense, useEffect, useMemo } from 'react';
import { useEngineStore } from '../../store/engineStore';
import * as THREE from 'three';
import { GhostShader } from './shaders/GhostShader';
import { HeatMapShader } from './shaders/HeatMapShader';

const AvatarMesh = ({ position = [0, 0, 0] as [number, number, number], isGhost = false }) => {
  const influences = useEngineStore((state) => state.influences);
  const stats = useEngineStore((state) => state.stats);
  const viewMode = useEngineStore((state) => state.viewMode);

  // Load appropriate model
  const modelPath = `/models/avatar-${stats.gender}.glb`;
  const { scene } = useGLTF(modelPath);

  // Clone scene so multiple instances (Ghost + Main) don't conflict
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const bodyMesh = useMemo(() => {
    let mesh: THREE.Mesh | null = null;
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        mesh = child as THREE.Mesh;
      }
    });
    return mesh;
  }, [clonedScene]) as THREE.Mesh | null;

  const ghostMaterial = useMemo(() => new THREE.ShaderMaterial({
    ...GhostShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  }), []);

  const heatMapMaterial = useMemo(() => new THREE.ShaderMaterial({
    ...HeatMapShader,
    vertexColors: true,
    side: THREE.DoubleSide,
  }), []);

  const standardMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: isGhost ? "#8888ff" : "#E0C8B0",
    transparent: isGhost,
    opacity: isGhost ? 0.4 : 1,
    roughness: 0.6,
    metalness: 0.0,
  }), [isGhost]);

  // Inject aDelta for heat map based on morph target weights
  useEffect(() => {
    if (bodyMesh && bodyMesh.geometry) {
      const geo = bodyMesh.geometry;
      // If we don't have aDelta, we can use the position delta from weight_down morph
      if (!geo.attributes.aDelta) {
        const count = geo.attributes.position.count;
        const deltas = new Float32Array(count);
        
        // Use the weight_down morph target (index 3) to simulate "heat"
        const morphTargets = (geo as any).morphAttributes?.position;
        if (morphTargets && morphTargets[3]) {
          const weightDownDelta = morphTargets[3].array;
          for (let i = 0; i < count; i++) {
            const dx = weightDownDelta[i * 3];
            const dy = weightDownDelta[i * 3 + 1];
            const dz = weightDownDelta[i * 3 + 2];
            deltas[i] = Math.sqrt(dx*dx + dy*dy + dz*dz) * 5.0; 
          }
        }
        geo.setAttribute('aDelta', new THREE.BufferAttribute(deltas, 1));
      }
    }
  }, [bodyMesh]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (ghostMaterial.uniforms) ghostMaterial.uniforms.uTime.value = time;
    if (heatMapMaterial.uniforms) heatMapMaterial.uniforms.uTime.value = time;
  });

  useEffect(() => {
    if (bodyMesh && bodyMesh.morphTargetInfluences) {
      const morphInfluences = bodyMesh.morphTargetInfluences;
      const dict = (bodyMesh as any).morphTargetDictionary;
      
      morphInfluences.fill(0);

      if (isGhost) {
        if (dict['weight_up'] !== undefined) morphInfluences[dict['weight_up']] = 0.6;
        if (dict['waist_up'] !== undefined) morphInfluences[dict['waist_up']] = 0.4;
      } else {
        const p = influences.weight; 
        
        if (p < 0.5) {
          const factor = (0.5 - p) * 2.0; 
          if (dict['weight_up'] !== undefined) morphInfluences[dict['weight_up']] = 0.6 * factor;
        } else {
          const factor = (p - 0.5) * 2.0; 
          if (dict['weight_down'] !== undefined) morphInfluences[dict['weight_down']] = 0.4 * factor;
        }

        const applyMorph = (name: string, value: number) => {
          if (value > 0.5) {
            const factor = (value - 0.5) * 2.0;
            if (dict[`${name}_up`] !== undefined) morphInfluences[dict[`${name}_up`]] = factor;
          } else {
            const factor = (0.5 - value) * 2.0;
            if (dict[`${name}_down`] !== undefined) morphInfluences[dict[`${name}_down`]] = factor;
          }
        };

        applyMorph('waist', influences.waist);
        applyMorph('hips', influences.hips);
        applyMorph('chest', influences.chest);
        applyMorph('arm_girth', influences.arm);
        applyMorph('thigh_girth', influences.thigh);
        applyMorph('shoulder_width', influences.shoulder);
        applyMorph('wrist_girth', influences.wrist);
        applyMorph('ankle_girth', influences.ankle);
        applyMorph('inseam', influences.inseam);
        
        const heightDelta = (stats.heightCm - 180) / 36; 
        if (heightDelta > 0 && dict['height_up'] !== undefined) {
          morphInfluences[dict['height_up']] = Math.min(1, heightDelta);
        } else if (heightDelta < 0 && dict['height_down'] !== undefined) {
          morphInfluences[dict['height_down']] = Math.min(1, -heightDelta);
        }
      }
    }
  }, [bodyMesh, influences, isGhost, stats.heightCm]);

  useEffect(() => {
    if (bodyMesh) {
      bodyMesh.material = isGhost ? ghostMaterial : (viewMode === 'heat-map' ? heatMapMaterial : standardMaterial);
    }
  }, [bodyMesh, isGhost, viewMode, ghostMaterial, heatMapMaterial, standardMaterial]);

  return <primitive object={clonedScene} position={position} />;
};

const AvatarScene = () => {
  const showGhost = useEngineStore((state) => state.showGhost);
  const splitView = useEngineStore((state) => state.splitView);

  return (
    <div className="w-full h-[500px] bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
      <Canvas shadows camera={{ position: [0, 1.2, 3], fov: 40 }}>
        <Suspense fallback={null}>
          <Stage intensity={0.5} environment="city" shadows={{ type: 'contact', opacity: 0.2 }}>
            {splitView ? (
              <group>
                <AvatarMesh position={[-0.8, 0, 0]} isGhost={true} />
                <AvatarMesh position={[0.8, 0, 0]} isGhost={false} />
              </group>
            ) : (
              <group>
                <AvatarMesh position={[0, 0, 0]} isGhost={false} />
                {showGhost && <AvatarMesh position={[0, 0, 0]} isGhost={true} />}
              </group>
            )}
          </Stage>
          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} target={[0, 1, 0]} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default AvatarScene;
