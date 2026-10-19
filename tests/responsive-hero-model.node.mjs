import assert from "node:assert/strict";
import test from "node:test";

import {
  getHeroVariant,
  getProfessionalActions,
} from "../components/home/responsive-hero-model.ts";

test("maps viewport widths to one responsive hero variant", () => {
  assert.equal(getHeroVariant(390), "mobile");
  assert.equal(getHeroVariant(767), "mobile");
  assert.equal(getHeroVariant(768), "tablet");
  assert.equal(getHeroVariant(1023), "tablet");
  assert.equal(getHeroVariant(1024), "desktop");
  assert.equal(getHeroVariant(1440), "desktop");
});

test("includes the resume action when a configured URL is available", () => {
  assert.deepEqual(
    getProfessionalActions({
      resumeUrl: "/resume.pdf",
      downloadResumeLabel: "Download Resume",
      getInTouchLabel: "Get in Touch",
    }),
    [
      {
        href: "/resume.pdf",
        label: "Download Resume",
        primary: true,
      },
      {
        href: "/contact",
        label: "Get in Touch",
      },
    ]
  );
});

test("omits the resume action when its URL is missing or blank", () => {
  for (const resumeUrl of [undefined, null, "", "   "]) {
    const actions = getProfessionalActions({
      resumeUrl,
      downloadResumeLabel: "Download Resume",
      getInTouchLabel: "Get in Touch",
    });

    assert.deepEqual(actions, [
      {
        href: "/contact",
        label: "Get in Touch",
        primary: true,
      },
    ]);
    assert.equal(actions.some((action) => action.href === "#"), false);
  }
});
