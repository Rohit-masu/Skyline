import { MathUtils, Vector3 } from "three";
import type { SceneId } from "./config";

type Vec3 = [number, number, number];

// `at` is the progress *inside* the named scene (0 = scene starts, 1 = scene ends).
// scroll.ts converts it to a global progress once section offsets are measured.
export interface CameraKeyframe {
  scene: SceneId;
  at: number;
  position: Vec3;
  target: Vec3;
}

// Tower base is at y = 0; floor 18 sits around y = 22, floor 24 around y = 28.5, the roof around y = 34.
// The pool is on the podium roof east of the tower (x ≈ 8), the gym terrace west of floor 24 (x ≈ -7).
// In the inside/pool/gym/garden scenes the target is set slightly to the left of the subject on screen,
// so the subject sits right of centre and the story text on the left stays readable.
export const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  // Hero and arrival targets sit left of the tower, so the tower stands right of the headline.
  { scene: "hero", at: 0, position: [-40, 11, 54], target: [-7, 19, -5] },
  { scene: "arrival", at: 0, position: [-18, 6, 46], target: [-6.5, 18, -2.5] },
  { scene: "arrival", at: 1, position: [10, 12, 44], target: [-6.8, 17, 1.5] },
  // Pulled back and aimed higher: at the start of the build-up the spread tower (with crown fins)
  // reaches y ≈ 46, and its top must stay clear of the fixed header.
  { scene: "build", at: 0, position: [48, 34, 58], target: [0, 27, 0] },
  { scene: "build", at: 1, position: [48, 34, 44], target: [0, 22, 0] },
  { scene: "inside", at: 0, position: [16, 34, 16], target: [-2.8, 22, 2.8] },
  { scene: "inside", at: 1, position: [9, 30, 12], target: [-3, 22.2, 2.2] },
  { scene: "pool", at: 0, position: [19, 14, 16], target: [3, 3.3, 5.6] },
  { scene: "pool", at: 1, position: [15, 12, 19], target: [3, 3.3, 5.6] },
  { scene: "gym", at: 0, position: [-20, 33, 12], target: [-9.4, 29, -2.5] },
  { scene: "gym", at: 1, position: [-18, 31.5, 15], target: [-9.4, 29, -2.5] },
  { scene: "garden", at: 0, position: [-12, 46, -14], target: [3.8, 35, -3.3] },
  { scene: "garden", at: 1, position: [12, 45, -16], target: [4, 35, 3] },
  { scene: "cta", at: 0, position: [40, 20, 46], target: [0, 18, 0] },
  { scene: "cta", at: 1, position: [52, 16, 58], target: [0, 17, 0] },
];

// Points along the whole camera path (keyframes plus samples between them). Easing changes the
// camera's speed along each segment but not the segment itself, so straight samples are exact.
export function cameraPathPoints(samplesPerSegment: number): Vector3[] {
  const points: Vector3[] = [];
  CAMERA_KEYFRAMES.forEach((frame, index) => {
    const next = CAMERA_KEYFRAMES[index + 1];
    const from = new Vector3(...frame.position);
    points.push(from);
    if (!next) return;
    const to = new Vector3(...next.position);
    for (let step = 1; step < samplesPerSegment; step++) {
      points.push(from.clone().lerp(to, step / samplesPerSegment));
    }
  });
  return points;
}

export interface ResolvedKeyframe {
  at: number;
  position: Vector3;
  target: Vector3;
}

// Smooth start and end, so the camera never jerks when it passes a keyframe.
function easeInOut(t: number): number {
  return t * t * (3 - 2 * t);
}

// Writes the interpolated camera pose for global progress `p` into `outPosition` / `outTarget`.
export function sampleCamera(
  keyframes: ResolvedKeyframe[],
  p: number,
  outPosition: Vector3,
  outTarget: Vector3,
): void {
  const first = keyframes[0];
  const last = keyframes[keyframes.length - 1];
  if (!first || !last) return;

  if (p <= first.at) {
    outPosition.copy(first.position);
    outTarget.copy(first.target);
    return;
  }

  for (let index = 1; index < keyframes.length; index++) {
    const previous = keyframes[index - 1];
    const next = keyframes[index];
    if (!previous || !next || p > next.at) continue;

    const span = next.at - previous.at;
    const t = span > 0 ? easeInOut(MathUtils.clamp((p - previous.at) / span, 0, 1)) : 1;
    outPosition.lerpVectors(previous.position, next.position, t);
    outTarget.lerpVectors(previous.target, next.target, t);
    return;
  }

  outPosition.copy(last.position);
  outTarget.copy(last.target);
}
