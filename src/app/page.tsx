import Link from "next/link";
import { Arrow, Symbol } from "@/components/icons";
import { Eyebrow, TextLink, ConnectSection } from "@/components/ui";
import { SystemSculpture } from "@/components/system-sculpture";
import { CredentialRow } from "@/components/credential-row";
import { certifications } from "@/lib/certifications";

export default function Home() {
  return <>
    <section className="hero shell">
      <div className="hero-topline"><Eyebrow>Keanu Holgado / Personal portfolio</Eyebrow><span className="practice-status mono"><i /> A practice in progress</span></div>
      <div className="hero-grid">
        <div className="hero-copy">
          <h1 data-reveal>Curiosity,<br />put to <em>work.</em></h1>
          <p className="hero-description" data-reveal>I’m Keanu. I work with data, build automations, and explore the systems that connect them.</p>
          <div className="hero-actions" data-reveal><Link href="/homelab" className="button button-primary">Step inside the homelab <Arrow diagonal /></Link><TextLink href="/about">A little about me</TextLink></div>
        </div>
        <SystemSculpture />
      </div>
      <div className="hero-bottom"><span className="mono">Based in the Philippines · Thinking in systems</span><a className="scroll-cue mono" href="#practice">Follow the curiosity <span aria-hidden="true">↓</span></a></div>
    </section>

    <section id="practice" className="practice-section shell section-space">
      <div className="section-side"><Eyebrow number="01">The practice</Eyebrow><span className="side-note mono">Different disciplines.<br />A connected way of thinking.</span></div>
      <div className="practice-main">
        <h2 data-reveal>A few interests.<br /><span className="muted">A lot of connections.</span></h2>
        <p className="section-lead" data-reveal>I’m interested in what happens between disciplines: when data becomes a useful insight, a repetitive task becomes a workflow, or a small server becomes a place to learn.</p>
        <div className="practice-rows">
          {[{ number: "01", kind: "data" as const, title: "Make sense of data", body: "Working with data, analysis, and the questions behind them.", tags: "Python / R / Power BI" }, { number: "02", kind: "automation" as const, title: "Connect the moving parts", body: "Exploring workflows that make repetitive tasks more manageable.", tags: "n8n / Python / Alteryx" }, { number: "03", kind: "systems" as const, title: "Learn by running things", body: "Self-hosting, maintaining, and documenting a home server.", tags: "Docker / Linux / Self-hosting" }].map(item => <article className="practice-row" key={item.number} data-reveal><span className="row-number mono">{item.number}</span><Symbol kind={item.kind} /><div><h3>{item.title}</h3><p>{item.body}</p><span className="mono practice-tools">{item.tags}</span></div></article>)}
        </div>
      </div>
    </section>

    <section className="homelab-feature section-space">
      <div className="shell">
        <div className="feature-top"><Eyebrow number="02">The homelab</Eyebrow><span className="mono">A place to learn by doing</span></div>
        <div className="feature-grid">
          <div className="feature-copy" data-reveal><h2>A small server.<br /><em>A bigger playground.</em></h2><p>Automation, self-hosted tools, and the occasional lesson in why something stopped working. My homelab is where ideas meet the practical details.</p><TextLink href="/homelab">Take a look inside</TextLink></div>
          <Link href="/homelab" className="lab-preview" aria-label="Explore the homelab architecture" data-reveal>
            <div className="lab-preview-top mono"><span>Home server / System sketch</span><Arrow diagonal width="16" height="16" /></div>
            <div className="preview-server"><span className="server-light" /><span className="server-slots" /><Symbol kind="systems" /><span className="mono">Ubuntu + Docker</span></div>
            <div className="preview-branches"><span /><span /><span /></div>
            <div className="preview-services"><span><Symbol kind="automation" />Automation</span><span><Symbol kind="systems" />Git hosting</span><span><Symbol kind="data" />Monitoring</span></div>
            <div className="lab-preview-bottom mono"><span>Connected tools. Practical learning.</span><span>↳</span></div>
          </Link>
        </div>
      </div>
    </section>

    <section className="credentials-feature shell section-space">
      <div className="credentials-heading" data-reveal><Eyebrow number="03">Keep learning</Eyebrow><h2>Foundations<br />to <em>build on.</em></h2><p>A selection of learning milestones across data, automation, and the tools behind them.</p><TextLink href="/certifications">All certifications</TextLink></div>
      <div className="featured-credentials" data-reveal>{certifications.filter(item => item.featured).map(item => <CredentialRow key={item.id} credential={item} compact />)}<div className="credential-list-note mono">Learning is part of the practice.</div></div>
    </section>
    <ConnectSection />
  </>;
}
