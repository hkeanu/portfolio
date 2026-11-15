"use client";

import { useState } from "react";
import type { Credential } from "@/lib/certifications";
import { CredentialRow } from "./credential-row";

export function CredentialDirectory({ credentials, categories }: { credentials: Credential[]; categories: string[] }) {
  const [active, setActive] = useState("All");
  const items = active === "All" ? credentials : credentials.filter(item => item.category === active);
  return <div className="credential-directory">
    <div className="filter-bar" role="group" aria-label="Filter credentials by topic">{["All", ...categories].map(category => <button key={category} className={active === category ? "filter-active" : ""} aria-pressed={active === category} onClick={() => setActive(category)}>{category}{category === "All" && <span>{credentials.length.toString().padStart(2, "0")}</span>}</button>)}</div>
    <div className="directory-heading mono"><span>Credential / Issuer</span><span>Date earned</span></div>
    <p className="sr-only" role="status">{items.length} {items.length === 1 ? "credential" : "credentials"} shown</p>
    <div>{items.map(item => <CredentialRow key={item.id} credential={item} />)}</div>
    <p className="directory-footnote">Dates reflect when credentials were earned. Evidence links open the original credential or certificate image.</p>
  </div>;
}
