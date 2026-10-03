type ProjectDrawingProps = { kind: "system" | "interface" | "lighting" };

export function ProjectDrawing({ kind }: ProjectDrawingProps) {
  return (
    <svg
      className="project-drawing"
      viewBox="0 0 240 150"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="0.8">
        <path
          d="M8 24V8h16M216 8h16v16M232 126v16h-16M24 142H8v-16"
          opacity=".5"
        />
        {kind === "system" ? (
          <>
            <path d="M78 35h84v80H78zM87 44h66v62H87z" />
            {Array.from({ length: 6 }, (_, i) => (
              <path
                key={i}
                d={`M${94 + i * 10} 27v8m0 80v8M70 ${50 + i * 10}h8m84 0h8`}
              />
            ))}
            <path d="M21 54h33l16 16h17M153 83h28l15 15h23M120 123v10h52" />
            <rect x="21" y="44" width="28" height="20" />
            <rect x="193" y="86" width="26" height="24" />
            <path
              d="m100 65-9 9 9 9m40-18 9 9-9 9m-13-23-14 29"
              className="drawing-accent"
            />
          </>
        ) : kind === "interface" ? (
          <>
            <path d="M15 25h97v68H15zM15 40h97M52 93v13m-14 0h43M146 66h74v61h-74z" />
            <path d="M30 52h25v25H30zM66 52h30m-30 10h23m-23 10h30M159 78h22v22h-22zM190 79h17m-17 10h17m-17 10h17" />
            <path d="M112 64h16v31h18" className="drawing-accent" />
            <circle cx="128" cy="64" r="3" />
            <circle cx="146" cy="95" r="3" />
            <path d="M157 115h8m5 0h8m5 0h8m5 0h8M21 32h3m4 0h3m4 0h3" />
          </>
        ) : (
          <>
            <path d="M31 62h48v44H31zM39 70h32v28H39zM79 83h31V59h40M172 98v15h-30v-15" />
            <path d="M157 29c-20 0-31 14-31 30 0 18 16 24 16 39h30c0-15 16-21 16-39 0-16-11-30-31-30Z" />
            <path
              d="m145 53 12 16 12-16M157 69v28m-15 9h30m-28 7 5 8h16l5-8M157 13V4m-43 22-8-8m94 8 8-8M108 59h-10m108 0h10"
              className="drawing-accent"
            />
            <path d="M24 71h7m-7 10h7m-7 10h7M46 54v8m10-8v8m10-8v8M55 106v23h66" />
          </>
        )}
      </g>
    </svg>
  );
}

export function SystemDrawing() {
  return (
    <figure className="system-drawing">
      <svg
        viewBox="0 0 460 320"
        fill="none"
        role="img"
        aria-label="Hardware, firmware and validation connected as one engineering system"
      >
        <g stroke="currentColor" strokeWidth="0.8">
          <circle
            cx="230"
            cy="160"
            r="98"
            strokeDasharray="2 7"
            opacity=".45"
          />
          <circle cx="230" cy="160" r="79" opacity=".35" />
          <path
            d="M230 61a99 99 0 0 1 94 68M230 259a99 99 0 0 1-94-68"
            className="drawing-accent"
            strokeWidth="2"
          />
          <path d="m230 107 46 26v54l-46 26-46-26v-54Z" />
          <path d="m230 117 37 21v44l-37 21-37-21v-44Z" opacity=".45" />
          <path d="M184 160h-59l-32-45H27M276 160h59l32-45h66M230 213v61" />
          <circle cx="125" cy="160" r="3" />
          <circle cx="335" cy="160" r="3" />
          <circle cx="230" cy="274" r="3" />
          <path
            d="M27 109v12m406-12v12M210 281h40M230 8v18m-9-9h18M17 153v14m-7-7h14M443 153v14m-7-7h14"
            opacity=".5"
          />
        </g>
        <g
          fill="currentColor"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          letterSpacing="1.5"
        >
          <text x="230" y="164" textAnchor="middle">
            SYSTEM
          </text>
          <text x="27" y="99">
            HARDWARE
          </text>
          <text x="433" y="99" textAnchor="end">
            FIRMWARE
          </text>
          <text x="230" y="307" textAnchor="middle">
            VALIDATION
          </text>
        </g>
      </svg>
      <figcaption className="technical-caption">
        Circuit → code → measured behavior
      </figcaption>
    </figure>
  );
}
