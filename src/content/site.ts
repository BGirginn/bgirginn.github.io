import { business, publicEmail, verifiedProfiles } from "./business";

const contactEmail = publicEmail;

export const siteContent = {
  brand: {
    name: business.displayName,
    mark: "BG.",
    tagline: "Hardware · Embedded systems · Robotics",
    email: contactEmail,
    copyright: `© ${business.displayName}`,
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services/" },
    { label: "Products", href: "/products/" },
    { label: "Projects", href: "/projects/" },
    { label: "Company", href: "/about/" },
    { label: "Contact", href: "/contact/" },
  ],
  sectionNav: [
    { label: "Hardware", href: "#signature" },
    { label: "Work", href: "#work" },
    { label: "Process", href: "#process" },
    { label: "Capabilities", href: "#capabilities" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  hero: {
    title: "LoRa.\nHardware.\nEmbedded.",
    description: business.venture.context,
    primaryCta: {
      label: "Explore Industrial LoRa",
      href: "/products/industrial-lora/",
    },
    secondaryCta: { label: "Get In Touch", href: "#contact" },
  },
  signature: {
    title: "Hardware, firmware and system behavior visualized as one system.",
    description:
      "A PCB is not an isolated board. Power integrity, signal routing, firmware interfaces and testing decisions move together.",
    layers: ["Top Layer", "Inner Layer 1", "Inner Layer 2", "Bottom Layer"],
    labels: [
      "Power Integrity",
      "Signal Routing",
      "Firmware Interfaces",
      "Testing",
    ],
    flow: ["MCU", "Sensor", "Communication", "Output"],
  },
  work: business.projects,
  process: [
    "Requirements",
    "Architecture",
    "Schematic",
    "PCB Layout",
    "Firmware",
    "Prototype",
    "Testing",
    "Iteration",
  ],
  capabilities: [
    {
      title: "Embedded Firmware",
      items: ["C/C++", "RTOS", "Drivers", "Peripheral control", "Bring-up"],
    },
    {
      title: "PCB Design",
      items: ["Schematic", "Multi-layer layout", "Power paths", "Routing"],
    },
    {
      title: "Communication",
      items: ["CAN", "UART", "SPI", "I2C", "Sensor interfaces"],
    },
    {
      title: "Testing",
      items: ["Prototype validation", "Debugging", "Signal checks", "Reports"],
    },
    {
      title: "Tools",
      items: ["KiCad", "STM32", "FreeRTOS", "Oscilloscope", "Logic analyzer"],
    },
  ],
  about: {
    title: "System thinking before surface decisions.",
    paragraphs: [
      "I work across hardware, firmware and integration details so electronic products behave predictably outside the design file.",
      "The focus is practical engineering: requirements, architecture, PCB layout, firmware interfaces, prototype bring-up and testing.",
      "Every decision should reduce risk, improve reliability and make the next validation step clearer.",
    ],
  },
  contact: {
    title: "Let's build reliable electronic systems.",
    description:
      "Send a concise note about the product, board, firmware or review you need.",
    success:
      "Email draft requested. If your email app opened, review and send it there. Delivery is not confirmed.",
    error: `Something went wrong. Email ${contactEmail} directly.`,
  },
  footerLinks: [
    ...verifiedProfiles.map((profile) => ({
      label: profile.label,
      href: profile.value,
    })),
    { label: "Email", href: `mailto:${contactEmail}` },
    { label: "CV", href: "/cv.pdf" },
    { label: "Resources", href: "/resources/" },
    { label: "Privacy", href: "/privacy/" },
  ],
};

export type SiteContent = typeof siteContent;
