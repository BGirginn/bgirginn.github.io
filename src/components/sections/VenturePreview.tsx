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
              Explore our produced Industrial LoRa product and follow Quadropod
              R&D towards image processing and Claude-assisted edge/server
              decision-making.
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
