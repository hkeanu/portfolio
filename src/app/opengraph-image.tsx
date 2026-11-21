import { ImageResponse } from "next/og";
export const alt = "Keanu Holgado — Curiosity, connected.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ background: "#0b1412", color: "#edf3eb", width: "100%", height: "100%", padding: 80, display: "flex", flexDirection: "column", justifyContent: "space-between" }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 24 }}><span>keanu.</span><span style={{ color: "#b9dfc4", fontSize: 18 }}>DATA / AUTOMATION / SYSTEMS</span></div><div style={{ display: "flex", flexDirection: "column", fontSize: 112, lineHeight: 1.05, letterSpacing: -5 }}><span>Curiosity,</span><span style={{ color: "#b9dfc4", fontStyle: "italic" }}>connected.</span></div><div style={{ fontSize: 20, color: "#b2c2b8" }}>Keanu Holgado · A connected practice</div></div>, size);
}
