import Link from "@/components/transition-link";
import { Symbol } from "@/components/icons";
import { Eyebrow, TextLink, ConnectSection } from "@/components/ui";
import { AfterimageHero } from "@/components/afterimage-hero";
import { CredentialRow } from "@/components/credential-row";
import { ToolLogo, ToolStrip } from "@/components/tool-logo";
import { ProjectArtMotionToggle } from "@/components/project-art-motion";
import { ProjectArt } from "@/components/project-art";
import { RevealHeading } from "@/components/reveal-heading";
import { certifications } from "@/lib/certifications";
import { getPublicServices } from "@/lib/content";

const selectedWork = [
  { slug: "automation", label: "Automation & documents", category: "Connecting the workflow", tools: ["n8n", "Python", "PostgreSQL"] },
  { slug: "git-hosting", label: "Self-hosted Git", category: "Owning the infrastructure", tools: ["Gitea", "PostgreSQL"] },
  { slug: "monitoring", label: "Monitoring", category: "Understanding the system", tools: ["Beszel", "Uptime Kuma"] },
];

export default function Home() {
  const services = getPublicServices();
  return <>
    <AfterimageHero />
    <ToolStrip />
    <div className="work-surface"><section className="selected-work shell section-space" id="selected-work" aria-labelledby="selected-work-title">
      <div className="section-heading-row"><div><Eyebrow>Selected homelab work</Eyebrow><RevealHeading id="selected-work-title" lines={[<>Ideas, made <em>tangible.</em></>]} /></div><p data-reveal>Built, operated, documented.<br />A few connections in practice.</p></div>
      <ProjectArtMotionToggle />
      <div className="project-grid" data-reveal-group>{selectedWork.map(item => {
        const service = services.find(service => service.slug === item.slug);
        return service && <Link href={`/homelab/services/${item.slug}`} className="project-card" key={item.slug} data-reveal="media">
          <ProjectArt kind={item.slug} shared />
          <div className="project-copy"><p className="eyebrow">{item.category}</p><h3>{item.label}</h3><p>{service.summary}</p><div className="project-tools">{item.tools.map(name => <ToolLogo name={name} key={name} />)}</div><span className="project-read">Explore the stack <span aria-hidden="true">＋</span></span></div>
        </Link>;
      })}</div>
    </section></div>

    <section id="practice" className="practice-section shell section-space">
      <div className="section-side"><Eyebrow>The connecting thread</Eyebrow><span className="side-note mono">Question. Build. Understand.<br />Then connect the dots.</span><div className="practice-orbit" aria-hidden="true"><span /><span /><span /></div></div>
      <div className="practice-main">
        <RevealHeading lines={["A few interests.", <span className="muted" key="connections">A lot of connections.</span>]} />
        <p className="section-lead" data-reveal>I’m interested in what happens between disciplines: when data becomes a useful insight, a repetitive task becomes a workflow, or a small server becomes a place to learn.</p>
        <div className="practice-rows">{[
          { kind: "data" as const, title: "Make sense of data", body: "Working with data, analysis, and the questions behind them.", tools: ["Python", "R", "Power BI"] },
          { kind: "automation" as const, title: "Connect the moving parts", body: "Exploring workflows that make repetitive tasks more manageable.", tools: ["n8n", "Python", "Alteryx"] },
          { kind: "systems" as const, title: "Learn by running things", body: "Self-hosting, maintaining, and documenting a home server.", tools: ["Docker", "Linux", "Self-hosting"] },
        ].map(item => <article className="practice-row" key={item.kind} data-reveal><Symbol kind={item.kind} /><div><h3>{item.title}</h3><p>{item.body}</p><div className="practice-tools">{item.tools.map(name => <ToolLogo name={name} key={name} />)}</div></div></article>)}</div>
      </div>
    </section>

    <section className="homelab-feature section-space"><div className="shell">
      <div className="feature-top"><Eyebrow>The homelab</Eyebrow><span className="mono">A place to learn by doing</span></div>
      <div className="feature-grid"><div className="feature-copy"><RevealHeading lines={["A small server.", <em key="playground">A bigger playground.</em>]} /><p data-reveal>Automation, self-hosted tools, and the occasional lesson in why something stopped working. My homelab is where ideas meet the practical details.</p><TextLink href="/homelab">Take a look inside</TextLink></div>
        <Link href="/homelab" className="lab-preview" aria-label="Explore the homelab architecture" data-reveal="media"><div className="lab-preview-top mono">Home server / System sketch</div><div className="preview-server"><ToolLogo name="Docker" label={false} /><span>Ubuntu + Docker</span><span className="server-slots" /></div><div className="preview-branches"><span /><span /><span /></div><div className="preview-services"><span><ToolLogo name="n8n" label={false} />Automation</span><span><ToolLogo name="Gitea" label={false} />Git hosting</span><span><Symbol kind="data" />Monitoring</span></div><div className="lab-preview-bottom mono">Connected tools. Practical learning.</div></Link>
      </div>
    </div></section>

    <section className="credentials-feature shell section-space"><div className="credentials-heading" data-reveal><Eyebrow>Keep learning</Eyebrow><h2>Foundations<br />to <em>build on.</em></h2><p>A selection of learning milestones across data, automation, and the tools behind them.</p><TextLink href="/certifications">All certifications</TextLink></div><div className="featured-credentials" data-reveal>{certifications.filter(item => item.featured).map(item => <CredentialRow key={item.id} credential={item} compact />)}<div className="credential-list-note mono">Learning is part of the practice.</div></div></section>
    <ConnectSection />
  </>;
}
