"use client";

import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei/core/OrbitControls";
import type { OrbitControls as OrbitControlsInstance } from "three-stdlib";
import { Group, MathUtils, PerspectiveCamera, Vector3 } from "three";
import { HexapodModel } from "@/components/three/HexapodModel";
import {
  getAssemblySeparation,
  type AssemblyMotion,
  type HardwareSubject,
} from "@/lib/hardware-explorer";
import { hardwareCamera } from "@/lib/hardware-camera";
import { createHologramScan } from "@/lib/hologram-material";
import {
  positionHardwarePart,
  type RadialSpread,
} from "@/lib/hardware-geometry";

const PCBModel = lazy(() =>
  import("@/components/three/PCBModel").then((module) => ({
    default: module.PCBModel,
  })),
);

type SceneProps = {
  subject: HardwareSubject;
  motion: RefObject<AssemblyMotion>;
  reduced: boolean;
  active: boolean;
  fallback: ReactNode;
  onReady: () => void;
  onFailure: () => void;
  cameraReset: number;
};

class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    console.error("Hardware viewer failed to render:", error);
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function CameraReset({ version }: { version: number }) {
  const { controls, invalidate } = useThree();
  useEffect(() => {
    if (controls) (controls as OrbitControlsInstance).saveState();
  }, [controls]);
  useEffect(() => {
    if (!controls || version === 0) return;
    (controls as OrbitControlsInstance).reset();
    invalidate();
  }, [version, controls, invalidate]);
  return null;
}

function Assembly({
  subject,
  motion,
  reduced,
  active,
  onReady,
}: Omit<SceneProps, "fallback" | "onFailure" | "cameraReset">) {
  const group = useRef<Group>(null);
  const current = useRef(motion.current.progress);
  const reportedReady = useRef(false);
  const { invalidate, camera, size, gl, controls } = useThree();
  const framingTarget = useMemo(
    () => new Vector3(...hardwareCamera.target),
    [],
  );
  const assembledDistance = useMemo(
    () => new Vector3(...hardwareCamera.position).distanceTo(framingTarget),
    [framingTarget],
  );
  const scan = useMemo(createHologramScan, []);

  useEffect(() => {
    motion.current.invalidate = invalidate;
    invalidate();
    return () => {
      motion.current.invalidate = null;
    };
  }, [motion, invalidate, subject, active, reduced]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = motion.current.progress;
    current.current = reduced
      ? target
      : MathUtils.damp(current.current, target, 9, Math.min(delta, 0.05));
    if (Math.abs(current.current - target) < 0.001) current.current = target;
    const separation = getAssemblySeparation(current.current);
    scan.uScanPosition.value = 0.12 + current.current * 0.76;
    scan.uScanHeight.value = size.height * gl.getPixelRatio();
    scan.uScanStrength.value = reduced
      ? 0
      : Math.sin(Math.PI * separation) * 0.7;
    if (camera instanceof PerspectiveCamera) {
      const orbitTarget =
        (controls as OrbitControlsInstance | undefined)?.target ??
        framingTarget;
      const distance =
        subject === "robot"
          ? MathUtils.lerp(
              assembledDistance,
              hardwareCamera.robotExplodedDistance,
              separation,
            )
          : assembledDistance;
      if (
        Math.abs(camera.position.distanceTo(orbitTarget) - distance) > 0.00001
      ) {
        camera.position.sub(orbitTarget).setLength(distance).add(orbitTarget);
        camera.updateMatrixWorld();
      }
      const baseFov =
        subject === "robot"
          ? MathUtils.lerp(
              hardwareCamera.robotFov,
              hardwareCamera.robotExplodedFov,
              MathUtils.smoothstep(current.current, 0, 0.8),
            )
          : hardwareCamera.fov;
      const horizontalFit = Math.max(
        1,
        hardwareCamera.horizontalFit / (size.width / size.height),
      );
      const fov = MathUtils.radToDeg(
        2 *
          Math.atan(Math.tan(MathUtils.degToRad(baseFov) / 2) * horizontalFit),
      );
      if (camera.fov !== fov) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
    }
    group.current.traverse((object) => {
      const offset = object.userData.explode as
        | [number, number, number]
        | undefined;
      if (offset) {
        positionHardwarePart(
          object.position,
          offset,
          separation,
          object.userData.radialSpread as RadialSpread | undefined,
        );
      }
    });
    group.current.rotation.y =
      current.current * hardwareCamera.robotSeparationTurn;
    if (!reportedReady.current) {
      reportedReady.current = true;
      onReady();
    }
    // Draw again only while the assembly is moving; a settled scene has no render loop.
    if (active && current.current !== target) invalidate();
  });

  return (
    <group ref={group}>
      {subject === "robot" ? (
        <HexapodModel scan={scan} />
      ) : (
        <PCBModel scan={scan} />
      )}
    </group>
  );
}

export function SignatureScene(props: SceneProps) {
  const { subject, motion, reduced, active, fallback, onReady, onFailure } =
    props;
  const [rendered, setRendered] = useState(false);
  const markRendered = useCallback(() => {
    setRendered(true);
    onReady();
  }, [onReady]);
  return (
    <SceneBoundary key={subject} fallback={fallback} onFailure={onFailure}>
      <Canvas
        // The initial frame must exist before pausing a background preview.
        frameloop={active || !rendered ? "demand" : "never"}
        dpr={[1, 1.5]}
        camera={{
          position: [...hardwareCamera.position],
          fov: hardwareCamera.fov,
          near: 0.1,
          far: 80,
        }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        fallback={fallback}
        onCreated={({ gl }) => {
          gl.setClearColor("#080c11", 0);
        }}
        style={{ touchAction: "pan-y" }}
      >
        <Suspense fallback={null}>
          <Assembly
            subject={subject}
            motion={motion}
            reduced={reduced}
            active={active}
            onReady={markRendered}
          />
        </Suspense>
        <OrbitControls
          key={subject}
          makeDefault
          enableDamping={!reduced}
          dampingFactor={0.12}
          enablePan={false}
          enableZoom={false}
          minPolarAngle={0.35}
          maxPolarAngle={Math.PI / 2.15}
          target={[...hardwareCamera.target]}
        />
        <CameraReset version={props.cameraReset} />
      </Canvas>
    </SceneBoundary>
  );
}
