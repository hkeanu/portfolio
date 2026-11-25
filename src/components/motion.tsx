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
    const start = () => media.add("(prefers-reduced-motion: no-preference)", () => {
      // A route transition carries visible content as one surface. Avoid a
      // second entrance inside its snapshot; lower sections can still reveal.
      const inRouteTransition = document.documentElement.dataset.routeArrival === "transition";
      gsap.utils.toArray<HTMLElement>("[data-reveal-lines]").forEach(heading => {
        if (inRouteTransition && heading.getBoundingClientRect().top < innerHeight) return;
        gsap.fromTo(heading.querySelectorAll("[data-heading-line]"), { yPercent: 110, opacity: .15 }, {
          yPercent: 0, opacity: 1, duration: 1, stagger: .08,
          ease: "none",
          scrollTrigger: { trigger: heading, start: "top 92%", end: "top 62%", scrub: .35 },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach(group => {
        const items = Array.from(group.querySelectorAll<HTMLElement>("[data-reveal]"));
        if (inRouteTransition && group.getBoundingClientRect().top < innerHeight) return;
        items.forEach((item, i) => {
          gsap.fromTo(item, { y: 96, scale: .92, rotation: i === 0 ? 0 : i % 2 ? -2 : 2, opacity: .15 }, {
            y: 0, scale: 1, rotation: 0, opacity: 1, ease: "none",
            scrollTrigger: { trigger: item, start: "top 96%", end: "top 52%", scrub: .4 },
          });
          // The artwork explains the project as it enters: draw its connections
          // once, instead of fading an already completed diagram into view.
          const paths = Array.from(item.querySelectorAll<SVGPathElement>(".project-art path[stroke]"));
          paths.forEach(path => {
            const length = path.getTotalLength();
            gsap.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, {
              strokeDashoffset: 0, duration: 1.1, ease: "studio-out",
              scrollTrigger: { trigger: item, start: "top 78%", once: true },
            });
          });
        });
      });
      gsap.utils.toArray<HTMLElement>(".lab-preview").forEach(preview => {
        gsap.fromTo(preview, { rotationX: 12, rotationY: -10, y: 80, scale: .9, opacity: .2 }, {
          rotationX: 0, rotationY: 0, y: 0, scale: 1, opacity: 1, ease: "none",
          scrollTrigger: { trigger: preview, start: "top 96%", end: "top 48%", scrub: .4 },
        });
        const flow = gsap.timeline({ scrollTrigger: { trigger: preview, start: "top 75%", once: true } });
        flow.fromTo(preview.querySelectorAll(".preview-branches span"), { scaleY: 0, transformOrigin: "top" }, { scaleY: 1, duration: .7, ease: "studio-out" })
          .fromTo(preview.querySelectorAll(".preview-services > span"), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .48, stagger: { each: .07, ease: "power2.out" }, ease: "studio-out" }, "-=.25");
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").filter(element => !element.closest("[data-reveal-group]")).forEach(element => {
        if (element.matches(".lab-preview")) return;
        if (inRouteTransition && element.getBoundingClientRect().top < innerHeight) return;
        const mediaReveal = element.dataset.reveal === "media";
        gsap.fromTo(element, { y: mediaReveal ? 20 : 14, opacity: 0 }, {
          y: 0, opacity: 1, duration: mediaReveal ? .6 : .48, ease: "studio-out", clearProps: "transform,opacity",
          scrollTrigger: { trigger: element, start: "top 94%", once: true },
        });
      });
    });
    // Keyboard arrival must remain immediate, but must not permanently disable
    // subsequent mouse/touch scrolling on this route. Initialize before the
    // first native scroll, with no listener cancelling or hijacking the gesture.
    const resume = () => { detach(); start(); ScrollTrigger.refresh(); };
    const detach = () => {
      window.removeEventListener("wheel", resume);
      window.removeEventListener("touchmove", resume);
    };
    if (document.documentElement.dataset.navigationInput === "keyboard") {
      window.addEventListener("wheel", resume, { passive: true });
      window.addEventListener("touchmove", resume, { passive: true });
    } else start();
    return () => { detach(); media.revert(); };
  }, [pathname]);
  return null;
}
