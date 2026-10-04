export type HardwareSubject = "robot" | "pcb" | "quadropod";

export type HardwareAppearance = "line" | "solid";

export type AssemblyMotion = {
  progress: number;
  invalidate: (() => void) | null;
};

export function getAssemblySeparation(progress: number): number {
  const value = Math.min(1, Math.max(0, progress));
  return value * value * (3 - 2 * value);
}

export const assemblyStages = [
  {
    start: 0,
    label: "Complete assembly",
    detail: "Six articulated legs around a central enclosure.",
  },
  {
    start: 0.04,
    label: "Synchronized separation",
    detail:
      "Enclosure, electronics and all six leg mechanisms expand together.",
  },
  {
    start: 0.96,
    label: "Full assembly breakdown",
    detail:
      "Every modeled assembly is exposed. Continue scrolling to the next project.",
  },
] as const;

export const quadropodStages = [
  { start: 0, label: "Quadropod V0 leg assembly", detail: "Original FreeCAD geometry: articulated links, servo references and removable covers." },
  { start: 0.04, label: "Inspect beneath the covers", detail: "The femur and tibia covers move aside to reveal the leg structure." },
  { start: 0.96, label: "Open mechanical assembly", detail: "Cover separation is a viewing aid, not the physical removal path. Physical fit and load capacity remain unverified." },
] as const;

export const hardwareSubjects = {
  quadropod: {
    number: "01",
    name: "Quadropod V0",
    category: "Mechanical design / FreeCAD",
    description: "A single articulated leg prototype with removable femur and tibia covers.",
    source: "Original FreeCAD leg assembly, not a complete robot. Servos and fasteners are nominal CAD references. Physical fit and load capacity are unverified.",
    parts: [
      { name: "Links", detail: "Parametric femur and tibia geometry." },
      { name: "Covers", detail: "Separate removable covers with M2 fasteners." },
      { name: "References", detail: "Nominal SG90 servos and connection hardware." },
    ],
  },
  robot: {
    number: "02",
    name: "Hexapod robot",
    category: "Robotics / embedded systems",
    description:
      "Six articulated legs around a compact central enclosure. Explore how the mechanical assembly opens up around its electronics.",
    source:
      "Photo-based reconstruction. Geometry and internal electronics are illustrative.",
    parts: [
      {
        name: "Enclosure",
        detail: "A removable cover separates the body from the electronics.",
      },
      {
        name: "Actuation",
        detail: "Repeated servo and linkage assemblies form the six legs.",
      },
      {
        name: "Control electronics",
        detail:
          "The internal board is an illustrative layout, not the robot's actual circuit.",
      },
    ],
  },
  pcb: {
    number: "03",
    name: "PCB assembly",
    category: "Electronics / KiCad",
    description:
      "A real KiCad export with through-hole components, connectors and a board. Separate the component assembly from the substrate to inspect the construction.",
    source:
      "Actual KiCad GLB export. The separation is a presentation effect, not a copper stack-up.",
    parts: [
      {
        name: "Components",
        detail:
          "The original resistor, LED and connector geometry from the KiCad export.",
      },
      {
        name: "Board",
        detail:
          "The original PCB substrate and board geometry, preserved from the source model.",
      },
      {
        name: "Assembly",
        detail:
          "Inspect the component placement in an assembled or separated view.",
      },
    ],
  },

} as const;
