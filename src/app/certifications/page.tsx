import type { Metadata } from "next";
import { certifications, credentialCategories } from "@/lib/certifications";
import { CredentialDirectory } from "@/components/credential-directory";
import { PageIntro, ConnectSection } from "@/components/ui";

export const metadata: Metadata = { title: "Certifications & learning", description: "Keanu’s learning milestones across data engineering, analytics, automation, AI, and technical foundations." };

export default function Certifications() {
  return <>
    <PageIntro number="03" label="Certifications & learning" title="Keep asking." accent="Keep learning."><p>A collection of professional certificates, accreditations, and completed courses. Different subjects, connected by a desire to understand more.</p></PageIntro>
    <section className="certifications-section shell"><CredentialDirectory credentials={certifications} categories={credentialCategories} /></section>
    <section className="learning-note shell" data-reveal><span className="learning-asterisk" aria-hidden="true">✳</span><div><h2>A milestone, then another question.</h2><p>A credential marks a step in learning. The interesting part is finding where that knowledge becomes useful—and where there’s more to understand.</p></div></section>
    <ConnectSection />
  </>;
}
