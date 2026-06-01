"use client";

import { Activity, Cpu, Gauge, RadioTower } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const nodes = [
  {
    label: "Sensor Edge",
    value: "12-bit ADC",
    icon: Gauge,
    className: "left-[7%] top-[14%]",
  },
  {
    label: "Firmware Loop",
    value: "1 kHz tick",
    icon: Cpu,
    className: "right-[9%] top-[22%]",
  },
  {
    label: "Signal Bus",
    value: "I2C / UART",
    icon: RadioTower,
    className: "left-[13%] bottom-[28%]",
  },
  {
    label: "Runtime Health",
    value: "84 ms",
    icon: Activity,
    className: "right-[12%] bottom-[28%]",
  },
];

const traceRows = [
  "boot.init -> rails.stable",
  "sensor.read -> filter.apply",
  "firmware.loop -> output.sync",
  "telemetry.frame -> ui.update",
];

export function HeroScene() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="relative aspect-[4/3] min-h-[260px] overflow-hidden border border-[var(--color-border)] bg-[#080C11] md:min-h-[360px]">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(201,169,110,0.08),transparent_28%),radial-gradient(circle_at_74%_20%,rgba(119,182,255,0.16),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[length:44px_44px] opacity-45" />

      <div className="absolute left-8 top-8 right-8 flex items-center justify-between border-b border-[var(--color-border)] pb-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)]">
            System Runtime
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Hardware signals mapped to firmware behavior
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--color-blue-light)] shadow-[0_0_18px_rgba(119,182,255,0.7)]" />
          Live
        </div>
      </div>

      <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 border border-[rgba(201,169,110,0.42)] bg-[rgba(10,15,20,0.76)] shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
        <div className="flex h-full flex-col items-center justify-center">
          <Cpu className="text-[var(--color-gold)]" size={30} strokeWidth={1.6} />
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text)]">
            Control Core
          </p>
        </div>
      </div>

      <div className="absolute left-[17%] right-[17%] top-1/2 h-px bg-[var(--color-blue-light)] opacity-55" />
      <div className="absolute bottom-[23%] left-1/2 top-[23%] w-px -translate-x-1/2 bg-[var(--color-gold)] opacity-45" />
      <div
        className={`absolute left-[18%] top-1/2 h-1 w-16 -translate-y-1/2 bg-[var(--color-blue-light)] shadow-[0_0_24px_rgba(119,182,255,0.75)] ${
          reduced ? "" : "animate-[signal-sweep_2.8s_ease-in-out_infinite]"
        }`}
      />

      {nodes.map((node) => {
        const Icon = node.icon;
        return (
          <div
            key={node.label}
            className={`absolute ${node.className} w-[min(36%,180px)] border border-[var(--color-border)] bg-[rgba(19,26,35,0.68)] p-4 backdrop-blur-md`}
          >
            <div className="flex items-center gap-3">
              <Icon size={18} className="text-[var(--color-blue-light)]" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  {node.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
                  {node.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-7 left-8 right-8 grid gap-2 border-t border-[var(--color-border)] pt-4 font-mono text-[11px] text-[var(--color-muted)]">
        {traceRows.map((row, index) => (
          <div key={row} className="flex items-center gap-3">
            <span className="text-[var(--color-gold)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{row}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
