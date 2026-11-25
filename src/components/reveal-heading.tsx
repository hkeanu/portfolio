import type { ReactNode } from "react";

/** Explicit editorial lines preserve markup, reading order, and no-JS content. */
export function RevealHeading({ lines, id }: { lines: ReactNode[]; id?: string }) {
  return <h2 id={id} data-reveal-lines>{lines.map((line, i) => <span className="heading-mask" key={i}><span data-heading-line>{line}</span></span>)}</h2>;
}
