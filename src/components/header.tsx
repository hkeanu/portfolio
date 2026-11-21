"use client";

import Link from "@/components/transition-link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation } from "@/lib/site";
import { Arrow } from "./icons";

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function isActive(href: string) { return path === href || path.startsWith(`${href}/`); }
  return <header className="site-header">
    <div className="header-inner shell">
      <Link href="/" className="wordmark" aria-label="Keanu — home" onClick={() => setOpen(false)}>
        <span className="brand-mark" aria-hidden="true"><span /><span /><span /><span /></span>
        keanu<span className="wordmark-dot">.</span>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navigation.map(item => <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>{item.label}</Link>)}
      </nav>
      <Link className="header-contact" href="/contact" aria-current={path === "/contact" ? "page" : undefined}>Let’s connect <span aria-hidden="true">＋</span></Link>
      <button id="menu-toggle" className={`menu-toggle ${open ? "is-open" : ""}`} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}><span /><span /></button>
    </div>
    <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" hidden={!open}>
      {[{ href: "/", label: "Home" }, ...navigation, { href: "/contact", label: "Contact" }].map((item, i) => <Link href={item.href} key={item.href} onClick={() => setOpen(false)} aria-current={path === item.href ? "page" : undefined}><span className="mono">0{i + 1}</span>{item.label}<Arrow diagonal /></Link>)}
    </nav>
    <noscript><style>{`.menu-toggle{display:none!important}`}</style><nav className="nojs-nav shell" aria-label="Navigation without JavaScript">{navigation.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}<a href="/contact">Contact</a></nav></noscript>
  </header>;
}
