import {
  AdditiveBlending,
  BackSide,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  Mesh,
  Points,
  PointsMaterial,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
} from "three";
import { createGlowTexture, createRandom } from "./textures";

// A gradient sky dome: deep zenith colour, a warm band at the horizon, and a glow towards the sun.
const vertexShader = /* glsl */ `
  varying vec3 vDirection;
  void main() {
    vDirection = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 zenithColor;
  uniform vec3 horizonColor;
  uniform vec3 sunGlowColor;
  uniform vec3 sunDirection;
  varying vec3 vDirection;
  void main() {
    float height = clamp(vDirection.y, 0.0, 1.0);
    vec3 color = mix(horizonColor, zenithColor, pow(height, 0.45));
    float towardsSun = max(dot(normalize(vDirection), normalize(sunDirection)), 0.0);
    color += sunGlowColor * pow(towardsSun, 6.0) * (1.0 - height);
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const STAR_COUNT = 900;

export function createSky() {
  const group = new Group();

  const domeMaterial = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      zenithColor: { value: new Color() },
      horizonColor: { value: new Color() },
      sunGlowColor: { value: new Color() },
      // Same direction as the sun light in lighting.ts, dropped to just above the horizon.
      sunDirection: { value: new Vector3(0.6, 0.12, -0.8) },
    },
  });
  const domeGeometry = new SphereGeometry(400, 32, 16);
  const dome = new Mesh(domeGeometry, domeMaterial);
  dome.renderOrder = -1;
  group.add(dome);

  // Stars only on the upper half of the dome; they fade in as night falls.
  const random = createRandom(7);
  const positions: number[] = [];
  for (let index = 0; index < STAR_COUNT; index++) {
    const angle = random() * Math.PI * 2;
    const height = 0.12 + random() * 0.88;
    const ring = Math.sqrt(1 - height * height);
    positions.push(Math.cos(angle) * ring * 380, height * 380, Math.sin(angle) * ring * 380);
  }
  const starGeometry = new BufferGeometry();
  starGeometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  const starTexture = createGlowTexture();
  const starMaterial = new PointsMaterial({
    size: 2.4,
    map: starTexture,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    fog: false,
    opacity: 0,
  });
  group.add(new Points(starGeometry, starMaterial));

  function setColors(zenith: Color, horizon: Color, sunGlow: Color, starOpacity: number): void {
    domeMaterial.uniforms.zenithColor?.value.copy(zenith);
    domeMaterial.uniforms.horizonColor?.value.copy(horizon);
    domeMaterial.uniforms.sunGlowColor?.value.copy(sunGlow);
    starMaterial.opacity = starOpacity;
  }

  function dispose(): void {
    domeGeometry.dispose();
    domeMaterial.dispose();
    starGeometry.dispose();
    starMaterial.dispose();
    starTexture.dispose();
  }

  return { group, setColors, dispose };
}
