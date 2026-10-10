import { About } from "@/components/sections/About";
import { Capabilities } from "@/components/sections/Capabilities";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { ProgressIndicator } from "@/components/sections/ProgressIndicator";
import { Signature } from "@/components/sections/Signature";
import { Work } from "@/components/sections/Work";
import { SiteMotion } from "@/components/ui/SiteMotion";

import { ServiceOverview } from "@/components/company/ServiceOverview";
import { ProductShowcase } from "@/components/company/ProductShowcase";
import { VenturePreview } from "@/components/sections/VenturePreview";

export default function Home() {
  return (
    <>
      <Header />
      <SiteMotion />
      <ProgressIndicator />
      <main id="main-content">
        <Hero />
        <ProductShowcase />
        <ServiceOverview />
        <Signature />
        <Work />
        <VenturePreview />
        <Process />
        <Capabilities />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
