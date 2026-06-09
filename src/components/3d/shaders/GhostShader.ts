import * as THREE from 'three';

export const GhostShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(0x00ffff) },
    uOpacity: { value: 0.3 },
    uFresnelBias: { value: 0.1 },
    uFresnelScale: { value: 1.0 },
    uFresnelPower: { value: 2.0 },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vViewPosition = normalize(cameraPosition - worldPosition.xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uFresnelBias;
    uniform float uFresnelScale;
    uniform float uFresnelPower;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;

    void main() {
      float fresnel = uFresnelBias + uFresnelScale * pow(1.0 + dot(vNormal, -vViewPosition), uFresnelPower);
      
      // Animated scanning line effect
      float scanline = sin(vUv.y * 100.0 + uTime * 5.0) * 0.1 + 0.9;
      
      vec3 color = uColor * scanline;
      gl_FragColor = vec4(color, fresnel * uOpacity);
    }
  `,
};
