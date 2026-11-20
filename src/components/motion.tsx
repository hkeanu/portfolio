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
        const mediaReveal = element.dataset.reveal === "media";
        gsap.fromTo(element, { y: mediaReveal ? 34 : 24, scale: mediaReveal ? .975 : 1, opacity: 0 }, {
          y: 0, scale: 1, opacity: 1, duration: mediaReveal ? 1 : .7, ease: "power2.out", clearProps: "transform,opacity",
          scrollTrigger: { trigger: element, start: "top 94%", once: true },
        });
      });
    });
    return () => media.revert();
  }, [pathname]);
  return null;
}
