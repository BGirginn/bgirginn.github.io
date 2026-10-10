import type { MetadataRoute } from "next";
import { business } from "@/content/business";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    "/venture/",
    "/products/",
    "/products/industrial-lora/",
    "/projects/",
    "/about/",
    "/contact/",
    "/services/",
    "/resources/",
    "/privacy/",
  ].map((path) => ({
    url: new URL(path, business.websiteUrl).href,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path === "/venture/" ? 0.9 : 0.7,
  }));
}
