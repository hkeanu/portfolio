import { z } from "zod";
import inventory from "@content/certifications.json";

const credentialSchema = z.object({
  id: z.string().min(1), title: z.string().min(1), issuer: z.string().min(1),
  platform: z.string().optional(), type: z.string().min(1),
  issuedAt: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
  category: z.string().min(1),
  evidenceUrl: z.string().refine(value => value.startsWith("/media/") || URL.canParse(value) && new URL(value).protocol === "https:", "Evidence must be local media or HTTPS"),
  expiresAt: z.string().optional(), featured: z.boolean(),
});

export type Credential = z.infer<typeof credentialSchema>;
export const certifications = z.array(credentialSchema).parse(inventory).sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
if (new Set(certifications.map(item => item.id)).size !== certifications.length) throw new Error("Duplicate credential IDs");
export const credentialCategories = [...new Set(certifications.map(item => item.category))];
export function formatCredentialDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}-01T00:00:00Z`));
}
