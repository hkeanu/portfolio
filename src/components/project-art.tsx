import { ProjectArtMotion } from "./project-art-motion";

export function ProjectArt({ kind, shared = false }: { kind: string; shared?: boolean }) {
  return <div className={`project-art art-${kind}`} aria-hidden="true" style={shared ? { viewTransitionName: `project-${kind}` } : undefined}>
    <div className="project-art-visual"><svg viewBox="0 0 560 280" fill="none">
      <defs><pattern id={`grid-${kind}`} width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="currentColor" opacity=".18" /></pattern><linearGradient id={`metal-${kind}`} x1="0" x2="1" y2="1"><stop stopColor="#263c4c" /><stop offset=".5" stopColor="#14232f" /><stop offset="1" stopColor="#0d151d" /></linearGradient></defs>
      <path fill={`url(#grid-${kind})`} d="M0 0h560v280H0z" />
      {kind === "automation" ? <>
        <path className="art-path" data-flow="4" d="M172 140h21q25 0 25-25V88q0-20 24-20" stroke="currentColor" strokeWidth="1.5" />
        <path data-flow="4.8" d="M172 140h46v52q0 20 25 20h122" stroke="currentColor" strokeWidth="1.5" />
        {[{ x: 62, y: 106, label: "INPUT", symbol: "{ }" }, { x: 242, y: 34, label: "WORKFLOW", symbol: "⌘" }, { x: 365, y: 178, label: "DOCUMENT", symbol: "≡" }].map(node => <g key={node.label} className="art-node"><rect x={node.x + 5} y={node.y + 7} width="110" height="72" rx="8" fill="#080d12" stroke="#253b4d" /><rect x={node.x} y={node.y} width="110" height="72" rx="8" fill={`url(#metal-${kind})`} stroke="#59768b" /><text x={node.x + 55} y={node.y + 33} fill="#b3d5e7" textAnchor="middle" fontSize="24">{node.symbol}</text><text x={node.x + 55} y={node.y + 57} fill="#a5b5c0" textAnchor="middle" fontSize="9" letterSpacing="1.5">{node.label}</text></g>)}
        <circle data-pulse="" className="art-signal" cx="218" cy="140" r="5" fill="#a5d7ec" />
      </> : kind === "git-hosting" ? <>
        <path data-flow="5" d="M100 145h360" stroke="#6489a1" strokeWidth="2" />
        <path data-flow="6" d="M180 145q30 0 30-30V87q0-20 25-20h115q25 0 25 25v27q0 26 30 26" stroke="#6489a1" strokeWidth="2" />
        {[100,180,300,405,460].map((x,i) => <g key={x}><circle data-pulse="" cx={x} cy="145" r={i===2?14:8} fill="#101c26" stroke="#a5ccdf" strokeWidth="2" />{i===2 && <circle data-pulse="" cx={x} cy="145" r="5" fill="#a5ccdf" />}</g>)}
        <circle cx="258" cy="67" r="8" fill="#101c26" stroke="#83a6bd" strokeWidth="2" /><circle cx="336" cy="67" r="8" fill="#101c26" stroke="#83a6bd" strokeWidth="2" />
        <text x="100" y="197" fill="#94aab8" fontSize="10" letterSpacing="2">SOURCE</text><text x="336" y="36" fill="#94aab8" fontSize="10" letterSpacing="2">EXPLORE</text><text x="370" y="197" fill="#94aab8" fontSize="10" letterSpacing="2">MAINTAIN</text>
      </> : kind === "media" ? <>
        {[60, 116, 172].map((y, i) => <g key={y}><rect x={130 + i * 12} y={y} width="280" height="44" rx="6" fill={`url(#metal-${kind})`} stroke="#59768b" /><circle data-pulse="" cx={156 + i * 12} cy={y + 22} r="4" fill="#b3dfcc" /><path d={`M${315 + i * 12} ${y+22}h70`} stroke="#6489a1" strokeWidth="2" /></g>)}
        <text x="140" y="38" fill="#94aab8" fontSize="10" letterSpacing="2">CONFIGURATION / LIBRARY / STORAGE</text>
      </> : <>
        <rect x="80" y="44" width="400" height="192" rx="8" fill={`url(#metal-${kind})`} stroke="#415e71" />
        <path d="M105 193h350M105 150h350M105 107h350" stroke="#334958" strokeDasharray="3 6" />
        <path className="art-path" data-flow="4.5" d="M105 168h35l13-12 16 19 26-44 20 20 20-63 20 75 18-24 20 15 27-54 20 32h31l16-19 20 12h38" stroke="#a2c9dc" strokeWidth="2" />
        <text x="107" y="73" fill="#b8cfdd" fontSize="10" letterSpacing="2">RESOURCE / SERVICE</text><circle data-pulse="" cx="451" cy="68" r="3" fill="#a2c9dc" />
      </>}
    </svg><ProjectArtMotion /></div>
  </div>;
}
