"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { siteContent } from "@/content/site";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { ScrollTrigger } from "@/lib/gsap";

const layerData = [
  { label: "Top Layer", color: "var(--color-gold)", accent: "#C9A96E" },
  {
    label: "Inner Layer 1",
    color: "var(--color-blue-light)",
    accent: "#77B6FF",
  },
  {
    label: "Inner Layer 2",
    color: "var(--color-blue-light)",
    accent: "#77B6FF",
  },
  { label: "Bottom Layer", color: "var(--color-gold)", accent: "#C9A96E" },
];

const layerSizeClass =
  "h-[clamp(120px,14vh,164px)] w-[min(40vw,720px)]";
const compactLayerSizeClass =
  "h-[clamp(118px,15vh,168px)] w-[min(42vw,620px)]";

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function getLayerOffset(index: number, progress: number, compact = false) {
  const separation = clamp((progress - 0.14) / 0.5);
  return {
    x: compact ? -20 + index * -10 : 20 + index * -6,
    y: compact
      ? -138 + index * 72 + (index - 1.5) * separation * 42
      : -146 + index * 72 + (index - 1.5) * separation * 40,
  };
}

function layerTransform(index: number, progress: number, compact = false) {
  const approach = clamp(progress / 0.34);
  const { x, y } = getLayerOffset(index, progress, compact);
  const scale = compact ? 0.92 + approach * 0.12 : 0.94 + approach * 0.08;
  const perspective = compact ? 900 : 1040;
  const rotateX = compact ? 58 : 57;
  const rotateZ = compact ? -1.5 : -1.2;

  return `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) perspective(${perspective}px) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
}

function layerLabelTransform(index: number, progress: number) {
  const { x, y } = getLayerOffset(index, progress);
  return `translate3d(calc(-50% + ${x}px + min(23vw, 420px)), calc(-50% + ${y}px), 0)`;
}

function SignalTrace({
  progress,
  compact = false,
}: {
  progress: number;
  compact?: boolean;
}) {
  const signal = clamp((progress - 0.46) / 0.24);

  return (
    <div
      className={`pointer-events-none absolute z-[4] bg-[var(--color-blue-light)] ${
        compact
          ? "left-[48%] top-[49%] h-px shadow-[0_0_24px_rgba(119,182,255,0.78)]"
          : "left-[70%] top-[38%] h-[2px] shadow-[0_0_18px_rgba(119,182,255,0.62)]"
      }`}
      style={{
        opacity: signal,
        width: compact ? `${8 + signal * 25}vw` : `${8 + signal * 22}vw`,
        transform: compact
          ? "translate3d(-50%, -50%, 0) perspective(900px) rotateX(58deg) rotateZ(-1.5deg)"
          : "translate3d(-50%, -50%, 0) perspective(1040px) rotateX(57deg) rotateZ(-1.2deg)",
      }}
    />
  );
}

function CssLayer({
  index,
  progress,
  compact = false,
}: {
  index: number;
  progress: number;
  compact?: boolean;
}) {
  const layer = layerData[index];
  const isTopLayer = index === 0;
  const detail = clamp(progress / 0.34);

  return (
    <>
      <div
        data-signature-layer={index}
        className={`absolute border bg-[rgba(11,19,25,0.66)] shadow-[0_18px_54px_rgba(0,0,0,0.24)] [contain:paint] ${
          compact
            ? `left-1/2 top-1/2 ${compactLayerSizeClass}`
            : `left-[70%] top-[38%] ${layerSizeClass}`
        }`}
        style={{
          zIndex: 10 - index,
          borderColor: layer.color,
          opacity: isTopLayer ? 0.94 : 0.48 + detail * 0.18,
          transform: layerTransform(index, progress, compact),
          transformOrigin: "50% 50%",
          backfaceVisibility: "hidden",
        }}
      >
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="absolute left-[8%] top-[30%] h-[2px] w-[22%] bg-current text-[var(--color-blue-light)]" />
        <div className="absolute right-[10%] top-[58%] h-[2px] w-[30%] bg-current text-[var(--color-gold)]" />
        <div className="absolute left-[32%] top-[54%] h-[2px] w-[16%] bg-current text-[var(--color-blue-light)]" />
        <div className="absolute left-[14%] top-[70%] h-px w-[18%] bg-[rgba(119,182,255,0.72)]" />
        <div className="absolute right-[18%] top-[28%] h-px w-[20%] bg-[rgba(201,169,110,0.7)]" />
        <span
          className="absolute left-[18%] top-[22%] h-2.5 w-2.5 rounded-full"
          style={{ background: layer.accent, color: layer.accent }}
        />
        <span
          className="absolute right-[21%] top-[35%] h-2.5 w-2.5 rounded-full"
          style={{ background: layer.accent, color: layer.accent }}
        />

        {isTopLayer ? (
          <div className="absolute left-[46%] top-[34%] h-[18%] w-[11%] border border-[rgba(201,169,110,0.62)] bg-[rgba(119,182,255,0.16)] shadow-[0_0_28px_rgba(119,182,255,0.24)]" />
        ) : null}
      </div>

      {!compact ? (
        <span
          className="absolute left-[70%] top-[38%] whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.12em]"
          style={{
            zIndex: 20,
            color: layer.accent,
            opacity: isTopLayer ? 0.94 : 0.52 + detail * 0.22,
            transform: layerLabelTransform(index, progress),
          }}
        >
          {layer.label}
        </span>
      ) : null}
    </>
  );
}

function LayerStack({
  progress,
  compact = false,
}: {
  progress: number;
  compact?: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_38%,rgba(119,182,255,0.12),transparent_28rem)]" />
      {layerData.map((layer, index) => (
        <CssLayer
          key={layer.label}
          index={index}
          progress={progress}
          compact={compact}
        />
      ))}
      <SignalTrace progress={progress} compact={compact} />
    </div>
  );
}

export function DesktopSignatureScene() {
  const sceneRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (!sceneRef.current) return;

      if (reduced) {
        setProgress(1);
        return;
      }

      const desktopQuery = window.matchMedia("(min-width: 1024px)");
      if (!desktopQuery.matches) {
        setProgress(0);
        return;
      }

      const trigger = ScrollTrigger.create({
        trigger: sceneRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.75,
        invalidateOnRefresh: true,
        onUpdate: (self) => setProgress(self.progress),
      });

      return () => trigger.kill();
    },
    { scope: sceneRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sceneRef}
      id="signature"
      data-scroll-lock
      className={`relative hidden bg-[#080C11] lg:block ${
        reduced ? "min-h-screen" : "min-h-[190vh]"
      }`}
      aria-label="PCB layer separation and signal flow"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[#080C11]" />
        <LayerStack progress={progress} />

        <div className="container-grid relative z-10 flex h-screen items-end pb-[clamp(3rem,8vh,6rem)] pt-[var(--header-height)]">
          <div className="grid w-full grid-cols-12 gap-8">
            <div className="col-span-5">
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-gold)]">
                Signature System View
              </p>
              <h2 className="max-w-[11ch] text-[clamp(34px,3.8vw,60px)] font-semibold leading-[1]">
                {siteContent.signature.title}
              </h2>
              <p className="mt-5 max-w-xl text-[clamp(16px,1.15vw,18px)] leading-8 text-[var(--color-muted)]">
                {siteContent.signature.description}
              </p>
            </div>
            <div className="col-span-4 col-start-9 self-end">
              <div className="space-y-3">
                {siteContent.signature.labels.map((label, index) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 text-sm text-[var(--color-muted)]"
                    style={{
                      opacity: progress > 0.72 ? 1 : 0.18 + index * 0.08,
                    }}
                  >
                    <span className="h-px w-10 bg-[var(--color-gold)]" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MobileSignatureScene() {
  return (
    <section className="section-shell lg:hidden" aria-label="PCB system view">
      <div className="container-grid">
        <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-gold)]">
          Signature System View
        </p>
        <div className="relative aspect-[4/3] overflow-hidden border border-[var(--color-border)] bg-[#080C11]">
          <div className="absolute inset-0 scale-75">
            <LayerStack progress={0.72} compact />
          </div>
        </div>
        <h2 className="mt-10 text-[clamp(32px,10vw,52px)] font-semibold leading-tight">
          {siteContent.signature.title}
        </h2>
        <p className="mt-5 text-lg leading-8 text-[var(--color-muted)]">
          {siteContent.signature.description}
        </p>
        <div className="mt-8 grid gap-3">
          {siteContent.signature.labels.map((label) => (
            <div
              key={label}
              className="border-l border-[var(--color-gold)] bg-[rgba(255,255,255,0.025)] px-4 py-3 text-sm text-[var(--color-muted)]"
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
