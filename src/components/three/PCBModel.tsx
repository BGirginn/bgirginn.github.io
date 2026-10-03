"use client";

import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei/core/Gltf";
import {
  Box3,
  AdditiveBlending,
  BufferGeometry,
  EdgesGeometry,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { applyHologramScan, type HologramScan } from "@/lib/hologram-material";

const MODEL_PATH = "/models/web.glb";

type BoardBatch = {
  key: string;
  category: "board" | "components";
  geometry: BufferGeometry;
  material: MeshStandardMaterial;
};

function BoardSurface({
  batch,
  scan,
}: {
  batch: BoardBatch;
  scan: HologramScan;
}) {
  const edges = useMemo(
    () => new EdgesGeometry(batch.geometry, 35),
    [batch.geometry],
  );
  useEffect(() => () => edges.dispose(), [edges]);
  return (
    <lineSegments geometry={edges}>
      <lineBasicMaterial
        color={batch.category === "board" ? "#73afaf" : "#a4d6d0"}
        transparent
        opacity={0.6}
        blending={AdditiveBlending}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
        onUpdate={(material) => applyHologramScan(material, scan)}
      />
    </lineSegments>
  );
}

export function PCBModel({ scan }: { scan: HologramScan }) {
  const gltf = useGLTF(MODEL_PATH);
  const batches = useMemo(() => {
    const boardIndex = gltf.parser.json.meshes.findIndex(
      (mesh: { name?: string }) => /PCB/i.test(mesh.name ?? ""),
    );
    if (boardIndex < 0)
      throw new Error("The KiCad model has no identifiable board mesh");
    gltf.scene.updateMatrixWorld(true);
    const bounds = new Box3().setFromObject(gltf.scene);
    const center = bounds.getCenter(new Vector3());
    const size = bounds.getSize(new Vector3());
    const scale = 5.2 / Math.max(size.x, size.z);
    const buckets = new Map<
      string,
      {
        category: BoardBatch["category"];
        material: MeshStandardMaterial;
        geometries: BufferGeometry[];
      }
    >();

    gltf.scene.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      const association = gltf.parser.associations.get(object);
      const category =
        association?.meshes === boardIndex ? "board" : "components";
      const material = object.material as MeshStandardMaterial;
      const key = `${category}-${material.uuid}`;
      const geometry = object.geometry.index
        ? object.geometry.toNonIndexed()
        : object.geometry.clone();
      // Bake source transforms into private copies; the cached GLB stays unchanged.
      geometry.applyMatrix4(object.matrixWorld);
      geometry.translate(-center.x, -bounds.min.y, -center.z);
      geometry.scale(scale, scale, scale);
      for (const attribute of Object.keys(geometry.attributes)) {
        if (attribute !== "position" && attribute !== "normal")
          geometry.deleteAttribute(attribute);
      }
      const bucket = buckets.get(key) ?? { category, material, geometries: [] };
      bucket.geometries.push(geometry);
      buckets.set(key, bucket);
    });

    return Array.from(buckets, ([key, bucket]) => {
      const geometry = mergeGeometries(bucket.geometries);
      bucket.geometries.forEach((source) => source.dispose());
      if (!geometry) throw new Error(`Cannot merge KiCad geometry for ${key}`);
      return {
        key,
        category: bucket.category,
        geometry,
        material: bucket.material,
      };
    });
  }, [gltf]);

  useEffect(
    () => () => batches.forEach((batch) => batch.geometry.dispose()),
    [batches],
  );
  return (
    <group rotation={[0, 0.3, 0]}>
      {(["board", "components"] as const).map((category) => (
        <group
          key={category}
          name={category}
          userData={{
            explode: [0, category === "components" ? 0.95 : -0.15, 0],
          }}
        >
          {batches
            .filter((batch) => batch.category === category)
            .map((batch) => (
              <BoardSurface key={batch.key} batch={batch} scan={scan} />
            ))}
        </group>
      ))}
    </group>
  );
}
