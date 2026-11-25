"use client";

import { useLayoutEffect, useRef, useState } from "react";
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
  const map = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const animateSelection = useRef(false);
  useLayoutEffect(() => {
    const element = map.current;
    if (!element || !path.current) return;
    const draw = () => {
      const host = element.querySelector(".host-node")?.getBoundingClientRect();
      const node = element.querySelector('[aria-pressed="true"]')?.getBoundingClientRect();
      if (!host || !node) return;
      const bounds = element.getBoundingClientRect();
      const x = host.left + host.width / 2 - bounds.left;
      const y = host.bottom - bounds.top;
      const endX = node.left + node.width / 2 - bounds.left;
      const endY = node.top - bounds.top;
      // Follow the grid's center gutter, then branch just above the target.
      const middle = endY - 8;
      path.current?.setAttribute("d", `M${x},${y} V${middle} H${endX} V${endY}`);
    };
    draw();
    const animations: Animation[] = [];
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (animateSelection.current) {
      if (!preference.matches) animations.push(path.current.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 220, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }));
      if (preview.current) animations.push(preview.current.animate([{ opacity: .35 }, { opacity: 1 }], { duration: preference.matches ? 80 : 160, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }));
    }
    animateSelection.current = false;
    const cancel = () => animations.forEach(animation => animation.cancel());
    preference.addEventListener("change", cancel);
    const observer = new ResizeObserver(draw);
    observer.observe(element);
    element.querySelectorAll(".host-node, .service-node").forEach(node => observer.observe(node));
    return () => { cancel(); observer.disconnect(); preference.removeEventListener("change", cancel); };
  }, [activeId]);
  const selected = services.find(service => service.id === activeId) ?? services[0];
  if (!selected) return null;
  return <div className="lab-explorer">
    <div className="lab-map" ref={map} data-reveal="media">
      <svg className="selection-connection" aria-hidden="true"><path ref={path} pathLength="1" /></svg>
      <div className="map-heading mono"><span>System overview</span><span>Docker / Ubuntu</span></div>
      <div className="access-layer"><span>Cloudflare Tunnel</span><span>Tailscale</span></div>
      <div className="map-connector" />
      <div className="host-node"><ToolLogo name="Docker" label={false} /><div><strong>The home server</strong><span className="mono">Containerized services</span></div></div>
      <div className="map-connector" />
      <div className="service-nodes" role="group" aria-label="Explore homelab services">{services.map((service, i) => <button key={service.id} aria-pressed={service.id === selected.id} aria-controls="service-preview" onClick={event => { animateSelection.current = event.detail !== 0 && service.id !== activeId; setActiveId(service.id); }} className={`service-node ${service.id === selected.id ? "node-active" : ""}`}><span className="mono node-number">0{i + 1}</span><Symbol kind={labels[service.slug]?.kind} /><span>{labels[service.slug]?.short ?? service.title}</span></button>)}</div>
      <p className="map-note mono">Select a stack to look closer <Arrow width="14" height="14" /></p>
    </div>
    <div className="service-preview" id="service-preview" aria-live="polite" aria-atomic="true">
      <div className="service-preview-content" ref={preview}>
        <span className="eyebrow">Inside the lab / 0{services.indexOf(selected) + 1}</span>
        <h3>{selected.title}</h3><p>{selected.summary}</p>
        <div className="tech-tags">{selected.technologies.map(tech => <ToolLogo name={tech} key={tech} />)}</div>
        <Link className="text-link" href={`/homelab/services/${selected.slug}`}>Explore this stack <Arrow diagonal /></Link>
      </div>
      <span className="preview-note">Documented configuration · Not live telemetry</span>
    </div>
  </div>;
}
