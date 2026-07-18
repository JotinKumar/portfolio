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

test("HeroSplit wraps the glass panel but excludes the scroll cue", async () => {
  const hero = await readSource("components/home/HeroSplit.tsx");
  const borderStart = hero.indexOf("<BorderRotate");
  const glassStart = hero.indexOf("<Glassmorphism", borderStart);
  const borderEnd = hero.indexOf("</BorderRotate>", glassStart);
  const scrollCue = hero.indexOf("<ScrollCue", borderEnd);

  assert.ok(borderStart >= 0, "BorderRotate wrapper is missing");
  assert.ok(glassStart > borderStart, "Glassmorphism must be inside BorderRotate");
  assert.ok(borderEnd > glassStart, "BorderRotate must close after Glassmorphism");
  assert.ok(scrollCue > borderEnd, "ScrollCue must remain outside BorderRotate");
  assert.match(hero, /animationMode="auto-rotate"/);
  assert.match(hero, /animationSpeed=\{8\}/);
});
