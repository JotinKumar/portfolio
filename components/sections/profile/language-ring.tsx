"use client";

import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type LanguageRingProps = {
  label: string;
  proficiency: number;
  placeholder?: boolean;
};

export function LanguageRing({ label, proficiency, placeholder = false }: LanguageRingProps) {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ringRef, { once: true, amount: 0.4 });
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(prefersReducedMotion ? proficiency : 0);
  const circumference = 2 * Math.PI * 24;
  const dashOffset = circumference - (circumference * displayValue) / 100;

  useEffect(() => {
    if (placeholder) return;
    if (prefersReducedMotion) {
      setDisplayValue(proficiency);
      return;
    }
    if (!isInView) return;

    const controls = animate(0, proficiency, {
      duration: 1.15,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (value) => setDisplayValue(Math.round(value)),
    });

    return () => controls.stop();
  }, [isInView, placeholder, prefersReducedMotion, proficiency]);

  return (
    <div ref={ringRef} className="flex flex-col items-center gap-2 text-center">
      <div className="relative grid size-[3.7rem] place-items-center">
        <svg className="-rotate-90 size-full" viewBox="0 0 56 56" aria-hidden="true">
          <circle
            cx="28"
            cy="28"
            r="24"
            fill="none"
            stroke="color-mix(in oklch, var(--color-border) 75%, transparent)"
            strokeWidth="5"
            strokeDasharray={placeholder ? "3 5" : undefined}
          />
          {placeholder ? null : (
            <motion.circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="var(--color-foreground)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: dashOffset }}
              initial={{ strokeDashoffset: circumference }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 1.15, ease: [0.22, 1, 0.36, 1] }
              }
            />
          )}
        </svg>
        <div
          className={`absolute inset-[0.55rem] grid place-items-center rounded-full ${
            placeholder ? "border border-dashed border-border/60 bg-transparent" : "bg-card"
          }`}
        >
          <span className="type-body text-[0.72rem]">{placeholder ? "..." : `${displayValue}%`}</span>
        </div>
      </div>

      <div className="space-y-1">
        <p className="type-body text-[0.88rem]">{label}</p>
        {placeholder ? <p className="type-meta text-muted-foreground">Set in settings</p> : null}
      </div>
    </div>
  );
}
