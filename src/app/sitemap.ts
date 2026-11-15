import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { getPublicServices } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  const url = getSiteUrl();
  if (!url) return [];
  return ["", "/about", "/homelab", "/certifications", "/contact", ...getPublicServices().map(entry => `/homelab/services/${entry.slug}`)].map(path => ({ url: `${url.origin}${path}`, changeFrequency: "monthly", priority: path === "" ? 1 : 0.7 }));
}
