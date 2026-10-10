import type { Metadata } from "next";
import { business } from "@/content/business";

export function pageMetadata(
  path: string,
  title: string,
  description: string,
): Metadata {
  const url = new URL(path, business.websiteUrl).href;
  return {
    title: `${title} | ${business.displayName}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${business.displayName}`,
      description,
      url,
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${business.displayName} hardware and embedded systems development`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  };
}
