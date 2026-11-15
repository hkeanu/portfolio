import type { Metadata } from "next";
import { Eyebrow, PageIntro, TextLink, ConnectSection } from "@/components/ui";
import { SystemSculpture } from "@/components/system-sculpture";
import { CredentialRow } from "@/components/credential-row";
import { certifications } from "@/lib/certifications";

export const metadata: Metadata = { title: "About", description: "Meet Keanu Holgado: a data practitioner exploring automation, self-hosted systems, and the connections between them." };

export default function About() {
  return <>
    <PageIntro number="01" label="A little context" title="Different interests." accent="One curious mind."><p>I’m Keanu Holgado, a data practitioner based in Pasay, Philippines. I’m interested in understanding how things work—and finding useful ways to put them together.</p></PageIntro>
    <section className="about-story shell section-space">
      <div className="about-art"><SystemSculpture small /><span className="mono">Data ↔ Automation ↔ Infrastructure</span></div>
      <div className="about-prose" data-reveal><Eyebrow>The connecting thread</Eyebrow><h2>I like the space<br /><em>between things.</em></h2><p>My interests span data analytics, data science, and automation. The tools change with the question: Python and R for working with data, Power BI for making it understandable, and workflow tools for connecting the steps.</p><p>That curiosity also extends to the infrastructure underneath. My home server gives me a place to explore Docker, self-hosted applications, and the ongoing work of keeping a system understandable.</p><p>This portfolio is growing alongside that practice. It’s a place to share what I’m building, record what I’m learning, and connect the two over time.</p><TextLink href="/homelab">See where I experiment</TextLink></div>
    </section>
    <section className="principles-section shell section-space"><Eyebrow number="02">How I approach things</Eyebrow><div className="principles-grid">{[{ title: "Start with the question.", body: "Understand what would be useful before choosing a tool or adding another moving part." }, { title: "Make it understandable.", body: "Keep the thinking visible. Write down decisions, dependencies, and the things that didn’t work." }, { title: "Leave room to learn.", body: "Build something small, try it in practice, and use what happens to decide what comes next." }].map((item, i) => <article key={item.title} data-reveal><span className="mono">0{i + 1} /</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section>
    <section className="about-learning shell section-space"><div data-reveal><Eyebrow number="03">Learning, along the way</Eyebrow><h2>Curiosity needs<br /><em>a foundation.</em></h2><p>Structured learning is one part of how I explore new subjects. Putting those ideas into practice is the next.</p><TextLink href="/certifications">View the full collection</TextLink></div><div data-reveal>{certifications.filter(item => item.featured).slice(1).map(item => <CredentialRow key={item.id} credential={item} compact />)}</div></section>
    <ConnectSection />
  </>;
}
