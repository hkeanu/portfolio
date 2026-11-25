"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

type Navigate = (href: string, options: { replace?: boolean; scroll?: boolean }) => boolean;
const NavigationContext = createContext<Navigate>(() => false);
export const usePageTransition = () => useContext(NavigationContext);

export function PageTransitions({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const pending = useRef<{ destination: string; scroll: boolean; hash: string; finish: () => void } | null>(null);
  const active = useRef<ViewTransition | null>(null);

  useLayoutEffect(() => {
    if (pending.current?.destination === pathname) {
      // Resolve only after the App Router commits the destination, rather than
      // photographing the outgoing page twice during an asynchronous push.
      // A view-transition update suspends painting. Waiting for rAF here would
      // deadlock the snapshot until the watchdog, even after React committed.
      // Own the scroll reset inside the update callback. Next's deferred
      // scroll handling can otherwise photograph the article at the old
      // gallery offset while the browser has suspended painting.
      if (pending.current.scroll) {
        const target = pending.current.hash ? document.getElementById(decodeURIComponent(pending.current.hash.slice(1))) : null;
        if (target) target.scrollIntoView({ behavior: "instant" });
        else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
      document.getElementById("main-content")?.focus({ preventScroll: true });
      pending.current.finish();
    }
  }, [pathname]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const skip = () => {
      active.current?.skipTransition();
      pending.current?.finish();
    };
    const onPreference = () => { if (preference.matches) skip(); };
    window.addEventListener("popstate", skip);
    preference.addEventListener("change", onPreference);
    return () => {
      skip();
      delete document.documentElement.dataset.pageTransition;
      delete document.documentElement.dataset.projectTransition;
      window.removeEventListener("popstate", skip);
      preference.removeEventListener("change", onPreference);
    };
  }, []);

  const navigate = useCallback<Navigate>((href, options) => {
    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    const url = new URL(href, location.href);
    if (url.origin !== location.origin || url.pathname === location.pathname) return false;

    active.current?.skipTransition();
    pending.current?.finish();
    document.documentElement.dataset.pageTransition = "running";
    document.documentElement.dataset.routeArrival = "transition";
    delete document.documentElement.dataset.projectTransition;
    if (url.pathname.startsWith("/homelab/services/")) {
      const slug = url.pathname.split("/").pop();
      const artwork = Array.from(document.querySelectorAll<HTMLElement>(".project-art")).find(element =>
        getComputedStyle(element).viewTransitionName === `project-${slug}`);
      const bounds = artwork?.getBoundingClientRect();
      // Only open a portal when a visible source frame can carry into the article.
      if (bounds && bounds.bottom > 0 && bounds.top < innerHeight) document.documentElement.dataset.projectTransition = slug;
    }
    const transition = document.startViewTransition(() => new Promise<void>(resolve => {
      const finish = () => {
        clearTimeout(timeout);
        if (pending.current?.finish === finish) pending.current = null;
        resolve();
      };
      // Slow navigation must not leave a frozen snapshot covering the website.
      const timeout = setTimeout(() => { transition.skipTransition(); finish(); }, 1800);
      pending.current = { destination: url.pathname, scroll: options.scroll !== false, hash: url.hash, finish };
      if (options.replace) router.replace(href, { scroll: false });
      else router.push(href, { scroll: false });
    }));
    active.current = transition;
    const clear = () => {
      if (active.current !== transition) return;
      active.current = null;
      delete document.documentElement.dataset.pageTransition;
      delete document.documentElement.dataset.projectTransition;
    };
    void transition.ready.catch(() => {}); // A skipped animation still navigates.
    void transition.finished.then(clear, clear);
    return true;
  }, [router]);

  return <NavigationContext.Provider value={navigate}>{children}</NavigationContext.Provider>;
}
