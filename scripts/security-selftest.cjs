const assert = require("node:assert/strict");
const { getSafeRedirectPath, isTrustedStateChangingRequest } = require("../lib/request-security.ts");
const { buildContentSecurityPolicy } = require("../next.config.ts");

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

  const devCsp = buildContentSecurityPolicy(true);
  assert.match(devCsp, /script-src[^;]*'unsafe-eval'/);
  assert.match(devCsp, /connect-src[^;]*ws:\/\/localhost:\*/);
  assert.doesNotMatch(devCsp, /upgrade-insecure-requests/);

  const prodCsp = buildContentSecurityPolicy(false);
  assert.doesNotMatch(prodCsp, /script-src[^;]*'unsafe-eval'/);
  assert.match(prodCsp, /upgrade-insecure-requests/);

  console.log("security self-test passed");
}

run();
