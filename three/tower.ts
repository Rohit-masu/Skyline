import {
  BoxGeometry,
  Group,
  InstancedMesh,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  type Texture,
} from "three";
import { TOWER } from "./config";
import { createWindowTexture } from "./textures";

const MULLIONS_PER_SIDE = 8;
const GLASS_VARIANTS = 4;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// Base height (y) of a floor, counting floors from 1 like people do.
export function floorBaseY(floorNumber: number): number {
  return TOWER.podiumHeight + (floorNumber - 1) * TOWER.floorHeight;
}

export function createTower(castShadows: boolean) {
  const group = new Group();
  const { width, depth, floorHeight, floors } = TOWER;
  const glassHeight = floorHeight - 0.18;

  const stone = new MeshStandardMaterial({ color: "#8f887c", roughness: 0.78, metalness: 0.05 });
  const brass = new MeshStandardMaterial({ color: "#c9a36a", roughness: 0.3, metalness: 0.9 });
  const lobbyGlow = new MeshStandardMaterial({ color: "#1a1a1a", emissive: "#ffcf96", emissiveIntensity: 1.2 });
  // Slab edges catch the warm interior light at night, the tower's signature gold banding.
  const slabMaterial = new MeshStandardMaterial({ color: "#cbbfa8", roughness: 0.6, emissive: "#ffb867", emissiveIntensity: 0.1 });
  const crownGlow = new MeshStandardMaterial({ color: "#2a2116", emissive: "#ffd394", emissiveIntensity: 1 });

  // Each glass variant shows a different row of the lit-window texture, so floors don't repeat.
  const windowTexture = createWindowTexture(3, 12, GLASS_VARIANTS, 0.82, 0.94);
  const textures: Texture[] = [windowTexture];
  const glassMaterials = Array.from({ length: GLASS_VARIANTS }, (_, variant) => {
    const texture = variant === 0 ? windowTexture : windowTexture.clone();
    texture.repeat.set(1, 1 / GLASS_VARIANTS);
    texture.offset.set(0, variant / GLASS_VARIANTS);
    if (variant > 0) textures.push(texture);
    return new MeshStandardMaterial({
      color: "#08111d",
      roughness: 0.06,
      metalness: 0.9,
      emissive: "#ffffff",
      emissiveMap: texture,
    });
  });
  // The showcase floor gets its own transparent glass so its facade can fade away.
  const showcaseGlass = new MeshStandardMaterial({
    color: "#0c1726", roughness: 0.06, metalness: 0.9, transparent: true,
  });

  const podiumGeometry = new BoxGeometry(18, TOWER.podiumHeight, 15);
  const lobbyGeometry = new BoxGeometry(width + 0.2, 1.4, depth + 0.2);
  const slabGeometry = new BoxGeometry(width + 0.7, 0.18, depth + 0.7);
  const glassGeometry = new BoxGeometry(width, glassHeight, depth);
  const panelGeometry = new BoxGeometry(width, glassHeight, 0.08);
  const mullionGeometry = new BoxGeometry(0.07, glassHeight, 0.07);
  const balconyGeometry = new BoxGeometry(3.6, 0.16, 2);
  const railGeometry = new BoxGeometry(3.6, 0.05, 0.05);
  const crownGeometry = new BoxGeometry(0.12, 2.6, 0.12);
  const lanternGeometry = new BoxGeometry(width + 0.6, 1.2, 0.12);

  const podium = new Mesh(podiumGeometry, stone);
  podium.position.set(2, TOWER.podiumHeight / 2, 1);
  const lobby = new Mesh(lobbyGeometry, lobbyGlow);
  lobby.position.set(0, 0.75, 0);
  group.add(podium, lobby);

  const floorGroups: Group[] = [];
  const glassMeshes: Mesh[] = [];
  const showcasePanels: Mesh[] = [];
  const instancedMeshes: InstancedMesh[] = [];
  const placement = new Object3D();

  for (let floorNumber = 1; floorNumber <= floors; floorNumber++) {
    const floor = new Group();
    floor.position.y = floorBaseY(floorNumber);
    floor.userData.baseY = floor.position.y;

    const slab = new Mesh(slabGeometry, slabMaterial);
    slab.position.y = 0.09;
    floor.add(slab);

    if (floorNumber === TOWER.showcaseFloor) {
      // Four separate facade panels that slide outwards in the "inside a home" scene.
      for (let side = 0; side < 4; side++) {
        const panel = new Mesh(panelGeometry, showcaseGlass);
        const angle = (side * Math.PI) / 2;
        panel.rotation.y = angle;
        panel.position.set(Math.sin(angle) * (depth / 2), 0.18 + glassHeight / 2, Math.cos(angle) * (depth / 2));
        panel.userData.direction = [Math.sin(angle), Math.cos(angle)];
        panel.userData.floorNumber = floorNumber;
        floor.add(panel);
        showcasePanels.push(panel);
        glassMeshes.push(panel);
      }
    } else {
      const glass = new Mesh(glassGeometry, glassMaterials[floorNumber % GLASS_VARIANTS]);
      glass.position.y = 0.18 + glassHeight / 2;
      glass.userData.floorNumber = floorNumber;
      floor.add(glass);
      glassMeshes.push(glass);
    }

    // Vertical mullions around all four sides: one instanced draw call per floor.
    const mullions = new InstancedMesh(mullionGeometry, brass, MULLIONS_PER_SIDE * 4);
    for (let index = 0; index < MULLIONS_PER_SIDE * 4; index++) {
      const side = Math.floor(index / MULLIONS_PER_SIDE);
      const along = ((index % MULLIONS_PER_SIDE) / (MULLIONS_PER_SIDE - 1) - 0.5) * width;
      const edge = depth / 2 + 0.04;
      const onX = side % 2 === 0;
      const sign = side < 2 ? 1 : -1;
      placement.position.set(onX ? along : sign * edge, 0.18 + glassHeight / 2, onX ? sign * edge : along);
      placement.updateMatrix();
      mullions.setMatrixAt(index, placement.matrix);
    }
    floor.add(mullions);
    instancedMeshes.push(mullions);

    // Balconies alternate corners up the tower, the facade's signature rhythm.
    const corner = floorNumber % 2 === 0 ? 1 : -1;
    const balcony = new Mesh(balconyGeometry, stone);
    balcony.position.set(corner * 2.6, 0.08, corner * (depth / 2 + 1));
    const rail = new Mesh(railGeometry, brass);
    rail.position.set(corner * 2.6, 0.95, corner * (depth / 2 + 1.95));
    floor.add(balcony, rail);

    floor.traverse((child) => {
      child.castShadow = castShadows;
      child.receiveShadow = castShadows;
    });
    group.add(floor);
    floorGroups.push(floor);
  }

  // Roof slab and crown fins ride on the top floor, so they lift and drop together with it.
  const roof = floorGroups[floors - 1] ?? group;
  const roofSlab = new Mesh(slabGeometry, slabMaterial);
  roofSlab.position.y = floorHeight + 0.09;
  roofSlab.receiveShadow = castShadows;
  roof.add(roofSlab);
  // Crown lantern: four glowing panels around the roof garden, like a lit crown at night.
  for (let side = 0; side < 4; side++) {
    const angle = (side * Math.PI) / 2;
    const lantern = new Mesh(lanternGeometry, crownGlow);
    lantern.rotation.y = angle;
    lantern.position.set(Math.sin(angle) * (depth / 2 + 0.3), floorHeight + 0.9, Math.cos(angle) * (depth / 2 + 0.3));
    roof.add(lantern);
  }
  for (let index = 0; index < 16; index++) {
    const fin = new Mesh(crownGeometry, brass);
    const side = Math.floor(index / 4);
    const along = ((index % 4) / 3 - 0.5) * width;
    const onX = side % 2 === 0;
    const sign = side < 2 ? 1 : -1;
    fin.position.set(onX ? along : sign * (depth / 2), floorHeight + 1.3, onX ? sign * (depth / 2) : along);
    roof.add(fin);
  }

  /**
   * Pure function of scroll state:
   * - spread: 0..1, how far the floors are pulled apart before the build-up
   * - build: 0..1, build-up progress; floor i lands when build passes i / floors
   * - lift: 0..1, raises everything above the showcase floor to reveal the plan
   * - open: 0..1, slides the showcase facade panels out and fades them
   */
  function setState(spread: number, build: number, lift: number, open: number, windowGlow: number): void {
    floorGroups.forEach((floor, index) => {
      const landed = easeOutCubic(MathUtils.clamp((build * (floors + 2) - index) / 2, 0, 1));
      const exploded = spread * (1 - landed) * (TOWER.dropHeight + index * TOWER.spreadPerFloor);
      const lifted = index + 1 > TOWER.showcaseFloor ? lift * TOWER.liftAboveShowcase : 0;
      floor.position.y = (floor.userData.baseY as number) + exploded + lifted;
    });

    for (const panel of showcasePanels) {
      const [x, z] = panel.userData.direction as [number, number];
      panel.position.x = x * (depth / 2 + open * 3);
      panel.position.z = z * (depth / 2 + open * 3);
      panel.visible = open < 0.99;
    }
    showcaseGlass.opacity = 1 - open;

    for (const material of glassMaterials) material.emissiveIntensity = windowGlow;
    lobbyGlow.emissiveIntensity = 0.25 + windowGlow * 0.35;
    slabMaterial.emissiveIntensity = 0.06 * windowGlow;
    crownGlow.emissiveIntensity = 0.3 + windowGlow * 0.45;
  }

  function dispose(): void {
    for (const disposable of [
      stone, brass, lobbyGlow, slabMaterial, crownGlow, lanternGeometry, showcaseGlass, ...glassMaterials, ...textures,
      podiumGeometry, lobbyGeometry, slabGeometry, glassGeometry, panelGeometry,
      mullionGeometry, balconyGeometry, railGeometry, crownGeometry,
    ]) {
      disposable.dispose();
    }
    for (const mesh of instancedMeshes) mesh.dispose();
  }

  return { group, floorGroups, glassMeshes, roof, setState, dispose };
}
