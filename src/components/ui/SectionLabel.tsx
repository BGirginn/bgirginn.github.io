type SectionLabelProps = {
  children: string;
  number?: string;
};

export function SectionLabel({ children, number }: SectionLabelProps) {
  return (
    <p className="section-label">
      {number && <span className="section-index">{number}</span>}
      <span>{children}</span>
      <span className="section-label-line" aria-hidden="true" />
    </p>
  );
}
