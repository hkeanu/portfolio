"use client";

import NextLink from "next/link";
import { useRef, type ComponentProps } from "react";
import { usePageTransition } from "./page-transitions";

// Preserve Next Link's prefetch, modified clicks, native anchors, focus/scroll
// handling, and no-JS links. Only eligible client navigations are enhanced.
export default function TransitionLink({ onNavigate, onClick, ...props }: ComponentProps<typeof NextLink>) {
  const navigate = usePageTransition();
  const keyboard = useRef(false);
  return <NextLink {...props} onClick={event => {
    keyboard.current = event.detail === 0;
    document.documentElement.dataset.navigationInput = keyboard.current ? "keyboard" : "pointer";
    onClick?.(event);
  }} onNavigate={event => {
    let cancelled = false;
    onNavigate?.({ preventDefault: () => { cancelled = true; event.preventDefault(); } });
    if (cancelled || keyboard.current || typeof props.href !== "string") return;
    if (navigate(props.href, { replace: props.replace, scroll: props.scroll })) event.preventDefault();
  }} />;
}
