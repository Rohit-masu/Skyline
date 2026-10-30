// Dev-only: renders the live 3D scene at the hero and at each story scene and saves PNG stills.
// These become the hero poster (LCP image) and the static fallback stills, so the poster and the
// live 3D are the same picture. Never shipped; run against a local production server:
//
//   npm run build && npm run start          (in one terminal)
//   npm run posters:capture                 (then npm run posters to convert to WebP)
//
// Drives Chrome through the DevTools protocol (no extra dependency).
// Set CHROME_PATH if Chrome is not in the default Windows location.
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const URL_TO_CAPTURE = process.argv[2] ?? "http://localhost:3000";
const OUTPUT_DIR = ".posters-raw";
const WIDTH = 1920;
const HEIGHT = 1080;
const CHROME = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9333;

// [file name, scene id, local progress inside that scene]
const SHOTS = [
  ["hero", "hero", 0],
  ["arrival", "arrival", 0.5],
  ["build", "build", 0.5],
  ["inside", "inside", 0.6],
  ["pool", "pool", 0.5],
  ["gym", "gym", 0.5],
  ["garden", "garden", 0.5],
  ["cta", "cta", 0.6],
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

mkdirSync(OUTPUT_DIR, { recursive: true });
const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${join(tmpdir(), "skyline-capture")}`,
  `--window-size=${WIDTH},${HEIGHT}`,
  "about:blank",
]);

let targets;
for (let attempt = 0; attempt < 120 && !targets; attempt++) {
  try {
    targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
  } catch {
    await sleep(250);
  }
}
const socket = new WebSocket(targets.find((target) => target.type === "page").webSocketDebuggerUrl);
await new Promise((resolve) => socket.addEventListener("open", resolve));

let nextId = 0;
const pending = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  pending.get(message.id)?.(message);
  pending.delete(message.id);
});
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const id = ++nextId;
    pending.set(id, resolve);
    socket.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expression) =>
  (await send("Runtime.evaluate", { expression, returnByValue: true })).result?.result?.value;

await send("Emulation.setDeviceMetricsOverride", { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: URL_TO_CAPTURE });

// Wait until the 3D scene has rendered its first frame.
for (let attempt = 0; attempt < 120; attempt++) {
  if ((await evaluate("document.documentElement.dataset.sceneMode")) === "3d") break;
  await sleep(500);
}

// Hide every page element except the canvas (also the shades over it): the stills must be clean.
await evaluate(`(() => {
  const style = document.createElement("style");
  style.textContent = "body * { visibility: hidden !important } canvas { visibility: visible !important }";
  document.head.appendChild(style);
})()`);

for (const [name, scene, local] of SHOTS) {
  await evaluate(`(() => {
    const section = document.querySelector('[data-scene="${scene}"]');
    const top = section.getBoundingClientRect().top + scrollY;
    const span = Math.max(0, section.offsetHeight - innerHeight);
    window.scrollTo({ top: top + span * ${local}, behavior: "instant" });
  })()`);
  // Wait for the damped progress to arrive (software rendering can be slow), then a little longer.
  for (let attempt = 0; attempt < 120; attempt++) {
    await sleep(500);
    const value = Number(await evaluate(`document.querySelector('[data-scene="${scene}"]').style.getPropertyValue('--scene-p') || 1`));
    if (scene === "hero" || Math.abs(value - local) < 0.005) break;
  }
  await sleep(2500);
  const { result } = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(join(OUTPUT_DIR, `${name}.png`), Buffer.from(result.data, "base64"));
  console.log(`captured ${name}`);
}

socket.close();
chrome.kill();
process.exit(0);
