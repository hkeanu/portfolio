"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { drawAfterimage } from "@/lib/afterimage";
import { site } from "@/lib/site";

const loopDuration = 6800;
const motionLabels = {
  play: "Play motion",
  pause: "Pause motion",
  resume: "Resume motion",
} as const;
type MotionAction = keyof typeof motionLabels;

export function AfterimageHero() {
  const artworkId = useId();
  const canvas = useRef<HTMLCanvasElement>(null);
  const activate = useRef<(() => void) | null>(null);
  const [motionAction, setMotionAction] = useState<MotionAction | null>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const artwork = canvas.current;
    const context = artwork?.getContext("2d");
    if (!artwork || !context) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let progress = 0;
    let frame: number | null = null;
    let started: number | null = null;
    let lastPaint = -Infinity;
    let wantsPlayback = !preference.matches;
    let onScreen = false;

    const paint = () => {
      if (width && height) drawAfterimage(context, width, height, progress);
    };

    function stop() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      started = null;
      lastPaint = -Infinity;
    }

    function tick(now: number) {
      started ??= now - progress * loopDuration;
      if (now - lastPaint >= 25) {
        progress = ((now - started) % loopDuration) / loopDuration;
        lastPaint = now;
        paint();
      }
      frame = requestAnimationFrame(tick);
    }

    function syncPlayback() {
      if (!wantsPlayback || !onScreen || document.hidden) {
        stop();
      } else if (frame === null) {
        frame = requestAnimationFrame(tick);
      }
    }

    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      syncPlayback();
    });

    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      if (!width || !height) return;
      const density = Math.min(window.devicePixelRatio || 1, 2);
      artwork.width = Math.max(1, Math.round(width * density));
      artwork.height = Math.max(1, Math.round(height * density));
      context.setTransform(artwork.width / width, 0, 0, artwork.height / height, 0, 0);
      paint();
      setRendered(true);
    });

    const syncPreference = () => {
      if (preference.matches) {
        wantsPlayback = false;
        syncPlayback();
        setMotionAction(progress ? "resume" : "play");
      }
    };

    activate.current = () => {
      wantsPlayback = !wantsPlayback;
      syncPlayback();
      setMotionAction(wantsPlayback ? "pause" : "resume");
    };

    resize.observe(artwork);
    visibility.observe(artwork);
    document.addEventListener("visibilitychange", syncPlayback);
    preference.addEventListener("change", syncPreference);
    setMotionAction(wantsPlayback ? "pause" : "play");
    return () => {
      stop();
      activate.current = null;
      resize.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      preference.removeEventListener("change", syncPreference);
    };
  }, []);

  return (
    <section className="hero">
      <div className="shell hero-inner">
        <div className="hero-copy" data-entrance>
          <p className="eyebrow">{site.name}</p>
          <h1>Curiosity,<br />put to <em>work.</em></h1>
          <p className="hero-description">I work with data, build automations, and explore the systems that connect them.</p>
          <div className="hero-actions">
            <a className="text-link" href="#selected-work">Explore my work <span aria-hidden="true">↓</span></a>
            <button
              className="hero-motion"
              type="button"
              aria-controls={artworkId}
              onClick={() => activate.current?.()}
              hidden={!motionAction}
            >
              <span aria-hidden="true">{motionAction === "pause" ? "Ⅱ" : "▶"}</span>
              {motionAction && motionLabels[motionAction]}
            </button>
          </div>
        </div>
        <figure
          className="hero-artwork"
          id={artworkId}
          role="img"
          aria-label="A steel-blue sculpture of woven loops and reflected light"
          data-rendered={rendered || undefined}
        >
          <Image src="/media/afterimage.webp" alt="" fill unoptimized fetchPriority="high" />
          <canvas ref={canvas} aria-hidden="true" />
        </figure>
      </div>
    </section>
  );
}
