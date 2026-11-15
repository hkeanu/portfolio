"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function PageMotion() {
  const pathname = usePathname();
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach(element => {
        gsap.fromTo(element, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.85, ease: "power2.out", clearProps: "transform,opacity",
          scrollTrigger: { trigger: element, start: "top 94%", once: true },
        });
      });
    });
    return () => media.revert();
  }, [pathname]);
  return null;
}
