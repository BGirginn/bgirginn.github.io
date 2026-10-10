import { statusLabels } from "@/content/business";

export function DevelopmentRoadmap({
  items,
}: {
  items: {
    name: string;
    status: "completed" | "development" | "planned";
    detail: string;
    evidence?: string;
  }[];
}) {
  return (
    <ol className="development-roadmap">
      {items.map((item) => (
        <li key={item.name}>
          <span className="status-tag">{statusLabels[item.status]}</span>
          <h3>{item.name}</h3>
          <p>{item.detail}</p>
          {item.evidence ? <a href={item.evidence}>View evidence ↗</a> : null}
        </li>
      ))}
    </ol>
  );
}
