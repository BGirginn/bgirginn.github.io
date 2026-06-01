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

export default function Home() {
  return (
    <>
      <Header />
      <ProgressIndicator />
      <main>
        <Hero />
        <Signature />
        <Work />
        <Process />
        <Capabilities />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
