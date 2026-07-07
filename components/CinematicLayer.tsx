"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 250;

/**
 * Generates a soft radial-gradient sprite texture used for every particle.
 * Avoids loading an external image asset.
 */
function createBokehTexture(): THREE.Texture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.25, "rgba(255,235,215,0.8)");
  gradient.addColorStop(0.6, "rgba(255,180,120,0.25)");
  gradient.addColorStop(1, "rgba(255,150,90,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface ParticleData {
  pos0: Point3D; // State 0: Spherical Cloud (Hero)
  pos1: Point3D; // State 1: Double Helix (About/Education)
  pos2: Point3D; // State 2: Neural Grid (Skills)
  pos3: Point3D; // State 3: Project Wall (Projects)
  pos4: Point3D; // State 4: Vortex Galaxy (Certifications/Contact)
  speed: number;
  phase: number;
  amplitude: number;
}

export default function CinematicLayer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const texture = createBokehTexture();

    // Prepare Particle Arrays
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const particleData: ParticleData[] = [];

    const warm = new THREE.Color(0xff8a3d);
    const warmSoft = new THREE.Color(0xffcf9e);
    const white = new THREE.Color(0xffffff);
    const blueAccent = new THREE.Color(0x4fa7ff);

    // Grid details for State 2
    const cols = 10;
    const rows = 5;
    const layers = 5;

    // Wall details for State 3
    const wCols = 25;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // STATE 0: Spherical Cloud
      const r0 = Math.random() * 8 + 2;
      const theta0 = Math.random() * Math.PI * 2;
      const phi0 = Math.acos(Math.random() * 2 - 1);
      const pos0 = {
        x: r0 * Math.sin(phi0) * Math.cos(theta0),
        y: r0 * Math.sin(phi0) * Math.sin(theta0),
        z: r0 * Math.cos(phi0) - 2,
      };

      // STATE 1: Double Helix
      const theta1 = (i / PARTICLE_COUNT) * Math.PI * 8;
      const r1 = 3.5;
      const isStrandB = i % 2 === 0;
      const angleOffset = isStrandB ? Math.PI : 0;
      const pos1 = {
        x: r1 * Math.cos(theta1 + angleOffset),
        y: (i - PARTICLE_COUNT / 2) * 0.05,
        z: r1 * Math.sin(theta1 + angleOffset) - 1,
      };

      // STATE 2: Neural Grid
      const col = i % cols;
      const row = Math.floor(i / cols) % rows;
      const layer = Math.floor(i / (cols * rows)) % layers;
      const pos2 = {
        x: (col - cols / 2) * 1.5,
        y: (row - rows / 2) * 1.5,
        z: (layer - layers / 2) * 1.5 - 2,
      };

      // STATE 3: Project Wall
      const wCol = i % wCols;
      const wRow = Math.floor(i / wCols);
      const pos3 = {
        x: (wCol - wCols / 2) * 0.75,
        y: (wRow - 5) * 0.75,
        z: Math.sin(wCol * 0.4) * Math.cos(wRow * 0.4) * 2 - 3,
      };

      // STATE 4: Vortex Galaxy
      const r4 = (i / PARTICLE_COUNT) * 9 + 0.8;
      const theta4 = i * 0.22;
      const pos4 = {
        x: r4 * Math.cos(theta4),
        y: (Math.random() - 0.5) * 1.5,
        z: r4 * Math.sin(theta4) - 2,
      };

      // Initialize buffer attribute coordinates with State 0
      positions[i * 3] = pos0.x;
      positions[i * 3 + 1] = pos0.y;
      positions[i * 3 + 2] = pos0.z;

      // Color selection (mostly orange/warm tones, blue accent for Grid/Projects, white highlight)
      const mixT = Math.random();
      let color = warm.clone().lerp(warmSoft, Math.random());
      if (mixT < 0.2) {
        color = white.clone();
      } else if (mixT > 0.8) {
        color = blueAccent.clone().lerp(white, 0.3);
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 1.8 + 0.4;

      particleData.push({
        pos0,
        pos1,
        pos2,
        pos3,
        pos4,
        speed: Math.random() * 0.3 + 0.1,
        phase: Math.random() * Math.PI * 2,
        amplitude: Math.random() * 0.6 + 0.2,
      });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 1.5,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Scroll Tracking
    let currentScroll = 0;
    let targetScroll = 0;

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        targetScroll = window.scrollY / docHeight;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run initial scroll check
    handleScroll();

    // Mouse parallax state
    const mouse = { x: 0, y: 0 };
    const targetCamera = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    let animationId: number;
    let elapsed = 0;
    const clock = new THREE.Clock();

    let isVisible = true;
    const handleVisibility = () => {
      isVisible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const positionAttr = geometry.getAttribute("position") as THREE.BufferAttribute;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();
      elapsed += delta;

      // Smooth scroll interpolation (lerp)
      currentScroll += (targetScroll - currentScroll) * 0.08;

      // Animate particle morphs based on scroll state
      if (!prefersReducedMotion) {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const p = particleData[i];
          let targetX = p.pos0.x;
          let targetY = p.pos0.y;
          let targetZ = p.pos0.z;

          // Multi-stage interpolation
          if (currentScroll < 0.25) {
            // Stage 0 -> 1 (Hero -> About)
            const t = currentScroll / 0.25;
            targetX = THREE.MathUtils.lerp(p.pos0.x, p.pos1.x, t);
            targetY = THREE.MathUtils.lerp(p.pos0.y, p.pos1.y, t);
            targetZ = THREE.MathUtils.lerp(p.pos0.z, p.pos1.z, t);
          } else if (currentScroll < 0.5) {
            // Stage 1 -> 2 (About -> Skills)
            const t = (currentScroll - 0.25) / 0.25;
            targetX = THREE.MathUtils.lerp(p.pos1.x, p.pos2.x, t);
            targetY = THREE.MathUtils.lerp(p.pos1.y, p.pos2.y, t);
            targetZ = THREE.MathUtils.lerp(p.pos1.z, p.pos2.z, t);
          } else if (currentScroll < 0.75) {
            // Stage 2 -> 3 (Skills -> Projects)
            const t = (currentScroll - 0.5) / 0.25;
            targetX = THREE.MathUtils.lerp(p.pos2.x, p.pos3.x, t);
            targetY = THREE.MathUtils.lerp(p.pos2.y, p.pos3.y, t);
            targetZ = THREE.MathUtils.lerp(p.pos2.z, p.pos3.z, t);
          } else {
            // Stage 3 -> 4 (Projects -> Contact)
            const t = (currentScroll - 0.75) / 0.25;
            targetX = THREE.MathUtils.lerp(p.pos3.x, p.pos4.x, t);
            targetY = THREE.MathUtils.lerp(p.pos3.y, p.pos4.y, t);
            targetZ = THREE.MathUtils.lerp(p.pos3.z, p.pos4.z, t);
          }

          // Add a subtle wave float overlay
          const floatY = Math.sin(elapsed * p.speed + p.phase) * p.amplitude * 0.4;
          const floatX = Math.cos(elapsed * p.speed * 0.7 + p.phase) * p.amplitude * 0.3;
          const floatZ = Math.sin(elapsed * p.speed * 0.5 + p.phase) * p.amplitude * 0.2;

          positionAttr.setX(i, targetX + floatX);
          positionAttr.setY(i, targetY + floatY);
          positionAttr.setZ(i, targetZ + floatZ);
        }
        positionAttr.needsUpdate = true;
      }

      // Smooth Camera position and rotation transitions on scroll
      let camTargetZ = 12;
      let camTargetY = 0;
      let camTargetX = 0;
      let rotSpeed = 0;

      if (currentScroll < 0.25) {
        // Hero -> About: Camera zooms in and dips down
        const t = currentScroll / 0.25;
        camTargetZ = THREE.MathUtils.lerp(12, 7.5, t);
        camTargetY = THREE.MathUtils.lerp(0, -2, t);
        camTargetX = THREE.MathUtils.lerp(0, 1.5, t);
        rotSpeed = currentScroll * 0.2;
      } else if (currentScroll < 0.5) {
        // About -> Skills: Camera zooms out and pans up
        const t = (currentScroll - 0.25) / 0.25;
        camTargetZ = THREE.MathUtils.lerp(7.5, 14, t);
        camTargetY = THREE.MathUtils.lerp(-2, 2.5, t);
        camTargetX = THREE.MathUtils.lerp(1.5, -1.5, t);
        rotSpeed = currentScroll * 0.35;
      } else if (currentScroll < 0.75) {
        // Skills -> Projects: Camera zooms in closer
        const t = (currentScroll - 0.5) / 0.25;
        camTargetZ = THREE.MathUtils.lerp(14, 9, t);
        camTargetY = THREE.MathUtils.lerp(2.5, -3, t);
        camTargetX = THREE.MathUtils.lerp(-1.5, 2, t);
        rotSpeed = currentScroll * 0.5;
      } else {
        // Projects -> Contact: Camera zooms out deeply for a grand overview
        const t = (currentScroll - 0.75) / 0.25;
        camTargetZ = THREE.MathUtils.lerp(9, 16, t);
        camTargetY = THREE.MathUtils.lerp(-3, 0, t);
        camTargetX = THREE.MathUtils.lerp(2, 0, t);
        rotSpeed = currentScroll * 0.8;
      }

      // Smooth camera parallax toward mouse position
      targetCamera.x += (mouse.x * 1.5 - targetCamera.x) * 0.04;
      targetCamera.y += (-mouse.y * 1.0 - targetCamera.y) * 0.04;

      camera.position.x = camTargetX + targetCamera.x;
      camera.position.y = camTargetY + targetCamera.y;
      camera.position.z = camTargetZ;

      // Add a slight rotation angle based on scroll
      points.rotation.y = currentScroll * Math.PI * 0.4;
      points.rotation.z = currentScroll * Math.PI * 0.2;

      camera.lookAt(0, camTargetY * 0.5, -2);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);

      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}
