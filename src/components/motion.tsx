"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

export function PageMotion() {
  const pathname = usePathname();
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, CustomEase);
    CustomEase.create("studio-out", "0.23,1,0.32,1");
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      if (document.documentElement.dataset.navigationInput === "keyboard") return;
      // A route transition carries visible content as one surface. Avoid a
      // second entrance inside its snapshot; lower sections can still reveal.
      const inRouteTransition = document.documentElement.dataset.routeArrival === "transition";
      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach(group => {
        const items = Array.from(group.querySelectorAll<HTMLElement>("[data-reveal]"));
        if (inRouteTransition && group.getBoundingClientRect().top < innerHeight) return;
        gsap.fromTo(items, { y: i => i === 0 ? 24 : 16, opacity: 0 }, {
          y: 0, opacity: 1, duration: i => i === 0 ? .6 : .5,
          stagger: i => [0, .07, .12][Math.min(i, 2)], ease: "studio-out", clearProps: "transform,opacity",
          onComplete: () => items.forEach(item => item.classList.add("is-revealed")),
          scrollTrigger: { trigger: group, start: "top 93%", once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").filter(element => !element.closest("[data-reveal-group]")).forEach(element => {
        if (inRouteTransition && element.getBoundingClientRect().top < innerHeight) return;
        const mediaReveal = element.dataset.reveal === "media";
        gsap.fromTo(element, { y: mediaReveal ? 20 : 14, opacity: 0 }, {
          y: 0, opacity: 1, duration: mediaReveal ? .6 : .48, ease: "studio-out", clearProps: "transform,opacity",
          scrollTrigger: { trigger: element, start: "top 94%", once: true },
        });
      });
    });
    return () => media.revert();
  }, [pathname]);
  return null;
}
