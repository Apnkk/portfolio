import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { audioEngine } from '../../utils/audioSynth';

const vertexShader = `
  uniform float uTime;
  uniform float uBass;
  uniform float uMid;
  uniform float uTreble;
  uniform float uIsPlaying;
  uniform vec2 uPointer;
  uniform float uDpr;

  varying float vH;
  varying float vDist;

  // simplex-ish value noise, cheap and good enough for a terrain
  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  float noise(vec2 p) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash(i)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    return dot(n, vec3(70.0));
  }

  void main() {
    vec3 p = position;
    float t = uTime * (0.05 + uIsPlaying * 0.13);

    // base rolling terrain (calm and flat when dormant)
    float h = noise(p.xy * 0.14 + vec2(t, t * 0.6)) * (0.35 + uIsPlaying * 0.55);
    h += noise(p.xy * 0.45 - vec2(t * 0.7, 0.0)) * (0.10 + uIsPlaying * 0.18);

    // audio: bass swells the middle ridge, mids ripple, treble sparkles
    float ridge = exp(-abs(p.y) * 0.32);
    h += uBass * ridge * 2.6 * (0.6 + 0.4 * sin(p.x * 0.5 + uTime * 2.2));
    h += uMid * noise(p.xy * 0.8 + uTime * 0.55) * 1.5;
    h += uTreble * noise(p.xy * 2.2 - uTime * 0.8) * 0.55;

    // pointer attraction
    float d = distance(p.xy * vec2(0.055, 0.11), uPointer);
    h += smoothstep(0.45, 0.0, d) * (0.3 + uIsPlaying * 0.4);

    p.z = h;
    vH = h;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (0.95 + vH * 1.1 + uBass * 1.8) * uDpr * (26.0 / vDist);
  }
`;

const fragmentShader = `
  precision mediump float;
  uniform float uLevel;
  uniform float uIsPlaying;
  varying float vH;
  varying float vDist;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    if (r > 0.5) discard;
    float glow = smoothstep(0.5, 0.05, r);

    vec3 cream = vec3(0.93, 0.91, 0.87);
    vec3 amber = vec3(0.95, 0.64, 0.24);
    vec3 ember = vec3(1.0, 0.24, 0.18);

    float a = clamp(vH * 0.6 + 0.25, 0.0, 1.0);

    // Dormant: subdued neutral smoke/cream
    vec3 dormantCol = mix(vec3(0.38, 0.35, 0.32), cream * 0.6, a * 0.5);

    // Active: glowing amber & ember
    vec3 activeCol = mix(cream * 0.5, amber, a);
    activeCol = mix(activeCol, ember, smoothstep(1.4, 2.6, vH) * 0.7);
    activeCol += uLevel * 0.25;

    vec3 col = mix(dormantCol, activeCol, uIsPlaying);
    float alphaMultiplier = mix(0.35, 1.0, uIsPlaying);

    float fade = smoothstep(34.0, 10.0, vDist);
    gl_FragColor = vec4(col, glow * (0.16 + a * 0.5) * fade * alphaMultiplier);
  }
`;

export const ParticleTerrainGL = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const isMobile = window.matchMedia('(max-width: 820px)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 1.75);
    renderer.setPixelRatio(dpr);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, -10.5, 5.2);
    camera.lookAt(0, 2, 0);

    const cols = isMobile ? 110 : 190;
    const rows = isMobile ? 56 : 92;
    const width = 36;
    const height = 18;
    const totalPoints = cols * rows;

    const positions = new Float32Array(totalPoints * 3);
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        positions[idx++] = (c / (cols - 1) - 0.5) * width;
        positions[idx++] = (r / (rows - 1) - 0.5) * height;
        positions[idx++] = 0;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const uniforms = {
      uTime: { value: 0 },
      uBass: { value: 0 },
      uMid: { value: 0 },
      uTreble: { value: 0 },
      uLevel: { value: 0 },
      uPointer: { value: new THREE.Vector2(10, 10) },
      uDpr: { value: dpr },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const mesh = new THREE.Points(geometry, material);
    mesh.rotation.x = -0.12;
    scene.add(mesh);

    const handleResize = () => {
      const parent = canvas.parentElement || document.body;
      const w = parent.clientWidth || window.innerWidth;
      const h = parent.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const pointerTarget = new THREE.Vector2(10, 10);
    const handlePointerMove = (e: PointerEvent) => {
      pointerTarget.set(
        (e.clientX / window.innerWidth - 0.5) * 2,
        -(e.clientY / window.innerHeight - 0.5) * 2
      );
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0]?.isIntersecting ?? true;
    });
    observer.observe(canvas);

    const currentBands = { bass: 0, mid: 0, treble: 0, level: 0 };
    let lastTime = performance.now();
    let rafId: number;

    const lerp = (cur: number, target: number) => cur + (target - cur) * (target > cur ? 0.5 : 0.06);

    const animate = (time: number) => {
      rafId = requestAnimationFrame(animate);
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      if (document.hidden || !isVisible) return;

      uniforms.uTime.value += delta;

      const bands = audioEngine.getBands();
      currentBands.bass = lerp(currentBands.bass, bands.bass);
      currentBands.mid = lerp(currentBands.mid, bands.mid);
      currentBands.treble = lerp(currentBands.treble, bands.treble);
      currentBands.level = lerp(currentBands.level, bands.level);

      uniforms.uBass.value = currentBands.bass;
      uniforms.uMid.value = currentBands.mid;
      uniforms.uTreble.value = currentBands.treble;
      uniforms.uLevel.value = currentBands.level;

      uniforms.uPointer.value.lerp(pointerTarget, 0.045);
      camera.position.x += (pointerTarget.x * 0.7 - camera.position.x) * 0.02;

      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      observer.disconnect();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="gl"
      className="absolute inset-0 w-full h-full pointer-events-none block z-0"
      aria-hidden="true"
    />
  );
};
