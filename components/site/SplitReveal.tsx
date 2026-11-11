"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** "scroll": entra ao aparecer na tela; "ready": entra quando a abertura termina. */
  trigger?: "scroll" | "ready";
  by?: "chars" | "lines";
  delay?: number;
};

/** Título que entra letra a letra (ou linha a linha) subindo de dentro de uma máscara. */
export default function SplitReveal({ as: Tag = "h2", children, className, trigger = "scroll", by = "chars", delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      let split: SplitText | null = null;
      let tween: gsap.core.Tween | null = null;

      const run = () => {
        split = SplitText.create(el, {
          type: by === "chars" ? "lines,words,chars" : "lines",
          linesClass: "split-line",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            const targets = by === "chars" ? self.chars : self.lines;
            tween = gsap.from(targets, {
              yPercent: 110,
              rotate: by === "chars" ? 6 : 0,
              duration: by === "chars" ? 1.1 : 1,
              ease: "expo.out",
              stagger: by === "chars" ? 0.018 : 0.08,
              delay,
              scrollTrigger: trigger === "scroll" ? { trigger: el, start: "top 85%", once: true } : undefined,
            });
            return tween;
          },
        });
      };

      if (trigger === "ready") {
        gsap.set(el, { autoAlpha: 0 });
        const onReady = () => {
          gsap.set(el, { autoAlpha: 1 });
          run();
        };
        window.addEventListener("goldfibra:ready", onReady, { once: true });
        return () => {
          window.removeEventListener("goldfibra:ready", onReady);
          split?.revert();
        };
      }

      run();
      return () => split?.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
