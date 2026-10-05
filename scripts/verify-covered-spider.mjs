import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { Box3, EdgesGeometry, MathUtils, Matrix4, PerspectiveCamera, Vector3 } from "three";
import ts from "typescript";
import { STLLoader } from "three/addons/loaders/STLLoader.js";

export async function verifyCoveredSpider() {
  const root = new URL("../public/models/covered-spider/", import.meta.url);
  const assembly = JSON.parse(await readFile(new URL("assembly.json", root)));
  assert.equal(assembly.files.length, 15);
  assert.equal(assembly.parts.length, 57);
  assert.equal(new Set(assembly.parts.map((part) => part.name)).size, 57);
  assert.equal(assembly.parts.filter((part) => part.cover).length, 8);
  assert.equal(assembly.files.filter((file) => file.kind === "printed").length, 11);
  assert.equal(assembly.parts.filter((part) => part.kind === "printed").length, 41);
  const sourceColors = {
    Chassis_Quarter: "#b8c2d1", Seam_Plate: "#808c99", Central_Deck: "#40a6b3",
    HIP_Test_Interface: "#526173", HIP_Horn_Adapter: "#eda32b", Femur: "#3399c7",
    KNEE_Horn_Adapter: "#eda32b", Tibia: "#4db37a", Foot_Pad_Interface: "#b86342",
    Femur_Cover: "#5e82a6", Tibia_Cover: "#477d5e",
    HIP_SG90: "#3361e0", KNEE_SG90: "#3361e0",
    HIP_Original_Horn: "#f0f0e0", KNEE_Original_Horn: "#f0f0e0",
  };
  for (const part of assembly.parts) {
    assert.equal(part.color, sourceColors[part.file.replace(/\.stl$/, "")],
      `FreeCAD source color for ${part.name}`);
  }
  for (const tag of ["FL", "FR", "BL", "BR"]) {
    for (const joint of ["HIP", "KNEE"]) {
      assert.equal(assembly.parts.find((part) => part.name === `${tag}_${joint}_SG90`)?.kind, "servo");
      assert.equal(assembly.parts.find((part) => part.name === `${tag}_${joint}_Original_Horn`)?.kind, "horn");
    }
  }
  const cameraSource = await readFile(new URL("../src/lib/hardware-camera.ts", import.meta.url), "utf8");
  const compiled = ts.transpileModule(cameraSource, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
  const { hardwareCamera: config } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
  const placed = [];
  const sources = new Map();
  for (const file of assembly.files) {
    const bytes = await readFile(new URL(file.file, root));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), file.sha256);
    const geometry = new STLLoader().parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
    assert.equal(geometry.getAttribute("position").count / 3, file.triangles);
    sources.set(file.file, geometry);
  }
  const bounds = new Box3();
  let segments = 0;
  let triangles = 0;
  for (const part of assembly.parts) {
    assert.equal(part.matrix.length, 16);
    assert.ok(part.matrix.every(Number.isFinite));
    const matrix = new Matrix4().fromArray(part.matrix);
    assert.ok(matrix.determinant() > 0, "Placement must not reflect or collapse STL faces");
    const geometry = sources.get(part.file).clone().applyMatrix4(matrix);
    geometry.computeBoundingBox();
    bounds.union(geometry.boundingBox);
    triangles += geometry.getAttribute("position").count / 3;
    const edges = new EdgesGeometry(geometry, 28);
    segments += edges.getAttribute("position").count / 2;
    assert.ok(part.offset.every(Number.isFinite));
    edges.dispose();
    placed.push({ name: part.name, geometry, offset: new Vector3(...part.offset) });
  }
  for (const prefix of ["FL", "FR", "BL", "BR"]) {
    assert.equal(assembly.parts.filter((part) => part.name.startsWith(prefix + "_")).length, 12);
  }
  assert.ok(Math.abs(Math.max(...bounds.getSize(new Vector3()).toArray()) - 5.2) < 0.002);
  assert.ok(bounds.getCenter(new Vector3()).length() < 0.002);
  assert.equal(triangles, 153924, "Original printed and exported servo/horn facets must be preserved");
  assert.equal(segments, 76540, "Both views must use the original STL geometry");
  for (const tag of ["FL", "FR", "BL", "BR"]) {
    const leg = assembly.parts.filter((part) => part.name.startsWith(tag + "_") && !part.cover);
    assert.equal(leg.length, 10);
    for (const part of leg) {
      assert.deepEqual(part.offset, leg[0].offset, "Leg joints must stay assembled during separation");
      assert.equal(part.offset[1], 0, "Legs must stay at the assembled height");
    }
    for (const cover of assembly.parts.filter((part) => part.name.startsWith(tag + "_") && part.cover)) {
      const lift = new Vector3(...cover.offset).sub(new Vector3(...leg[0].offset));
      assert.ok(Math.abs(lift.length() - 0.48) < 0.00001, "Covers must lift separately from the intact leg");
    }
  }
  const deck = assembly.parts.find((part) => part.name === "Central_Deck");
  assert.deepEqual(deck.offset, [0, 0.65, 0], "Deck must lift vertically");
  for (const aspect of [0.55, 0.8, 1.4, 2.1]) {
    for (const progress of [0, 0.25, 0.6, 1]) {
      const separation = progress * progress * (3 - 2 * progress);
      const baseFov = config.robotFov;
      const fov = MathUtils.radToDeg(2 * Math.atan(Math.tan(MathUtils.degToRad(baseFov) / 2) * Math.max(1, config.horizontalFit / aspect)));
      const camera = new PerspectiveCamera(fov, aspect, 0.1, 80);
      const target = new Vector3(...config.target);
      const direction = new Vector3(...config.position).sub(target);
      camera.position.copy(target).add(direction);
      camera.lookAt(target);
      camera.updateMatrixWorld();
      for (const { geometry, offset } of placed) {
        const vertices = geometry.getAttribute("position");
        for (let index = 0; index < vertices.count; index++) {
          const vertex = new Vector3().fromBufferAttribute(vertices, index)
            .addScaledVector(offset, separation)
            .project(camera);
          assert.ok(Math.abs(vertex.x) < 0.95 && Math.abs(vertex.y) < 0.95,
            `STL must fit at aspect ${aspect}, progress ${progress}`);
        }
      }
    }
  }
  placed.forEach(({ geometry }) => geometry.dispose());
  sources.forEach((geometry) => geometry.dispose());
  return { instances: 57, files: 15, servos: 8, horns: 8, triangles, segments, originalHashes: "passed" };
}
