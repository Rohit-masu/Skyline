// Converts the PNG stills from scripts/capture-posters.mjs into WebP files in public/posters.
// next/image then serves AVIF/WebP at the right width for each screen.
//   npm run posters
import { mkdirSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import sharp from "sharp";

const INPUT_DIR = ".posters-raw";
const OUTPUT_DIR = "public/posters";
const MAX_WIDTH = 1920;
const QUALITY = 80;

// Wrapped in a function: tsx runs this file as CommonJS, where top-level await is not allowed.
async function main(): Promise<void> {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  for (const file of readdirSync(INPUT_DIR).filter((name) => name.endsWith(".png"))) {
    const output = join(OUTPUT_DIR, `${basename(file, ".png")}.webp`);
    const info = await sharp(join(INPUT_DIR, file))
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(output);
    console.log(`${output}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
