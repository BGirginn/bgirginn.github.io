# Hardware sequence

The hardware section (`#signature`) is a transparent 3D scene
integrated into the site's dark background. It contains three separate subjects:

- **Hexapod robot:** procedural geometry reconstructed from the supplied photo.
  The geometry, servo proportions and internal electronics are illustrative.
  There is no source CAD, schematic or verified controller specification.
- **Quadropod V0 leg:** original FreeCAD edge geometry from the supplied leg
  assembly, with removable covers and nominal servo/fastener references.
- **PCB assembly:** the existing `/models/web.glb` KiCad export. Source geometry
  is preserved, centered and scaled. Components separate from the board; this
  does not depict hidden copper layers.

Hexapod and PCB retain their line-only views. Quadropod also offers a solid
view using the source FreeCAD colors. There are no white panels or externally
fetched HDRI assets. Mobile starts with an outline reference.
Descriptions and source notes live in `src/lib/hardware-explorer.ts`.

## Scroll behavior

On desktop the hardware stage sticks below the header. A native scroll range of
2.8 viewport heights drives the complete disassembly; scroll events are not
cancelled and the browser retains normal wheel, keyboard and reverse scrolling.
All robot parts expand together from the assembled model's common center:
enclosure, electronics, servo bodies, mounting
frames, foot links and cable references. Every movable group has
`userData.explode`; one shared smoothstep curve drives all offsets from the
first scroll movement. The common center is the complete assembled geometry's
bounding-box center. Each part keeps its original direction from that center,
except for the two rear legs (Leg 2 and Leg 3 in the default view). Those legs swing outward by
15 degrees to each side as separation increases. All five groups of each rear
leg follow this exception; the assembled pose and the other four legs are
unchanged.
One increasing radius map supplies core clearance and additional spacing
beyond the hip actuators; a part farther out in the assembled robot remains
farther out throughout the movement. The six sets of matching leg components
retain their circular radii rather than becoming rows or columns. Rear-leg
angular spread is applied after radial translation around the same common
center, preserving radius order even during intermediate animation frames.
There are no per-part start delays. PCB board and components continue
their simultaneous vertical separation. The assembly finishes in the first 88% of the sticky scroll range; the remainder holds the
completed model for inspection. The CSS sticky geometry sets the release point.
The scroll handler writes to a mutable ref and updates React only when the
narrative chapter changes. Camera orbit and reset remain available.

Reduced motion and unsupported WebGL2 disable pinning. Mobile starts with a
transparent SVG and offers explicit 3D activation; its assembly controls work
with the keyboard as well as touch. Reduced motion also removes damping and
the scan pass, ring rotation and HUD entrance animation.

## Rendering and assets

`frameloop="demand"` renders only while separation or the camera is moving. The
canvas renders its initial frame before stopping outside the section or in a
hidden tab. Readiness is reported from that first frame, not from component mount.
Desktop loading uses a status message, never the old static robot drawing. If
WebGL is unavailable, an explicit message replaces the scene and pinning ends.
Materials render transparent line segments. The robot uses normal alpha
blending so overlapping strokes do not add up to white glare. Its primary shell
outlines retain a 1.45 CSS-pixel stroke; actuator bodies use 1.05 pixels and
secondary metal/cable details use 0.9 pixels with lower opacity. Board outlines
use 1.3 pixels. The canvas has no glow filter. Tiny screw heads, pin clusters,
the illustrative trace grid and bevel rims are simplified while retaining all
six articulated leg assemblies. The cover, board and chassis have visible
vertical gaps in the fully exploded pose. The two rear leg mechanisms swing
sideways; all other legs stay on their assembled radial directions. The foot links form the outermost circular
envelope. Parts translate without scaling or changing their geometry, and
remain three-dimensional and orbitable. Perspective can still put the outlines
of front and rear components over one another when orbiting.
The simplified robot has 1,650 edge segments per frame, down from 3,504; the
browser check caps the overview at 2,000 to prevent reintroducing dense detail.

Robot edges use `LineSegments2`; its shader uses triangle quads only
to rasterize lines, never filled model surfaces. The assembled robot uses a
31-degree field of view (approximately 17% larger than the previous 36-degree
view). During separation it eases back to 38 degrees and increases the camera distance
to 19.5 model units to fit the circular layout without excessive perspective
distortion. Camera orbit direction is preserved while the distance changes.
Portrait views retain aspect-aware framing.

The holographic treatment adds cool cyan outlines, sparse frame brackets and
counter-rotating segmented HUD rings with sparse tick marks and amber cardinal accents.
The concentric frame expands with the assembly's common-center separation;
it does not move parts independently or introduce staged starts.
A scan line sweeps across the viewport and
tints the actual Three.js line shaders. Scan position, intensity and ring angles
derive from assembly progress, not an endless clock. The DOM overlay is
decorative, ignores pointer events and has no fabricated sensor readings.
The shader uniforms are shared by the scene's materials; the PCB source asset
is unchanged. Settled, offscreen and hidden scenes retain zero new GPU draws.
Reduced motion also removes the ring expansion. The board outline and cables use amber;
low-opacity secondary lines distinguish cable references without adding geometry.

Desktop fetches scene code within 300 pixels of the section, without initializing
WebGL before arrival. PCB code and the local GLB load only after the PCB subject
is selected. Camera reset reuses the existing canvas and geometry, preserves
separation and does not re-enter loading. Source materials and geometry are
not mutated. `PCBModel` batches 1,096 source primitives by material/category
before building their edge geometry. The geometry created by either model is
disposed when it is unmounted.

Use an actual CAD assembly when one becomes available. Export named, separate
nodes for covers, electronics, actuators, frames and foot links. Keep movement
behavior and explicitly identify any remaining illustrative geometry. Never
add controller models, operating limits or firmware claims without evidence.

## Validation

Run `npm run build`, then `npm run typecheck`; concurrent execution can race on
Next's generated `.next/types` files. Serve the production export with:

```sh
npm run preview
```

`npm run verify:hardware` checks the local build and saves screenshots plus
`verification.json` in `output/playwright/`. Use Playwright's installed Chromium
or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to an existing Chromium executable.

The browser checks verify:

- A text-only hero with no drawings, WebGL initialization or model preload.
- Constant stage position during scroll, increasing separation, full separation
  before release, and the next section entering after release.
- Geometry checks for one common radial center, inner/outer distance order,
  six circular rings with their assembled angles and the two rear-leg exceptions,
  unchanged assembled geometry, rear-only lateral clearance, gaps between the
  three central layers, simultaneous motion without per-part delays, and framing margins at
  four assembly phases and four aspect ratios.
  `verify-hardware-layout.mjs` compiles the actual geometry sources in memory
  with the installed TypeScript compiler; no generated files or Node TS loader
  are required.
- Zero filled-surface calls in line mode, actual 0.9–1.45-pixel robot strokes without additive
  glare, PCB batching and
  zero new draws at idle. Wide-line shader quads are counted separately.
- A ready-only, noninteractive HUD and an actual bounded scan uniform in the
  compiled robot line shaders.
- An initial frame in a hidden preview, subsequent idle pause, and resuming on
  visibility change; desktop contains no static drawing.
- Orbit/reset without remounting or loading, preserved separation, mobile
  activation, touch orbit, keyboard assembly controls, robot/PCB switching,
  portrait sizes from 320px and landscape framing.
- Reduced motion, WebGL2 fallback and absence of horizontal overflow.

WebGL counters are injected by the test harness. They are absent from the site.
The historical `part1.md`–`part4.md` cover the earlier design; this document
records the pinned holographic sequence and the CAD appearance controls.

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
