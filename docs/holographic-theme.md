# Holographic engineering interface

The portfolio uses the hardware explorer's transparent line aesthetic throughout
navigation, project records, the process board, capabilities, biography and
contact. Cyan defines diagrams and interactive controls; amber identifies
section numbers and secondary details. The introduction is text-only;
the line-only Three.js models appear in the hardware section below it. Other
sections use SVG and CSS.

## Design and behavior

- The hero contains only the heading, introduction, navigation buttons and
  engineering focus labels. There is no drawing, image, canvas, model download
  or WebGL initialization in the introduction. Three.js activates on reaching
  the hardware section below. The former hero model, generator and preview
  asset have been removed.
- Shared colors, typography, frames and responsive layouts live in
  `src/app/globals.css`. Headings use the self-hosted Chakra Petch semibold font
  through `next/font/local`; its SIL Open Font License is in `public/fonts/`.
  Body text uses the Avenir Next/system font stack; technical labels use monospace.
  The favicon and social preview also use the cyan/amber circuit treatment.
- `EngineeringDrawing` contains project concept diagrams and the relationship
  between hardware, firmware and validation. These are explanatory graphics,
  not source schematics or measured project results.
- `SiteMotion` observes offscreen `data-reveal` elements once. Content is visible
  in the server HTML and without JavaScript. Changing to reduced motion exposes
  all pending elements and disconnects the observer. There is no ambient loop.
- The process traces use the existing scoped GSAP ScrollTrigger. Changing the
  motion preference reverts the previous animation through `revertOnUpdate`.
- Desktop navigation appears at 1024px. The section rail appears at 1536px;
  it schedules no scroll measurements below that breakpoint. Target elements
  and header height are cached outside the scroll callback.
- Mobile navigation locks background scrolling while open, supports Escape and
  keyboard focus wrapping, and closes on navigation or a desktop resize. Menu
  navigation moves focus to the destination heading. Modified link clicks retain
  the browser's native behavior. Hash navigation respects reduced motion.
- Contact continues to prepare a `mailto:` draft. The interface states this
  behavior explicitly. Field errors are associated with their inputs through
  `aria-describedby` and `aria-invalid`; no delivery service is added.

The hardware sequence and model provenance remain documented in
[`hardware-explorer.md`](hardware-explorer.md).

## Verification

Run `npm run build`, followed by `npm run typecheck`, then serve `out/` locally
as described in the hardware document. Both browser checks use local URLs only:

```sh
npm run verify:theme
npm run verify:hardware
```

Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` when using an existing Chromium browser.
Theme checks cover horizontal overflow at 320, 360, 375, 390, 768, 1024, 1440 and 1600px,
section navigation, reveals, mobile menu focus and Escape, resize cleanup,
invalid form input, motion preference changes, local assets and runtime errors.
They never submit a valid message or contact an email recipient. Screenshots and
results are saved to the ignored `output/playwright/theme/` directory.

Hardware checks cover pinned scrolling, simultaneous radial disassembly, line-only rendering,
PCB batching, mobile controls, fallback and zero new draws at idle.

## Local preview

After building, run `npm run preview` and open `http://127.0.0.1:4173/`.
The local server uses `Cache-Control: no-store` for HTML and assets. Rebuilding
replaces the export's hashed CSS/JS files, so caching an older HTML document can
otherwise produce missing assets and an unstyled page in VS Code's browser.
Refresh the page after a build; use Hard Reload once if an older preview was
already cached. `npm run verify:preview` checks asset MIME types, cache headers,
conditional requests and path boundaries. This affects only the local preview;
GitHub Pages deployment is unchanged.
