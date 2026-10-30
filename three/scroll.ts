import { MathUtils, Vector3 } from "three";
import { SCENE_IDS, SCROLL_DAMPING, type SceneId } from "./config";
import { CAMERA_KEYFRAMES, type ResolvedKeyframe } from "./keyframes";

interface SceneRange {
  element: HTMLElement;
  start: number;
  end: number;
  lastWritten: number;
}

// Turns window scroll into one damped progress value `p` (0..1) over the story root,
// plus a local progress per scene. Offsets are measured once (and on resize), never per frame.
export function createScrollProgress(storyRoot: HTMLElement) {
  const ranges = new Map<SceneId, SceneRange>();
  let rootTop = 0;
  let scrollRange = 1;
  let current = 0;
  let keyframes: ResolvedKeyframe[] = [];

  function documentTop(element: HTMLElement): number {
    return element.getBoundingClientRect().top + window.scrollY;
  }

  function measure(): void {
    const viewportHeight = window.innerHeight;
    rootTop = documentTop(storyRoot);
    scrollRange = Math.max(1, storyRoot.offsetHeight - viewportHeight);

    ranges.clear();
    for (const id of SCENE_IDS) {
      const element = storyRoot.querySelector<HTMLElement>(`[data-scene="${id}"]`);
      if (!element) continue;
      const top = documentTop(element) - rootTop;
      // Local 0 = section top reaches the viewport top; local 1 = section bottom reaches the viewport bottom.
      const start = top / scrollRange;
      const end = Math.max(start, (top + element.offsetHeight - viewportHeight) / scrollRange);
      ranges.set(id, { element, start, end, lastWritten: -1 });
    }

    keyframes = CAMERA_KEYFRAMES.map((frame) => ({
      at: toGlobal(frame.scene, frame.at),
      position: new Vector3(...frame.position),
      target: new Vector3(...frame.target),
    }));
  }

  function toGlobal(scene: SceneId, local: number): number {
    const range = ranges.get(scene);
    if (!range) return 0;
    return range.start + (range.end - range.start) * local;
  }

  function rawProgress(): number {
    return MathUtils.clamp((window.scrollY - rootTop) / scrollRange, 0, 1);
  }

  function update(deltaSeconds: number): number {
    current = MathUtils.damp(current, rawProgress(), SCROLL_DAMPING, deltaSeconds);
    // Snap the tail of the damping so the loop settles on the exact value.
    if (Math.abs(current - rawProgress()) < 0.00005) current = rawProgress();
    writeSceneVariables();
    return current;
  }

  function local(scene: SceneId): number {
    const range = ranges.get(scene);
    if (!range) return 0;
    const length = range.end - range.start;
    if (length <= 0) return current >= range.start ? 1 : 0;
    return MathUtils.clamp((current - range.start) / length, 0, 1);
  }

  // Overlay panels read --scene-p in CSS, so text is always in sync with the 3D.
  function writeSceneVariables(): void {
    for (const [id, range] of ranges) {
      const value = local(id);
      if (Math.abs(value - range.lastWritten) < 0.001) continue;
      range.lastWritten = value;
      range.element.style.setProperty("--scene-p", value.toFixed(4));
    }
  }

  function clearSceneVariables(): void {
    for (const range of ranges.values()) range.element.style.removeProperty("--scene-p");
  }

  measure();
  current = rawProgress();

  return {
    measure,
    update,
    local,
    toGlobal,
    clearSceneVariables,
    get progress() {
      return current;
    },
    get keyframes() {
      return keyframes;
    },
  };
}

export type ScrollProgress = ReturnType<typeof createScrollProgress>;
