"use client";

import { Clone, useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";

const MODEL_PATH = "/models/web.glb";

type PCBModelProps = ThreeElements["group"];

export function PCBModel(props: PCBModelProps) {
  const { scene } = useGLTF(MODEL_PATH);

  return (
    <group {...props}>
      <Clone object={scene} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
