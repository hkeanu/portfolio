import type { SVGProps } from "react";

export function Arrow({ diagonal = false, ...props }: SVGProps<SVGSVGElement> & { diagonal?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

export function Symbol({ kind = "systems", ...props }: SVGProps<SVGSVGElement> & { kind?: "systems" | "data" | "automation" | "credential" | "github" }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    {kind === "systems" && <><rect x="3" y="3" width="18" height="7" rx="1" /><rect x="3" y="14" width="18" height="7" rx="1" /><path d="M7 6.5h.01M7 17.5h.01M15 6.5h3M15 17.5h3M12 10v4" /></>}
    {kind === "data" && <><path d="M4 20V4m0 16h17M8 15l4-5 4 3 5-8" /><circle cx="12" cy="10" r="1" /><circle cx="16" cy="13" r="1" /></>}
    {kind === "automation" && <><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="15" width="6" height="6" rx="1" /><path d="M9 6h6a3 3 0 0 1 3 3v6M6 9v6a3 3 0 0 0 3 3h6m0-15 3 3 3-3M3 15l3 3 3-3" /></>}
    {kind === "credential" && <><circle cx="12" cy="9" r="6" /><path d="m8 14-1 7 5-3 5 3-1-7m-6-5 1.5 1.5L15 7" /></>}
    {kind === "github" && <path d="M9 19c-4 1-4-2-6-2m12 5v-3.5a3 3 0 0 0-.8-2.4c2.7-.3 5.5-1.3 5.5-6A4.7 4.7 0 0 0 18.4 7a4.3 4.3 0 0 0-.1-3.1S17.3 3.6 15 5a11 11 0 0 0-6 0C6.7 3.6 5.7 3.9 5.7 3.9A4.3 4.3 0 0 0 5.6 7a4.7 4.7 0 0 0-1.3 3.1c0 4.7 2.8 5.7 5.5 6a3 3 0 0 0-.8 2.4V22" />}
  </svg>;
}
