"use client";

import { Activity, Cpu, RadioTower, Zap } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const metrics = [
  { label: "ADC", value: "12 bit", icon: Activity },
  { label: "Loop", value: "1 kHz", icon: Cpu },
  { label: "Bus", value: "I2C", icon: RadioTower },
  { label: "Rail", value: "3.3 V", icon: Zap },
];

const traces = [
  { id: "trace-a", d: "M116 188 H318 C360 188 366 244 410 244 H520" },
  { id: "trace-b", d: "M1076 182 H820 C770 182 760 244 704 244 H610" },
  { id: "trace-c", d: "M168 494 H368 C420 494 430 420 520 420" },
  { id: "trace-d", d: "M1042 498 H842 C786 498 776 420 610 420" },
  { id: "trace-e", d: "M565 126 V204" },
  { id: "trace-f", d: "M565 548 V468" },
];

export function HeroScene() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="relative min-h-[360px] w-full max-w-full overflow-hidden border border-[rgba(201,169,110,0.2)] bg-[#080C11] shadow-[0_30px_110px_rgba(0,0,0,0.28)] md:aspect-[4/3] md:min-h-[390px]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(201,169,110,0.08),transparent_28%),linear-gradient(215deg,rgba(119,182,255,0.13),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.024)_1px,transparent_1px)] bg-[length:42px_42px] opacity-50" />

      <div className="absolute left-5 right-5 top-5 z-10 flex items-start justify-between gap-4 border-b border-[var(--color-border)] pb-4 md:left-8 md:right-8 md:top-8">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)]">
            Signal Board
          </p>
          <p className="mt-1 max-w-[24ch] text-sm leading-5 text-[var(--color-muted)] md:max-w-none">
            Power, sensing and firmware timing on one board
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
          <span
            className={`h-2 w-2 rounded-full bg-[var(--color-blue-light)] shadow-[0_0_18px_rgba(119,182,255,0.85)] ${
              reduced ? "" : "animate-[status-blink_1.6s_ease-in-out_infinite]"
            }`}
          />
          Live
        </div>
      </div>

      <svg
        className="absolute inset-x-0 top-[16%] h-[76%] w-full overflow-hidden"
        viewBox="0 0 1160 640"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="blueTrace" x1="0" x2="1" y1="0" y2="0">
            <stop stopColor="#77B6FF" stopOpacity="0.16" />
            <stop offset="0.5" stopColor="#77B6FF" stopOpacity="0.88" />
            <stop offset="1" stopColor="#77B6FF" stopOpacity="0.22" />
          </linearGradient>
          <linearGradient id="goldTrace" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#C9A96E" stopOpacity="0.18" />
            <stop offset="0.55" stopColor="#E3C48A" stopOpacity="0.9" />
            <stop offset="1" stopColor="#C9A96E" stopOpacity="0.18" />
          </linearGradient>
          <filter id="traceGlow">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect
          x="156"
          y="118"
          width="848"
          height="398"
          fill="rgba(10,15,20,0.5)"
          stroke="rgba(255,255,255,0.08)"
        />
        <path
          d="M246 318 H914 M580 128 V510"
          stroke="rgba(201,169,110,0.3)"
          strokeWidth="1.5"
        />

        {traces.map((trace, index) => (
          <path
            key={trace.id}
            id={trace.id}
            d={trace.d}
            fill="none"
            stroke={index % 2 === 0 ? "url(#blueTrace)" : "url(#goldTrace)"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={index > 3 ? 3 : 4}
            filter="url(#traceGlow)"
            className={reduced ? "" : "hero-trace-flow"}
            style={{ animationDelay: `${index * 0.26}s` }}
          />
        ))}

        {[
          [116, 188],
          [1076, 182],
          [168, 494],
          [1042, 498],
          [565, 126],
          [565, 548],
        ].map(([cx, cy], index) => (
          <g key={`${cx}-${cy}`}>
            <circle
              cx={cx}
              cy={cy}
              r="19"
              fill="rgba(10,15,20,0.92)"
              stroke={index % 2 === 0 ? "#77B6FF" : "#C9A96E"}
              strokeOpacity="0.78"
            />
            <circle
              cx={cx}
              cy={cy}
              r="4"
              fill={index % 2 === 0 ? "#77B6FF" : "#E3C48A"}
            />
          </g>
        ))}

        {!reduced
          ? traces.map((trace, index) => {
              const duration = `${3.4 + index * 0.24}s`;
              const delay = `${index * 0.38}s`;

              return (
                <circle
                  key={`${trace.id}-packet`}
                  r={index > 3 ? 5 : 7}
                  fill={index % 2 === 0 ? "#77B6FF" : "#E3C48A"}
                  filter="url(#traceGlow)"
                  opacity="0"
                >
                  <animate
                    attributeName="opacity"
                    dur={duration}
                    begin={delay}
                    values="0;1;1;0"
                    keyTimes="0;0.12;0.86;1"
                    repeatCount="indefinite"
                  />
                  <animateMotion
                    dur={duration}
                    begin={delay}
                    repeatCount="indefinite"
                    rotate="auto"
                  >
                    <mpath href={`#${trace.id}`} />
                  </animateMotion>
                </circle>
              );
            })
          : null}
      </svg>

      <div className="absolute left-1/2 top-[48%] z-10 h-[100px] w-[100px] -translate-x-1/2 -translate-y-1/2 border border-[rgba(201,169,110,0.55)] bg-[rgba(8,12,17,0.9)] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_24px_80px_rgba(0,0,0,0.44)] md:top-[50%] md:h-[138px] md:w-[138px]">
        <div className="absolute -left-2 top-4 grid gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index} className="h-2 w-2 bg-[var(--color-gold)]" />
          ))}
        </div>
        <div className="absolute -right-2 top-4 grid gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index} className="h-2 w-2 bg-[var(--color-gold)]" />
          ))}
        </div>
        <div className="absolute left-4 top-[-8px] flex gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index} className="h-2 w-2 bg-[var(--color-gold)]" />
          ))}
        </div>
        <div className="absolute bottom-[-8px] left-4 flex gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index} className="h-2 w-2 bg-[var(--color-gold)]" />
          ))}
        </div>
        <div className="flex h-full flex-col items-center justify-center">
          <Cpu
            className={`text-[var(--color-gold)] ${
              reduced ? "" : "animate-[core-breathe_2.8s_ease-in-out_infinite]"
            }`}
            size={34}
            strokeWidth={1.5}
          />
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text)]">
            MCU Core
          </p>
          <p className="mt-1 hidden text-[10px] text-[var(--color-muted)] md:block">
            STM32 bus map
          </p>
        </div>
      </div>

      <div className="absolute bottom-6 left-5 right-5 z-10 grid grid-cols-2 gap-2 md:bottom-8 md:left-8 md:right-8 md:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="border-t border-[var(--color-border)] pt-3"
              style={{ opacity: 0.72 + index * 0.06 }}
            >
              <div className="flex items-center gap-2 text-[var(--color-blue-light)]">
                <Icon size={15} strokeWidth={1.7} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  {metric.label}
                </span>
              </div>
              <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                {metric.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
