const assert = require("node:assert/strict");
const { getSafeRedirectPath, isTrustedStateChangingRequest } = require("../lib/request-security.ts");

function run() {
  assert.equal(getSafeRedirectPath("/admin/dashboard"), "/admin/dashboard");
  assert.equal(getSafeRedirectPath("https://evil.example"), "/");
  assert.equal(getSafeRedirectPath("//evil.example"), "/");
  assert.equal(getSafeRedirectPath("/\\evil"), "/");
  assert.equal(getSafeRedirectPath(undefined), "/");

  const sameOriginReq = new Request("https://example.com/api/contact", {
    method: "POST",
    headers: {
      origin: "https://example.com",
      "sec-fetch-site": "same-origin",
    },
  });
  assert.equal(isTrustedStateChangingRequest(sameOriginReq), true);

  const crossSiteReq = new Request("https://example.com/api/contact", {
    method: "POST",
    headers: {
      origin: "https://attacker.example",
      "sec-fetch-site": "cross-site",
    },
  });
  assert.equal(isTrustedStateChangingRequest(crossSiteReq), false);

  console.log("security self-test passed");
}

run();
