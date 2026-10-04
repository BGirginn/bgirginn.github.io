"use client";

export function HardwareHud({ reduced }: { reduced: boolean }) {
  return (
    <div
      className={`hardware-hud ${reduced ? "is-static" : ""}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1000 700"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <g className="hardware-hud-frame">
          <path d="M56 160V134H82 M918 134H944V160 M56 590V616H82 M918 616H944V590" />
          <path d="M480 70H520 M500 60V80 M480 630H520 M500 620V640" />
          <path d="M48 340V360 M38 350H58 M952 340V360 M942 350H962" />
        </g>
        <g transform="translate(500 350)">
          <g className="hardware-hud-orbits">
            <circle
              className="hardware-hud-dial"
              r="278"
              pathLength="100"
              strokeDasharray="14 12 6 18 10 40"
            />
            <circle
              className="hardware-hud-counterdial"
              r="295"
              pathLength="100"
              strokeDasharray="4 21 4 21 4 21 4 21"
            />
            <circle
              className="hardware-hud-ticks"
              r="307"
              pathLength="120"
              strokeDasharray="0.12 1.88"
            />
            <path
              className="hardware-hud-accent"
              d="M-295 0h-12 M295 0h12 M0-295v-12 M0 295v12"
            />
          </g>
        </g>
        <g className="hardware-hud-dots">
          <circle cx="56" cy="134" r="2" />
          <circle cx="944" cy="616" r="2" />
        </g>
      </svg>
      <div className="hardware-hud-scan" />
      <div className="hardware-hud-labels">
        <span>
          SYSTEM ASSEMBLY <i /> SYNCHRONIZED
        </span>
        <span>DRAG / ORBIT</span>
      </div>
    </div>
  );
}
