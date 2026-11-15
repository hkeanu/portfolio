import Link from "next/link";
import type { ReactNode } from "react";
import { Arrow } from "./icons";

export function Eyebrow({ number, children }: { number?: string; children: ReactNode }) {
  return <p className="eyebrow">{number && <span>{number}</span>}{children}</p>;
}
export function TextLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return <Link href={href} className={`text-link ${className}`}>{children}<Arrow diagonal /></Link>;
}
export function PageIntro({ number, label, title, accent, children }: { number: string; label: string; title: string; accent?: string; children: ReactNode }) {
  return <section className="page-intro shell">
    <Eyebrow number={number}>{label}</Eyebrow>
    <h1 data-reveal>{title}{accent && <><br /><em>{accent}</em></>}</h1>
    <div className="intro-description" data-reveal>{children}</div>
  </section>;
}
export function ConnectSection() {
  return <section className="connect-section shell" data-reveal>
    <Eyebrow>Good things start with a conversation</Eyebrow>
    <Link href="/contact" className="connect-link">Let’s connect<span className="connect-period">.</span><Arrow diagonal /></Link>
    <p>Ideas, systems, or something I haven’t thought of yet.</p>
  </section>;
}
