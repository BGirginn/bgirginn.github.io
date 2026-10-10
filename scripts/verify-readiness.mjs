import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { createRequire } from "node:module";
import Module from "node:module";
import ts from "typescript";
import { chromium } from "playwright";
import { createPreviewServer } from "./preview-static.mjs";

// Load the actual TypeScript schemas without adding a test runner dependency.
async function loadSource(path) {
  const filename = resolve(path);
  const source = await readFile(filename, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
      resolveJsonModule: true,
    },
  }).outputText;
  const module = new Module(filename);
  module.filename = filename;
  module.paths = createRequire(filename).resolve.paths("zod");
  module._compile(compiled, filename);
  return module.exports;
}
const { business, businessSchema, verifiedValue, publicEmail } =
  await loadSource("src/content/business.ts");
const { contactSchema } = await loadSource("src/lib/contact-schema.ts");
assert.equal(
  verifiedValue({
    value: "Unverified company",
    status: "needs_verification",
    evidence: "",
  }),
  undefined,
);
assert.equal(
  verifiedValue({ value: "Planned customer", status: "planned", evidence: "" }),
  undefined,
);
for (const status of ["prototype", "integrated"]) {
  const candidate = structuredClone(business);
  candidate.claude.status = status;
  assert.equal(
    businessSchema.safeParse(candidate).success,
    false,
    "Claude claims require implementation evidence",
  );
}
const unconfirmedCompletion = structuredClone(business);
unconfirmedCompletion.products.find(
  (product) => product.id === "industrial-lora",
).completionEvidence.status = "planned";
assert.equal(businessSchema.safeParse(unconfirmedCompletion).success, false);
const invalidFeatured = structuredClone(business);
invalidFeatured.featuredProductIds.push("missing-product");
assert.equal(businessSchema.safeParse(invalidFeatured).success, false);
const duplicateFeatured = structuredClone(business);
duplicateFeatured.featuredProductIds.push(
  duplicateFeatured.featuredProductIds[0],
);
assert.equal(businessSchema.safeParse(duplicateFeatured).success, false);
const invalidPrimary = structuredClone(business);
invalidPrimary.primaryProductId = "missing-product";
assert.equal(businessSchema.safeParse(invalidPrimary).success, false);
const duplicateServices = structuredClone(business);
duplicateServices.services[1].id = duplicateServices.services[0].id;
assert.equal(businessSchema.safeParse(duplicateServices).success, false);
assert.equal(publicEmail, "contact@bgirgin.dev");
const invalidDomainContact = structuredClone(business);
invalidDomainContact.domainContactEmail.value = "invalid";
assert.equal(businessSchema.safeParse(invalidDomainContact).success, false);
const invalidContact = structuredClone(business);
invalidContact.publicContactEmail.value = "invalid";
assert.equal(businessSchema.safeParse(invalidContact).success, false);
const invalidLink = structuredClone(business);
invalidLink.products[0].repository = "javascript:alert(1)";
assert.equal(businessSchema.safeParse(invalidLink).success, false);
assert.equal(
  contactSchema.safeParse({ name: "  ", email: "wrong", message: "short" })
    .success,
  false,
);
assert.equal(
  contactSchema.safeParse({
    name: "Bora",
    email: "test@example.com",
    message: "a".repeat(2001),
  }).success,
  false,
);
assert.equal(
  contactSchema.safeParse({
    name: " Bora ",
    email: " test@example.com ",
    message: " A meaningful inquiry. ",
  }).success,
  true,
);

const server = await createPreviewServer();
await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(0, "127.0.0.1", resolve);
});
const base = `http://127.0.0.1:${server.address().port}`;
const routes = [
  "/",
  "/venture/",
  "/products/",
  "/products/industrial-lora/",
  "/projects/",
  "/about/",
  "/contact/",
  "/services/",
  "/resources/",
  "/privacy/",
];
const artifacts = "output/playwright/readiness";
await mkdir(artifacts, { recursive: true });
let browser;
try {
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
  });
  const page = await browser.newPage({ reducedMotion: "reduce" });
  const errors = [];
  const externalLinks = new Set();
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  const axePath = process.env.ACCESSIBILITY_AXE_PATH;
  const accessibility = [];
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of routes) {
      await page.goto(base + path);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator("h1").count(), 1, path);
      assert.equal(
        await page.locator(".brand-copy strong").textContent(),
        business.displayName,
      );
      if (path === "/") {
        assert.equal(
          await page.locator(".company-product-card").count(),
          business.products.length,
        );
        assert.equal(
          await page
            .getByRole("link", { name: "Explore Quadropod", exact: true })
            .getAttribute("href"),
          "/products/#quadropod",
        );
      }
      if (path === "/") {
        assert.equal(
          await page.locator(".company-primary-product").count(),
          business.featuredProductIds.length,
        );
        const industrialCard = page.locator('[data-product="industrial-lora"]');
        assert.equal(
          await industrialCard
            .getByText("Completed", { exact: true })
            .isVisible(),
          true,
        );
        assert.equal(
          await industrialCard
            .getByRole("link", { name: "Product details", exact: false })
            .getAttribute("href"),
          "/products/industrial-lora/",
        );
      }
      if (path === "/products/industrial-lora/") {
        assert.equal(
          await page
            .getByText("Completed company project", { exact: true })
            .isVisible(),
          true,
        );
        assert.equal(await page.locator(".product-architecture li").count(), 3);
        assert.equal(await page.locator(".industrial-workflow li").count(), 4);
        const content = await page.locator("main").textContent();
        assert.equal(
          /TUBITAK|TÜBİTAK|2209|Sakarya|Talu|%/i.test(content),
          false,
        );
      }
      if (path === "/products/") {
        assert.equal(await page.locator(".platform-stage-list li").count(), 4);
        assert.equal(
          await page.locator(".product-entry").first().getAttribute("id"),
          business.primaryProductId,
        );
        const drawing = page.locator(".product-drawing img");
        assert.equal(
          await drawing.evaluate(
            (image) => image.complete && image.naturalWidth > 0,
          ),
          true,
        );
      }
      if (path === "/services/") {
        assert.equal(
          await page.locator(".service-entry").count(),
          business.services.length,
        );
        assert.equal(
          await page.locator(".engagement-process li").count(),
          business.engagementSteps.length,
        );
      }
      if (path === "/about/") {
        assert.equal(
          await page.getByText("Registered address", { exact: true }).count(),
          0,
        );
        assert.equal(
          await page.getByText("Registration", { exact: true }).count(),
          0,
        );
      }
      assert.equal(await page.locator("main").count(), 1, path);
      assert.equal(
        await page.locator('link[rel="canonical"]').getAttribute("href"),
        new URL(path, business.websiteUrl).href,
      );
      assert.equal(
        await page.locator('meta[property="og:url"]').getAttribute("content"),
        new URL(path, business.websiteUrl).href,
      );
      const identity = JSON.parse(
        await page.locator('script[type="application/ld+json"]').textContent(),
      );
      assert.equal(identity["@type"], "Person");
      assert.equal(identity.name, business.founder.name);
      assert.equal(identity.email, publicEmail);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `${path} at ${width}px`,
      );
      assert.equal(
        await page.locator('a[href="https://www.linkedin.com/"]').count(),
        0,
      );
      // Check names, labels and references, including form errors after submission.
      const unnamed = await page
        .locator("a, button, input:not([type=hidden]), textarea")
        .evaluateAll((elements) =>
          elements
            .filter((element) => {
              if (
                element.getAttribute("aria-label") ||
                element.getAttribute("aria-labelledby")
              )
                return false;
              if (element.matches("input, textarea"))
                return !element.labels?.length;
              return !element.textContent.trim();
            })
            .map((element) => element.outerHTML),
        );
      assert.deepEqual(unnamed, [], `${path}: controls need accessible names`);
      if (width === 390 || width === 1440)
        await page.screenshot({
          path: `${artifacts}/${path === "/" ? "home" : path.split("/").filter(Boolean).join("-")}-${width}.png`,
          fullPage: path !== "/",
        });
      if (axePath && [390, 1440].includes(width)) {
        await page.addScriptTag({ path: axePath });
        const result = await page.evaluate(async () =>
          window.axe.run(document, {
            runOnly: {
              type: "tag",
              values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
            },
          }),
        );
        await import("node:fs/promises").then(({ writeFile }) =>
          writeFile(
            `${artifacts}/axe-${path === "/" ? "home" : path.split("/").filter(Boolean).join("-")}-${width}.json`,
            JSON.stringify(result, null, 2),
          ),
        );
        accessibility.push({
          path,
          width,
          violations: result.violations.map((issue) => ({
            id: issue.id,
            nodes: issue.nodes.map((node) => node.target),
          })),
        });
      }
      if (width !== 1440) continue;
      for (const href of await page
        .locator("a[href]")
        .evaluateAll((links) =>
          links.map((link) => link.getAttribute("href")),
        )) {
        const url = new URL(href, base + path);
        if (url.protocol === "mailto:") {
          assert.equal(url.pathname, publicEmail);
          continue;
        }
        if (url.origin !== base) {
          externalLinks.add(url.href);
          continue;
        }
        const response = await fetch(url);
        assert.equal(response.status, 200, url.href);
        if (url.hash)
          assert.ok(
            (await response.text()).includes(`id="${url.hash.slice(1)}"`),
            url.href,
          );
      }
    }
  }
  await page.goto(base + "/resources/");
  const firstQuestion = page.locator(".company-faq summary").first();
  assert.equal(
    await page.locator(".company-faq details").count(),
    business.faq.length,
  );
  await firstQuestion.focus();
  await page.keyboard.press("Enter");
  assert.equal(
    await page.locator(".company-faq details").first().getAttribute("open"),
    "",
  );
  await page.keyboard.press("Enter");
  assert.equal(
    await page.locator(".company-faq details").first().getAttribute("open"),
    null,
  );
  await page.goto(base + "/services/");
  const service = business.services[0];
  await page
    .locator(`#${service.id}`)
    .getByRole("link", {
      name: `Discuss ${service.name.toLowerCase()} ↗`,
      exact: true,
    })
    .click();
  await page.waitForURL(base + `/contact/?service=${service.id}`);
  await page
    .getByText(`Project area: ${service.name}`, { exact: true })
    .waitFor();
  assert.equal(
    await page.getByLabel("Message", { exact: true }).inputValue(),
    `I'd like to discuss ${service.name.toLowerCase()}.`,
  );
  await page
    .getByLabel("Message", { exact: true })
    .fill("Keep this engineering enquiry while changing the navigation.");
  await page
    .getByRole("navigation", { name: "Main navigation", exact: true })
    .getByRole("link", { name: "Contact", exact: true })
    .click();
  await page.waitForURL(base + "/contact/");
  await page.waitForFunction(
    () => !document.querySelector(".contact-service-context"),
  );
  assert.equal(
    await page.getByLabel("Message", { exact: true }).inputValue(),
    "Keep this engineering enquiry while changing the navigation.",
  );
  await page.goto(base + "/contact/?service=unknown");
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator(".contact-service-context").count(), 0);
  assert.equal(
    await page.getByLabel("Message", { exact: true }).inputValue(),
    "",
  );
  for (const requested of ["quadropod", "robot", "pcb", "unknown"]) {
    await page.goto(base + `/?hardware=${requested}#signature`);
    await page.waitForFunction(
      (expected) =>
        document
          .querySelector(".hardware-section")
          ?.getAttribute("data-subject") === expected,
      requested === "unknown" ? "quadropod" : requested,
    );
  }
  await page.goto(base + "/contact/");
  await page.getByRole("button", { name: "Prepare Email" }).click();
  assert.equal(await page.locator('[aria-invalid="true"]').count(), 3);
  for (const field of await page.locator('[aria-invalid="true"]').all()) {
    const id = await field.getAttribute("aria-describedby");
    assert.ok(await page.locator(`[id="${id}"]`).textContent());
  }
  await page.getByLabel("Name", { exact: true }).fill("Test Developer");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page
    .getByLabel("Message", { exact: true })
    .fill("Engineering inquiry for the local validation.");
  // Browser mailto handoff is observed; no message is sent by this test.
  await page.getByRole("button", { name: "Prepare Email" }).click();
  await page.getByText("Email draft requested.", { exact: false }).waitFor();
  assert.equal(
    await page.getByLabel("Message", { exact: true }).inputValue(),
    "Engineering inquiry for the local validation.",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + "/venture/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("navigation", { name: "Mobile navigation" });
  assert.equal(
    await page.evaluate(() => document.body.style.overflow),
    "hidden",
  );
  await page.keyboard.press("Escape");
  assert.equal(await menu.count(), 0);
  await page.getByRole("button", { name: "Open menu" }).click();
  await menu.getByRole("link", { name: "Products" }).click();
  await page.waitForURL(base + "/products/");
  await page.waitForFunction(
    () => document.activeElement === document.querySelector("main h1"),
  );
  assert.equal(await page.evaluate(() => document.body.style.overflow), "");
  assert.equal(await menu.count(), 0);
  const sitemap = await (await fetch(base + "/sitemap.xml")).text();
  for (const path of routes)
    assert.ok(sitemap.includes(new URL(path, business.websiteUrl).href));
  assert.ok(
    (await (await fetch(base + "/robots.txt")).text()).includes(
      `${business.websiteUrl}/sitemap.xml`,
    ),
  );
  assert.deepEqual(errors, []);
  await readFile("public/og-image.png");
  await readFile(`${artifacts}/venture-390.png`);
  assert.deepEqual(
    accessibility.filter((result) => result.violations.length),
    [],
    "WCAG accessibility violations",
  );
  console.log(
    JSON.stringify(
      {
        configurationAndFormRegression: "passed",
        routesAndMetadata: `${routes.length} passed`,
        localLinksAndAnchors: "passed",
        responsiveWidths: [320, 390, 768, 1440],
        accessibleControlsAndErrors: "passed",
        emailDraftAndRetainedInput: "passed",
        mobileNavigation: "passed",
        browserErrors: errors,
        accessibility: axePath
          ? accessibility
          : "axe scan skipped: ACCESSIBILITY_AXE_PATH not provided",
        externalLinks: [...externalLinks],
      },
      null,
      2,
    ),
  );
} finally {
  await browser?.close();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}
