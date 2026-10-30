import {
  Color,
  DirectionalLight,
  Fog,
  HemisphereLight,
  MathUtils,
  PCFShadowMap,
  PMREMGenerator,
  type Scene,
  type WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Two moods as plain data. The scene blends between them with `night` (0 = blue hour, 1 = night).
// Blue hour, not orange sunset: the same deep-blue-with-warm-horizon look as the brand imagery.
export const MOOD_PRESETS = {
  dusk: {
    zenith: "#081a3c",
    horizon: "#34466e",
    sunGlow: "#9c6a55",
    fog: "#1b2742",
    sunColor: "#ffbf90",
    sunIntensity: 1.6,
    hemiIntensity: 0.6,
    envIntensity: 0.7,
    windowGlow: 1.1,
    stars: 0.12,
  },
  night: {
    zenith: "#02060f",
    horizon: "#122039",
    sunGlow: "#24365c",
    fog: "#080e1b",
    sunColor: "#8fa8d8",
    sunIntensity: 0.5,
    hemiIntensity: 0.3,
    envIntensity: 0.4,
    windowGlow: 1.9,
    stars: 0.9,
  },
} as const;

export interface Mood {
  zenith: Color;
  horizon: Color;
  sunGlow: Color;
  windowGlow: number;
  envIntensity: number;
  stars: number;
}

export function createLighting(scene: Scene, renderer: WebGLRenderer, shadows: boolean) {
  // Reflections come from a generated studio room: no HDR file to download.
  const pmrem = new PMREMGenerator(renderer);
  const roomEnvironment = new RoomEnvironment();
  const environment = pmrem.fromScene(roomEnvironment, 0.04).texture;
  roomEnvironment.dispose();
  pmrem.dispose();
  scene.environment = environment;

  const fog = new Fog(MOOD_PRESETS.dusk.fog, 70, 260);
  scene.fog = fog;

  const hemisphere = new HemisphereLight("#9fb4d9", "#20160f", MOOD_PRESETS.dusk.hemiIntensity);
  scene.add(hemisphere);

  const sun = new DirectionalLight(MOOD_PRESETS.dusk.sunColor, MOOD_PRESETS.dusk.sunIntensity);
  sun.position.set(45, 40, -55);
  scene.add(sun);

  if (shadows) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap;
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -30;
    sun.shadow.camera.right = 30;
    sun.shadow.camera.top = 40;
    sun.shadow.camera.bottom = -10;
    sun.shadow.camera.far = 160;
    sun.shadow.bias = -0.0006;
  }

  const dusk = MOOD_PRESETS.dusk;
  const night = MOOD_PRESETS.night;
  const colors = {
    duskZenith: new Color(dusk.zenith),
    nightZenith: new Color(night.zenith),
    duskHorizon: new Color(dusk.horizon),
    nightHorizon: new Color(night.horizon),
    duskGlow: new Color(dusk.sunGlow),
    nightGlow: new Color(night.sunGlow),
    duskFog: new Color(dusk.fog),
    nightFog: new Color(night.fog),
    duskSun: new Color(dusk.sunColor),
    nightSun: new Color(night.sunColor),
  };
  const mood: Mood = {
    zenith: new Color(),
    horizon: new Color(),
    sunGlow: new Color(),
    windowGlow: 0,
    envIntensity: 1,
    stars: 0,
  };

  // Pure function of `night`: same input, same lighting, in both scroll directions.
  function applyMood(nightAmount: number): Mood {
    const t = MathUtils.clamp(nightAmount, 0, 1);
    mood.zenith.lerpColors(colors.duskZenith, colors.nightZenith, t);
    mood.horizon.lerpColors(colors.duskHorizon, colors.nightHorizon, t);
    mood.sunGlow.lerpColors(colors.duskGlow, colors.nightGlow, t);
    fog.color.lerpColors(colors.duskFog, colors.nightFog, t);
    sun.color.lerpColors(colors.duskSun, colors.nightSun, t);
    sun.intensity = MathUtils.lerp(dusk.sunIntensity, night.sunIntensity, t);
    hemisphere.intensity = MathUtils.lerp(dusk.hemiIntensity, night.hemiIntensity, t);
    mood.windowGlow = MathUtils.lerp(dusk.windowGlow, night.windowGlow, t);
    mood.envIntensity = MathUtils.lerp(dusk.envIntensity, night.envIntensity, t);
    mood.stars = MathUtils.lerp(dusk.stars, night.stars, t);
    scene.environmentIntensity = mood.envIntensity;
    return mood;
  }

  function dispose(): void {
    environment.dispose();
    sun.shadow.map?.dispose();
    scene.remove(hemisphere, sun);
  }

  return { applyMood, dispose };
}
