import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseURL = process.env.HARDWARE_TEST_URL ?? "http://127.0.0.1:4173";
assert.ok(
  ["localhost", "127.0.0.1"].includes(new URL(baseURL).hostname),
  "Use a local static build",
);
const artifacts = "output/playwright/theme";
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
});
const results = {};

async function goToSection(page, id) {
  await page.evaluate((id) => {
    document
      .getElementById(id)
      .scrollIntoView({ behavior: "instant", block: "start" });
  }, id);
  await page.waitForTimeout(800);
}

async function assertLayout(page) {
  const layout = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth,
    pendingInView: Array.from(
      document.querySelectorAll(".reveal-pending"),
    ).filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.top < innerHeight - 80 && rect.bottom > 82;
    }).length,
  }));
  assert.equal(
    layout.overflow,
    false,
    "The site must fit the viewport horizontally",
  );
  assert.equal(
    layout.pendingInView,
    0,
    "Visible content must finish revealing",
  );
  const clippedHeadings = await page
    .locator(".hero-title, .capability-domain h3, .project-summary h3")
    .evaluateAll((headings) =>
      headings
        .filter((heading) => heading.scrollWidth > heading.clientWidth + 1)
        .map((heading) => heading.textContent),
    );
  assert.deepEqual(
    clippedHeadings,
    [],
    `Project and capability headings must fit their columns at ${page.viewportSize()?.width}px`,
  );
}

try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto(baseURL);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator("h1").count(), 1);
  assert.equal(await page.locator(".desktop-nav").isVisible(), true);
  assert.equal(
    await page.locator(".hero-console-heading").count(),
    0,
    "The original text-only introduction must not gain a console card",
  );
  const theme = await page.evaluate(() => {
    const tokens = getComputedStyle(document.documentElement);
    return {
      background: tokens.getPropertyValue("--color-bg").trim(),
      cyan: tokens.getPropertyValue("--color-cyan").trim(),
      accent: tokens.getPropertyValue("--color-gold").trim(),
      unboxedSections: Array.from(
        document.querySelectorAll(
          ".hero-text-layout, .project-record, .process-board, .capability-matrix, .system-drawing, .contact-console",
        ),
      ).every(
        (element) => getComputedStyle(element).backgroundImage === "none",
      ),
    };
  });
  assert.deepEqual(
    theme,
    {
      background: "#080c11",
      cyan: "#86c9c6",
      accent: "#c9a96e",
      unboxedSections: true,
    },
    "Preserve the original dark/cyan/amber theme and open layouts",
  );
  results.originalTheme = "passed";
  const typeface = await page
    .locator("h1")
    .evaluate((element) => getComputedStyle(element).fontFamily);
  assert.match(
    typeface,
    /displayFont/,
    "Headings must use the self-hosted display font",
  );
  for (const id of [
    "hero",
    "work",
    "process",
    "capabilities",
    "about",
    "contact",
  ]) {
    await goToSection(page, id);
    await assertLayout(page);
    await page
      .locator(`#${id}`)
      .screenshot({ path: `${artifacts}/${id}-desktop.png` });
  }
  assert.equal(await page.locator(".project-record").count(), 3);
  assert.equal(await page.locator(".capability-domain").count(), 5);
  assert.equal(await page.locator(".process-steps li").count(), 8);
  await page.getByRole("button", { name: "Prepare Email" }).click();
  const invalid = page.locator(".contact-input[aria-invalid='true']");
  await invalid.first().waitFor();
  assert.equal(await invalid.count(), 3);
  for (const field of await invalid.all()) {
    const errorId = await field.getAttribute("aria-describedby");
    assert.ok(errorId);
    assert.ok(
      (await page.locator(`[id='${errorId}']`).textContent()).length > 0,
    );
  }
  assert.equal(
    new URL(page.url()).protocol,
    "http:",
    "Invalid submission must not open email",
  );
  results.desktopAndForm = "passed";

  // A normal end-of-page view must show the complete contact form above the
  // footer and below the fixed header, including on short laptop screens.
  const contactViewports = [
    { width: 1024, height: 768 },
    { width: 1280, height: 720 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1000 },
  ];
  await page.reload();
  for (const viewport of contactViewports) {
    await page.setViewportSize(viewport);
    await page.evaluate(() =>
      scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "instant",
      }),
    );
    await page.waitForTimeout(800);
    const fit = await page.evaluate(() => {
      const box = (selector) => {
        const rect = document.querySelector(selector).getBoundingClientRect();
        return { top: rect.top, bottom: rect.bottom, height: rect.height };
      };
      return {
        header: box(".site-header"),
        form: box(".contact-console"),
        heading: box("#contact h2"),
        footer: box(".site-footer"),
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    assert.ok(
      fit.form.top >= fit.header.bottom + 8,
      `Contact form must clear the header at ${viewport.width}x${viewport.height}`,
    );
    assert.ok(
      fit.heading.top >= fit.header.bottom + 8,
      "Contact heading must clear the header",
    );
    assert.ok(
      fit.form.bottom <= fit.footer.top - 8,
      "Contact form must clear the footer",
    );
    assert.ok(fit.footer.height <= 82, "Desktop footer must remain compact");
    assert.equal(fit.overflow, false);
    await page.screenshot({
      path: `${artifacts}/contact-fit-${viewport.width}-${viewport.height}.png`,
    });
  }
  results.contactViewportFit =
    "passed: 1024x768, 1280x720, 1440x900, 1920x1000";
  await page.setViewportSize({ width: 1280, height: 600 });
  await page.evaluate(() =>
    scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    }),
  );
  for (const control of await page
    .locator(".contact-input, .contact-console button[type=submit]")
    .all()) {
    await control.evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
    const accessible = await control.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const header = document
        .querySelector(".site-header")
        .getBoundingClientRect();
      return rect.top >= header.bottom + 8 && rect.bottom <= innerHeight;
    });
    assert.ok(
      accessible,
      "Every form control must remain reachable on short screens",
    );
  }
  const normalHeight = await page
    .locator("#contact")
    .evaluate((element) => element.offsetHeight);
  await page.locator("textarea.contact-input").evaluate((element) => {
    element.style.height = "480px";
  });
  assert.ok(
    (await page
      .locator("#contact")
      .evaluate((element) => element.offsetHeight)) >
      normalHeight + 250,
    "An enlarged textarea must grow the section rather than clip its content",
  );
  await page.getByRole("button", { name: "Prepare Email" }).click();
  assert.equal(
    await page.locator(".contact-input[aria-invalid='true']").count(),
    3,
  );
  await page
    .getByRole("button", { name: "Prepare Email" })
    .evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
  assert.ok(
    await page.getByRole("button", { name: "Prepare Email" }).isVisible(),
  );
  await page.reload();
  results.contactNaturalGrowth =
    "passed: short viewport, resized textarea and form errors";

  await page.setViewportSize({ width: 1600, height: 1000 });
  await goToSection(page, "capabilities");
  assert.equal(
    await page.locator(".rail-link[aria-current]").getAttribute("href"),
    "#capabilities",
  );
  await page.getByRole("link", { name: "Go to About", exact: true }).click();
  await page.waitForTimeout(1500);
  assert.equal(
    await page.locator(".rail-link[aria-current]").getAttribute("href"),
    "#about",
  );
  results.sectionNavigation = "passed";

  for (const width of [320, 360, 375, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    for (const id of [
      "hero",
      "work",
      "process",
      "capabilities",
      "about",
      "contact",
    ]) {
      await goToSection(page, id);
      await assertLayout(page);
      if (width === 390)
        await page
          .locator(`#${id}`)
          .screenshot({ path: `${artifacts}/${id}-mobile.png` });
    }
  }
  results.responsiveLayouts =
    "passed: 320, 360, 375, 390, 768, 1024, 1440, 1600";

  await page.setViewportSize({ width: 390, height: 844 });
  await goToSection(page, "hero");
  const toggle = page.getByRole("button", { name: "Open menu" });
  await toggle.click();
  const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
  await mobileNav.waitFor();
  assert.equal(
    await page.evaluate(() => document.body.style.overflow),
    "hidden",
  );
  assert.equal(
    await mobileNav
      .getByRole("link")
      .first()
      .evaluate((element) => element === document.activeElement),
    true,
  );
  await mobileNav.getByRole("link").last().focus();
  await page.keyboard.press("Tab");
  assert.equal(
    await page
      .getByRole("button", { name: "Close menu" })
      .evaluate((element) => element === document.activeElement),
    true,
  );
  await page.keyboard.press("Shift+Tab");
  assert.equal(
    await mobileNav
      .getByRole("link")
      .last()
      .evaluate((element) => element === document.activeElement),
    true,
  );
  await page.keyboard.press("Escape");
  assert.equal(await mobileNav.count(), 0);
  assert.equal(
    await toggle.evaluate((element) => element === document.activeElement),
    true,
  );
  assert.equal(await page.evaluate(() => document.body.style.overflow), "");
  await toggle.click();
  await mobileNav.getByRole("link", { name: "Contact" }).click();
  await page.waitForTimeout(1500);
  assert.equal(await mobileNav.count(), 0);
  assert.equal(new URL(page.url()).hash, "#contact");
  assert.equal(
    await page
      .locator("#contact h2")
      .evaluate((element) => element === document.activeElement),
    true,
  );
  await toggle.click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.waitForTimeout(200);
  assert.equal(await mobileNav.count(), 0);
  assert.equal(await page.evaluate(() => document.body.style.overflow), "");
  results.mobileMenuAndKeyboard = "passed";

  const reduced = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await reduced.addInitScript(() => {
    const original = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (options) {
      window.lastScrollBehavior = options?.behavior;
      return original.call(this, options);
    };
  });
  await reduced.goto(baseURL);
  await reduced
    .getByRole("link", { name: "Get In Touch", exact: true })
    .click();
  assert.equal(
    await reduced.evaluate(() => window.lastScrollBehavior),
    "instant",
  );
  assert.equal(await reduced.locator(".reveal-pending").count(), 0);
  await reduced.emulateMedia({ reducedMotion: "no-preference" });
  await goToSection(reduced, "hero");
  await reduced.emulateMedia({ reducedMotion: "reduce" });
  await reduced.waitForFunction(
    () => document.querySelectorAll(".reveal-pending").length === 0,
  );
  assert.equal(
    await reduced.locator(".reveal-pending").count(),
    0,
    "Changing the motion preference must expose pending content",
  );
  await assertLayout(reduced);
  results.reducedMotion = "passed";
  assert.deepEqual(errors, [], "No runtime or local asset errors");
  results.runtimeAndAssets = "passed";
  await writeFile(
    `${artifacts}/verification.json`,
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
