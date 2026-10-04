import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import { verifyHardwareLayout } from "./verify-hardware-layout.mjs";

const baseURL = process.env.HARDWARE_TEST_URL ?? "http://127.0.0.1:4173";
assert.ok(
  ["localhost", "127.0.0.1"].includes(new URL(baseURL).hostname),
  "Use a local static build",
);
const artifacts = "output/playwright";
await mkdir(artifacts, { recursive: true });
const results = { explodedLayout: await verifyHardwareLayout() };
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
});

async function instrument(context) {
  await context.addInitScript(() => {
    window.hardwareTest = {
      draws: 0,
      triangles: 0,
      strokes: 0,
      additiveStrokes: 0,
      currentSegments: 0,
      maxSegments: 0,
      minStrokeWidth: Infinity,
      maxStrokeWidth: 0,
      scanDraws: 0,
      maxScanStrength: 0,
      frames: 0,
      currentCalls: 0,
      maxCalls: 0,
    };
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (...args) {
      const gl = original.apply(this, args);
      if (gl && args[0] === "webgl2" && !gl.hardwareTestInstrumented) {
        gl.hardwareTestInstrumented = true;
        const clear = gl.clear.bind(gl);
        gl.clear = (...values) => {
          window.hardwareTest.frames++;
          window.hardwareTest.currentCalls = 0;
          window.hardwareTest.currentSegments = 0;
          return clear(...values);
        };
        for (const name of [
          "drawElements",
          "drawArrays",
          "drawElementsInstanced",
          "drawArraysInstanced",
        ]) {
          const draw = gl[name].bind(gl);
          gl[name] = (...values) => {
            const stats = window.hardwareTest;
            stats.draws++;
            stats.currentCalls++;
            if (
              values[0] === gl.TRIANGLES ||
              values[0] === gl.TRIANGLE_STRIP ||
              values[0] === gl.TRIANGLE_FAN
            ) {
              const program = gl.getParameter(gl.CURRENT_PROGRAM);
              const width = gl.getUniformLocation(program, "linewidth");
              const resolution = gl.getUniformLocation(program, "resolution");
              // Three's wide-line shader draws stroke quads, not filled model faces.
              if (width !== null && resolution !== null) {
                const value = gl.getUniform(program, width);
                stats.strokes++;
                const scan = gl.getUniformLocation(program, "uScanStrength");
                if (scan !== null) {
                  stats.scanDraws++;
                  stats.maxScanStrength = Math.max(
                    stats.maxScanStrength,
                    gl.getUniform(program, scan),
                  );
                }
                if (gl.getParameter(gl.BLEND_DST_RGB) === gl.ONE)
                  stats.additiveStrokes++;
                if (
                  name === "drawElementsInstanced" ||
                  name === "drawArraysInstanced"
                ) {
                  stats.currentSegments +=
                    values[name === "drawElementsInstanced" ? 4 : 3];
                  stats.maxSegments = Math.max(
                    stats.maxSegments,
                    stats.currentSegments,
                  );
                }
                stats.minStrokeWidth = Math.min(stats.minStrokeWidth, value);
                stats.maxStrokeWidth = Math.max(stats.maxStrokeWidth, value);
              } else stats.triangles++;
            }
            stats.maxCalls = Math.max(stats.maxCalls, stats.currentCalls);
            return draw(...values);
          };
        }
      }
      return gl;
    };
  });
}

async function idleDraws(page) {
  await page.waitForTimeout(1800);
  const start = await page.evaluate(() => window.hardwareTest.draws);
  await page.waitForTimeout(600);
  const end = await page.evaluate(() => window.hardwareTest.draws);
  assert.equal(end, start, "A settled viewer must stop rendering");
  return end - start;
}

async function seek(page, fraction) {
  await page.evaluate((value) => {
    const section = document.querySelector("#signature");
    const stage = document.querySelector(".hardware-stage");
    const header = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--header-height",
      ),
    );
    const top = section.getBoundingClientRect().top + scrollY - header;
    const distance = section.offsetHeight - stage.offsetHeight;
    window.scrollTo({ top: top + distance * value, behavior: "instant" });
  }, fraction);
  await page.waitForTimeout(350);
}

async function assertNoOverflow(page) {
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
}

try {
  const background = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  await instrument(background);
  await background.addInitScript(() => {
    window.previewDocumentHidden = true;
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => (window.previewDocumentHidden ? "hidden" : "visible"),
    });
  });
  const backgroundPage = await background.newPage();
  await backgroundPage.goto(`${baseURL}/#signature`);
  await backgroundPage
    .locator(".explorer-canvas.is-ready canvas")
    .waitFor({ timeout: 10000 });
  assert.ok(
    (await backgroundPage.evaluate(() => window.hardwareTest.frames)) > 0,
    "A background preview must render its initial frame before pausing",
  );
  assert.equal(await backgroundPage.locator(".explorer-static svg").count(), 0);
  results.backgroundInitialFrameIdleDraws = await idleDraws(backgroundPage);
  const paused = await backgroundPage.evaluate(
    () => window.hardwareTest.frames,
  );
  await seek(backgroundPage, 0.5);
  await backgroundPage.evaluate(() => {
    window.previewDocumentHidden = false;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await backgroundPage.waitForFunction(
    (frames) => window.hardwareTest.frames > frames,
    paused,
  );
  results.backgroundInitialFrame = "passed";
  await background.close();

  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  await instrument(desktop);
  const page = await desktop.newPage();
  const errors = [];
  const modelRequests = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error")
      errors.push(`${message.text()} @ ${message.location().url}`);
  });
  page.on("request", (request) => {
    if (request.url().endsWith(".glb")) modelRequests.push(request.url());
  });
  await page.goto(baseURL);
  await page.waitForTimeout(350);
  assert.equal(
    await page
      .locator("#hero canvas, #hero img, #hero svg, #hero figure")
      .count(),
    0,
    "The introduction must contain no drawings or 3D preview",
  );
  assert.equal(
    await page.locator("canvas").count(),
    0,
    "3D must load only when the hardware section is reached",
  );
  assert.equal(
    modelRequests.length,
    0,
    "The introduction must not preload the PCB asset",
  );
  results.textOnlyHero = "passed";
  assert.equal(
    await page.locator(".hardware-hud").count(),
    0,
    "HUD must wait for the interactive scene",
  );
  await page.screenshot({ path: `${artifacts}/hero.png` });
  await page
    .getByRole("link", { name: "Explore the Hardware", exact: true })
    .click();
  await page.locator(".explorer-canvas.is-ready canvas").waitFor();
  await seek(page, 0);
  assert.equal(
    await page.locator(".hardware-hud[aria-hidden='true']").count(),
    1,
  );
  for (const viewport of [
    { width: 1024, height: 768 },
    { width: 1280, height: 720 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1000 },
  ]) {
    await page.setViewportSize(viewport);
    await seek(page, 0);
    const overlappingLabels = await page.evaluate(() => {
      const heading = document
        .querySelector(".hardware-heading h2")
        .getBoundingClientRect();
      return Array.from(
        document.querySelectorAll(".hardware-hud-labels > span"),
      )
        .filter((element) => {
          const label = element.getBoundingClientRect();
          return (
            label.left < heading.right &&
            label.right > heading.left &&
            label.top < heading.bottom &&
            label.bottom > heading.top
          );
        })
        .map((element) => element.textContent);
    });
    assert.deepEqual(
      overlappingLabels,
      [],
      `HUD labels must clear the heading at ${viewport.width}x${viewport.height}`,
    );
  }
  results.hudHeadingClearance = "passed";
  await page.setViewportSize({ width: 1440, height: 1000 });
  await seek(page, 0);
  results.assembledIdleDraws = await idleDraws(page);
  const orbitScale = () =>
    page
      .locator(".hardware-hud-orbits")
      .evaluate(
        (element) =>
          new DOMMatrixReadOnly(getComputedStyle(element).transform).a,
      );
  const assembledOrbitScale = await orbitScale();
  assert.equal(
    await page.locator(".explorer-static svg").count(),
    0,
    "Desktop must show the real 3D scene, never the old static drawing",
  );
  assert.equal(modelRequests.length, 0, "Robot must not preload PCB");
  await page.screenshot({ path: `${artifacts}/robot-assembled.png` });
  const start = await page.evaluate(() => window.hardwareTest.draws);
  await seek(page, 0.35);
  const topA = await page
    .locator(".hardware-stage")
    .evaluate((element) => element.getBoundingClientRect().top);
  const progressA = await page.locator(".assembly-footer output").textContent();
  assert.equal(
    await page.locator(".assembly-story h3").textContent(),
    "Synchronized separation",
  );
  assert.equal(
    await page
      .locator(".hardware-hud-scan")
      .evaluate((element) => Number(getComputedStyle(element).opacity) > 0),
    true,
  );
  await page.screenshot({ path: `${artifacts}/robot-opening.png` });
  await seek(page, 0.75);
  const topB = await page
    .locator(".hardware-stage")
    .evaluate((element) => element.getBoundingClientRect().top);
  const progressB = await page.locator(".assembly-footer output").textContent();
  assert.ok(
    Math.abs(topA - 82) < 2 && Math.abs(topB - topA) < 2,
    "The stage must remain pinned while scrolling",
  );
  assert.notEqual(progressA, progressB, "Scroll must disassemble the model");
  assert.ok((await page.evaluate(() => window.hardwareTest.draws)) > start);
  await seek(page, 0.94);
  assert.equal(
    await page.locator(".assembly-footer output").textContent(),
    "100%",
  );
  assert.ok(
    Math.abs(
      (await page
        .locator(".hardware-stage")
        .evaluate((element) => element.getBoundingClientRect().top)) - 82,
    ) < 2,
    "The completed model must have an inspection hold before release",
  );
  results.explodedIdleDraws = await idleDraws(page);
  assert.ok(
    (await orbitScale()) > assembledOrbitScale + 0.1,
    "The concentric HUD must expand with the common-center assembly",
  );
  results.radialHud = "passed";
  await page.screenshot({ path: `${artifacts}/robot-hologram-exploded.png` });
  results.robotLineCallsPerFrame = await page.evaluate(
    () => window.hardwareTest.maxCalls,
  );
  assert.equal(
    await page.evaluate(() => window.hardwareTest.triangles),
    0,
    "The hologram must not draw any solid surfaces",
  );
  results.linesOnly = "passed";
  const strokes = await page.evaluate(() => ({
    count: window.hardwareTest.strokes,
    minWidth: window.hardwareTest.minStrokeWidth,
    maxWidth: window.hardwareTest.maxStrokeWidth,
    additive: window.hardwareTest.additiveStrokes,
    segments: window.hardwareTest.maxSegments,
  }));
  assert.ok(strokes.count > 0, "Robot must render real wide-line strokes");
  assert.ok(Math.abs(strokes.minWidth - 0.9) < 0.00001);
  assert.ok(Math.abs(strokes.maxWidth - 1.45) < 0.00001);
  assert.equal(
    strokes.additive,
    0,
    "Robot overlaps must not accumulate white additive glare",
  );
  assert.ok(
    strokes.segments > 0 && strokes.segments <= 2000,
    "The robot overview must stay below 2,000 edge segments to limit visual clutter",
  );
  results.robotStrokeWidths = [
    Number(strokes.minWidth.toFixed(2)),
    Number(strokes.maxWidth.toFixed(2)),
  ];
  results.robotSegmentsPerFrame = strokes.segments;
  const scan = await page.evaluate(() => ({
    draws: window.hardwareTest.scanDraws,
    strength: window.hardwareTest.maxScanStrength,
  }));
  assert.ok(
    scan.draws > 0 && scan.strength > 0.3 && scan.strength <= 0.701,
    "The real line shaders must render a bounded cyan scan pass",
  );
  results.hologramScan = "passed";
  results.pinnedSeparation = "passed";
  await seek(page, 1.16);
  assert.ok(
    (await page
      .locator(".hardware-stage")
      .evaluate((element) => element.getBoundingClientRect().top)) < 82,
    "The stage must release after separation",
  );
  assert.ok(
    (await page
      .locator("#work")
      .evaluate((element) => element.getBoundingClientRect().top)) < 1000,
    "The next section must enter the viewport",
  );
  results.releaseToProjects = "passed";

  await seek(page, 0.5);
  const canvas = page.locator(".explorer-canvas canvas");
  const box = await canvas.boundingBox();
  const beforeOrbit = await page.evaluate(() => window.hardwareTest.draws);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    box.x + box.width / 2 + 120,
    box.y + box.height / 2 + 30,
    { steps: 10 },
  );
  await page.mouse.up();
  await page.waitForTimeout(500);
  assert.ok(
    (await page.evaluate(() => window.hardwareTest.draws)) > beforeOrbit,
  );
  await page.evaluate(() => {
    window.canvasBeforeReset = document.querySelector(
      ".explorer-canvas canvas",
    );
    window.progressBeforeReset = document.querySelector(
      ".assembly-footer output",
    ).textContent;
    window.resetLostReady = false;
    window.resetObserver = new MutationObserver(() => {
      if (!document.querySelector(".explorer-canvas.is-ready"))
        window.resetLostReady = true;
    });
    window.resetObserver.observe(document.querySelector(".explorer-canvas"), {
      attributes: true,
    });
  });
  await page.getByRole("button", { name: "Reset camera view" }).click();
  await page.locator(".explorer-canvas.is-ready canvas").waitFor();
  await page.waitForTimeout(350);
  assert.equal(
    await page.evaluate(
      () =>
        window.canvasBeforeReset ===
        document.querySelector(".explorer-canvas canvas"),
    ),
    true,
    "Reset must reuse the canvas",
  );
  assert.equal(
    await page.evaluate(() => window.resetLostReady),
    false,
    "Camera reset must not reload the viewer",
  );
  assert.equal(
    await page.evaluate(
      () =>
        window.progressBeforeReset ===
        document.querySelector(".assembly-footer output").textContent,
    ),
    true,
    "Camera reset must preserve separation",
  );
  await page.evaluate(() => window.resetObserver.disconnect());
  results.orbitAndReset = "passed";
  await page
    .getByRole("button", { name: "02 PCB assembly", exact: true })
    .click();
  await page.locator(".explorer-canvas.is-ready canvas").waitFor();
  assert.equal(modelRequests.length, 1);
  await page.evaluate(() => {
    window.hardwareTest.maxCalls = 0;
  });
  await seek(page, 0.94);
  results.pcbIdleDraws = await idleDraws(page);
  results.pcbLineCallsPerFrame = await page.evaluate(
    () => window.hardwareTest.maxCalls,
  );
  assert.ok(
    results.pcbLineCallsPerFrame <= 12,
    "The real PCB must use batched geometry",
  );
  assert.equal(await page.evaluate(() => window.hardwareTest.triangles), 0);
  await page.screenshot({ path: `${artifacts}/pcb-hologram.png` });
  await assertNoOverflow(page);
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }),
  );
  results.offscreenIdleDraws = await idleDraws(page);
  assert.deepEqual(
    errors,
    [],
    "Healthy desktop must not log runtime or asset errors",
  );
  await desktop.close();

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await instrument(mobile);
  const mobilePage = await mobile.newPage();
  const mobileErrors = [];
  mobilePage.on("pageerror", (error) => mobileErrors.push(error.message));
  mobilePage.on("console", (message) => {
    if (message.type() === "error") mobileErrors.push(message.text());
  });
  mobilePage.on("response", (response) => {
    if (response.status() >= 400)
      mobileErrors.push(`${response.status()} ${response.url()}`);
  });
  await mobilePage.goto(`${baseURL}/#signature`);
  await mobilePage.waitForTimeout(400);
  assert.equal(await mobilePage.locator("canvas").count(), 0);
  await assertNoOverflow(mobilePage);
  await mobilePage.getByRole("button", { name: "Open interactive 3D" }).tap();
  await mobilePage.locator(".explorer-canvas.is-ready canvas").waitFor();
  await mobilePage.getByRole("button", { name: "Exploded", exact: true }).tap();
  results.mobileIdleDraws = await idleDraws(mobilePage);
  const range = mobilePage.getByRole("slider", { name: "Assembly separation" });
  await range.focus();
  await range.press("Home");
  assert.equal(await range.inputValue(), "0");
  await range.press("End");
  assert.equal(await range.inputValue(), "100");
  await idleDraws(mobilePage);
  assert.equal(
    await mobilePage.evaluate(() => window.hardwareTest.triangles),
    0,
  );
  await mobilePage
    .locator(".hardware-stage")
    .screenshot({ path: `${artifacts}/mobile-hologram.png` });
  await assertNoOverflow(mobilePage);
  const touch = await mobile.newCDPSession(mobilePage);
  const mobileCanvas = await mobilePage
    .locator(".explorer-canvas canvas")
    .boundingBox();
  const beforeTouch = await mobilePage.evaluate(() => ({
    draws: window.hardwareTest.draws,
    scroll: scrollY,
  }));
  const point = {
    x: mobileCanvas.x + mobileCanvas.width / 2,
    y: Math.max(90, mobileCanvas.y + mobileCanvas.height / 2),
  };
  await touch.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [point],
  });
  for (let step = 1; step <= 8; step++) {
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: point.x + step * 8, y: point.y + step }],
    });
  }
  await touch.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await mobilePage.waitForTimeout(400);
  assert.ok(
    (await mobilePage.evaluate(() => window.hardwareTest.draws)) >
      beforeTouch.draws,
    "A horizontal touch drag must orbit the mobile model",
  );
  assert.ok(
    Math.abs((await mobilePage.evaluate(() => scrollY)) - beforeTouch.scroll) <
      5,
    "Touch orbit must not scroll the page horizontally",
  );
  await mobilePage.getByRole("button", { name: "Reset camera view" }).tap();
  await idleDraws(mobilePage);
  await touch.detach();
  for (const viewport of [
    { width: 320, height: 760 },
    { width: 360, height: 800 },
    { width: 768, height: 1024 },
    { width: 844, height: 390 },
  ]) {
    await mobilePage.setViewportSize(viewport);
    await idleDraws(mobilePage);
    await assertNoOverflow(mobilePage);
    for (const value of ["Assembled", "Exploded"]) {
      await mobilePage.getByRole("button", { name: value, exact: true }).tap();
      await mobilePage.waitForTimeout(1200);
      assert.equal(
        await range.inputValue(),
        value === "Assembled" ? "0" : "100",
      );
    }
    await mobilePage
      .locator(".hardware-stage")
      .screenshot({ path: `${artifacts}/mobile-${viewport.width}-radial.png` });
  }
  await mobilePage.setViewportSize({ width: 390, height: 844 });
  await mobilePage
    .getByRole("button", { name: "02 PCB assembly", exact: true })
    .tap();
  await mobilePage.locator(".explorer-canvas.is-ready canvas").waitFor();
  await mobilePage.getByRole("button", { name: "Exploded", exact: true }).tap();
  await idleDraws(mobilePage);
  await assertNoOverflow(mobilePage);
  await mobilePage
    .getByRole("button", { name: "01 Hexapod robot", exact: true })
    .tap();
  await mobilePage.locator(".explorer-canvas.is-ready canvas").waitFor();
  assert.equal(await range.inputValue(), "0");
  await idleDraws(mobilePage);
  assert.deepEqual(
    mobileErrors,
    [],
    "Mobile must not log runtime or asset errors",
  );
  results.mobileAndKeyboard = "passed";
  results.mobileTouchAndFraming =
    "passed: 320, 360, 390, 768, 844 landscape; orbit and project switching";
  await mobile.close();

  const reduced = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  await instrument(reduced);
  const reducedPage = await reduced.newPage();
  await reducedPage.goto(`${baseURL}/#signature`);
  await reducedPage.locator(".explorer-canvas.is-ready canvas").waitFor();
  assert.equal(
    await reducedPage
      .locator(".hardware-stage")
      .evaluate((element) => getComputedStyle(element).position),
    "relative",
  );
  await reducedPage
    .getByRole("button", { name: "Exploded", exact: true })
    .click();
  results.reducedMotionIdleDraws = await idleDraws(reducedPage);
  assert.equal(
    await reducedPage
      .locator(".hardware-hud")
      .evaluate((element) => getComputedStyle(element).animationName),
    "none",
  );
  assert.equal(
    await reducedPage
      .locator(".hardware-hud-scan")
      .evaluate((element) => getComputedStyle(element).display),
    "none",
  );
  assert.equal(
    await reducedPage
      .locator(".hardware-hud-dial")
      .evaluate((element) => getComputedStyle(element).transform),
    "none",
  );
  assert.equal(
    await reducedPage.evaluate(() => window.hardwareTest.maxScanStrength),
    0,
    "Reduced motion must disable shader scanning",
  );
  assert.equal(
    await reducedPage
      .locator(".hardware-hud-orbits")
      .evaluate((element) => getComputedStyle(element).transform),
    "none",
    "Reduced motion must disable orbital expansion",
  );
  results.reducedMotion = "passed";
  await reduced.close();

  const unsupported = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  await unsupported.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return type === "webgl2" ? null : original.call(this, type, ...args);
    };
  });
  const fallbackPage = await unsupported.newPage();
  await fallbackPage.goto(`${baseURL}/#signature`);
  await fallbackPage.locator(".explorer-unavailable").waitFor();
  assert.equal(await fallbackPage.locator("canvas").count(), 0);
  assert.equal(
    await fallbackPage
      .locator(".hardware-stage")
      .evaluate((element) => getComputedStyle(element).position),
    "relative",
  );
  assert.equal(await fallbackPage.locator(".explorer-static svg").count(), 0);
  assert.match(
    await fallbackPage.locator(".explorer-unavailable").textContent(),
    /description remains available/,
  );
  results.webglFallback = "passed";
  await unsupported.close();
  await writeFile(
    `${artifacts}/verification.json`,
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
