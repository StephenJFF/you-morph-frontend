import * as THREE from 'three';

export const HeatMapShader = {
  uniforms: {
    uTime: { value: 0 },
    uHotColor: { value: new THREE.Color(0xff0000) },
    uColdColor: { value: new THREE.Color(0x0000ff) },
    uBaseColor: { value: new THREE.Color(0x888888) },
  },
  vertexShader: `
    attribute float aDelta; 
    varying float vDelta;
    varying vec3 vColor;
    varying vec2 vUv;

    void main() {
      vDelta = aDelta;
      vColor = color;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uHotColor;
    uniform vec3 uColdColor;
    uniform vec3 uBaseColor;

    varying float vDelta;
    varying vec3 vColor;
    varying vec2 vUv;

    void main() {
      // Use the R channel (fat sensitivity) weighted by the actual displacement (vDelta)
      float intensity = vDelta * vColor.r;
      
      vec3 color;
      if (intensity > 0.5) {
        color = mix(uBaseColor, uHotColor, (intensity - 0.5) * 2.0);
      } else {
        color = mix(uColdColor, uBaseColor, intensity * 2.0);
      }
      
      // Pulse effect
      float pulse = sin(uTime * 2.0) * 0.05 + 0.95;
      
      gl_FragColor = vec4(color * pulse, 1.0);
    }
  `,
};
