export function SystemSculpture({ small = false }: { small?: boolean }) {
  return <div className={`system-sculpture ${small ? "sculpture-small" : ""}`}>
    <svg viewBox="0 0 600 560" fill="none" role="img" aria-label="Four connected layers representing data, automation, documentation, and infrastructure">
      <defs>
        <linearGradient id={small ? "plate-small" : "plate"} x1="130" y1="100" x2="480" y2="460" gradientUnits="userSpaceOnUse"><stop stopColor="#363d30" /><stop offset="1" stopColor="#171b16" /></linearGradient>
        <linearGradient id={small ? "edge-small" : "edge"} x1="100" y1="200" x2="470" y2="200" gradientUnits="userSpaceOnUse"><stop stopColor="#444d37" /><stop offset=".48" stopColor="#b5cc8e" /><stop offset="1" stopColor="#444d37" /></linearGradient>
        <radialGradient id={small ? "halo-small" : "halo"}><stop stopColor="#879d61" stopOpacity=".17" /><stop offset="1" stopColor="#879d61" stopOpacity="0" /></radialGradient>
        <pattern id={small ? "grid-small" : "grid"} width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" stroke="#93a17f" strokeOpacity=".085" /></pattern>
      </defs>
      <rect width="600" height="560" fill={`url(#${small ? "grid-small" : "grid"})`} />
      <ellipse cx="310" cy="315" rx="270" ry="235" fill={`url(#${small ? "halo-small" : "halo"})`} />
      <path d="M65 384 312 524 552 386M65 416 312 556 552 418" stroke="#63704e" strokeOpacity=".16" />
      <path d="M300 65v417" stroke="#a7bd85" strokeOpacity=".25" strokeDasharray="3 7" />
      {[{ y: 325, label: "01 / OPERATE", detail: "Infrastructure", x: 0 }, { y: 252, label: "02 / AUTOMATE", detail: "Connections", x: 1 }, { y: 179, label: "03 / DOCUMENT", detail: "Understanding", x: 2 }, { y: 106, label: "04 / EXPLORE", detail: "Possibilities", x: 3 }].map(layer => <g key={layer.label} className={`sculpture-layer layer-${layer.x}`}>
        <path d={`M110 ${layer.y + 75} 300 ${layer.y - 34} 490 ${layer.y + 75}v19L300 ${layer.y + 204} 110 ${layer.y + 94}Z`} fill="#151914" stroke="#596448" strokeOpacity=".65" />
        <path d={`M110 ${layer.y + 75} 300 ${layer.y - 34} 490 ${layer.y + 75} 300 ${layer.y + 185}Z`} fill={`url(#${small ? "plate-small" : "plate"})`} stroke={`url(#${small ? "edge-small" : "edge"})`} />
        <path d={`M141 ${layer.y + 75} 300 ${layer.y - 16} 459 ${layer.y + 75} 300 ${layer.y + 167}Z`} stroke="#7b8c60" strokeOpacity=".22" />
        <path d={`m211 ${layer.y + 46} 89 51 87-50M300 ${layer.y + 97}v49`} stroke="#9aac80" strokeOpacity=".3" />
        <ellipse cx="300" cy={layer.y + 75} rx="24" ry="14" fill="#b6cc90" fillOpacity=".09" stroke="#b6cc90" strokeOpacity=".65" />
        <path d={`m291 ${layer.y + 75} 9-5 9 5-9 5Z`} fill="#b6cc90" />
        <circle cx="125" cy={layer.y + 92} r="2" fill="#c3da9e" />
        <text x="147" y={layer.y + 106} transform={`rotate(30 147 ${layer.y + 106})`} fill="#bac5aa" fontSize="9" fontFamily="monospace" letterSpacing="1.2">{layer.label}</text>
      </g>)}
      <path d="M300 44v27m-5-5 5 5 5-5" stroke="#b6cc90" strokeWidth="1.2" />
      <circle cx="300" cy="36" r="3" fill="#b6cc90" className="sculpture-signal" />
      <path d="M38 45h17M38 45v17M562 45h-17M562 45v17M38 520h17M38 520v-17M562 520h-17M562 520v-17" stroke="#566247" />
    </svg>
    {!small && <div className="sculpture-caption mono"><span>Connected by curiosity</span><span>FIG. 001 ↗</span></div>}
  </div>;
}
