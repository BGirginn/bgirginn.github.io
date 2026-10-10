type Stage = { title: string; detail: string };

export function ProductArchitecture({
  name,
  stages,
  compact = false,
}: {
  name: string;
  stages: Stage[];
  compact?: boolean;
}) {
  return (
    <figure
      className={`product-architecture${compact ? " product-architecture-compact" : ""}`}
      aria-label={`${name} system architecture`}
    >
      <ol>
        {stages.map((stage, index) => (
          <li key={stage.title}>
            <span className="architecture-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <strong>{stage.title}</strong>
              <p>{stage.detail}</p>
            </div>
          </li>
        ))}
      </ol>
      <figcaption>
        {name} · Equipment interfaces → wireless nodes → central management
      </figcaption>
    </figure>
  );
}
