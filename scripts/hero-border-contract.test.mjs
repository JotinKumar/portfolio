import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function readSource(relativePath) {
  return readFile(new URL(relativePath, projectRoot), "utf8");
}

test("BorderRotate exposes configurable modes and reduced-motion styles", async () => {
  const component = await readSource("components/ui/border-rotate.tsx");
  const globals = await readSource("app/globals.css");

  assert.match(component, /export function BorderRotate/);
  assert.match(component, /type AnimationMode =/);
  assert.match(component, /gradient-border-auto/);
  assert.match(component, /gradient-border-hover/);
  assert.match(component, /gradient-border-stop-hover/);
  assert.match(globals, /@property --gradient-angle/);
  assert.match(globals, /@keyframes gradient-border-rotate/);
  assert.match(globals, /prefers-reduced-motion: reduce/);
});
