import { useId } from "react";
import type { HardwareSubject } from "@/lib/hardware-explorer";

export function HardwareDrawing({
  subject = "robot",
}: {
  subject?: HardwareSubject;
}) {
  const id = useId().replace(/:/g, "");
  if (subject === "robot") {
    return (
      <img
        src="/models/covered-spider/outline.svg"
        className="hardware-drawing"
        width="800"
        height="580"
        alt="Covered spider: four-legged robot with original STL parts and eight SG90 servos"
      />
    );
  }
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
      aria-label="Technical illustration of a PCB assembly"
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
      </defs>
      <rect width="800" height="580" fill="none" />
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
