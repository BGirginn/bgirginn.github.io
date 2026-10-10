export function PlatformArchitecture() {
  const stages = [
    { title: "Device", detail: "Raspberry Pi / peripherals" },
    { title: "Agent", detail: "Host telemetry / Unix RPC" },
    { title: "Platform", detail: "FastAPI / SQLite / SSE" },
    { title: "Interface", detail: "React / browser controls" },
  ];

  return (
    <figure
      className="platform-architecture"
      aria-label="Pi Control Panel technical architecture"
    >
      <ol className="platform-stage-list">
        {stages.map((stage, index) => (
          <li key={stage.title}>
            <span className="architecture-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <strong className="architecture-title">{stage.title}</strong>
            <p className="architecture-detail">{stage.detail}</p>
          </li>
        ))}
      </ol>
      <figcaption>
        Pi Control Panel · Architecture from the public source repository
      </figcaption>
    </figure>
  );
}
