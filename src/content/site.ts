export const siteContent = {
  brand: {
    name: "Bora Girgin",
    mark: "BG.",
    tagline: "Embedded Systems & PCB Design",
    email: "hello@bgirgin.dev",
    copyright: "© Bora Girgin",
  },
  nav: [
    { label: "Signature", href: "#signature" },
    { label: "Work", href: "#work" },
    { label: "Process", href: "#process" },
    { label: "Capabilities", href: "#capabilities" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  hero: {
    title: "Embedded Systems\n& PCB Design",
    description:
      "Hardware, firmware and system-level engineering for reliable electronic products.",
    primaryCta: { label: "View Selected Work", href: "#work" },
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
  work: [
    {
      eyebrow: "01 Featured Project",
      name: "OS",
      summary:
        "C-based operating-system work focused on low-level structure, control flow and system behavior.",
      role: "Low-level C · Systems Programming",
      stack: "C · GNU GPL-3.0 · Main branch",
      outcome: "Active systems-level codebase",
      href: "https://github.com/BGirginn/OS",
    },
    {
      eyebrow: "02 System Build",
      name: "rasp_pi_webUI",
      summary:
        "Raspberry Pi web interface work connecting hardware-oriented operation with a browser-based control surface.",
      role: "Interface · Runtime Control · Deployment",
      stack: "JavaScript · Raspberry Pi · Web UI",
      outcome: "Remote device control layer",
      href: "https://github.com/BGirginn/rasp_pi_webUI",
    },
    {
      eyebrow: "03 Reliability Work",
      name: "NightLamp",
      summary:
        "C++ embedded-style project for controlled lighting behavior and compact device logic.",
      role: "Embedded Logic · C++ · Device Behavior",
      stack: "C++ · Control Logic · Hardware-facing code",
      outcome: "Small device firmware prototype",
      href: "https://github.com/BGirginn/NightLamp",
    },
  ],
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
    success: "Message sent.",
    error: "Something went wrong. Try again.",
  },
  footerLinks: [
    { label: "GitHub", href: "https://github.com/BGirginn" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Email", href: "mailto:hello@bgirgin.dev" },
    { label: "CV", href: "/cv.pdf" },
  ],
};

export type SiteContent = typeof siteContent;
