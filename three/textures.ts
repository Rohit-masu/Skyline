import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

// All textures are drawn on a <canvas> at runtime: zero bytes downloaded.

// Seeded PRNG so the lit windows look the same on every visit (and in posters).
export function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

function makeCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2D canvas unavailable");
  return { canvas, context };
}

// Grid of windows: black glass with a share of warm and cool lit rooms.
// Used as the emissive map of the city blocks and the tower glass.
export function createWindowTexture(seed: number, columns: number, rows: number, litShare: number, warmShare = 0.78) {
  const cell = 16;
  const { canvas, context } = makeCanvas(columns * cell, rows * cell);
  const random = createRandom(seed);
  context.fillStyle = "#000000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      if (random() > litShare) continue;
      const warm = random() < warmShare;
      const brightness = 0.45 + random() * 0.55;
      context.fillStyle = warm
        ? `rgba(255, ${Math.round(190 + random() * 30)}, ${Math.round(120 + random() * 40)}, ${brightness})`
        : `rgba(170, 205, 255, ${brightness * 0.7})`;
      context.fillRect(column * cell + 2, row * cell + 3, cell - 4, cell - 6);
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  return texture;
}

// Dark ground with a grid of faint sodium-lit roads around the site.
export function createGroundTexture() {
  const size = 1024;
  const { canvas, context } = makeCanvas(size, size);
  context.fillStyle = "#0b0f16";
  context.fillRect(0, 0, size, size);

  const roadEvery = 128;
  for (let offset = roadEvery / 2; offset < size; offset += roadEvery) {
    const glow = context.createLinearGradient(offset - 4, 0, offset + 4, 0);
    glow.addColorStop(0, "rgba(255, 170, 90, 0)");
    glow.addColorStop(0.5, "rgba(255, 180, 110, 0.22)");
    glow.addColorStop(1, "rgba(255, 170, 90, 0)");
    context.fillStyle = glow;
    context.fillRect(offset - 4, 0, 8, size);

    const glowHorizontal = context.createLinearGradient(0, offset - 4, 0, offset + 4);
    glowHorizontal.addColorStop(0, "rgba(255, 170, 90, 0)");
    glowHorizontal.addColorStop(0.5, "rgba(255, 180, 110, 0.22)");
    glowHorizontal.addColorStop(1, "rgba(255, 170, 90, 0)");
    context.fillStyle = glowHorizontal;
    context.fillRect(0, offset - 4, size, 8);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

// Soft radial shadow, used under the tower when real-time shadows are off (low tier).
export function createContactShadowTexture() {
  const size = 256;
  const { canvas, context } = makeCanvas(size, size);
  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0.75)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

// Soft light ripples for the pool floor: thin wavy lines, blurred, so the water shimmers
// instead of showing hard squares.
export function createCausticTexture(seed: number) {
  const size = 256;
  const { canvas, context } = makeCanvas(size, size);
  const random = createRandom(seed);
  context.fillStyle = "#000000";
  context.fillRect(0, 0, size, size);
  context.filter = "blur(1.5px)";
  context.lineWidth = 1.6;
  for (let line = 0; line < 70; line++) {
    context.strokeStyle = `rgba(190, 255, 245, ${0.25 + random() * 0.45})`;
    context.beginPath();
    let x = random() * size;
    let y = random() * size;
    context.moveTo(x, y);
    for (let step = 0; step < 4; step++) {
      const nextX = x + (random() - 0.5) * 60;
      const nextY = y + (random() - 0.5) * 60;
      context.quadraticCurveTo(x + (random() - 0.5) * 40, y + (random() - 0.5) * 40, nextX, nextY);
      x = nextX;
      y = nextY;
    }
    context.stroke();
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(1, 2.5);
  return texture;
}

// Small round glow sprite for street lights, the crown beacon and the stars.
export function createGlowTexture() {
  const size = 64;
  const { canvas, context } = makeCanvas(size, size);
  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.25, "rgba(255, 255, 255, 0.45)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
