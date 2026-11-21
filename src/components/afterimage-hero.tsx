"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { SceneInput, Discipline } from "./connected-scene";
import { site } from "@/lib/site";
import Link from "./transition-link";

const ConnectedScene = dynamic(() => import("./connected-scene"), { ssr: false });
const perspectives = ["Original view", "Angled view", "Elevated view"];
const practice: Record<Discipline, { label: string; title: string; description: string; href: string; action: string }> = {
  all: { label: "Together", title: "Different disciplines. Shared possibilities.", description: "Follow a thread to see how I turn questions into something useful.", href: "#selected-work", action: "Explore the work" },
  data: { label: "Data", title: "From information to understanding.", description: "Python, R, and Power BI help me explore questions, find patterns, and make data understandable.", href: "/about", action: "Meet my practice" },
  automation: { label: "Automation", title: "Less repetition. More possibility.", description: "I connect workflows, documents, and tools with n8n and Python. The homelab is where I put those ideas into practice.", href: "/homelab/services/automation", action: "Explore automation" },
  systems: { label: "Systems", title: "Build it. Run it. Understand it.", description: "Docker, self-hosted services, and hands-on maintenance help me understand the infrastructure underneath.", href: "/homelab", action: "Inside the homelab" },
};

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function AfterimageHero() {
  const hero = useRef<HTMLElement>(null);
  const input = useRef<SceneInput>({ x: 0, y: 0, scroll: 0 });
  const [enabled, setEnabled] = useState(false);
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [perspective, setPerspective] = useState(0);
  const [discipline, setDiscipline] = useState<Discipline>("all");
  const [immediate, setImmediate] = useState(false);
  const detail = useRef<HTMLDivElement>(null);
  const detailAnimation = useRef<Animation | null>(null);
  const selected = practice[discipline];
  const fail = useCallback(() => { setEnabled(false); setAvailable(false); setRendered(false); }, []);
  const ready = useCallback(() => setRendered(true), []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const probe = document.createElement("canvas");
    let context: WebGL2RenderingContext | null;
    try { context = probe.getContext("webgl2"); } catch { return; }
    if (!context) return;
    context.getExtension("WEBGL_lose_context")?.loseContext();
    setAvailable(true);
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const constrained = connection?.saveData || (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2);
    if (!preference.matches && !constrained) { setEnabled(true); setPlaying(true); }
    const syncPreference = () => {
      if (preference.matches) { setPlaying(false); setEnabled(false); setRendered(false); setImmediate(true); input.current = { x: 0, y: 0, scroll: 0 }; }
    };
    preference.addEventListener("change", syncPreference);
    return () => preference.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => () => detailAnimation.current?.cancel(), []);

  function selectDiscipline(value: Discipline, keyboard: boolean) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setImmediate(keyboard || reduce);
    detailAnimation.current?.cancel();
    setDiscipline(value);
    if (!keyboard && value !== discipline && detail.current) {
      detailAnimation.current = detail.current.animate(
        [{ opacity: .35, transform: reduce ? "none" : "translateY(4px)" }, { opacity: 1, transform: "none" }],
        { duration: reduce ? 80 : 220, easing: "cubic-bezier(0.23, 1, 0.32, 1)" },
      );
    }
  }

  useEffect(() => {
    const section = hero.current;
    if (!section) return;
    let visible = false;
    const sync = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(section.querySelector(".hero-visual") ?? section);
    const updateScroll = () => {
      if (!visible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      input.current.scroll = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / section.offsetHeight));
    };
    window.addEventListener("scroll", updateScroll, { passive: true });
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); window.removeEventListener("scroll", updateScroll); document.removeEventListener("visibilitychange", sync); };
  }, []);

  return <section className="hero" ref={hero} onPointerMove={event => {
    if (event.pointerType !== "mouse" || !playing || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (immediate) setImmediate(false);
    const rect = event.currentTarget.getBoundingClientRect();
    input.current.x = (event.clientX - rect.left) / rect.width - .5;
    input.current.y = (event.clientY - rect.top) / rect.height - .5;
  }} onPointerLeave={() => { input.current.x = 0; input.current.y = 0; }}>
    <div className="hero-topline shell"><span className="eyebrow">The personal practice of {site.name}</span><span className="mono">Pasay, Philippines / UTC +08</span></div>
    <div className="shell hero-inner">
      <div className="hero-copy" data-entrance>
        <p className="eyebrow hero-kicker">Data / Automation / Infrastructure</p>
        <h1>Curiosity,<br /><em>connected.</em></h1>
        <p className="hero-description">I work with data, build automations, and explore the systems that connect them.</p>
        <div className="hero-actions"><a className="button button-primary" href="#selected-work">Explore my work</a><Link className="text-link" href="/about">A little about me</Link></div>
      </div>
      <div className="hero-visual">
        <figure className="hero-artwork" role="img" aria-label="Three interlocking metallic ribbons representing data, automation, and infrastructure" data-discipline={discipline} data-rendered={rendered || undefined} data-active={enabled && active && playing ? "true" : "false"} data-perspective={perspective}>
          <Image src="/media/connected-sculpture.webp" alt="" fill unoptimized fetchPriority="high" />
          {enabled && <div className="scene-layer" aria-hidden="true"><SceneBoundary onFailure={fail}><ConnectedScene playing={playing} active={active} perspective={perspective} discipline={discipline} immediate={immediate} input={input} onReady={ready} onFailure={fail} /></SceneBoundary></div>}
        </figure>
        <span className="scene-label scene-label-data" aria-hidden="true">A connected practice</span><span className="scene-label scene-label-auto" aria-hidden="true">Explore below</span>
        <div className="scene-caption"><span className="mono">Three disciplines. One curious mind.</span>
          {available && <div className="scene-controls">{!enabled ? <button onClick={() => { setEnabled(true); setPlaying(false); setImmediate(true); }}>Enable 3D artwork</button> : <><button onClick={() => { setImmediate(playing); setPlaying(!playing); }} aria-pressed={playing}>{playing ? "Pause motion" : "Play motion"}</button><button aria-label="Change sculpture perspective" onClick={event => { setImmediate(event.detail === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches); setPerspective((perspective + 1) % 3); }}>Change view</button></>}</div>}
          <span className="sr-only" role="status">{perspectives[perspective]}</span>
        </div>
      </div>
    </div>
    <div className="hero-explorer shell">
      <noscript><style>{`.discipline-picker{display:none}.hero-explorer{grid-template-columns:1fr}`}</style></noscript>
      <div className="discipline-picker"><p className="eyebrow">Follow a thread</p><div role="group" aria-label="Explore my disciplines">{(Object.keys(practice) as Discipline[]).map(value => <button key={value} aria-pressed={discipline === value} aria-controls="discipline-detail" onClick={event => selectDiscipline(value, event.detail === 0)}>{practice[value].label}</button>)}</div></div>
      <div className="discipline-detail" id="discipline-detail" ref={detail} aria-live="polite" aria-atomic="true"><h2>{selected.title}</h2><p>{selected.description}</p><Link className="text-link" href={selected.href}>{selected.action}<span aria-hidden="true">＋</span></Link></div>
    </div>
  </section>;
}
