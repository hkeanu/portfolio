"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

let paused = false;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
const isPaused = () => paused;

export function ProjectArtMotionToggle() {
  const stopped = useSyncExternalStore(subscribe, isPaused, () => false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <button className="project-motion-toggle mono" type="button" aria-pressed={stopped} onClick={() => {
    paused = !paused;
    listeners.forEach(listener => listener());
  }}>{stopped ? "Play diagram motion" : "Pause diagram motion"}</button>;
}

export function ProjectArtMotion() {
  const mount = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData || (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2)) return;
    let visible = false;
    let cancelled = false;
    let loading = false;
    let failed = false;
    let scene: { sync: () => void; dispose: () => void } | undefined;
    const active = () => visible && !document.hidden && !preference.matches && !isPaused();
    const sync = () => {
      if (preference.matches) { scene?.dispose(); scene = undefined; }
      scene?.sync();
      if (!active() || scene || loading || failed) return;
      loading = true;
      void import("./project-art-scene").then(({ createProjectArtScene }) => {
        if (!cancelled && !preference.matches) scene = createProjectArtScene(host, active);
      }).catch(() => { failed = true; }).finally(() => { loading = false; });
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(host);
    preference.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    const unsubscribe = subscribe(sync);
    return () => {
      cancelled = true;
      observer.disconnect();
      preference.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      unsubscribe();
      scene?.dispose();
    };
  }, []);
  return <div ref={mount} className="project-art-motion" />;
}
