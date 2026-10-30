import { BoxGeometry, ConeGeometry, Group, Mesh, MeshStandardMaterial, Object3D } from "three";
import { TOWER } from "./config";

// The 3 BHK plan on the showcase floor, in the floor group's local space
// (x and z from -4.5 to 4.5, y = 0.18 is the top of the slab).
const FLOOR_TOP = 0.19;
const WALL_HEIGHT = 0.75; // cut low, like an architectural model, so the plan reads from above

type Box = [width: number, height: number, depth: number, x: number, y: number, z: number];

const ZONES = {
  living: { color: "#8a6a4a", box: [5, 0.02, 4.4, -2, FLOOR_TOP, 2.2] as Box },
  kitchen: { color: "#bfb8ac", box: [3.9, 0.02, 4.4, -2.55, FLOOR_TOP, -2.2] as Box },
  bedroom: { color: "#b9a68c", box: [4.4, 0.02, 4.4, 2.2, FLOOR_TOP, -2.2] as Box },
  balcony: { color: "#3b3027", box: [3.9, 0.02, 4.4, 2.55, FLOOR_TOP, 2.2] as Box },
} as const;

const WALLS: Box[] = [
  [9, WALL_HEIGHT, 0.08, 0, FLOOR_TOP + WALL_HEIGHT / 2, -4.46],
  [0.08, WALL_HEIGHT, 9, -4.46, FLOOR_TOP + WALL_HEIGHT / 2, 0],
  [3.4, WALL_HEIGHT, 0.08, -2.8, FLOOR_TOP + WALL_HEIGHT / 2, 0],
  [3.4, WALL_HEIGHT, 0.08, 2.8, FLOOR_TOP + WALL_HEIGHT / 2, 0],
  [0.08, WALL_HEIGHT, 4.4, 0.6, FLOOR_TOP + WALL_HEIGHT / 2, -2.2],
  [0.08, WALL_HEIGHT * 0.5, 4.4, 0.6, FLOOR_TOP + WALL_HEIGHT * 0.25, 2.2],
];

const FURNITURE: { box: Box; color: string }[] = [
  { box: [2.6, 0.32, 0.9, -2.4, 0.35, 3.6], color: "#b8ab95" }, // sofa
  { box: [1.2, 0.18, 0.7, -2.4, 0.28, 2.3], color: "#2b2622" }, // coffee table
  { box: [3.2, 0.01, 2.2, -2.4, 0.2, 2.8], color: "#c9a36a" }, // rug
  { box: [2.2, 0.3, 2.6, 2.6, 0.34, -2.4], color: "#cfc6b8" }, // bed
  { box: [2.4, 0.5, 0.12, 2.6, 0.45, -3.75], color: "#5a4636" }, // headboard
  { box: [2.4, 0.45, 0.9, -2.6, 0.42, -2.2], color: "#c9c1b4" }, // kitchen island
  { box: [3.6, 0.5, 0.6, -2.4, 0.44, -4.05], color: "#3a3430" }, // kitchen counter
  { box: [0.7, 0.12, 1.6, 1.8, 0.28, 2.6], color: "#d9cdb8" }, // lounger
  { box: [0.7, 0.12, 1.6, 3.2, 0.28, 2.6], color: "#d9cdb8" }, // lounger
];

export function createInterior() {
  const group = new Group();
  const geometries: BoxGeometry[] = [];
  const materials: MeshStandardMaterial[] = [];

  function addBox([width, height, depth, x, y, z]: Box, material: MeshStandardMaterial): void {
    const geometry = new BoxGeometry(width, height, depth);
    geometries.push(geometry);
    const mesh = new Mesh(geometry, material);
    mesh.position.set(x, y, z);
    group.add(mesh);
  }

  // Zone floors glow softly at night, as if the rooms were lit.
  const zoneMaterials = Object.values(ZONES).map((zone) => {
    const material = new MeshStandardMaterial({ color: zone.color, roughness: 0.55, emissive: zone.color });
    materials.push(material);
    addBox(zone.box, material);
    return material;
  });

  // Off-white, not pure white: bright surfaces would cross the bloom threshold and glow like lamps.
  const wallMaterial = new MeshStandardMaterial({ color: "#bdb5a8", roughness: 0.85 });
  materials.push(wallMaterial);
  for (const wall of WALLS) addBox(wall, wallMaterial);

  for (const item of FURNITURE) {
    const material = new MeshStandardMaterial({ color: item.color, roughness: 0.7 });
    materials.push(material);
    addBox(item.box, material);
  }

  const plantGeometry = new ConeGeometry(0.25, 0.8, 7);
  const plantMaterial = new MeshStandardMaterial({ color: "#3f6b45", roughness: 0.9 });
  for (const [x, z] of [[-4, 4], [4, 4], [0.2, -4]] as const) {
    const plant = new Mesh(plantGeometry, plantMaterial);
    plant.position.set(x, 0.6, z);
    group.add(plant);
  }

  // Anchor points for the DOM labels (see labels.ts); they move with the floor.
  const anchors: Record<string, Object3D> = {};
  for (const [name, zone] of Object.entries(ZONES)) {
    const anchor = new Object3D();
    anchor.position.set(zone.box[3], 1.1, zone.box[5]);
    group.add(anchor);
    anchors[name] = anchor;
  }

  group.visible = false;

  function setState(open: number, windowGlow: number): void {
    group.visible = open > 0.01;
    for (const material of zoneMaterials) material.emissiveIntensity = 0.04 * windowGlow;
  }

  function dispose(): void {
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    plantGeometry.dispose();
    plantMaterial.dispose();
  }

  return { group, anchors, floorNumber: TOWER.showcaseFloor, setState, dispose };
}
