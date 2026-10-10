import assert from "node:assert/strict";
import { createPreviewServer } from "./preview-static.mjs";

const server = await createPreviewServer();
await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(0, "127.0.0.1", resolve);
});
const base = `http://127.0.0.1:${server.address().port}`;
try {
  const home = await fetch(base);
  assert.equal(home.status, 200);
  assert.equal(home.headers.get("cache-control"), "no-store");
  assert.equal(home.headers.get("last-modified"), null);
  const html = await home.text();
  for (const path of ["/about/", "/venture/"]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    const source = await response.text();
    assert.match(source, /<time dateTime="2024-04">Founded April 2024<\/time>/);
    assert.match(source, /<dt>Legal status<\/dt><dd>Registered Sole Proprietorship<\/dd>/);
  }
  const product = await fetch(base + "/products/industrial-lora/");
  assert.equal(product.status, 200);
  const productSource = await product.text();
  assert.match(productSource, /Talu Tekstil/);
  assert.match(productSource, /TÜBİTAK 2209-B/);
  const assets = [
    ...new Set(
      [...html.matchAll(/(?:href|src)="(\/_next\/[^"]+)"/g)].map(
        (match) => match[1],
      ),
    ),
  ];
  assert.ok(assets.some((path) => path.endsWith(".css")));
  assert.ok(assets.some((path) => path.endsWith(".js")));
  for (const path of assets) {
    const asset = await fetch(base + path);
    assert.equal(asset.status, 200, path);
    assert.equal(asset.headers.get("cache-control"), "no-store", path);
    if (path.endsWith(".css"))
      assert.match(asset.headers.get("content-type"), /^text\/css/);
    if (path.endsWith(".js"))
      assert.match(asset.headers.get("content-type"), /^text\/javascript/);
    await asset.arrayBuffer();
  }
  const conditional = await fetch(base, {
    headers: {
      "If-Modified-Since": "Wed, 01 Jan 2099 00:00:00 GMT",
      "If-None-Match": "stale-build",
    },
  });
  assert.equal(
    conditional.status,
    200,
    "Never return stale HTML from conditional cache requests",
  );
  assert.equal(await conditional.text(), html);
  const head = await fetch(base, { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");
  assert.equal(head.headers.get("cache-control"), "no-store");
  const missing = await fetch(base + "/_next/static/css/does-not-exist.css");
  assert.equal(missing.status, 404);
  assert.equal(missing.headers.get("cache-control"), "no-store");
  assert.equal((await fetch(base + "/%ZZ")).status, 400);
  assert.equal((await fetch(base + "/%2e%2e%2fpackage.json")).status, 403);
  assert.equal((await fetch(base, { method: "POST" })).status, 405);
  console.log(
    JSON.stringify(
      {
        uncachedHTMLAndAssets: "passed",
        conditionalRequests: "passed",
        assetCount: assets.length,
        methodsAndPaths: "passed",
      },
      null,
      2,
    ),
  );
} finally {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}
