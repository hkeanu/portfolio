import { z } from "zod";

export const entrySchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  type: z.enum(["work", "homelab-service", "homelab-story", "knowledge", "exploration"]),
  summary: z.string().min(1),
  disciplines: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  status: z.enum(["ongoing", "maintained", "completed", "archived"]),
  publicationState: z.enum(["draft", "published"]),
  disclosureStatus: z.enum(["pending", "approved"]),
  featured: z.boolean().default(false),
  relatedIds: z.array(z.string()).default([]),
  sources: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
});

export type Entry = z.infer<typeof entrySchema>;

export function isPublic(entry: Entry) {
  return entry.publicationState === "published" && entry.disclosureStatus === "approved";
}

export function validateEntries(input: unknown): Entry[] {
  const entries = z.array(entrySchema).parse(input);
  const ids = new Set<string>();
  const paths = new Set<string>();
  for (const entry of entries) {
    if (ids.has(entry.id)) throw new Error(`Duplicate content ID: ${entry.id}`);
    const path = `${entry.type}/${entry.slug}`;
    if (paths.has(path)) throw new Error(`Duplicate content path: ${path}`);
    ids.add(entry.id);
    paths.add(path);
  }
  for (const entry of entries) {
    for (const id of entry.relatedIds) {
      if (!ids.has(id)) throw new Error(`Unknown related content ${id} in ${entry.id}`);
    }
  }
  return entries;
}
