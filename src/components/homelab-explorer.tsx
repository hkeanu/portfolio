"use client";

import { useState } from "react";
import type { Entry } from "@/lib/content-schema";
import { Arrow, Symbol } from "./icons";
import Link from "@/components/transition-link";
import { ToolLogo } from "./tool-logo";

const labels: Record<string, { short: string; kind: "systems" | "automation" | "data" }> = {
  automation: { short: "Automation", kind: "automation" },
  "git-hosting": { short: "Git hosting", kind: "systems" },
  monitoring: { short: "Monitoring", kind: "data" },
  media: { short: "Media", kind: "systems" },
};

export function HomelabExplorer({ services }: { services: Entry[] }) {
  const [activeId, setActiveId] = useState(services[0]?.id);
  const selected = services.find(service => service.id === activeId) ?? services[0];
  if (!selected) return null;
  return <div className="lab-explorer">
    <div className="lab-map" data-reveal="media">
      <div className="map-heading mono"><span>System overview</span><span>Docker / Ubuntu</span></div>
      <div className="access-layer"><span>Cloudflare Tunnel</span><span>Tailscale</span></div>
      <div className="map-connector" />
      <div className="host-node"><ToolLogo name="Docker" label={false} /><div><strong>The home server</strong><span className="mono">Containerized services</span></div></div>
      <div className="map-connector" />
      <div className="service-nodes" role="group" aria-label="Explore homelab services">{services.map((service, i) => <button key={service.id} aria-pressed={service.id === selected.id} aria-controls="service-preview" onClick={() => setActiveId(service.id)} className={`service-node ${service.id === selected.id ? "node-active" : ""}`}><span className="mono node-number">0{i + 1}</span><Symbol kind={labels[service.slug]?.kind} /><span>{labels[service.slug]?.short ?? service.title}</span></button>)}</div>
      <p className="map-note mono">Select a stack to look closer <Arrow width="14" height="14" /></p>
    </div>
    <div className="service-preview" id="service-preview" aria-live="polite" aria-atomic="true">
      <div className="service-preview-content" key={selected.id}>
        <span className="eyebrow">Inside the lab / 0{services.indexOf(selected) + 1}</span>
        <h3>{selected.title}</h3><p>{selected.summary}</p>
        <div className="tech-tags">{selected.technologies.map(tech => <ToolLogo name={tech} key={tech} />)}</div>
        <Link className="text-link" href={`/homelab/services/${selected.slug}`}>Explore this stack <Arrow diagonal /></Link>
      </div>
      <span className="preview-note">Documented configuration · Not live telemetry</span>
    </div>
  </div>;
}
