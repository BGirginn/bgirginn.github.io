# Hardware sequence

The hardware section (`#signature`) contains three separate subjects:

- **Quadropod V0:** the existing single-leg FreeCAD model, unchanged. It remains
  the default and offers Line / FreeCAD colors.
- **Covered spider:** the original printed STL parts of the four-legged
  `covered_spider` assembly, replacing the photo-based hexapod. It offers
  Line / STL solid. Both modes use the same meshes and placements.
- **PCB assembly:** the existing KiCad GLB, with its line-only view.

## Covered spider STL assembly

`public/models/covered-spider/` contains 11 byte-for-byte copies of the package's
STLs and `assembly.json`, which records their SHA-256 hashes, source CAD hash,
41 named instances, assembly transforms and inspection offsets. The original
STLs use print-bed coordinates. The exporter reverses the documented printing
placements and applies the matching FreeCAD instance placements. Every transformed
mesh bounding box must match its CAD part within 0.06 mm or export fails.
The assembled model is centered, uniformly scaled and converted from Z-up to Y-up.

The printed assembly includes four chassis quarters, four seam plates, a central
deck and eight printed components on each of four legs. Servo, fastener and
reserved electronics references are deliberately absent because they are not in
the STL package. Physical fit and load capacity are not established by the viewer.
STL has no source material colors; the solid view uses a neutral material with
local lights. The 139,892 original triangles are preserved. The line view extracts
69,428 feature-edge segments at a 28-degree threshold, without drawing the filled
surfaces. Its strokes use normal alpha blending and 0.9/1.45 CSS-pixel widths.
The higher edge count reflects the supplied detailed meshes, replacing the old
procedural robot's 2,000-segment budget.

`CoveredSpiderModel` loads only when selected. Cached STL geometry is never mutated;
private placed copies and line resources are disposed on unmount. Appearance
switching preserves the canvas, orbit and assembly separation. The mobile SVG
is a matching CAD-edge projection of the same printed components.

Regenerate from the matching package with FreeCAD's Python:

```sh
PYTHONPATH=/Applications/FreeCAD.app/Contents/Resources/lib \
  /Applications/FreeCAD.app/Contents/Resources/bin/python \
  scripts/export-covered-spider.py /path/to/covered_spider_Package
```

The source CAD is read and closed without saving. Source construction scripts,
macros and editable CAD are not published.

## Interaction and rendering

Desktop uses a sticky stage and a native scroll range of 2.8 viewport heights.
The inspection animation uses a shared smoothstep curve, completing in the first
88% of the range. Each leg moves outward as an intact group; covers lift along
their local outward direction, chassis quarters open slightly, and seam plates
and the central deck lift vertically. This is a viewing aid, not a physical
disassembly sequence. Covered spider camera distance, field of view and model
rotation stay constant throughout scrolling, with aspect-aware framing. Orbit
and reset remain available. PCB and single-leg inspection behavior is unchanged.

Demand rendering stops when the camera and assembly settle, outside the section,
and in hidden tabs. The first rendered frame marks readiness. The cyan scan and
concentric HUD follow scroll progress rather than an endless clock. Reduced motion
disables pinning, damping and decorative motion. Mobile begins with an SVG and
requires explicit 3D activation. WebGL failure produces an explicit fallback.

## Validation

Run `npm run build`, then `npm run typecheck`; running them concurrently can race
on generated Next types. Run `npm run verify:preview` and serve with `npm run preview`.
Then run `npm run verify:hardware`, using `PLAYWRIGHT_CHROMIUM_EXECUTABLE` if needed.
Artifacts are saved in `output/playwright/`.

The suite verifies original STL hashes, all 41 instances, eight covers, four legs,
triangle/edge counts, centering, placement matrices, and assembled/exploded framing.
Browser checks cover sticky scrolling, shader scanning, idle pause, orbit/reset,
responsive framing, mobile activation, appearance switching, reduced motion,
WebGL fallback, the unchanged single-leg controls, and PCB switching.

## Quadropod V0 CAD leg

The first and default subject, **Quadropod V0**, displays a single leg assembly exported
from `Quadropod_v0_copy.FCStd`. It is not a complete quadruped. The eight
PartDesign bodies and supplier/fastener reference groups retain their source
assembly coordinates. Construction axes and sketch history are excluded.
Servo, horn and fastener shapes are nominal references; physical fit, strength
and load capacity have not been established by this web visualization.

`public/models/quadropod.json` contains sampled CAD edges (0.15 mm deflection),
normalized uniformly and converted from Z-up to Y-up. The asset also contains
indexed surface meshes and the actual per-part diffuse colors read from the
FCStd version-3 material lists. Unsupported material layouts fail export. The source SHA-256 is
embedded in the asset. `quadropod.svg` is an orthographic projection of those
same edges for mobile fallback. The JSON and renderer load only when selected.
The femur and tibia covers move aside together; this inspection animation does
not simulate the validated multi-step physical cover removal path. Fasteners
remain in their assembled positions.

Regenerate both assets with a Python interpreter that can import FreeCAD:

```sh
PYTHONPATH=/Applications/FreeCAD.app/Contents/Resources/lib \
  /Applications/FreeCAD.app/Contents/Resources/bin/python \
  scripts/export-quadropod.py /path/to/Quadropod_v0_copy.FCStd
```

The exporter reads and closes the original document without saving it. The
editable source, backups, macros and construction scripts are not published.

The Quadropod **Line / FreeCAD colors** control becomes available after 3D
activation. Switching preserves the canvas, orbit and cover separation. Solid
mode uses local scene lights and depth-tested opaque materials; light and tone
mapping can differ from FreeCAD's viewport. Line mode remains the default.
The reduced-motion and demand-rendering behavior applies to both modes.
