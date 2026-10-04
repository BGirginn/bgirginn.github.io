"use client";

import { useEffect, useMemo } from "react";
import { EdgesGeometry, NormalBlending } from "three";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import {
  buildHexapodParts,
  type GeometryBatch,
  type PartSurface,
} from "@/lib/hardware-geometry";
import { hardwareCamera } from "@/lib/hardware-camera";
import { applyHologramScan, type HologramScan } from "@/lib/hologram-material";

const strokeStyles = {
  shell: { color: "#83d7ec", opacity: 0.78, width: 1.45 },
  servo: { color: "#6fb0c8", opacity: 0.56, width: 1.05 },
  metal: { color: "#52798c", opacity: 0.38, width: 0.9 },
  board: { color: "#c8a86c", opacity: 0.78, width: 1.3 },
  copper: { color: "#c8a86c", opacity: 0.38, width: 0.9 },
} satisfies Record<
  PartSurface,
  { color: string; opacity: number; width: number }
>;

function Surface({
  batch,
  scan,
}: {
  batch: GeometryBatch;
  scan: HologramScan;
}) {
  const lines = useMemo(() => {
    const edges = new EdgesGeometry(batch.geometry, 28);
    const geometry = new LineSegmentsGeometry().setPositions(
      edges.getAttribute("position").array as Float32Array,
    );
    edges.dispose();
    const style = strokeStyles[batch.surface];
    const material = new LineMaterial({
      color: style.color,
      transparent: true,
      opacity: style.opacity,
      // Overlapping strokes must stay cyan rather than accumulating into white glare.
      blending: NormalBlending,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
    });
    // Native WebGL lines ignore widths above one pixel; screen-space strokes
    // retain this readable width at every device pixel ratio and camera distance.
    material.linewidth = style.width;
    applyHologramScan(material, scan);
    return new LineSegments2(geometry, material);
  }, [batch.geometry, batch.surface, scan]);
  useEffect(
    () => () => {
      lines.geometry.dispose();
      lines.material.dispose();
    },
    [lines],
  );
  return <primitive object={lines} />;
}

export function HexapodModel({ scan }: { scan: HologramScan }) {
  const parts = useMemo(buildHexapodParts, []);
  useEffect(
    () => () =>
      parts.forEach((part) =>
        part.batches.forEach((batch) => batch.geometry.dispose()),
      ),
    [parts],
  );
  return (
    <group rotation={[0, hardwareCamera.robotRotation, 0]}>
      {parts.map((part) => (
        <group
          key={part.name}
          name={part.name}
          userData={{ explode: part.offset, radialSpread: part.radialSpread }}
        >
          {part.batches.map((batch) => (
            <Surface key={batch.surface} batch={batch} scan={scan} />
          ))}
        </group>
      ))}
    </group>
  );
}
