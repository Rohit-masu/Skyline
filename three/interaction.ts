import {
  BoxGeometry,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  Raycaster,
  Vector2,
  type Camera,
  type Group,
  type Object3D,
} from "three";
import { POINTER_PARALLAX, TOWER } from "./config";

// Typical home on each floor, for the hover tooltip. Upper floors get the bigger homes.
function homeTypeFor(floorNumber: number): string {
  if (floorNumber >= 26) return "Penthouse";
  if (floorNumber >= 18) return "4 BHK";
  if (floorNumber >= 8) return "3 BHK";
  return "2 BHK";
}

// Pointer parallax (damped camera offset) and floor hover with a DOM tooltip.
// Disabled on touch devices, where there is no hover and parallax fights scrolling.
export function createInteraction(floorGroups: Group[], hoverTargets: Object3D[], tooltip: HTMLElement) {
  const enabled = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const pointer = new Vector2();
  const parallax = new Vector2();
  const raycaster = new Raycaster();
  let pointerMoved = false;
  let pointerOverStory = false;
  let pointerX = 0;
  let pointerY = 0;

  // One brass-tinted shell is moved to the hovered floor instead of changing per-floor materials.
  const highlightGeometry = new BoxGeometry(TOWER.width + 0.25, TOWER.floorHeight - 0.1, TOWER.depth + 0.25);
  const highlightMaterial = new MeshBasicMaterial({ color: "#c9a36a", transparent: true, opacity: 0.28, depthWrite: false });
  const highlight = new Mesh(highlightGeometry, highlightMaterial);
  highlight.visible = false;
  highlight.position.y = TOWER.floorHeight / 2 + 0.05;

  function onPointerMove(event: PointerEvent): void {
    pointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    pointerX = event.clientX;
    pointerY = event.clientY;
    pointerMoved = true;
    // The canvas is fixed behind the whole page, so the tower can sit under Featured homes or the
    // header. Hover only counts over the story itself. Hiding here (not in the frame loop) also
    // works after the loop has paused because the story scrolled away.
    pointerOverStory = event.target instanceof Element && event.target.closest("[data-story-root]") !== null;
    if (!pointerOverStory && highlight.visible) hideHover();
  }

  if (enabled) window.addEventListener("pointermove", onPointerMove, { passive: true });

  function hideHover(): void {
    highlight.removeFromParent();
    highlight.visible = false;
    tooltip.hidden = true;
  }

  // Raycasts only on frames after the pointer actually moved, never every frame.
  function update(camera: Camera, deltaSeconds: number, hoverAllowed: boolean): Vector2 {
    if (!enabled) return parallax;
    parallax.x = MathUtils.damp(parallax.x, pointer.x * POINTER_PARALLAX.strength, POINTER_PARALLAX.damping, deltaSeconds);
    parallax.y = MathUtils.damp(parallax.y, pointer.y * POINTER_PARALLAX.strength, POINTER_PARALLAX.damping, deltaSeconds);

    if (!hoverAllowed || !pointerOverStory) {
      if (highlight.visible) hideHover();
      return parallax;
    }
    if (!pointerMoved) return parallax;
    pointerMoved = false;

    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(hoverTargets, false)[0];
    const floorNumber = hit?.object.userData.floorNumber as number | undefined;
    const floor = floorNumber ? floorGroups[floorNumber - 1] : undefined;
    if (!floor || !floorNumber) {
      hideHover();
      return parallax;
    }

    if (highlight.parent !== floor) floor.add(highlight);
    highlight.visible = true;
    tooltip.hidden = false;
    tooltip.textContent = `Floor ${floorNumber} · ${homeTypeFor(floorNumber)}`;
    tooltip.style.transform = `translate3d(${pointerX + 16}px, ${pointerY + 16}px, 0)`;
    return parallax;
  }

  function dispose(): void {
    window.removeEventListener("pointermove", onPointerMove);
    hideHover();
    highlightGeometry.dispose();
    highlightMaterial.dispose();
  }

  return { update, dispose };
}
