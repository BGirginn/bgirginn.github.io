import type { Vector3 } from "three";

export function positionHardwarePart(
  position: Vector3,
  offset: [number, number, number],
  separation: number,
) {
  position.set(
    offset[0] * separation,
    offset[1] * separation,
    offset[2] * separation,
  );
}
