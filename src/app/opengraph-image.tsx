import { ImageResponse } from "next/og";
export const alt = "Keanu Holgado — Curiosity, put to work.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ background: "#131510", color: "#eeeae1", width: "100%", height: "100%", padding: 80, display: "flex", flexDirection: "column", justifyContent: "space-between" }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 24 }}><span>keanu.</span><span style={{ color: "#bdd39b", fontSize: 18 }}>DATA / AUTOMATION / SYSTEMS</span></div><div style={{ display: "flex", flexDirection: "column", fontSize: 100, lineHeight: 1.05, letterSpacing: -5 }}><span>Curiosity,</span><span>put to <span style={{ color: "#bdd39b", fontStyle: "italic" }}>work.</span></span></div><div style={{ fontSize: 20, color: "#a3a79a" }}>Keanu Holgado · A practice in progress</div></div>, size);
}
