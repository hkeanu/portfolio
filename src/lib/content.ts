import "server-only";
import inventory from "@content/homelab/entries.json";
import Automation from "@content/homelab/automation.mdx";
import GitHosting from "@content/homelab/git-hosting.mdx";
import Monitoring from "@content/homelab/monitoring.mdx";
import Media from "@content/homelab/media.mdx";
import { isPublic, validateEntries } from "./content-schema";

const entries = validateEntries(inventory);
const bodies = { automation: Automation, "git-hosting": GitHosting, monitoring: Monitoring, media: Media };

export function getPublicServices() {
  return entries.filter(entry => entry.type === "homelab-service" && isPublic(entry));
}
export function getService(slug: string) {
  const entry = getPublicServices().find(item => item.slug === slug);
  if (!entry || !(entry.slug in bodies)) return undefined;
  return { entry, Body: bodies[entry.slug as keyof typeof bodies] };
}
export function getRelatedServices(ids: string[]) {
  return getPublicServices().filter(entry => ids.includes(entry.id));
}
