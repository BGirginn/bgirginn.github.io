import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";
import {
  Box2,
  Box3,
  MathUtils,
  PerspectiveCamera,
  Vector2,
  Vector3,
} from "three";

// Compile the actual geometry modules in memory with the project's TypeScript
// compiler; Node need not understand Next's aliases or a particular TS version.
async function sourceModule(relativePath, aliases = {}) {
  const source = await readFile(new URL(relativePath, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
    },
    transformers: {
      before: [
        (context) => {
          const visit = (node) => {
            if (
              ts.isImportDeclaration(node) &&
              ts.isStringLiteral(node.moduleSpecifier)
            ) {
              const name = node.moduleSpecifier.text;
              return ts.factory.updateImportDeclaration(
                node,
                node.modifiers,
                node.importClause,
                ts.factory.createStringLiteral(
                  aliases[name] ?? import.meta.resolve(name),
                ),
                node.attributes,
              );
            }
            return ts.visitEachChild(node, visit, context);
          };
          return (file) => ts.visitNode(file, visit);
        },
      ],
    },
  });
  return `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
}

export async function verifyHardwareLayout() {
  const cameraModule = await sourceModule("../src/lib/hardware-camera.ts");
  const { hardwareCamera } = await import(cameraModule);
  const motionModule = await sourceModule("../src/lib/hardware-explorer.ts");
  const { getAssemblySeparation } = await import(motionModule);
  const geometryModule = await sourceModule("../src/lib/hardware-geometry.ts", {
    "@/lib/hardware-camera": cameraModule,
  });
  const { buildHexapodParts } = await import(geometryModule);
  const parts = buildHexapodParts();
  const central = parts.filter((part) => !part.name.startsWith("Leg "));
  const legs = parts.filter((part) => part.name.startsWith("Leg "));
  const assemblyBounds = new Box3();
  const centers = parts.map((part) => {
    const bounds = new Box3();
    for (const batch of part.batches) {
      batch.geometry.computeBoundingBox();
      bounds.union(batch.geometry.boundingBox);
    }
    assemblyBounds.union(bounds);
    return new Vector3(...part.center);
  });
  const origin = assemblyBounds.getCenter(new Vector3());
  const radii = centers.map((center) => center.distanceTo(origin));
  const ordered = parts
    .map((_, index) => index)
    .sort((a, b) => radii[a] - radii[b]);
  const axis = new Vector3(0, 1, 0);
  const view = new Vector3(...hardwareCamera.position)
    .sub(new Vector3(...hardwareCamera.target))
    .normalize();
  const right = new Vector3()
    .crossVectors(new Vector3(0, 1, 0), view)
    .normalize();
  const up = new Vector3().crossVectors(view, right);

  function projectedBounds(part, camera, progress = 1) {
    const bounds = new Box2();
    const separation = getAssemblySeparation(progress);
    const offset = new Vector3(...part.offset).multiplyScalar(separation);
    const rotation =
      hardwareCamera.robotRotation +
      hardwareCamera.robotSeparationTurn * progress;
    const vertex = new Vector3();
    const point = new Vector2();
    for (const batch of part.batches) {
      const positions = batch.geometry.getAttribute("position");
      for (let index = 0; index < positions.count; index++) {
        vertex
          .fromBufferAttribute(positions, index)
          .add(offset)
          .applyAxisAngle(axis, rotation);
        if (camera) {
          vertex.project(camera);
          point.set(vertex.x, vertex.y);
        } else point.set(vertex.dot(right), vertex.dot(up));
        bounds.expandByPoint(point);
      }
    }
    return bounds;
  }

  try {
    assert.equal(getAssemblySeparation(-1), 0);
    assert.equal(getAssemblySeparation(2), 1);
    assert.equal(getAssemblySeparation(0.5), 0.5);
    for (const progress of [0.01, 0.1, 0.5, 0.99]) {
      const separation = getAssemblySeparation(progress);
      assert.ok(separation > 0 && separation < 1);
      for (const part of parts) {
        assert.equal(
          "interval" in part,
          false,
          `${part.name} must have no individual start delay`,
        );
        assert.ok(
          new Vector3(...part.offset).multiplyScalar(separation).length() > 0,
          `${part.name} must start moving with every other part`,
        );
      }
    }
    assert.equal(central.length, 3);
    assert.equal(
      legs.length,
      30,
      "Every leg must retain all five movable groups",
    );
    for (const progress of [0, 0.01, 0.35, 0.75, 1]) {
      const separation = getAssemblySeparation(progress);
      const moved = centers.map((center, index) =>
        center
          .clone()
          .addScaledVector(new Vector3(...parts[index].offset), separation)
          .sub(origin),
      );
      for (const index of ordered) {
        const start = centers[index].clone().sub(origin);
        assert.ok(
          start.clone().cross(moved[index]).length() < 0.00001,
          `${parts[index].name} must move on its original ray from the common assembly center`,
        );
        assert.ok(
          moved[index].dot(start) > 0,
          `${parts[index].name} must stay on its original side of the center`,
        );
        assert.ok(
          moved[index].length() >= radii[index] - 0.00001,
          `${parts[index].name} must never move inward`,
        );
      }
      for (let rank = 1; rank < ordered.length; rank++) {
        const inner = ordered[rank - 1];
        const outer = ordered[rank];
        assert.ok(
          moved[outer].length() >= moved[inner].length() - 0.00001,
          `${parts[outer].name} must stay farther from the common center than ${parts[inner].name}`,
        );
      }
      // Each set of six equivalent leg parts remains a circular ring in the
      // robot's ground plane, rather than being rearranged into columns.
      for (const name of [
        "Hip actuator",
        "Mounting frame",
        "Knee actuator",
        "Foot link",
        "Cable reference",
      ]) {
        const ring = parts
          .map((part, index) => ({ part, index }))
          .filter(({ part }) => part.name.endsWith(`/ ${name}`))
          .map(({ index }) => moved[index]);
        assert.equal(ring.length, 6);
        const radii = ring.map((point) => Math.hypot(point.x, point.z));
        assert.ok(
          Math.max(...radii) - Math.min(...radii) < 0.00001,
          `${name} must retain its circular envelope`,
        );
        const angles = ring
          .map((point) => Math.atan2(point.z, point.x))
          .sort((a, b) => a - b);
        for (let index = 0; index < angles.length; index++) {
          const next =
            angles[(index + 1) % angles.length] +
            (index === angles.length - 1 ? Math.PI * 2 : 0);
          assert.ok(
            Math.abs(next - angles[index] - Math.PI / 3) < 0.00001,
            `${name} must retain the six assembled directions`,
          );
        }
      }
    }
    const [chassis, enclosure, board] = central.map((part) =>
      projectedBounds(part),
    );
    assert.ok(
      enclosure.min.y - board.max.y >= 0.15,
      "Cover and board need a visible vertical gap",
    );
    assert.ok(
      board.min.y - chassis.max.y >= 0.15,
      "Board and chassis need a visible vertical gap",
    );

    for (const aspect of [0.8, 1, 1.45, 2.4]) {
      const fit = Math.max(1, hardwareCamera.horizontalFit / aspect);
      for (const progress of [0, 0.35, 0.75, 1]) {
        const baseFov = MathUtils.lerp(
          hardwareCamera.robotFov,
          hardwareCamera.robotExplodedFov,
          MathUtils.smoothstep(progress, 0, 0.8),
        );
        const fov = MathUtils.radToDeg(
          2 * Math.atan(Math.tan(MathUtils.degToRad(baseFov) / 2) * fit),
        );
        const camera = new PerspectiveCamera(fov, aspect, 0.1, 80);
        const target = new Vector3(...hardwareCamera.target);
        const direction = new Vector3(...hardwareCamera.position).sub(target);
        camera.position
          .copy(
            direction.setLength(
              MathUtils.lerp(
                direction.length(),
                hardwareCamera.robotExplodedDistance,
                getAssemblySeparation(progress),
              ),
            ),
          )
          .add(target);
        camera.lookAt(new Vector3(...hardwareCamera.target));
        camera.updateMatrixWorld();
        for (const part of parts) {
          const bounds = projectedBounds(part, camera, progress);
          assert.ok(
            bounds.min.x >= -0.95 &&
              bounds.max.x <= 0.95 &&
              bounds.min.y >= -0.95 &&
              bounds.max.y <= 0.95,
            `${part.name} must fit with a margin at aspect ${aspect}, progress ${progress}`,
          );
        }
      }
    }
    return "common-center radial expansion, inner/outer order, circular envelope, all parts fit: passed";
  } finally {
    parts.forEach((part) =>
      part.batches.forEach((batch) => batch.geometry.dispose()),
    );
  }
}
