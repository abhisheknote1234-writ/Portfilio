/**
 * Abhishek Kumar Gupta — Research Portfolio
 * Ethereal Celestial WebGL Environment (#webgl-canvas)
 * Custom GLSL Fractional Brownian Motion (FBM) Multi-Chromatic Nebula Shader
 * Palette: Celestial Yellow, Crimson Red, Sapphire Blue, Amethyst Purple, Aurora Green, Cosmic Black
 * Plus Sparkling Starry Aura Particles & Synaptic Constellation Web
 * 60fps+ Hardware Accelerated Architecture
 */

(function () {
  'use strict';

  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // Always render celestial background regardless of OS accessibility flags
  const prefersReducedMotion = false;

  // ─────────────────────────────────────────────────────────────
  // 1. THREE.JS SCENE, CAMERA & RENDERER
  // ─────────────────────────────────────────────────────────────
  const scene = new THREE.Scene();

  const startCameraZ = 15;
  const endCameraZ = -100;

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, startCameraZ);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));

  const cosmosGroup = new THREE.Group();
  scene.add(cosmosGroup);

  // ─────────────────────────────────────────────────────────────
  // 2. CUSTOM GLSL NEBULA SHADER (FBM Celestial Clouds)
  // Palette: Yellow, Red, Blue, Purple, Green, Deep Obsidian Black
  // ─────────────────────────────────────────────────────────────
  const nebulaVertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const nebulaFragmentShader = `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    varying vec2 vUv;

    // 2D Simplex/Perlin Noise Functions
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    // Fast 2-octave smooth cosmic noise (ultra-lightweight GPU execution)
    float fbm2(vec2 st) {
      return 0.65 * snoise(st) + 0.35 * snoise(st * 2.05);
    }

    void main() {
      vec2 st = vUv * 2.2;
      st.x *= uResolution.x / uResolution.y;

      // Mouse influence
      vec2 mouseOffset = uMouse * 0.12;
      st += mouseOffset;

      float t = uTime * 0.04;

      // Soft silky flow with just 2 fast evaluations
      float q = fbm2(st + vec2(t * 0.25, t * 0.15));
      float f = fbm2(st + vec2(q * 0.45, -t * 0.1) + vec2(1.2, 3.4));

      // Color Palette Definition: Luminous Light Green, Warm Yellow & Soft White Shimmers
      vec3 colYellow       = vec3(0.98, 0.84, 0.36); // Luminous Warm Golden Yellow
      vec3 colYellowBright = vec3(1.0, 0.92, 0.52);  // Radiant Sunbeam Yellow
      vec3 colGreen        = vec3(0.24, 0.94, 0.65); // Vibrant Light Aurora Green
      vec3 colGreenLight   = vec3(0.52, 0.98, 0.78); // Soft Light Green Shimmer
      vec3 colWhite        = vec3(0.98, 0.99, 1.0);  // Soft White Starlight
      vec3 colDeepSpace    = vec3(0.02, 0.035, 0.045); // Deep Obsidian Lab Space

      // Multi-stage ethereal color blending tuned for light green & warm yellow
      vec3 color = mix(colDeepSpace, colGreen * 0.5, clamp(f * f * 1.6, 0.0, 1.0));
      color = mix(color, colYellow * 0.45, clamp(abs(q), 0.0, 1.0) * 0.45);
      color = mix(color, colGreenLight, clamp(f * 0.7, 0.0, 1.0) * 0.32);
      color = mix(color, colYellowBright, clamp(pow(abs(f), 2.0), 0.0, 1.0) * 0.36);
      color = mix(color, colWhite, clamp(pow(clamp(f, 0.0, 1.0), 3.0) * 1.2, 0.0, 1.0) * 0.3);

      // Gentle radial vignette falloff toward edges
      float distFromCenter = length(vUv - vec2(0.5));
      float vignette = smoothstep(0.85, 0.15, distFromCenter);

      // Delicate, airy transparency (soft cosmic veil, never heavy or sticky)
      float finalAlpha = clamp(length(color) * 0.22, 0.015, 0.22) * vignette;

      gl_FragColor = vec4(color, finalAlpha);
    }
  `;

  // Create Fullscreen Background Plane Shader
  const nebulaUniforms = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uMouse: { value: new THREE.Vector2(0, 0) }
  };

  const nebulaMaterial = new THREE.ShaderMaterial({
    vertexShader: nebulaVertexShader,
    fragmentShader: nebulaFragmentShader,
    uniforms: nebulaUniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  // Large plane covering entire screen
  const planeGeo = new THREE.PlaneGeometry(120, 80);
  const nebulaMesh = new THREE.Mesh(planeGeo, nebulaMaterial);
  nebulaMesh.position.set(0, 0, -35);
  cosmosGroup.add(nebulaMesh);

  // ─────────────────────────────────────────────────────────────
  // 3. PROCEDURAL SOFT AURA STAR TEXTURE
  // ─────────────────────────────────────────────────────────────
  function createStarryAuraTexture() {
    const size = 128;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    const center = size / 2;

    const auraGrad = ctx.createRadialGradient(center, center, 0, center, center, center * 0.95);
    auraGrad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');     // Pure nucleus
    auraGrad.addColorStop(0.12, 'rgba(255, 255, 255, 0.90)');    // Inner core
    auraGrad.addColorStop(0.32, 'rgba(255, 255, 255, 0.60)');    // Luminous halo
    auraGrad.addColorStop(0.65, 'rgba(255, 255, 255, 0.22)');    // Soft aura
    auraGrad.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');      // Smooth falloff
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(center, center, center * 0.95, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(c);
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    return tex;
  }

  const starryTexture = createStarryAuraTexture();

  // ─────────────────────────────────────────────────────────────
  // 4. STARRY AURA PARTICLE CONSTELLATION
  // ─────────────────────────────────────────────────────────────
  const starryPalette = [
    new THREE.Color(0xfacc15), // Yellow
    new THREE.Color(0xf43f5e), // Red
    new THREE.Color(0x3b82f6), // Blue
    new THREE.Color(0xa855f7), // Purple
    new THREE.Color(0x2ccb91), // Green
    new THREE.Color(0xffffff)  // Pure Starlight White
  ];

  const starCount = 450;
  const starGeo = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    starPositions[i3] = (Math.random() - 0.5) * 70;
    starPositions[i3 + 1] = (Math.random() - 0.5) * 50;
    starPositions[i3 + 2] = 20 - Math.random() * 160;

    const r = Math.random();
    let col;
    if (r < 0.22) col = starryPalette[0];      // Yellow
    else if (r < 0.42) col = starryPalette[1]; // Red
    else if (r < 0.62) col = starryPalette[2]; // Blue
    else if (r < 0.78) col = starryPalette[3]; // Purple
    else if (r < 0.92) col = starryPalette[4]; // Green
    else col = starryPalette[5];               // White

    starColors[i3] = col.r;
    starColors[i3 + 1] = col.g;
    starColors[i3 + 2] = col.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMaterial = new THREE.PointsMaterial({
    size: 2.2,
    sizeAttenuation: true, // Natural 3D depth attenuation
    map: starryTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const starPoints = new THREE.Points(starGeo, starMaterial);
  cosmosGroup.add(starPoints);

  // ─────────────────────────────────────────────────────────────
  // 5. CONSTELLATION SYNAPTIC THREADS
  // ─────────────────────────────────────────────────────────────
  const maxLines = 160;
  const linePositions = new Float32Array(maxLines * 6);
  const lineColors = new Float32Array(maxLines * 6);
  let lineCount = 0;

  for (let i = 0; i < starCount && lineCount < maxLines; i += 2) {
    const i3 = i * 3;
    const x1 = starPositions[i3];
    const y1 = starPositions[i3 + 1];
    const z1 = starPositions[i3 + 2];

    for (let j = i + 1; j < Math.min(i + 15, starCount) && lineCount < maxLines; j++) {
      const j3 = j * 3;
      const dx = x1 - starPositions[j3];
      const dy = y1 - starPositions[j3 + 1];
      const dz = z1 - starPositions[j3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < 10.0) {
        const lIndex = lineCount * 6;
        linePositions[lIndex] = x1;
        linePositions[lIndex + 1] = y1;
        linePositions[lIndex + 2] = z1;
        linePositions[lIndex + 3] = starPositions[j3];
        linePositions[lIndex + 4] = starPositions[j3 + 1];
        linePositions[lIndex + 5] = starPositions[j3 + 2];

        const alpha = Math.max(0.12, 1 - dist / 10.0) * 0.50;

        lineColors[lIndex] = starColors[i3] * alpha;
        lineColors[lIndex + 1] = starColors[i3 + 1] * alpha;
        lineColors[lIndex + 2] = starColors[i3 + 2] * alpha;
        lineColors[lIndex + 3] = starColors[j3] * alpha;
        lineColors[lIndex + 4] = starColors[j3 + 1] * alpha;
        lineColors[lIndex + 5] = starColors[j3 + 2] * alpha;

        lineCount++;
      }
    }
  }

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions.slice(0, lineCount * 6), 3));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors.slice(0, lineCount * 6), 3));

  const lineMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.50,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
  cosmosGroup.add(lineSegments);

  // ─────────────────────────────────────────────────────────────
  // 6. PASSIVE HARDWARE-ACCELERATED SCROLL FLY-THROUGH
  // ─────────────────────────────────────────────────────────────
  let targetScrollZ = -5;
  let targetRotationY = 0;
  let currentScrollZ = -5;
  let currentRotationY = 0;

  function updateScroll() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / docHeight)) : 0;
    targetScrollZ = -5 + progress * (endCameraZ - (-5));
    targetRotationY = progress * 0.35;
  }

  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  // ─────────────────────────────────────────────────────────────
  // 7. MOUSE PARALLAX & DAMPING
  // ─────────────────────────────────────────────────────────────
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // ─────────────────────────────────────────────────────────────
  // 8. ANIMATION LOOP (Locked 60fps)
  // ─────────────────────────────────────────────────────────────
  const clock = new THREE.Clock();
  let isRunning = true;

  document.addEventListener('visibilitychange', () => {
    isRunning = document.visibilityState === 'visible';
    if (isRunning) clock.start();
  });

  function animate() {
    requestAnimationFrame(animate);
    if (!isRunning || prefersReducedMotion) return;

    const time = clock.getElapsedTime();

    // Update GLSL shader time uniform
    nebulaUniforms.uTime.value = time;
    nebulaUniforms.uMouse.value.set(mouseX, mouseY);

    // Smooth mouse lerp
    mouseX += (targetMouseX - mouseX) * 0.04;
    mouseY += (targetMouseY - mouseY) * 0.04;

    camera.position.x = mouseX * 1.8;
    camera.position.y = -mouseY * 1.8;

    // Smooth scroll camera depth (native 60fps lerp, zero GSAP thread blocking)
    currentScrollZ += (targetScrollZ - currentScrollZ) * 0.08;
    currentRotationY += (targetRotationY - currentRotationY) * 0.06;
    camera.position.z = currentScrollZ;
    cosmosGroup.rotation.y = currentRotationY;

    // Star twinkling
    const twinkle = Math.sin(time * 2.5);
    starMaterial.opacity = 0.85 + twinkle * 0.12;

    // Slow organic axial rotation
    cosmosGroup.rotation.z += 0.0003;

    renderer.render(scene, camera);
  }

  animate();

  // ─────────────────────────────────────────────────────────────
  // 9. RESIZE HANDLING
  // ─────────────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));

    nebulaUniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  }, { passive: true });

})();
