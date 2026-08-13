"use client";

import dynamic from "next/dynamic";
import { ComponentProps, ReactNode, Suspense } from "react";
import type { ScrollReveal as ScrollRevealType } from "./ScrollReveal";
import type { Tilt3D as Tilt3DType } from "./Tilt3D";

const ScrollRevealClient = dynamic(
  () => import("./ScrollReveal").then((m) => m.ScrollReveal),
  { ssr: false }
);

const Tilt3DClient = dynamic(
  () => import("./Tilt3D").then((m) => m.Tilt3D),
  { ssr: false }
);

function RevealFallback({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function ScrollReveal(props: ComponentProps<typeof ScrollRevealType>) {
  const { children, className = "" } = props;
  return (
    <Suspense fallback={<RevealFallback className={className}>{children}</RevealFallback>}>
      <ScrollRevealClient {...props} />
    </Suspense>
  );
}

export function Tilt3D(props: ComponentProps<typeof Tilt3DType>) {
  const { children, className = "" } = props;
  return (
    <Suspense fallback={<div className={className}>{children}</div>}>
      <Tilt3DClient {...props} />
    </Suspense>
  );
}
