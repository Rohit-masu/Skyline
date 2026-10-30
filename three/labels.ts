import { Vector3, type Camera, type Object3D } from "three";

// Pins real DOM labels (room names, amenity cards) to points in the 3D scene.
// Each label element has data-label="<anchor name>" inside the label layer.
export function createLabels(layer: HTMLElement, anchors: Record<string, Object3D>) {
  const projected = new Vector3();
  const entries = Object.entries(anchors).flatMap(([name, anchor]) => {
    const element = layer.querySelector<HTMLElement>(`[data-label="${name}"]`);
    return element ? [{ name, element, anchor, lastOpacity: -1 }] : [];
  });

  // `visibility` gives each label's opacity (0..1) by anchor name; missing names are hidden.
  function update(camera: Camera, visibility: Record<string, number>, width: number, height: number): void {
    for (const entry of entries) {
      const opacity = visibility[entry.name] ?? 0;
      if (opacity !== entry.lastOpacity) {
        entry.element.style.opacity = opacity.toFixed(3);
        entry.lastOpacity = opacity;
      }
      if (opacity <= 0) continue;

      entry.anchor.getWorldPosition(projected).project(camera);
      // z > 1 means the point is behind the camera; hide instead of mirroring it.
      const onScreen = projected.z < 1 && Math.abs(projected.x) < 1.1 && Math.abs(projected.y) < 1.1;
      entry.element.style.visibility = onScreen ? "visible" : "hidden";
      const x = (projected.x * 0.5 + 0.5) * width;
      const y = (-projected.y * 0.5 + 0.5) * height;
      entry.element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -100%)`;
    }
  }

  function dispose(): void {
    for (const entry of entries) entry.element.style.removeProperty("opacity");
  }

  return { update, dispose };
}
