import {
  BoxGeometry,
  Box3,
  BufferGeometry,
  CylinderGeometry,
  Euler,
  ExtrudeGeometry,
  Matrix4,
  Quaternion,
  Shape,
  Vector3,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export type PartSurface = "shell" | "servo" | "metal" | "board" | "copper";
export type GeometryBatch = { surface: PartSurface; geometry: BufferGeometry };
export type HardwarePart = {
  name: string;
  center: [number, number, number];
  offset: [number, number, number];
  batches: GeometryBatch[];
};

class PartBuilder {
  private geometries = new Map<PartSurface, BufferGeometry[]>();

  add(
    surface: PartSurface,
    geometry: BufferGeometry,
    position: [number, number, number],
    rotation: [number, number, number] = [0, 0, 0],
  ) {
    const quaternion = new Quaternion().setFromEuler(new Euler(...rotation));
    geometry.applyMatrix4(
      new Matrix4().compose(
        new Vector3(...position),
        quaternion,
        new Vector3(1, 1, 1),
      ),
    );
    const flattened = geometry.index ? geometry.toNonIndexed() : geometry;
    if (flattened !== geometry) geometry.dispose();
    for (const attribute of Object.keys(flattened.attributes)) {
      if (attribute !== "position" && attribute !== "normal")
        flattened.deleteAttribute(attribute);
    }
    const list = this.geometries.get(surface) ?? [];
    list.push(flattened);
    this.geometries.set(surface, list);
  }

  box(
    surface: PartSurface,
    size: [number, number, number],
    position: [number, number, number],
    rotation?: [number, number, number],
  ) {
    this.add(surface, new BoxGeometry(...size), position, rotation);
  }

  cylinder(
    surface: PartSurface,
    top: number,
    bottom: number,
    height: number,
    position: [number, number, number],
    sides = 16,
    rotation?: [number, number, number],
  ) {
    this.add(
      surface,
      new CylinderGeometry(top, bottom, height, sides),
      position,
      rotation,
    );
  }

  finish(name: string): HardwarePart {
    const batches = Array.from(this.geometries, ([surface, geometries]) => {
      const geometry = mergeGeometries(geometries);
      geometries.forEach((source) => source.dispose());
      if (!geometry)
        throw new Error(`Cannot merge the ${surface} geometry of ${name}`);
      return { surface, geometry };
    });
    const bounds = new Box3();
    for (const batch of batches) {
      batch.geometry.computeBoundingBox();
      bounds.union(batch.geometry.boundingBox!);
    }
    return {
      name,
      center: bounds.getCenter(new Vector3()).toArray() as [
        number,
        number,
        number,
      ],
      offset: [0, 0, 0],
      batches,
    };
  }
}

function addServo(builder: PartBuilder, x: number, y: number, z: number) {
  builder.box("servo", [0.48, 0.64, 0.31], [x, y, z]);
  builder.box("shell", [0.56, 0.08, 0.4], [x, y - 0.27, z]);
  builder.cylinder("metal", 0.13, 0.13, 0.055, [x, y + 0.13, z + 0.18], 16, [
    Math.PI / 2,
    0,
    0,
  ]);
}

export function buildHexapodParts(): HardwarePart[] {
  const base = new PartBuilder();
  base.cylinder("shell", 1.43, 1.43, 0.12, [0, -0.02, 0], 6);
  base.cylinder("shell", 1.39, 1.43, 0.3, [0, 0.14, 0], 6);
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    base.cylinder(
      "metal",
      0.035,
      0.035,
      0.36,
      [Math.cos(angle) * 1.12, 0.25, Math.sin(angle) * 1.12],
      8,
    );
  }

  const lid = new PartBuilder();
  // A single cover outline avoids nearly coincident rims at presentation scale.
  lid.cylinder("shell", 1.25, 1.4, 0.48, [0, 0.62, 0], 6);
  lid.cylinder("servo", 0.036, 0.036, 0.7, [0, 1.18, -0.55], 12);

  const electronics = new PartBuilder();
  electronics.box("board", [1.54, 0.06, 1.1], [0, 0.39, 0]);
  electronics.box("servo", [0.32, 0.09, 0.32], [0.1, 0.47, 0.05]);
  electronics.box("metal", [0.22, 0.09, 0.28], [-0.6, 0.48, 0.06]);
  for (let row = 0; row < 3; row++) {
    electronics.box(
      "copper",
      [1.17, 0.006, 0.008],
      [-0.04, 0.423, -0.32 + row * 0.32],
    );
    for (const side of [-1, 1]) {
      electronics.box(
        "servo",
        [0.1, 0.12, 0.075],
        [side * 0.62, 0.5, -0.32 + row * 0.32],
      );
    }
  }

  const parts = [
    base.finish("Chassis"),
    lid.finish("Enclosure"),
    electronics.finish("Illustrative control board"),
  ];
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3 + Math.PI / 6;
    const rotation = new Matrix4().makeRotationY(angle);
    const addPart = (builder: PartBuilder, name: string) => {
      const part = builder.finish(`Leg ${i + 1} / ${name}`);
      part.batches.forEach((batch) => batch.geometry.applyMatrix4(rotation));
      part.center = new Vector3(...part.center)
        .applyMatrix4(rotation)
        .toArray() as [number, number, number];
      parts.push(part);
    };

    const hip = new PartBuilder();
    addServo(hip, 1.49, 0.3, 0);
    addPart(hip, "Hip actuator");

    const frame = new PartBuilder();
    frame.box("shell", [0.68, 0.11, 0.4], [1.78, 0.37, 0]);
    frame.box("shell", [0.13, 0.57, 0.41], [1.98, 0.61, 0], [0, 0, -0.22]);
    frame.box("shell", [0.18, 0.65, 0.42], [2.42, 0.75, 0], [0, 0, -0.18]);
    addPart(frame, "Mounting frame");

    const knee = new PartBuilder();
    addServo(knee, 2.2, 0.77, 0);
    addPart(knee, "Knee actuator");

    const foot = new PartBuilder();
    const blade = new Shape();
    blade.moveTo(2.25, 0.91);
    blade.bezierCurveTo(2.75, 0.67, 3.04, -0.04, 3.35, -0.74);
    blade.lineTo(3.22, -0.77);
    blade.bezierCurveTo(2.96, -0.36, 2.76, 0.12, 2.25, 0.45);
    blade.closePath();
    foot.add(
      "shell",
      new ExtrudeGeometry(blade, {
        depth: 0.1,
        bevelEnabled: false,
        steps: 1,
        curveSegments: 8,
      }),
      [0, 0, -0.05],
    );
    addPart(foot, "Foot link");

    const wiring = new PartBuilder();
    wiring.box(
      "copper",
      [0.035, 0.36, 0.022],
      [2.22, 0.85, -0.175],
      [0, 0, 0.3],
    );
    wiring.box(
      "copper",
      [0.6, 0.027, 0.022],
      [1.89, 0.94, -0.175],
      [0, 0, 0.13],
    );
    addPart(wiring, "Cable reference");
  }
  const assemblyBounds = new Box3();
  parts.forEach((part) => {
    const bounds = new Box3();
    for (const batch of part.batches) {
      batch.geometry.computeBoundingBox();
      bounds.union(batch.geometry.boundingBox!);
    }
    assemblyBounds.union(bounds);
  });
  const center = assemblyBounds.getCenter(new Vector3());
  parts.forEach((part) => {
    const radial = new Vector3(...part.center).sub(center);
    const radius = radial.length();
    if (radius === 0) return;
    // This increasing radius map preserves the assembled radial order and
    // angles about one common center. Core clearance opens the stacked housing;
    // extra spread beyond the hips separates the outer leg mechanisms.
    const expandedRadius =
      radius + 2.6 * (1 - Math.exp(-radius / 0.3)) + Math.max(0, radius - 1.5);
    part.offset = radial
      .multiplyScalar(expandedRadius / radius - 1)
      .toArray() as [number, number, number];
  });
  return parts;
}
