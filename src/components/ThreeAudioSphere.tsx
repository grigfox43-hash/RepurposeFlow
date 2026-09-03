'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeAudioSphereProps {
  isPlaying?: boolean;
}

export const ThreeAudioSphere: React.FC<ThreeAudioSphereProps> = ({ isPlaying = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for rotation
    const group = new THREE.Group();
    scene.add(group);

    // 1. Inner Glowing Icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(1.4, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4, // Cyan
      wireframe: true,
      transparent: true,
      opacity: 0.75,
      roughness: 0.2,
      metalness: 0.8
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    // 2. Secondary Inner Octahedron (Pulsing Diamond)
    const innerGeo = new THREE.OctahedronGeometry(0.85, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6, // Purple
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    group.add(innerMesh);

    // 3. Orbital Particle Cloud / Sound Ring
    const particleCount = 280;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cyan = new THREE.Color(0x06b6d4);
    const purple = new THREE.Color(0xa855f7);
    const sky = new THREE.Color(0x38bdf8);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.1 + (Math.random() - 0.5) * 0.7;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.9;

      particlePositions[i * 3] = radius * Math.cos(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi) * Math.sin(theta);

      const mixedColor = i % 3 === 0 ? cyan : i % 3 === 1 ? purple : sky;
      particleColors[i * 3] = mixedColor.r;
      particleColors[i * 3 + 1] = mixedColor.g;
      particleColors[i * 3 + 2] = mixedColor.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    // 4. Outer Ring
    const ringGeo = new THREE.RingGeometry(2.35, 2.38, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.5;
    group.add(ringMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x06b6d4, 3, 20);
    pointLight1.position.set(4, 3, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xa855f7, 3, 20);
    pointLight2.position.set(-4, -3, -2);
    scene.add(pointLight2);

    // Mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const active = isPlayingRef.current;

      const speedMultiplier = active ? 2.5 : 1.0;
      const pulse = active ? 1 + Math.sin(elapsedTime * 8) * 0.12 : 1 + Math.sin(elapsedTime * 2) * 0.03;

      // Group rotation
      group.rotation.y += 0.006 * speedMultiplier;
      group.rotation.x += 0.003 * speedMultiplier;

      // Inner counter rotation
      innerMesh.rotation.y -= 0.015 * speedMultiplier;
      innerMesh.rotation.z += 0.01 * speedMultiplier;
      innerMesh.scale.set(pulse * 0.95, pulse * 0.95, pulse * 0.95);

      coreMesh.scale.set(pulse, pulse, pulse);
      ringMesh.rotation.z += 0.004;

      // Smooth mouse follow
      targetX += (mouseX * 0.4 - targetX) * 0.05;
      targetY += (mouseY * 0.4 - targetY) * 0.05;
      group.position.x = targetX;
      group.position.y = targetY;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[300px] sm:min-h-[360px] flex items-center justify-center relative cursor-grab active:cursor-grabbing select-none"
    />
  );
};
