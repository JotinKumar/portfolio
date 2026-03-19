const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const source = fs.readFileSync(
  path.join(__dirname, "..", "components/sections/work-timeline.tsx"),
  "utf8"
);

test("work timeline uses a split current-vs-history layout without horizontal scrolling", () => {
  assert.match(source, /const currentExperience =/);
  assert.match(source, /const previousExperiences =/);
  assert.match(source, /const parseAchievements =/);
  assert.doesNotMatch(source, /overflow-x-auto/);
  assert.doesNotMatch(source, /flex-shrink-0 w-80/);
  assert.match(source, /lg:grid-cols-\[minmax\(0,1\.15fr\)_minmax\(18rem,0\.85fr\)\]/);
});

test("work timeline renders an editorial header with a generated year rail", () => {
  assert.match(source, /const currentYear = new Date\(\)\.getFullYear\(\)/);
  assert.match(source, /const startYear =/);
  assert.match(source, /const timelineYears = Array\.from/);
  assert.match(source, /const milestoneYears = new Set/);
  assert.match(source, /const cadenceYears = new Set/);
  assert.match(source, /const visibleYears =/);
  assert.match(source, /Current role/);
  assert.match(source, /Primary experience/);
  assert.match(source, /Selected impact/);
  assert.match(source, /View chronology/);
  assert.doesNotMatch(source, /---\s*\{title\}\s*---/);
  assert.match(source, /const isMilestone = milestoneYears\.has\(year\)/);
  assert.match(source, /const isCadenceYear = cadenceYears\.has\(year\)/);
  assert.match(source, /bg-primary\/10 text-foreground/);
  assert.match(source, /year === "\.\.\."|year === "\\.\\.\\."/);
  assert.match(source, /visibleYears\.map/);
});
