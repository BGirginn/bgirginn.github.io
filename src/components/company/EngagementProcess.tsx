import { business } from "@/content/business";

export function EngagementProcess() {
  return (
    <ol className="engagement-process">
      {business.engagementSteps.map((step, index) => (
        <li key={step.name}>
          <span className="company-index">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3>{step.name}</h3>
          <p>{step.detail}</p>
          <p className="engagement-output">
            <span>Output</span> {step.output}
          </p>
        </li>
      ))}
    </ol>
  );
}
