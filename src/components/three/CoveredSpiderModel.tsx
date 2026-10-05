"use client";

import { useEffect, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { EdgesGeometry, FileLoader, Matrix4 } from "three";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import type { HardwareAppearance } from "@/lib/hardware-explorer";
import { applyHologramScan, type HologramScan } from "@/lib/hologram-material";

const ROOT = "/models/covered-spider/";
type Part = {
  name: string;
  file: string;
  matrix: number[];
  cover: boolean;
  color: string;
  kind: "printed" | "servo" | "horn";
  offset: [number, number, number];
};

function finiteArray(value: unknown, length: number): value is number[] {
  return Array.isArray(value) && value.length === length &&
    value.every((n: unknown) => typeof n === "number" && Number.isFinite(n));
}

function parseAssembly(source: unknown): Part[] {
  if (typeof source !== "string") throw new Error("Invalid STL assembly response");
  const data = JSON.parse(source);
  if (!Array.isArray(data?.parts) || data.parts.length !== 57)
    throw new Error("Incomplete covered spider assembly");
  const names = new Set<string>();
  for (const part of data.parts) {
    if (!part || typeof part.name !== "string" || names.has(part.name) ||
        typeof part.file !== "string" || !/^[A-Za-z0-9_]+\.stl$/.test(part.file) ||
        typeof part.color !== "string" || !/^#[0-9a-f]{6}$/i.test(part.color) ||
        !["printed", "servo", "horn"].includes(part.kind) ||
        typeof part.cover !== "boolean" || !finiteArray(part.matrix, 16) ||
        !finiteArray(part.offset, 3)) throw new Error("Invalid STL assembly part");
    names.add(part.name);
  }
  return data.parts;
}

function SpiderPart({ part, appearance, scan }: {
  part: Part;
  appearance: HardwareAppearance;
  scan: HologramScan;
}) {
  const source = useLoader(STLLoader, ROOT + part.file);
  const geometry = useMemo(() => {
    const positions = source.getAttribute("position");
    if (!positions || positions.count === 0 || positions.count % 3 !== 0 ||
        !Array.from(positions.array).every(Number.isFinite))
      throw new Error(`Invalid STL geometry: ${part.file}`);
    // Keep the cached original STL untouched; bake only the recorded assembly placement.
    return source.clone().applyMatrix4(new Matrix4().fromArray(part.matrix));
  }, [source, part]);
  const lines = useMemo(() => {
    const edges = new EdgesGeometry(geometry, 28);
    const segments = new LineSegmentsGeometry().setPositions(
      edges.getAttribute("position").array as Float32Array,
    );
    edges.dispose();
    const material = new LineMaterial({
      color: part.cover ? "#e0b773" : "#a4d6d0",
      linewidth: part.cover ? 1.45 : 0.9,
      transparent: true, opacity: 0.65,
      depthTest: false, depthWrite: false, toneMapped: false,
    });
    applyHologramScan(material, scan);
    return new LineSegments2(segments, material);
  }, [geometry, part.cover, scan]);
  useEffect(() => () => {
    geometry.dispose();
    lines.geometry.dispose();
    lines.material.dispose();
  }, [geometry, lines]);
  return (
    <group name={part.name} userData={{ explode: part.offset }}>
      {appearance === "solid" ? (
        <mesh geometry={geometry}>
          <meshStandardMaterial color={part.color} roughness={0.65} metalness={0} />
        </mesh>
      ) : <primitive object={lines} />}
    </group>
  );
}

export function CoveredSpiderModel({ appearance, scan }: {
  appearance: HardwareAppearance;
  scan: HologramScan;
}) {
  const source = useLoader(FileLoader, ROOT + "assembly.json");
  const parts = useMemo(() => parseAssembly(source), [source]);
  return <group>{parts.map((part) => (
    <SpiderPart key={part.name} part={part} appearance={appearance} scan={scan} />
  ))}</group>;
}
