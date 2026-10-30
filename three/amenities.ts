import {
  AdditiveBlending,
  BoxGeometry,
  CylinderGeometry,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Sprite,
  SpriteMaterial,
} from "three";
import { TOWER } from "./config";
import { createCausticTexture, createGlowTexture, createRandom } from "./textures";

type Box = [width: number, height: number, depth: number, x: number, y: number, z: number];

// Pool on the podium roof (L04), open-air gym on a terrace of floor 24, garden on the roof.
export function createAmenities(gymFloor: Group, roof: Group, groundTrees: number) {
  const group = new Group();
  const geometries: { dispose(): void }[] = [];
  const materials: { dispose(): void }[] = [];

  function box([width, height, depth, x, y, z]: Box, material: MeshStandardMaterial, parent: Object3D) {
    const geometry = new BoxGeometry(width, height, depth);
    geometries.push(geometry);
    const mesh = new Mesh(geometry, material);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }

  const stone = new MeshStandardMaterial({ color: "#9a9184", roughness: 0.75 });
  const dark = new MeshStandardMaterial({ color: "#23262c", roughness: 0.5, metalness: 0.6 });
  const brassGlow = new MeshStandardMaterial({ color: "#c9a36a", emissive: "#ffcf96", emissiveIntensity: 1 });
  materials.push(stone, dark, brassGlow);

  // Pool: soft light ripples under the water, drifting slowly (see update below).
  const causticTexture = createCausticTexture(19);
  const water = new MeshStandardMaterial({
    color: "#0f5560",
    roughness: 0.04,
    metalness: 0.2,
    emissive: "#3fd4d0",
    emissiveMap: causticTexture,
    emissiveIntensity: 0.5,
  });
  materials.push(water, causticTexture);
  const podiumTop = TOWER.podiumHeight;
  box([4.6, 0.12, 11.4, 8.2, podiumTop + 0.02, 1.6], stone, group); // coping
  box([4, 0.12, 10.8, 8.2, podiumTop + 0.05, 1.6], water, group);
  for (const z of [-2.5, -0.8, 0.9, 2.6]) box([0.7, 0.14, 1.6, 5.3, podiumTop + 0.12, z], stone, group);

  // Sky gym terrace cantilevered off the west face of floor 24.
  box([4.6, 0.16, 7, -6.8, 0.08, 0.5], stone, gymFloor);
  box([0.05, 0.05, 7, -9.05, 1, 0.5], brassGlow, gymFloor); // glowing handrail
  for (const z of [-2, -0.6, 0.8]) {
    box([0.7, 0.25, 1.6, -6, 0.3, z], dark, gymFloor); // treadmill deck
    box([0.6, 0.9, 0.08, -6, 0.7, z - 0.75], dark, gymFloor); // treadmill console
  }
  box([0.5, 0.35, 1.6, -7.8, 0.33, 2.8], dark, gymFloor); // bench
  box([1.4, 1.1, 0.12, -7.6, 0.7, 3.8], dark, gymFloor); // rack
  box([1.8, 0.02, 0.8, -7.8, 0.17, -1.5], brassGlow, gymFloor); // yoga mat

  // Roof garden: lawn, firepit glow and trees, all riding on the roof (which lifts in scene 3).
  const lawn = new MeshStandardMaterial({ color: "#2f4a31", roughness: 0.95 });
  materials.push(lawn);
  const roofTop = TOWER.floorHeight + 0.19;
  box([7.6, 0.06, 7.6, 0, roofTop, 0], lawn, roof);
  box([1.2, 0.2, 1.2, 0, roofTop + 0.1, 0], dark, roof);

  const glowTexture = createGlowTexture();
  const fireMaterial = new SpriteMaterial({ map: glowTexture, color: "#ffb15e", blending: AdditiveBlending, depthWrite: false });
  const beaconMaterial = new SpriteMaterial({ map: glowTexture, color: "#ff3b30", blending: AdditiveBlending, depthWrite: false });
  materials.push(glowTexture, fireMaterial, beaconMaterial);
  const fire = new Sprite(fireMaterial);
  fire.position.set(0, roofTop + 0.6, 0);
  fire.scale.setScalar(2.2);
  const beacon = new Sprite(beaconMaterial);
  beacon.position.set(0, roofTop + 3.4, 0);
  roof.add(fire, beacon);

  // Low-poly trees: one instanced draw call for trunks, one for canopies.
  const trunkGeometry = new CylinderGeometry(0.08, 0.12, 0.8, 5);
  trunkGeometry.translate(0, 0.4, 0);
  const canopyGeometry = new IcosahedronGeometry(0.75, 0);
  canopyGeometry.translate(0, 1.3, 0);
  const trunkMaterial = new MeshStandardMaterial({ color: "#2b2119", roughness: 1 });
  const canopyMaterial = new MeshStandardMaterial({ color: "#1f3529", roughness: 1, flatShading: true });
  geometries.push(trunkGeometry, canopyGeometry);
  materials.push(trunkMaterial, canopyMaterial);

  const roofTreeSpots: [number, number][] = [[-3, -3], [3, -3], [-3, 3], [3, 3], [-3, 0], [3, 0], [0, -3], [0, 3]];
  const trunks = new InstancedMesh(trunkGeometry, trunkMaterial, groundTrees);
  const canopies = new InstancedMesh(canopyGeometry, canopyMaterial, groundTrees);
  const roofTrunks = new InstancedMesh(trunkGeometry, trunkMaterial, roofTreeSpots.length);
  const roofCanopies = new InstancedMesh(canopyGeometry, canopyMaterial, roofTreeSpots.length);
  const placement = new Object3D();
  const random = createRandom(5);

  for (let index = 0; index < groundTrees; index++) {
    // Landscaped ring around the podium, kept clear of the podium itself.
    const angle = random() * Math.PI * 2;
    const distance = 13 + random() * 18;
    placement.position.set(Math.cos(angle) * distance, 0, Math.sin(angle) * distance);
    placement.scale.setScalar(0.7 + random() * 0.6);
    placement.updateMatrix();
    trunks.setMatrixAt(index, placement.matrix);
    canopies.setMatrixAt(index, placement.matrix);
  }
  roofTreeSpots.forEach(([x, z], index) => {
    placement.position.set(x, roofTop, z);
    placement.scale.setScalar(0.8 + random() * 0.3);
    placement.updateMatrix();
    roofTrunks.setMatrixAt(index, placement.matrix);
    roofCanopies.setMatrixAt(index, placement.matrix);
  });
  group.add(trunks, canopies);
  roof.add(roofTrunks, roofCanopies);
  const instanced = [trunks, canopies, roofTrunks, roofCanopies];

  // `elapsed` only drives idle life (water shimmer, aviation beacon); everything else follows scroll.
  function update(elapsed: number, windowGlow: number): void {
    causticTexture.offset.set(Math.sin(elapsed * 0.3) * 0.02, elapsed * 0.01);
    water.emissiveIntensity = 0.25 + windowGlow * 0.35;
    fireMaterial.opacity = 0.75 + Math.sin(elapsed * 7) * 0.08 + Math.sin(elapsed * 13) * 0.05;
    beaconMaterial.opacity = Math.sin(elapsed * 2.4) > 0.6 ? 1 : 0.15;
    brassGlow.emissiveIntensity = 0.4 + windowGlow * 0.5;
  }

  function dispose(): void {
    for (const item of [...geometries, ...materials, ...instanced]) item.dispose();
  }

  // Points the DOM amenity cards are pinned to (see components/landing/SceneLabels.tsx).
  // Children of the gym floor and the roof, so they follow those floors when they move.
  const anchors: Record<string, Object3D> = { pool: new Object3D(), gym: new Object3D(), garden: new Object3D() };
  anchors.pool?.position.set(8.2, podiumTop + 0.3, 1.6);
  anchors.gym?.position.set(-6.8, 1.3, 0.5);
  anchors.garden?.position.set(0, roofTop + 2.2, 0);
  if (anchors.pool) group.add(anchors.pool);
  if (anchors.gym) gymFloor.add(anchors.gym);
  if (anchors.garden) roof.add(anchors.garden);

  return { group, anchors, update, dispose };
}
