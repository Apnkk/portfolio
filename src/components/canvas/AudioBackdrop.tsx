import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';
import { audioEngine } from '../../utils/audioSynth';
import './audioBackdrop.css';

const VERTEX = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  uniform float uBass;
  uniform float uMid;
  uniform float uTreble;
  uniform float uEnergy;
  uniform float uKick;
  uniform vec2 uPointer;

  float h21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float vn(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = h21(i);
    float b = h21(i + vec2(1.0, 0.0));
    float c = h21(i + vec2(0.0, 1.0));
    float d = h21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float a = 0.5;
    float s = 0.0;
    for (int i = 0; i < 4; i++) {
      s += a * vn(p);
      p *= 2.02;
      a *= 0.5;
    }
    return s;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uRes;
    float aspect = uRes.x / uRes.y;
    float x = uv.x * aspect;
    // Brouillard rouge animé, déformé par la souris et gonflé par les basses
    vec2 fp = vec2(uv.x * aspect, uv.y) * 1.6;
    fp += (uPointer - 0.5) * 0.25;
    float ft = uTime * 0.05;
    float fog = fbm(fp + vec2(ft, -ft * 0.7) + fbm(fp * 1.3 - ft) * 1.2);
    vec3 col = vec3(1.0, 0.1, 0.2) * pow(fog, 2.2) * (0.35 + uBass * uEnergy * 0.5) * 0.55;

    // Lueur qui suit le curseur
    float pg = exp(-length((uv - uPointer) * vec2(aspect, 1.0)) * 3.5);
    col += vec3(1.0, 0.12, 0.22) * pg * 0.10;

    for (int i = 0; i < 18; i++) {
      float fi = float(i) / 17.0;
      float baseY = mix(0.80, 0.10, fi);
      float amp = (0.018 + 0.055 * fi) * (0.7 + uEnergy * 1.1);
      float band = mix(uTreble, uBass, fi);
      float phase = uTime * (0.22 + 0.14 * fi) + fi * 3.1;

      float w = sin(x * 2.2 + phase) * 0.5
              + sin(x * 4.7 - phase * 1.3 + fi * 5.0) * 0.3
              + sin(x * 9.0 + phase * 2.0) * 0.12 * (0.3 + uTreble * 2.5);

      float env = 0.55 + 0.45 * sin(uv.x * 3.14159);
      float y = baseY + w * amp * env * (1.0 + band * 2.4 * uEnergy);

      float d = abs(uv.x - 0.5);
      y += uKick * 0.06 * sin(d * 30.0 - uTime * 8.0) * exp(-d * 3.0) * fi;

      float dist = abs(uv.y - y);
      float line = smoothstep(0.0022 + 0.0015 * fi, 0.0, dist);
      float glow = exp(-dist * 90.0) * 0.18;
      float a = 0.25 + 0.75 * fi;

      vec3 c = mix(vec3(1.0, 0.12, 0.22), vec3(0.96, 0.93, 0.93),
                   clamp(band * uEnergy * 1.2, 0.0, 1.0) * 0.6);
      col += c * (line * 0.8 + glow) * a * (0.35 + 0.65 * uEnergy) * (1.0 - uEnergy);
    }

    col *= smoothstep(1.1, 0.25, length(uv - 0.5) * 1.3);

    // Son actif : voile de soie douce. Rubans rouge profond, flous et lents,
    // sans blanc ni étincelles. Les basses gonflent légèrement, le kick pulse
    // doucement. Centre très atténué pour garder le Hero lisible.
    if (uEnergy > 0.01) {
      vec3 deep = vec3(0.55, 0.05, 0.12);
      vec3 red = vec3(1.0, 0.12, 0.22);
      vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

      float spd = uTime * (0.04 + uMid * 0.03);
      vec2 q = p * 1.4 + (uPointer - 0.5) * 0.15;
      float w1 = fbm(q + vec2(spd, -spd * 0.6));
      float w2 = fbm(q * 1.3 - vec2(spd * 0.8, spd) + w1 * (1.2 + uBass * 0.8));
      float fld = fbm(q + vec2(w1, w2) * (1.4 + uBass * 0.5));

      float ridge = 1.0 - abs(fld * 2.0 - 1.0);
      float silk = pow(ridge, 3.0);
      float halo = pow(ridge, 1.6);

      float centre = 0.2 + 0.8 * smoothstep(0.1, 0.7, length(p * vec2(0.8, 1.2)));
      vec3 sc = mix(deep, red, silk);
      float gain = (0.30 + uBass * 0.25) * centre * uEnergy;
      col += sc * (silk * 0.55 + halo * 0.10) * gain;
      col += deep * halo * uKick * 0.12 * centre;
    }
    col += vec3(1.0, 0.12, 0.22) * uBass * uEnergy * 0.05 * (1.0 - uv.y);

    float alpha = clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`;

/**
 * Fond fixe plein écran (shader WebGL).
 * Au repos : vagues en lignes qui ondulent doucement.
 * Son actif : les vagues s'effacent au profit d'un voile de soie douce
 * (rouge profond, flou, lent) avec une pulsation légère à chaque kick.
 */
export const AudioBackdrop = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uBass: { value: 0 },
      uMid: { value: 0 },
      uTreble: { value: 0 },
      uEnergy: { value: 0 },
      uKick: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    };
    const pointerTarget = new THREE.Vector2(0.5, 0.5);

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    const scene = new THREE.Scene();
    scene.add(mesh);
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      const size = renderer.getDrawingBufferSize(new THREE.Vector2());
      uniforms.uRes.value.set(size.x, size.y);
      renderer.render(scene, camera);
    };
    resize();
    window.addEventListener('resize', resize);

    const onPointerMove = (e: PointerEvent) => {
      pointerTarget.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let playing = false;
    const unsubscribe = audioEngine.subscribe((s) => {
      playing = s.isPlaying;
    });

    let rafId = 0;
    let last = performance.now();
    let bassAvg = 0;
    let lastBeat = 0;

    const frame = (now: number) => {
      rafId = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (document.hidden) return;

      const b = playing ? audioEngine.getBands() : { bass: 0, mid: 0, treble: 0 };
      const follow = (cur: number, t: number) => cur + (t - cur) * (t > cur ? 0.4 : 0.08);

      uniforms.uBass.value = follow(uniforms.uBass.value, b.bass);
      uniforms.uMid.value = follow(uniforms.uMid.value, b.mid);
      uniforms.uTreble.value = follow(uniforms.uTreble.value, b.treble);
      uniforms.uEnergy.value += ((playing ? 1 : 0) - uniforms.uEnergy.value) * Math.min(1, dt * 2.5);

      bassAvg += (b.bass - bassAvg) * 0.04;
      if (playing && b.bass > 0.38 && b.bass > bassAvg * 1.22 && now - lastBeat > 220) {
        lastBeat = now;
        uniforms.uKick.value = Math.max(uniforms.uKick.value, 0.5 + b.bass * 0.5);
      }
      uniforms.uKick.value *= Math.exp(-dt * 4);

      uniforms.uPointer.value.lerp(pointerTarget, Math.min(1, dt * 3));
      uniforms.uTime.value += dt * (1 + uniforms.uEnergy.value * 0.8 + uniforms.uMid.value);
      renderer.render(scene, camera);
    };

    if (!reduce) rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      unsubscribe();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [reduce]);

  return <canvas ref={canvasRef} className="audio-backdrop" aria-hidden="true" />;
};