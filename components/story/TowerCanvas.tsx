"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface TowerCanvasProps {
  progress: number; // 0.0 to 1.0
  pointerX: number; // -1.0 to 1.0
  pointerY: number; // -1.0 to 1.0
  onSceneChange?: (sceneIndex: number) => void;
}

export function TowerCanvas({
  progress,
  pointerX,
  pointerY,
  onSceneChange,
}: TowerCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    progress: 0,
    pointerX: 0,
    pointerY: 0,
  });

  // Keep state updated in ref for the render loop
  useEffect(() => {
    stateRef.current.progress = progress;
    stateRef.current.pointerX = pointerX;
    stateRef.current.pointerY = pointerY;

    // Notify scene changes
    let scene = 0;
    if (progress < 0.22) scene = 1;
    else if (progress < 0.48) scene = 2;
    else if (progress < 0.72) scene = 3;
    else if (progress < 0.88) scene = 4;
    else scene = 5;

    onSceneChange?.(scene);
  }, [progress, pointerX, pointerY, onSceneChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      // WebGL not supported, container fallback handles this
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0f18, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
    camera.position.set(0, 15, 42);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x1a2638, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xdfba82, 2.4);
    sunLight.position.set(20, 40, 25);
    scene.add(sunLight);

    const coolRimLight = new THREE.DirectionalLight(0x4f709c, 1.5);
    coolRimLight.position.set(-25, 20, -20);
    scene.add(coolRimLight);

    // Architectural Materials
    const concreteMaterial = new THREE.MeshStandardMaterial({
      color: 0x141d2b,
      roughness: 0.85,
      metalness: 0.15,
    });

    const brassMaterial = new THREE.MeshStandardMaterial({
      color: 0xc9a36a,
      roughness: 0.35,
      metalness: 0.85,
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1f2c40,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.7,
      transparent: true,
      opacity: 0.85,
      emissive: 0xdfba82,
      emissiveIntensity: 0.15,
    });

    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x0fa8a0,
      roughness: 0.1,
      metalness: 0.2,
      emissive: 0x0a6660,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.85,
    });

    const interiorMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4eee5,
      roughness: 0.4,
      metalness: 0.1,
    });

    // Root Tower Group
    const towerGroup = new THREE.Group();
    scene.add(towerGroup);

    // Ground Grid / Reflection Plane
    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x06090f,
      roughness: 0.95,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    scene.add(ground);

    // 1. Podium Base (Levels 1 - 4)
    const podiumGeo = new THREE.BoxGeometry(14, 3, 14);
    const podium = new THREE.Mesh(podiumGeo, concreteMaterial);
    podium.position.y = 1.5;
    towerGroup.add(podium);

    // Podium Cantilevered Infinity Pool
    const poolGeo = new THREE.BoxGeometry(6, 0.4, 16);
    const pool = new THREE.Mesh(poolGeo, waterMaterial);
    pool.position.set(4.5, 3.2, 1);
    towerGroup.add(pool);

    // 2. Tower Floors (24 residential slabs)
    const floorMeshes: THREE.Group[] = [];
    const TOTAL_FLOORS = 24;
    const FLOOR_HEIGHT = 1.1;

    for (let i = 0; i < TOTAL_FLOORS; i++) {
      const floorGroup = new THREE.Group();
      const baseY = 3.2 + i * FLOOR_HEIGHT;

      // Slab
      const slabGeo = new THREE.BoxGeometry(9.5, 0.2, 9.5);
      const slab = new THREE.Mesh(slabGeo, concreteMaterial);
      floorGroup.add(slab);

      // Glass core
      const coreGeo = new THREE.BoxGeometry(8.2, 0.9, 8.2);
      const core = new THREE.Mesh(coreGeo, glassMaterial);
      core.position.y = 0.45;
      floorGroup.add(core);

      // Staggered luxury cantilevered balcony
      const isEven = i % 2 === 0;
      const balconyGeo = new THREE.BoxGeometry(3.5, 0.18, 2.2);
      const balcony = new THREE.Mesh(balconyGeo, brassMaterial);
      balcony.position.set(isEven ? 3.6 : -3.6, 0.1, isEven ? 3.8 : -3.8);
      floorGroup.add(balcony);

      floorGroup.position.y = baseY;
      floorGroup.userData = { originalY: baseY, index: i };
      towerGroup.add(floorGroup);
      floorMeshes.push(floorGroup);
    }

    // 3. Level 18 Detailed Suite for Interior Reveal (Scene 3)
    const interiorSuiteGroup = new THREE.Group();
    const suiteY = 3.2 + 16 * FLOOR_HEIGHT; // Level 18
    interiorSuiteGroup.position.set(0, suiteY + 0.1, 0);

    // Living Room Floor Plate (Statuario marble look)
    const suiteFloorGeo = new THREE.BoxGeometry(8, 0.05, 8);
    const suiteFloor = new THREE.Mesh(suiteFloorGeo, interiorMaterial);
    interiorSuiteGroup.add(suiteFloor);

    // Master Bed & Living Furniture Blocks
    const sofaGeo = new THREE.BoxGeometry(2.4, 0.4, 0.9);
    const sofa = new THREE.Mesh(sofaGeo, brassMaterial);
    sofa.position.set(-1.8, 0.25, 1.2);
    interiorSuiteGroup.add(sofa);

    const tableGeo = new THREE.BoxGeometry(1.6, 0.35, 1.0);
    const table = new THREE.Mesh(tableGeo, concreteMaterial);
    table.position.set(1.5, 0.2, 1.2);
    interiorSuiteGroup.add(table);

    const bedGeo = new THREE.BoxGeometry(2.2, 0.5, 2.4);
    const bed = new THREE.Mesh(bedGeo, interiorMaterial);
    bed.position.set(0, 0.3, -2.2);
    interiorSuiteGroup.add(bed);

    towerGroup.add(interiorSuiteGroup);

    // 4. Crown Pergola & Sky Lounge (Level 28)
    const crownY = 3.2 + TOTAL_FLOORS * FLOOR_HEIGHT;
    const crownGeo = new THREE.CylinderGeometry(5.5, 5, 2, 8, 1, true);
    const crown = new THREE.Mesh(crownGeo, brassMaterial);
    crown.position.y = crownY + 1;
    towerGroup.add(crown);

    // Crown Starlit Firepit
    const fireGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const fireMat = new THREE.MeshBasicMaterial({ color: 0xffb74d });
    const firepit = new THREE.Mesh(fireGeo, fireMat);
    firepit.position.y = crownY + 0.6;
    towerGroup.add(firepit);

    // Animation & Smooth Interpolation Loop
    let animId: number;
    let isVisible = true;

    // Pause when offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? false;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Camera targets for smooth cinematic lerp
    const currentCamPos = new THREE.Vector3(0, 15, 42);
    const targetCamPos = new THREE.Vector3();
    const currentLookAt = new THREE.Vector3(0, 14, 0);
    const targetLookAt = new THREE.Vector3();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const { progress: p, pointerX: px, pointerY: py } = stateRef.current;

      // Calculate camera coordinates and tower assembly based on progress
      if (p < 0.22) {
        // Scene 1: Arrival - gentle low angle to mid orbit
        const t = p / 0.22;
        const angle = -0.4 + t * 0.8;
        const dist = 38 - t * 4;
        targetCamPos.set(
          Math.sin(angle) * dist + px * 3,
          12 + t * 6 + py * 2,
          Math.cos(angle) * dist
        );
        targetLookAt.set(0, 14, 0);

        // Floors assembled
        floorMeshes.forEach((mesh) => {
          mesh.position.y = mesh.userData.originalY;
          mesh.rotation.y = 0;
        });
      } else if (p < 0.48) {
        // Scene 2: Build-up - floors assemble/disassemble with scroll
        const t = (p - 0.22) / (0.48 - 0.22);
        const angle = 0.4 + t * 0.6;
        targetCamPos.set(
          Math.sin(angle) * 34 + px * 2,
          16 + t * 8 + py * 2,
          Math.cos(angle) * 34
        );
        targetLookAt.set(0, 18, 0);

        // Floor assembly tied directly to scroll progress
        floorMeshes.forEach((mesh, idx) => {
          const floorProgressThreshold = idx / TOTAL_FLOORS;
          const delta = Math.max(0, 1 - (t - floorProgressThreshold) * 3);
          const explodedY = mesh.userData.originalY + delta * (15 - idx * 0.4);
          mesh.position.y = explodedY;
          mesh.rotation.y = delta * 0.15;
        });
      } else if (p < 0.72) {
        // Scene 3: Interior Reveal - close-up on Level 18
        const t = (p - 0.48) / (0.72 - 0.48);
        targetCamPos.set(
          Math.sin(1.2) * (14 - t * 3) + px * 1.5,
          suiteY + 2.5 + py * 1.5,
          Math.cos(1.2) * (14 - t * 3)
        );
        targetLookAt.set(0, suiteY + 0.8, 0);

        // Floors in place
        floorMeshes.forEach((mesh) => {
          mesh.position.y = mesh.userData.originalY;
          mesh.rotation.y = 0;
        });
      } else if (p < 0.88) {
        // Scene 4: Amenities (Pool -> Gym -> Crown)
        const t = (p - 0.72) / (0.88 - 0.72);
        const angle = 1.6 + t * 1.2;
        targetCamPos.set(
          Math.sin(angle) * 26 + px * 2,
          8 + t * 22 + py * 2, // rises from podium pool to crown
          Math.cos(angle) * 26
        );
        targetLookAt.set(0, 5 + t * 24, 0);

        floorMeshes.forEach((mesh) => {
          mesh.position.y = mesh.userData.originalY;
          mesh.rotation.y = 0;
        });
      } else {
        // Scene 5: Settle & CTA - majestic wide panorama
        const t = (p - 0.88) / 0.12;
        const angle = 2.8 + t * 0.4;
        targetCamPos.set(
          Math.sin(angle) * 44 + px * 2,
          20 + py * 2,
          Math.cos(angle) * 44
        );
        targetLookAt.set(0, 16, 0);

        floorMeshes.forEach((mesh) => {
          mesh.position.y = mesh.userData.originalY;
          mesh.rotation.y = 0;
        });
      }

      // Smooth camera interpolation
      currentCamPos.lerp(targetCamPos, 0.08);
      currentLookAt.lerp(targetLookAt, 0.08);

      camera.position.copy(currentCamPos);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      podiumGeo.dispose();
      concreteMaterial.dispose();
      brassMaterial.dispose();
      glassMaterial.dispose();
      waterMaterial.dispose();
      interiorMaterial.dispose();
      crownGeo.dispose();
      fireGeo.dispose();
      fireMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
