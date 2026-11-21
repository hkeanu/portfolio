import type { Metadata } from "next";
import { PageIntro, Eyebrow, ConnectSection } from "@/components/ui";
import { HomelabExplorer } from "@/components/homelab-explorer";
import { getPublicServices } from "@/lib/content";
import { Arrow } from "@/components/icons";
import Link from "@/components/transition-link";

export const metadata: Metadata = { title: "Homelab", description: "Inside Keanu’s home server: Docker-based automation, Git hosting, monitoring, and personal media services." };

export default function Homelab() {
  const services = getPublicServices();
  return <>
    <PageIntro number="02" label="The homelab" title="Small infrastructure." accent="Endless questions."><p>A home server, a collection of self-hosted tools, and a practical way to understand the systems I use. This is my space for connecting, maintaining, and learning.</p></PageIntro>
    <section className="homelab-overview shell"><div className="overview-label"><Eyebrow>Follow the connections</Eyebrow><span className="mono">An architectural sketch</span></div><HomelabExplorer services={services} /><p className="architecture-note">A curated overview based on my self-hosting documentation. Access methods vary by service; this diagram does not imply every service is publicly exposed.</p></section>
    <section className="stack-directory shell section-space"><div className="section-heading-row"><div><Eyebrow number="01">Inside the machine</Eyebrow><h2>The moving parts<span className="accent">.</span></h2></div><p>Different responsibilities.<br />One place to learn how they fit.</p></div><div className="stack-list">{services.map((service, i) => <Link className="stack-row" href={`/homelab/services/${service.slug}`} key={service.id} data-reveal><span className="mono">0{i + 1}</span><div><h3>{service.title}</h3><p>{service.summary}</p></div><span className="stack-tech mono">{service.technologies.slice(0, 2).join(" / ")}</span><Arrow diagonal /></Link>)}</div></section>
    <section className="operations-section section-space"><div className="shell operations-grid"><div data-reveal><Eyebrow number="02">Beyond the deployment</Eyebrow><h2>The interesting part<br />is <em>keeping it going.</em></h2></div><div className="operations-copy" data-reveal><p>A Compose file is only the start. Storage, permissions, updates, and recovery are part of the system too.</p><p>My notes cover the Docker host, container storage, networking, remote access, and maintenance procedures. As those notes become useful public guides, they’ll find a home here.</p><div className="tech-tags"><span>Docker Compose</span><span>Ubuntu</span><span>Cloudflare Tunnel</span><span>Tailscale</span></div></div></div></section>
    <ConnectSection />
  </>;
}
