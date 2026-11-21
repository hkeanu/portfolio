import Link from "@/components/transition-link";
import type { ReactNode } from "react";

export function Eyebrow({ children }: { number?: string; children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
export function TextLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return <Link href={href} className={`text-link ${className}`}>{children}<span aria-hidden="true">＋</span></Link>;
}
export function PageIntro({ number, label, title, accent, children }: { number: string; label: string; title: string; accent?: string; children: ReactNode }) {
  return <section className="page-intro shell" data-entrance>
    <Eyebrow number={number}>{label}</Eyebrow>
    <h1>{title}{accent && <><br /><em>{accent}</em></>}</h1>
    <div className="intro-description">{children}</div>
  </section>;
}
export function ConnectSection() {
  return <section className="connect-section shell" data-reveal>
    <Eyebrow>Good things start with a conversation</Eyebrow>
    <Link href="/contact" className="connect-link">Let’s connect<span className="connect-period">.</span><span className="connect-plus" aria-hidden="true">＋</span></Link>
    <p>Ideas, systems, or something I haven’t thought of yet.</p>
  </section>;
}
