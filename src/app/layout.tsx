import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageMotion } from "@/components/motion";
import { getSiteUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: getSiteUrl() ?? new URL("http://localhost:3000"),
  title: { default: "Keanu Holgado — A practice in curiosity", template: "%s — Keanu Holgado" },
  description: site.description,
  applicationName: "Keanu’s portfolio",
  openGraph: { title: "Keanu Holgado — A practice in curiosity", description: site.description, type: "website", locale: "en_US", siteName: site.name },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { themeColor: "#131510", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a><Header /><main id="main-content">{children}</main><Footer /><PageMotion /></body></html>;
}
