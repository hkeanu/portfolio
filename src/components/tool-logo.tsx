import Image from "next/image";

const toolFiles: Record<string, string> = {
  Python: "python", R: "r", n8n: "n8n", Alteryx: "alteryx",
  PostgreSQL: "postgresql", Docker: "docker", "Docker Compose": "docker", Gitea: "gitea",
};

export function ToolLogo({ name, label = true }: { name: string; label?: boolean }) {
  const file = toolFiles[name];
  return <span className={`tool-logo${label ? "" : " tool-logo-symbol"}`}>
    {file && <Image src={`/media/tools/${file}.${file === "alteryx" ? "png" : "svg"}`} width={24} height={24} alt={label ? "" : name} unoptimized />}
    {label && <span>{name}</span>}
  </span>;
}

export function ToolStrip() {
  return <div className="tool-strip shell">
    <p className="eyebrow">Ideas take shape<br />with the right tools.</p>
    <ul aria-label="Tools in my practice">{["Python", "R", "n8n", "Alteryx", "PostgreSQL", "Docker"].map(name => <li key={name}><ToolLogo name={name} /></li>)}</ul>
  </div>;
}
