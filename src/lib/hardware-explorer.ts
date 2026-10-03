export type HardwareSubject = "robot" | "pcb";

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

export const hardwareSubjects = {
  robot: {
    number: "01",
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
    number: "02",
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
