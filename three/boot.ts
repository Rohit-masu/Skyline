import { MathUtils, Vector3 } from "three";
import { TIER_SETTINGS, TOWER, pickTier } from "./config";
import { createAmenities } from "./amenities";
import { createCity } from "./city";
import { createEngine } from "./engine";
import { createInteraction } from "./interaction";
import { createInterior } from "./interior";
import { sampleCamera } from "./keyframes";
import { createLabels } from "./labels";
import { createLighting } from "./lighting";
import { createScrollProgress } from "./scroll";
import { createSky } from "./sky";
import { createTower } from "./tower";

export interface BootOptions {
  host: HTMLElement;
  storyRoot: HTMLElement;
  labelLayer: HTMLElement;
  tooltip: HTMLElement;
  onFirstFrame: () => void;
  onContextLost: () => void;
}

const smooth = (from: number, to: number, value: number) => MathUtils.smoothstep(value, from, to);

// Entry point of the lazy 3D chunk. The only module the page imports (dynamically).
export function boot({ host, storyRoot, labelLayer, tooltip, onFirstFrame, onContextLost }: BootOptions) {
  const tier = pickTier();
  const settings = TIER_SETTINGS[tier];
  const scroll = createScrollProgress(storyRoot);
  const cameraPosition = new Vector3();
  const cameraTarget = new Vector3();
  let viewport = { width: host.clientWidth, height: host.clientHeight };

  const engine = createEngine({
    host,
    pauseWhenHidden: storyRoot,
    tier,
    onResize: (width, height) => {
      viewport = { width, height };
      scroll.measure();
    },
    onFrame: renderStory,
  });
  const { scene, camera, renderer } = engine;

  const lighting = createLighting(scene, renderer, settings.shadows);
  const sky = createSky();
  const city = createCity(settings.cityBlocks, settings.shadows);
  const tower = createTower(settings.shadows);
  const interior = createInterior();
  const gymFloor = tower.floorGroups[TOWER.gymFloor - 1];
  const showcaseFloor = tower.floorGroups[TOWER.showcaseFloor - 1];
  if (!gymFloor || !showcaseFloor) throw new Error("Tower floors missing");
  showcaseFloor.add(interior.group);
  const amenities = createAmenities(gymFloor, tower.roof, settings.trees);
  scene.add(sky.group, city.group, tower.group, amenities.group);

  const labels = createLabels(labelLayer, { ...interior.anchors, ...amenities.anchors });
  const interaction = createInteraction(tower.floorGroups, tower.glassMeshes, tooltip);

  // Build-up counters ("28 floors", "112 residences") count with the same progress as the floors.
  const counters = Array.from(storyRoot.querySelectorAll<HTMLElement>("[data-count-to]")).map((element) => ({
    element,
    target: Number(element.dataset.countTo),
    finalText: element.textContent ?? "",
  }));
  function updateCounters(build: number): void {
    for (const counter of counters) {
      const text = String(Math.round(counter.target * build));
      if (counter.element.textContent !== text) counter.element.textContent = text;
    }
  }

  // Section heights can change after fonts or images load, not only on window resize.
  const storyResizeObserver = new ResizeObserver(() => scroll.measure());
  storyResizeObserver.observe(storyRoot);

  // Everything below is a pure function of the damped progress `p` (plus tiny idle motion).
  function renderStory(deltaSeconds: number, elapsedSeconds: number): void {
    const p = scroll.update(deltaSeconds);
    const at = scroll.toGlobal;

    const mood = lighting.applyMood(smooth(at("arrival", 0.5), at("garden", 1), p));
    sky.setColors(mood.zenith, mood.horizon, mood.sunGlow, mood.stars);
    city.setNight(mood.windowGlow);

    // Floors pull apart between Arrival and Build-up, then drop back in one by one.
    const spread = smooth(at("arrival", 1), at("build", 0), p);
    const build = scroll.local("build");
    // Floor 18 opens during "Inside a home" and closes again on the way to the pool.
    const inside = scroll.local("inside");
    const closing = smooth(at("inside", 1), at("pool", 0), p);
    const lift = smooth(0, 0.35, inside) * (1 - closing);
    const open = smooth(0.15, 0.5, inside) * (1 - closing);

    tower.setState(spread, build, lift, open, mood.windowGlow);
    updateCounters(build);
    interior.setState(open, mood.windowGlow);
    amenities.update(elapsedSeconds, mood.windowGlow);

    sampleCamera(scroll.keyframes, p, cameraPosition, cameraTarget);
    // Hover only where the whole tower is in view (hero, arrival, build-up, CTA).
    const hoverAllowed = p < at("build", 1) || p > at("cta", 0);
    const parallax = interaction.update(camera, deltaSeconds, hoverAllowed);
    // A slow idle drift keeps the hero alive even when nobody scrolls.
    cameraPosition.x += parallax.x + Math.sin(elapsedSeconds * 0.2) * 0.5;
    cameraPosition.y += parallax.y + Math.sin(elapsedSeconds * 0.13) * 0.25;
    camera.position.copy(cameraPosition);
    camera.lookAt(cameraTarget);

    // Room labels show while floor 18 is open; each amenity card while the camera is at that stop.
    const rooms = smooth(0.4, 0.55, inside) * (1 - smooth(0.9, 1, inside));
    const atStop = (scene: "pool" | "gym" | "garden") => {
      const local = scroll.local(scene);
      return smooth(0.08, 0.3, local) * (1 - smooth(0.8, 0.98, local));
    };
    labels.update(
      camera,
      { living: rooms, bedroom: rooms, kitchen: rooms, balcony: rooms, pool: atStop("pool"), gym: atStop("gym"), garden: atStop("garden") },
      viewport.width,
      viewport.height,
    );
  }

  function handleContextLost(event: Event): void {
    event.preventDefault();
    onContextLost();
  }
  renderer.domElement.addEventListener("webglcontextlost", handleContextLost);

  // Render one frame right away so the page only fades the canvas in once it has real content.
  engine.renderFrame(performance.now());
  onFirstFrame();

  return function dispose(): void {
    renderer.domElement.removeEventListener("webglcontextlost", handleContextLost);
    storyResizeObserver.disconnect();
    scroll.clearSceneVariables();
    for (const counter of counters) counter.element.textContent = counter.finalText;
    labels.dispose();
    interaction.dispose();
    amenities.dispose();
    interior.dispose();
    tower.dispose();
    city.dispose();
    sky.dispose();
    lighting.dispose();
    engine.dispose();
  };
}
