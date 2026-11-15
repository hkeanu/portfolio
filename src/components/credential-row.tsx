import { type Credential, formatCredentialDate } from "@/lib/certifications";
import { Arrow, Symbol } from "./icons";

export function CredentialRow({ credential, compact = false }: { credential: Credential; compact?: boolean }) {
  const external = credential.evidenceUrl.startsWith("https:");
  return <a className={`credential-row ${compact ? "credential-compact" : ""}`} href={credential.evidenceUrl} target="_blank" rel="noopener noreferrer">
    <span className="credential-icon"><Symbol kind="credential" /></span>
    <span className="credential-copy"><span className="credential-issuer mono">{credential.issuer}{credential.platform && ` / ${credential.platform}`}</span><span className="credential-title">{credential.title}</span>{!compact && <span className="credential-type">{credential.type}</span>}</span>
    <span className="credential-date mono"><time dateTime={credential.issuedAt}>{formatCredentialDate(credential.issuedAt)}</time></span>
    <Arrow diagonal className="credential-arrow" />
    <span className="sr-only"> — {external ? "View credential" : "View certificate image"} (opens in a new tab)</span>
  </a>;
}
