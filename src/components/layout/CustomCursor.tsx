"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const move = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    };

    const grow = () => {
      el.style.width = "48px";
      el.style.height = "48px";
    };
    const shrink = () => {
      el.style.width = "28px";
      el.style.height = "28px";
    };

    window.addEventListener("mousemove", move);
    document.querySelectorAll("a, button, [data-cursor-hover]").forEach((node) => {
      node.addEventListener("mouseenter", grow);
      node.addEventListener("mouseleave", shrink);
    });

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return <div ref={ref} className="custom-cursor hidden md:block" aria-hidden="true" />;
}
