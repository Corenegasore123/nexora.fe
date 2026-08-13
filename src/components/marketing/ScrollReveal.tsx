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

export function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 700,
  className = "",
  immediate = false,
  threshold = 0.12,
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
    if (immediate) return;

    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [immediate, threshold]);

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
