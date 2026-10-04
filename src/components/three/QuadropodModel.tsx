"use client";

import { useEffect, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { BufferGeometry, FileLoader, Float32BufferAttribute } from "three";
import type { HardwareAppearance } from "@/lib/hardware-explorer";
import { applyHologramScan, type HologramScan } from "@/lib/hologram-material";

type CADPart = {
  name: string;
  cover: boolean;
  positions: number[];
  color: string;
  surface: number[];
  indices: number[];
};

function isCoordinates(value: unknown, stride: number): value is number[] {
  return Array.isArray(value) && value.length > 0 && value.length % stride === 0 &&
    value.every((item: unknown) => typeof item === "number" && Number.isFinite(item));
}

function parseParts(source: unknown): CADPart[] {
  if (typeof source !== "string") throw new Error("Invalid CAD response");
  const data = JSON.parse(source);
  if (!data || !Array.isArray(data.parts) || data.parts.length === 0)
    throw new Error("The CAD assembly has no parts");
  for (const part of data.parts) {
    if (
      !part || typeof part.name !== "string" || typeof part.cover !== "boolean" ||
      typeof part.color !== "string" || !/^#[0-9a-f]{6}$/i.test(part.color) ||
      !isCoordinates(part.positions, 6) || !isCoordinates(part.surface, 3) ||
      !isCoordinates(part.indices, 3) ||
      !part.indices.every((index: number) => Number.isInteger(index) && index >= 0 && index < part.surface.length / 3)
    ) throw new Error("Invalid CAD geometry or material");
  }
  return data.parts;
}

export function QuadropodModel({ scan, appearance }: {
  scan: HologramScan;
  appearance: HardwareAppearance;
}) {
  const source = useLoader(FileLoader, "/models/quadropod.json");
  const parts = useMemo(() => parseParts(source).map((part) => {
    const edges = new BufferGeometry().setAttribute(
      "position", new Float32BufferAttribute(part.positions, 3),
    );
    const surface = new BufferGeometry().setAttribute(
      "position", new Float32BufferAttribute(part.surface, 3),
    );
    surface.setIndex(part.indices);
    surface.computeVertexNormals();
    return { ...part, edges, mesh: surface };
  }), [source]);
  useEffect(() => () => parts.forEach((part) => {
    part.edges.dispose();
    part.mesh.dispose();
  }), [parts]);
  return (
    <group rotation={[0, 0.3, 0]}>
      {parts.map((part) => (
        <group key={part.name} name={part.name} userData={{
          // This inspection offset is not the physical cover removal trajectory.
          explode: part.cover ? [0, 0, -1.5] : [0, 0, 0],
        }}>
          {appearance === "solid" ? (
            <mesh geometry={part.mesh}>
              <meshStandardMaterial color={part.color} roughness={0.65} metalness={0} />
            </mesh>
          ) : (
            <lineSegments geometry={part.edges}>
              <lineBasicMaterial
                color={part.cover ? "#e0b773" : "#a4d6d0"}
                transparent opacity={0.7} depthTest={false} depthWrite={false}
                toneMapped={false}
                onUpdate={(material) => applyHologramScan(material, scan)}
              />
            </lineSegments>
          )}
        </group>
      ))}
    </group>
  );
}
