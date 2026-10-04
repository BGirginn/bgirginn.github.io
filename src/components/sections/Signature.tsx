"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, Box, RotateCcw } from "lucide-react";
import { HardwareDrawing } from "@/components/three/HardwareDrawing";
import { HardwareHud } from "@/components/three/HardwareHud";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useWebGLAvailable } from "@/hooks/use-webgl-available";
import {
  assemblyStages,
  quadropodStages,
  hardwareSubjects,
  type AssemblyMotion,
  type HardwareSubject,
  type HardwareAppearance,
} from "@/lib/hardware-explorer";

const loadScene = () =>
  import("@/components/three/SignatureScene").then(
    (module) => module.SignatureScene,
  );
const SignatureScene = dynamic(loadScene, { ssr: false });
const pcbStages = [
  {
    start: 0,
    label: "Complete PCB assembly",
    detail: "Original KiCad geometry: the board, components and connectors.",
  },
  {
    start: 0.04,
    label: "Synchronized separation",
    detail: "The board and components move apart together.",
  },
  {
    start: 0.96,
    label: "Inspect the board and components",
    detail: "This separation illustrates assembly, not hidden copper layers.",
  },
] as const;

export function Signature() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLInputElement>(null);
  const percentage = useRef<HTMLOutputElement>(null);
  const motion = useRef<AssemblyMotion>({ progress: 0, invalidate: null });
  const phaseRef = useRef(0);
  const [phase, setPhase] = useState(0);
  const [subject, setSubject] = useState<HardwareSubject>("quadropod");
  const [appearance, setAppearance] = useState<HardwareAppearance>("line");
  const [desktop, setDesktop] = useState(false);
  const [visible, setVisible] = useState(false);
  const [requested, setRequested] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [cameraReset, setCameraReset] = useState(0);
  const [pageVisible, setPageVisible] = useState(true);
  const reduced = usePrefersReducedMotion();
  const enable3D = requested || (desktop && visible);
  const webgl = useWebGLAvailable(enable3D);
  const interactive =
    ready && Boolean(webgl) && !failed && (desktop || requested);
  const pinned = desktop && !reduced && webgl !== false && !failed;
  const stages =
    subject === "robot"
      ? assemblyStages
      : subject === "quadropod"
        ? quadropodStages
        : pcbStages;
  const currentStage = stages[Math.min(phase, stages.length - 1)];
  const project = hardwareSubjects[subject];
  const markReady = useCallback(() => setReady(true), []);
  const markFailed = useCallback(() => {
    setReady(false);
    setFailed(true);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    const visibility = () =>
      setPageVisible(document.visibilityState === "visible");
    visibility();
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(
      ([entry]) =>
        setVisible(entry.isIntersecting && entry.intersectionRatio > 0),
      { threshold: 0.01 },
    );
    if (section.current) observer.observe(section.current);
    const prepare = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || !media.matches) return;
        prepare.disconnect();
        // Fetch scene code before arrival without creating a canvas or loading the PCB.
        void loadScene().catch((error: unknown) => {
          console.error("Hardware viewer code could not be loaded:", error);
          markFailed();
        });
      },
      { rootMargin: "300px 0px" },
    );
    if (section.current) prepare.observe(section.current);
    return () => {
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
      observer.disconnect();
      prepare.disconnect();
    };
  }, [markFailed]);

  const updateProgress = useCallback(
    (value: number) => {
      const progress = Math.min(1, Math.max(0, value));
      motion.current.progress = progress;
      motion.current.invalidate?.();
      stage.current?.style.setProperty("--assembly-progress", String(progress));
      if (slider.current) {
        slider.current.value = String(Math.round(progress * 100));
        slider.current.setAttribute(
          "aria-valuetext",
          `${Math.round(progress * 100)} percent separated`,
        );
      }
      if (percentage.current)
        percentage.current.textContent = `${Math.round(progress * 100)}%`;
      let next = 0;
      stages.forEach((item, index) => {
        if (progress >= item.start) next = index;
      });
      if (phaseRef.current !== next) {
        phaseRef.current = next;
        setPhase(next);
      }
    },
    [stages],
  );

  useEffect(() => {
    if (!interactive || !pinned || !visible || !pageVisible) return;
    let frame = 0;
    const header =
      Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-height",
        ),
      ) || 82;
    const update = () => {
      frame = 0;
      if (!section.current || !stage.current) return;
      const rect = section.current.getBoundingClientRect();
      const distance =
        rect.height - stage.current.getBoundingClientRect().height;
      // Complete the model before the sticky range ends, leaving a final inspection hold.
      updateProgress((header - rect.top) / Math.max(1, distance * 0.88));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [interactive, pinned, visible, pageVisible, updateProgress]);

  function selectSubject(next: HardwareSubject) {
    if (next === subject) return;
    setSubject(next);
    setReady(false);
    setFailed(false);
    phaseRef.current = 0;
    setPhase(0);
    motion.current.progress = 0;
    if (!pinned) updateProgress(0);
  }

  const fallback = desktop ? null : <HardwareDrawing subject={subject} />;
  return (
    <section
      ref={section}
      id="signature"
      data-subject={subject}
      className={`hardware-section ${reduced || failed || webgl === false ? "is-static" : ""}`}
      aria-labelledby="hardware-title"
    >
      <div ref={stage} className="hardware-stage container-grid">
        <div className="hardware-heading">
          <p className="engineering-eyebrow">
            <span /> Inside the hardware
          </p>
          <h2 id="hardware-title">
            One system.
            <br />
            <span>Every moving part.</span>
          </h2>
        </div>
        <div
          className="explorer-tabs"
          role="group"
          aria-label="Hardware project"
        >
          {(Object.keys(hardwareSubjects) as HardwareSubject[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={subject === key}
              onClick={() => selectSubject(key)}
            >
              <span>{hardwareSubjects[key].number}</span>
              {hardwareSubjects[key].name}
            </button>
          ))}
        </div>
        {subject === "quadropod" ? (
          <div className="explorer-appearance" role="group" aria-label="Model appearance">
            {(["line", "solid"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                disabled={!interactive}
                aria-pressed={appearance === mode}
                onClick={() => setAppearance(mode)}
              >
                {mode === "line" ? "Line" : "FreeCAD colors"}
              </button>
            ))}
          </div>
        ) : null}
        <div
          className="explorer-viewport"
          aria-label={`${project.name} interactive view`}
        >
          {interactive ? <HardwareHud reduced={reduced} /> : null}
          {!interactive && !desktop ? (
            <div className="explorer-static">{fallback}</div>
          ) : null}
          {desktop && !interactive && !failed && webgl !== false ? (
            <p className="explorer-loading" role="status">
              Loading interactive 3D assembly…
            </p>
          ) : null}
          {webgl && (desktop || requested) ? (
            <div className={`explorer-canvas ${ready ? "is-ready" : ""}`}>
              <SignatureScene
                key={subject}
                cameraReset={cameraReset}
                subject={subject}
                appearance={appearance}
                motion={motion}
                reduced={reduced}
                active={visible && pageVisible}
                fallback={fallback}
                onReady={markReady}
                onFailure={markFailed}
              />
            </div>
          ) : null}
          {!desktop && !requested ? (
            <button
              type="button"
              className="explorer-open"
              onClick={() => setRequested(true)}
            >
              <Box size={16} /> Open interactive 3D
            </button>
          ) : null}
          {(enable3D && webgl === false) || failed ? (
            <p className="explorer-unavailable">
              {failed
                ? "The 3D model could not be loaded."
                : "3D is unavailable on this device."}{" "}
              {desktop
                ? "The assembly description remains available."
                : "The reference drawing remains available."}
            </p>
          ) : null}
          <span className="explorer-scale">
            {subject === "robot"
              ? "PHOTO-BASED RECONSTRUCTION"
              : subject === "quadropod"
                ? "ORIGINAL FREECAD GEOMETRY"
                : "ORIGINAL KICAD GEOMETRY"}
            <br />
            {subject === "quadropod" && appearance === "solid" ? "SOLID" : "LINE"} ASSEMBLY / {project.number}
          </span>
        </div>
        <div className="assembly-story" aria-live="polite">
          <span className="assembly-stage-number">
            0{Math.min(phase + 1, stages.length)} / 0{stages.length}
          </span>
          <h3>{currentStage.label}</h3>
          <p>{currentStage.detail}</p>
          <div className="assembly-chapters" aria-hidden="true">
            {stages.map((item, index) => (
              <span
                key={item.label}
                className={index <= phase ? "is-active" : ""}
              />
            ))}
          </div>
        </div>
        <div className="assembly-footer">
          <span className="assembly-scroll-hint">
            <ArrowDown size={14} />
            {pinned
              ? phase === stages.length - 1
                ? "CONTINUE TO PROJECTS"
                : "SCROLL TO DISASSEMBLE"
              : "EXPLORE THE ASSEMBLY"}
          </span>
          <div className="assembly-progress-track" aria-hidden="true">
            <span />
          </div>
          <output ref={percentage}>0%</output>
          <button
            type="button"
            disabled={!interactive}
            aria-label="Reset camera view"
            onClick={() => setCameraReset((value) => value + 1)}
          >
            <RotateCcw size={13} /> Reset view
          </button>
        </div>
        <div className="assembly-manual">
          <button
            type="button"
            disabled={!interactive}
            onClick={() => updateProgress(0)}
          >
            Assembled
          </button>
          <label>
            <span className="sr-only">Assembly separation</span>
            <input
              ref={slider}
              disabled={!interactive}
              type="range"
              min="0"
              max="100"
              defaultValue="0"
              aria-label="Assembly separation"
              onChange={(event) =>
                updateProgress(Number(event.currentTarget.value) / 100)
              }
            />
          </label>
          <button
            type="button"
            disabled={!interactive}
            onClick={() => updateProgress(1)}
          >
            Exploded
          </button>
        </div>
        <p className="explorer-source-note">{project.source}</p>
      </div>
    </section>
  );
}
