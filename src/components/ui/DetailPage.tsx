import type { ReactNode } from "react";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { Container } from "./Container";

export function DetailPage({
  eyebrow,
  title,
  introduction,
  children,
}: {
  eyebrow: string;
  title: string;
  introduction: string;
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main-content" className="detail-page">
        <Container>
          <div className="detail-intro">
            <p className="engineering-eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{introduction}</p>
          </div>
          {children}
        </Container>
      </main>
      <Footer expanded />
    </>
  );
}
