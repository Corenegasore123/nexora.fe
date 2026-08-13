"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

type Animation = "fade-up" | "fade-down" | "fade-in" | "fade-left" | "fade-right" | "scale" | "blur-up";

const ANIMATION_CLASS: Record<Animation, string> = {
  "fade-up": "reveal-fade-up",
  "fade-down": "reveal-fade-down",
  "fade-in": "reveal-fade-in",
  "fade-left": "reveal-fade-left",
  "fade-right": "reveal-fade-right",
  scale: "reveal-scale",
  "blur-up": "reveal-blur-up",
};

type RevealCallback = () => void;

let sharedObserver: IntersectionObserver | null = null;
const revealCallbacks = new WeakMap<Element, RevealCallback>();

function getSharedObserver(threshold: number, rootMargin: string) {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          revealCallbacks.get(entry.target)?.();
          sharedObserver?.unobserve(entry.target);
          revealCallbacks.delete(entry.target);
        }
      },
      { threshold, rootMargin }
    );
  }
  return sharedObserver;
}

export function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 600,
  className = "",
  immediate = false,
  threshold = 0.1,
}: {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  duration?: number;
  className?: string;
  immediate?: boolean;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(immediate);

  useEffect(() => {
    if (immediate || visible) return;

    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = getSharedObserver(threshold, "0px 0px -32px 0px");
    revealCallbacks.set(el, () => setVisible(true));
    observer.observe(el);

    return () => {
      observer.unobserve(el);
      revealCallbacks.delete(el);
    };
  }, [immediate, threshold, visible]);

  return (
    <div
      ref={ref}
      className={`reveal ${ANIMATION_CLASS[animation]} ${visible ? "reveal-visible" : ""} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
