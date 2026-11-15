export const site = {
  name: "Keanu Holgado",
  shortName: "Keanu",
  description: "A personal practice in data, automation, and self-hosted systems. Built with curiosity, documented along the way.",
  location: "Pasay, Philippines",
  github: "https://github.com/hkeanu",
  // Add real contact details here when ready. Empty values never render.
  email: "",
  linkedin: "",
};

export const navigation = [
  { href: "/homelab", label: "Homelab" },
  { href: "/about", label: "About" },
  { href: "/certifications", label: "Certifications" },
];

// Set SITE_URL at build time after selecting the production domain.
// No invented domain is emitted into metadata, robots, or the sitemap.
export function getSiteUrl(): URL | undefined {
  if (!process.env.SITE_URL) return undefined;
  const url = new URL(process.env.SITE_URL);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error("SITE_URL must use HTTP or HTTPS");
  return new URL(url.origin);
}
