import { z } from "zod";
import configuration from "./business.json";

const factFields = {
  value: z.string(),
  status: z.enum(["verified", "planned", "needs_verification"]),
  evidence: z.string(),
};
const hasVerifiedEvidence = (fact: {
  value: string;
  status: string;
  evidence: string;
}) =>
  fact.status !== "verified" || (!!fact.value.trim() && !!fact.evidence.trim());

const factSchema = z.object(factFields).refine(hasVerifiedEvidence, {
  message: "Verified facts require a value and evidence.",
});
const link = z.string().refine((value) => {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}, "Evidence links must be local paths or HTTPS URLs.");
const milestone = z.object({
  name: z.string().min(1),
  status: z.enum(["completed", "development", "planned"]),
  detail: z.string().min(1),
  evidence: link.or(z.literal("")).optional(),
});
const developmentStatus = z.enum([
  "completed",
  "development",
  "prototype",
  "planned",
]);
export const businessSchema = z
  .object({
    displayName: z.string().min(1),
    primaryProductId: z.string().min(1),
    featuredProductIds: z.array(z.string().min(1)).min(1),
    websiteUrl: z.string().url().startsWith("https://"),
    legalEntityName: factSchema,
    legalRegistrationStatus: factSchema,
    foundingDate: factSchema,
    publicContactEmail: factSchema.refine(
      (fact) =>
        fact.status === "verified" &&
        z.string().email().safeParse(fact.value).success,
      "A verified public contact is required.",
    ),
    domainContactEmail: factSchema.refine(
      (fact) =>
        fact.status !== "verified" ||
        z.string().email().safeParse(fact.value).success,
      "Invalid domain email.",
    ),
    ventureContactEmail: factSchema.refine(
      (fact) =>
        fact.status === "verified" &&
        z.string().email().safeParse(fact.value).success,
      "A verified venture email is required.",
    ),
    founder: z.object({
      name: z.string().min(1),
      role: z.string(),
      ventureFounderRole: factSchema,
      background: factSchema,
      education: factSchema,
      experience: factSchema,
    }),
    socialProfiles: z.array(
      z
        .object({ ...factFields, label: z.string() })
        .refine(hasVerifiedEvidence, {
          message: "Verified profiles require evidence.",
        })
        .refine(
          (fact) =>
            fact.status !== "verified" ||
            (fact.value.startsWith("https://") &&
              link.safeParse(fact.value).success),
        ),
    ),
    venture: z.object({
      name: factSchema,
      mission: factSchema,
      problem: factSchema,
      solution: factSchema,
      intendedCustomers: factSchema,
      stage: z.string(),
      context: z.string(),
    }),
    company: z.object({
      headline: z.string().min(1),
      description: z.string().min(1),
      principles: z
        .array(
          z.object({ title: z.string().min(1), detail: z.string().min(1) }),
        )
        .min(1),
      registeredAddress: factSchema,
      phone: factSchema,
    }),
    services: z
      .array(
        z.object({
          id: z.string().regex(/^[a-z][a-z0-9-]*$/),
          name: z.string().min(1),
          summary: z.string().min(1),
          scope: z.array(z.string().min(1)).min(1),
          deliverables: z.array(z.string().min(1)).min(1),
          evidence: z.object({ label: z.string().min(1), href: link }),
        }),
      )
      .min(1),
    engagementSteps: z
      .array(
        z.object({
          name: z.string().min(1),
          detail: z.string().min(1),
          output: z.string().min(1),
        }),
      )
      .min(1),
    inquiryChecklist: z.array(z.string().min(1)).min(1),
    faq: z
      .array(
        z.object({ question: z.string().min(1), answer: z.string().min(1) }),
      )
      .min(1),
    resources: z
      .array(
        z.object({
          title: z.string().min(1),
          description: z.string().min(1),
          href: link,
          kind: z.string().min(1),
        }),
      )
      .min(1),
    milestones: z.array(milestone),
    claude: z.object({
      status: z.enum(["planned", "prototype", "integrated"]),
      description: z.string(),
      evidence: z.array(link),
      useCases: z.array(z.string()),
      roadmap: z.array(milestone).min(1),
      references: z.array(z.object({ label: z.string().min(1), href: link })),
      safety: z.string(),
      prototypeEvidence: factSchema,
      integrationEvidence: factSchema,
    }),
    products: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        designation: z.string().min(1),
        detailHref: link.optional(),
        completionEvidence: factSchema.optional(),
        verificationNote: z.string().min(1).optional(),
        developmentStages: z.array(milestone).min(1).optional(),
        architectureStages: z
          .array(
            z.object({ title: z.string().min(1), detail: z.string().min(1) }),
          )
          .min(1)
          .optional(),
        caseStudy: z
          .object({
            headline: z.string().min(1),
            problem: z.string().min(1),
            solution: z.string().min(1),
            capabilities: z
              .array(
                z.object({
                  title: z.string().min(1),
                  detail: z.string().min(1),
                }),
              )
              .min(1),
            workflow: z
              .array(
                z.object({
                  name: z.string().min(1),
                  detail: z.string().min(1),
                }),
              )
              .min(1),
            example: z.string().min(1),
            outcome: z.string().min(1),
          })
          .optional(),
        preview: z
          .object({
            src: z.string().startsWith("/models/"),
            alt: z.string().min(1),
            caption: z.string().min(1),
          })
          .optional(),
        targetUser: factSchema,
        status: developmentStatus,
        architecture: z.string(),
        components: z.array(z.string()),
        repository: link.or(z.literal("")),
        demo: link.or(z.literal("")),
        evidence: z.array(z.object({ label: z.string(), href: link })),
        roadmap: z.array(milestone),
      }),
    ),
    projects: z.array(
      z.object({
        name: z.string(),
        status: developmentStatus,
        eyebrow: z.string(),
        summary: z.string(),
        role: z.string(),
        stack: z.string(),
        outcome: z.string(),
        href: link,
        objective: z.string(),
        implementation: z.string(),
        evidence: link,
        limitations: z.string(),
      }),
    ),
  })
  .superRefine((config, context) => {
    const productIds = config.products.map((product) => product.id);
    if (new Set(productIds).size !== productIds.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["products"],
        message: "Product identifiers must be unique.",
      });
    }
    if (
      new Set(config.featuredProductIds).size !==
        config.featuredProductIds.length ||
      config.featuredProductIds.some((id) => !productIds.includes(id)) ||
      !config.featuredProductIds.includes(config.primaryProductId)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["featuredProductIds"],
        message:
          "Featured products must be unique configured products and include the primary product.",
      });
    }
    config.products.forEach((product, index) => {
      if (
        product.status === "completed" &&
        product.completionEvidence?.status !== "verified"
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["products", index, "completionEvidence"],
          message:
            "Completed products require recorded verified completion evidence.",
        });
      }
    });
    const serviceIds = config.services.map((service) => service.id);
    if (new Set(serviceIds).size !== serviceIds.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["services"],
        message: "Service identifiers must be unique.",
      });
    }
    if (
      !config.products.some((product) => product.id === config.primaryProductId)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["primaryProductId"],
        message: "The primary product must reference a configured product.",
      });
    }
    if (config.claude.status !== "planned") {
      const evidence =
        config.claude.status === "integrated"
          ? config.claude.integrationEvidence
          : config.claude.prototypeEvidence;
      if (evidence.status !== "verified" || !config.claude.evidence.length) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["claude", "status"],
          message:
            "Prototype or integrated status requires verified implementation evidence.",
        });
      }
    }
  });

export const business = businessSchema.parse(configuration);
export function verifiedValue(fact: z.infer<typeof factSchema>) {
  return fact.status === "verified" ? fact.value : undefined;
}
export const publicEmail =
  verifiedValue(business.domainContactEmail) ??
  business.publicContactEmail.value;
export const ventureEmail = business.ventureContactEmail.value;
export const verifiedProfiles = business.socialProfiles.filter(
  (profile) => profile.status === "verified",
);
export const statusLabels = {
  completed: "Completed",
  development: "Active development",
  prototype: "Prototype",
  planned: "Planned",
  integrated: "Integrated",
};
