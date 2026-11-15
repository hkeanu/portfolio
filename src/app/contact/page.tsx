import type { Metadata } from "next";
import { PageIntro, Eyebrow } from "@/components/ui";
import { Arrow, Symbol } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact", description: "Connect with Keanu Holgado about data, automation, self-hosting, and useful things to build." };

export default function Contact() {
  const links = [
    { label: "GitHub", detail: "Code, repositories, and a place to connect.", href: site.github, handle: "@hkeanu", external: true },
    ...(site.email ? [{ label: "Email", detail: "Start a conversation.", href: `mailto:${site.email}`, handle: site.email, external: false }] : []),
    ...(site.linkedin ? [{ label: "LinkedIn", detail: "Connect professionally.", href: site.linkedin, handle: "View profile", external: true }] : []),
  ];
  return <>
    <PageIntro number="04" label="Let’s connect" title="An idea? A question?" accent="I’m curious."><p>I’m interested in conversations about data, automation, self-hosting, and useful things to build. If something here caught your attention, follow the thread.</p></PageIntro>
    <section className="contact-body shell"><div className="contact-context" data-reveal><span className="contact-orbit" aria-hidden="true"><span>↗</span></span><Eyebrow>From the Philippines</Eyebrow><p>Based in Pasay.<br />Curious about what’s next.</p><span className="mono">PH / UTC +08:00</span></div><div className="contact-channels" data-reveal>{links.map(link => <a key={link.label} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined}><span className="eyebrow">Find me on</span><div className="contact-channel-title"><h2>{link.label}</h2><Arrow diagonal /></div><p>{link.detail}</p><span className="contact-handle mono"><Symbol kind={link.label === "GitHub" ? "github" : "automation"} width="17" height="17" />{link.handle}</span>{link.external && <span className="sr-only"> (opens in a new tab)</span>}</a>)}</div></section>
    <div className="contact-closing shell"><span className="mono">Good systems connect things.</span><span className="mono">So do good conversations. ↗</span></div>
  </>;
}
