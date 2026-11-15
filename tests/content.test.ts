import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { entrySchema, isPublic, validateEntries } from "../src/lib/content-schema";

const base = entrySchema.parse({ id: "test-entry", slug: "test-entry", title: "Test entry", type: "homelab-service", summary: "Publication boundary fixture", status: "ongoing", publicationState: "published", disclosureStatus: "approved" });

test("only published entries approved for disclosure cross the publication boundary", () => {
  assert.equal(isPublic(base), true);
  assert.equal(isPublic({ ...base, publicationState: "draft" }), false);
  assert.equal(isPublic({ ...base, disclosureStatus: "pending" }), false);
});
test("duplicate IDs and routes fail validation", () => {
  assert.throws(() => validateEntries([base, base]), /Duplicate content ID/);
  assert.throws(() => validateEntries([base, { ...base, id: "another-id" }]), /Duplicate content path/);
});
test("broken content references fail validation", () => {
  assert.throws(() => validateEntries([{ ...base, relatedIds: ["missing-entry"] }]), /Unknown related content/);
});
test("the homelab inventory has valid relationships and a body for each public entry", () => {
  const entries = validateEntries(JSON.parse(readFileSync(join(process.cwd(), "content/homelab/entries.json"), "utf8")));
  for (const entry of entries.filter(isPublic)) assert.ok(existsSync(join(process.cwd(), `content/homelab/${entry.slug}.mdx`)), `Missing MDX: ${entry.slug}`);
});
test("credential evidence points to HTTPS or a real local asset", () => {
  const credentials = JSON.parse(readFileSync(join(process.cwd(), "content/certifications.json"), "utf8"));
  assert.equal(credentials.length, 9);
  assert.equal(new Set(credentials.map((credential: { id: string }) => credential.id)).size, credentials.length);
  for (const item of credentials) {
    if (item.evidenceUrl.startsWith("/media/")) assert.ok(existsSync(join(process.cwd(), "public", item.evidenceUrl)), `Missing evidence: ${item.title}`);
    else assert.equal(new URL(item.evidenceUrl).protocol, "https:");
  }
});
