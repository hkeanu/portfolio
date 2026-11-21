import Link from "@/components/transition-link";
import { site } from "@/lib/site";
import { Arrow } from "./icons";

export function Footer() {
  return <footer className="site-footer shell">
    <div><Link href="/" className="footer-name">Keanu Holgado<span>.</span></Link><p>Always a work in progress.</p></div>
    <div className="footer-links"><Link href="/about">About</Link><Link href="/contact">Contact</Link><a href={site.github} target="_blank" rel="noopener noreferrer">GitHub <Arrow diagonal width="13" height="13" /><span className="sr-only"> (opens in a new tab)</span></a></div>
    <span className="footer-note mono">© 2026 · Made with intention</span>
  </footer>;
}
