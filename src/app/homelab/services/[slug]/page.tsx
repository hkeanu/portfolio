import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicServices, getRelatedServices, getService } from "@/lib/content";
import { Arrow } from "@/components/icons";
import { Eyebrow } from "@/components/ui";

export const dynamicParams = false;
export function generateStaticParams() { return getPublicServices().map(entry => ({ slug: entry.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const service = getService((await params).slug);
  return service ? { title: service.entry.title, description: service.entry.summary } : { title: "Not found" };
}
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const service = getService((await params).slug);
  if (!service) notFound();
  const { entry, Body } = service;
  const related = getRelatedServices(entry.relatedIds);
  return <article className="service-article shell">
    <Link href="/homelab" className="back-link mono"><Arrow style={{ transform: "rotate(180deg)" }} width="16" height="16" /> Back to the homelab</Link>
    <header className="article-header"><Eyebrow>Homelab / Stack notes</Eyebrow><h1 data-reveal>{entry.title}<span className="accent">.</span></h1><p className="article-summary">{entry.summary}</p><div className="tech-tags">{entry.technologies.map(tech => <span key={tech}>{tech}</span>)}</div></header>
    <div className="article-layout"><aside><span className="eyebrow">About these notes</span><p>A curated summary of my documented setup. This page is not a live service-status report.</p><span className="mono">{entry.disciplines.join(" / ")}</span></aside><div className="prose"><Body /></div></div>
    {related.length > 0 && <section className="related-section"><Eyebrow>Keep following the thread</Eyebrow><div className="related-grid">{related.map(item => <Link key={item.id} href={`/homelab/services/${item.slug}`}><h2>{item.title}</h2><p>{item.summary}</p><Arrow diagonal /></Link>)}</div></section>}
  </article>;
}
