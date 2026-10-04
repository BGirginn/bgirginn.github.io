import { useId } from "react";
import type { HardwareSubject } from "@/lib/hardware-explorer";

export function HardwareDrawing({
  subject = "robot",
}: {
  subject?: HardwareSubject;
}) {
  const id = useId().replace(/:/g, "");
  if (subject === "quadropod") {
    return (
      <img
        src="/models/quadropod.svg"
        className="hardware-drawing"
        width="800"
        height="580"
        alt="Original FreeCAD geometry of the Quadropod V0 leg with removable covers"
      />
    );
  }
  return (
    <svg
      viewBox="0 0 800 580"
      className="hardware-drawing"
      style={{ color: "#83bdb8" }}
      role="img"
      aria-label={
        subject === "robot"
          ? "Technical illustration of a six-legged robot"
          : "Technical illustration of a PCB assembly"
      }
    >
      <defs>
        <pattern
          id={`${id}-grid`}
          width="36"
          height="36"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M36 0H0V36"
            fill="none"
            stroke="currentColor"
            strokeOpacity=".1"
          />
        </pattern>
        <g
          id={`${id}-leg`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        >
          <path d="M0 0L55 -12L96 18L80 48L34 30Z" />
          <path d="M75 8L116 -4L145 56L120 90L88 47Z" />
          <path d="M124 60L150 70L196 156L177 151L126 107Z" />
          <rect x="53" y="0" width="34" height="44" rx="4" fill="none" />
          <circle cx="70" cy="19" r="11" />
          <circle cx="70" cy="19" r="3" />
          <circle cx="117" cy="41" r="12" />
          <circle cx="117" cy="41" r="3" />
          <path
            d="M30 11L58 -2M96 23L122 10"
            fill="none"
            stroke="currentColor"
          />
        </g>
      </defs>
      <rect width="800" height="580" fill="none" />
      {subject === "robot" ? (
        <g transform="translate(405 280) scale(1 .74)">
          <ellipse
            cy="50"
            rx="275"
            ry="194"
            fill="none"
            stroke="currentColor"
            strokeOpacity=".2"
            strokeDasharray="4 8"
          />
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <use
              key={angle}
              href={`#${id}-leg`}
              transform={`rotate(${angle}) translate(102 0)`}
            />
          ))}
          <path
            d="M-126 -55L-5 -118L120 -58L120 58L0 120L-126 56Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M-126 -55L-126 -84L-5 -147L120 -86L120 -58M-126 -84L-5 -20L120 -86M-5 -20V9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M-100 -52L0 -106L98 -52L98 41L0 93L-100 40Z"
            fill="none"
            stroke="currentColor"
            strokeOpacity=".5"
          />
          <path d="M0 -146V-235" stroke="currentColor" strokeWidth="5" />
          <circle cy="-235" r="4" fill="none" />
          <path
            d="M-75 7L-33 -15H38L74 7V37L28 57H-38L-75 37Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </g>
      ) : (
        <g
          transform="translate(380 320) rotate(-25) skewX(25)"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="-220" y="-115" width="440" height="230" rx="8" fill="none" />
          <rect x="-220" y="-121" width="440" height="230" rx="8" fill="none" />
          {Array.from({ length: 5 }, (_, row) =>
            Array.from({ length: 7 }, (_, column) => (
              <g
                key={`${row}-${column}`}
                transform={`translate(${-175 + column * 53} ${-78 + row * 38})`}
              >
                <path d="M-16 0H16" />
                <rect x="-9" y="-5" width="18" height="10" rx="3" fill="none" />
              </g>
            )),
          )}
          <path
            d="M-205 84H180V-100M-185 70H164V-83"
            stroke="currentColor"
            fill="none"
          />
          {[-190, 190].map((x) =>
            [-92, 86].map((y) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="none" />
            )),
          )}
        </g>
      )}
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity=".6">
        <path d="M82 456H715M82 446V466M715 446V466M65 114V430M55 114H75M55 430H75" />
      </g>
      <g fill="#73968f" fontFamily="monospace" fontSize="10" letterSpacing="2">
        <text x="88" y="483">
          ISOMETRIC / REFERENCE VIEW
        </text>
        <text x="580" y="483">
          NOT TO SCALE
        </text>
      </g>
    </svg>
  );
}
