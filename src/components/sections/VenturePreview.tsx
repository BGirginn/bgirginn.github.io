import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function VenturePreview() {
  return (
    <section className="venture-preview" aria-labelledby="venture-heading">
      <Container>
        <div className="venture-preview-inner">
          <div>
            <p className="engineering-eyebrow">Engineering approach</p>
            <h2 id="venture-heading">
              Circuit, code and mechanical design. One workflow.
            </h2>
            <p>
              Explore the completed Industrial LoRa Platform and follow
              Quadropod towards embedded control, physical validation and
              integration.
            </p>
          </div>
          <Button href="/venture/" variant="secondary">
            Our approach
          </Button>
        </div>
      </Container>
    </section>
  );
}
