import { ACESFilmicToneMapping, PerspectiveCamera, SRGBColorSpace, Scene, Timer, Vector2, WebGLRenderer } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { BLOOM, MAX_FRAME_DELTA, TIER_SETTINGS, type QualityTier } from "./config";

interface EngineOptions {
  host: HTMLElement;
  // The loop pauses while this element is off-screen (the canvas itself is fixed, so it is always "visible").
  pauseWhenHidden: HTMLElement;
  tier: QualityTier;
  onResize: (width: number, height: number) => void;
  onFrame: (deltaSeconds: number, elapsedSeconds: number) => void;
}

// Renderer, camera and the render loop. Knows nothing about the tower or the story.
export function createEngine({ host, pauseWhenHidden, tier, onResize, onFrame }: EngineOptions) {
  const pixelRatio = Math.min(window.devicePixelRatio, TIER_SETTINGS[tier].maxPixelRatio);
  const renderer = new WebGLRenderer({
    antialias: pixelRatio <= 1,
    powerPreference: "high-performance",
    alpha: false,
  });
  renderer.setPixelRatio(pixelRatio);
  // Shader checks are a development aid; in production they cost time and can log
  // harmless GPU-driver compiler notes to the console.
  renderer.debug.checkShaderErrors = process.env.NODE_ENV !== "production";
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(40, 1, 0.5, 900);
  const timer = new Timer();

  // High tier only: render → bloom (only bright pixels glow) → output (tone mapping + sRGB).
  // The low tier renders straight to the screen, which is much cheaper on phones.
  let composer: EffectComposer | null = null;
  if (TIER_SETTINGS[tier].bloom) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new Vector2(1, 1), BLOOM.strength, BLOOM.radius, BLOOM.threshold));
    composer.addPass(new OutputPass());
  }
  let storyOnScreen = true;
  let running = false;

  function resize(): void {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (width === 0 || height === 0) return;
    renderer.setSize(width, height, false);
    composer?.setSize(width, height);
    camera.aspect = width / height;
    // Portrait phones get a wider lens so the whole tower still fits.
    camera.fov = camera.aspect < 0.8 ? 55 : 40;
    camera.updateProjectionMatrix();
    onResize(width, height);
  }

  function renderFrame(timestamp: number): void {
    timer.update(timestamp);
    const delta = Math.min(timer.getDelta(), MAX_FRAME_DELTA);
    onFrame(delta, timer.getElapsed());
    if (composer) composer.render(delta);
    else renderer.render(scene, camera);
  }

  function syncLoop(): void {
    const shouldRun = storyOnScreen && !document.hidden;
    if (shouldRun === running) return;
    running = shouldRun;
    // Resetting the timer on resume means the first frame back has a tiny delta, not the whole pause.
    if (shouldRun) timer.reset();
    renderer.setAnimationLoop(shouldRun ? renderFrame : null);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    storyOnScreen = entry?.isIntersecting ?? false;
    syncLoop();
  });
  visibilityObserver.observe(pauseWhenHidden);
  document.addEventListener("visibilitychange", syncLoop);

  resize();
  syncLoop();

  function dispose(): void {
    renderer.setAnimationLoop(null);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    document.removeEventListener("visibilitychange", syncLoop);
    timer.dispose();
    composer?.dispose();
    renderer.dispose();
    // Browsers cap live WebGL contexts; release ours so navigating away and back never hits the cap.
    renderer.forceContextLoss();
    renderer.domElement.remove();
  }

  return { renderer, scene, camera, renderFrame, dispose };
}
