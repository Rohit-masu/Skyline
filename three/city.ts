import {
  BoxGeometry,
  CircleGeometry,
  Color,
  InstancedMesh,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
} from "three";
import { cameraPathPoints } from "./keyframes";
import { createContactShadowTexture, createGroundTexture, createRandom, createWindowTexture } from "./textures";

// The surrounding city: one instanced mesh of lit blocks, a road-grid ground, and a contact shadow.
// Blocks keep a clear ring around the site so they never hide the tower.
const CLEAR_RADIUS = 34;
const CITY_RADIUS = 190;
// Minimum ground distance between a block centre and the camera path.
const CAMERA_CLEARANCE = 24;

export function createCity(blockCount: number, receiveShadows: boolean) {
  const group = new Group();
  const random = createRandom(42);

  const groundTexture = createGroundTexture();
  const groundGeometry = new PlaneGeometry(600, 600);
  const groundMaterial = new MeshStandardMaterial({
    color: "#0a0d14",
    roughness: 0.92,
    metalness: 0,
    emissive: "#ffffff",
    emissiveMap: groundTexture,
    emissiveIntensity: 0.2,
  });
  groundTexture.repeat.set(6, 6);
  const ground = new Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = receiveShadows;
  group.add(ground);

  // Soft dark pool under the tower; cheap stand-in for ambient occlusion.
  const shadowTexture = createContactShadowTexture();
  const shadowGeometry = new CircleGeometry(16, 32);
  const shadowMaterial = new MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false });
  const contactShadow = new Mesh(shadowGeometry, shadowMaterial);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = 0.02;
  group.add(contactShadow);

  const windowTexture = createWindowTexture(11, 16, 64, 0.26, 0.62);
  const blockGeometry = new BoxGeometry(1, 1, 1);
  blockGeometry.translate(0, 0.5, 0); // pivot at the base so scale.y grows upwards
  const blockMaterial = new MeshStandardMaterial({
    color: "#0f141d",
    roughness: 0.5,
    metalness: 0.5,
    emissive: "#ffffff",
    emissiveMap: windowTexture,
    emissiveIntensity: 0.6,
  });
  const blocks = new InstancedMesh(blockGeometry, blockMaterial, blockCount);
  const placement = new Object3D();
  const tint = new Color();
  const cameraPath = cameraPathPoints(8);
  let placed = 0;

  // Try more spots than needed; spots too close to the camera path are skipped,
  // so the camera never flies through (or sits inside) a building.
  for (let attempt = 0; attempt < blockCount * 6 && placed < blockCount; attempt++) {
    const angle = random() * Math.PI * 2;
    // Square root keeps the density even across the ring instead of crowding the centre.
    const distance = CLEAR_RADIUS + Math.sqrt(random()) * (CITY_RADIUS - CLEAR_RADIUS);
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;
    if (cameraPath.some((point) => Math.hypot(point.x - x, point.z - z) < CAMERA_CLEARANCE)) continue;

    const nearness = 1 - (distance - CLEAR_RADIUS) / (CITY_RADIUS - CLEAR_RADIUS);
    const height = 4 + random() * 10 + random() * random() * 26 * (0.4 + nearness);
    placement.position.set(x, 0, z);
    placement.rotation.y = Math.round(random() * 4) * (Math.PI / 2) + (random() - 0.5) * 0.2;
    placement.scale.set(4 + random() * 6, height, 4 + random() * 6);
    placement.updateMatrix();
    blocks.setMatrixAt(placed, placement.matrix);
    blocks.setColorAt(placed, tint.setHSL(0.6, 0.15, 0.05 + random() * 0.05));
    placed++;
  }
  blocks.count = placed;
  blocks.instanceMatrix.needsUpdate = true;
  group.add(blocks);

  function setNight(windowGlow: number): void {
    blockMaterial.emissiveIntensity = windowGlow * 0.45;
    groundMaterial.emissiveIntensity = 0.08 + windowGlow * 0.12;
  }

  function dispose(): void {
    for (const disposable of [
      groundTexture, groundGeometry, groundMaterial, shadowTexture, shadowGeometry,
      shadowMaterial, windowTexture, blockGeometry, blockMaterial,
    ]) {
      disposable.dispose();
    }
    blocks.dispose();
  }

  return { group, setNight, dispose };
}
