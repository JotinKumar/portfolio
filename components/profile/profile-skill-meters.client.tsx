"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { ProfileSidebarBlock } from "@/components/profile/profile-sidebar-block";

type SkillMeterEntry = {
  label: string;
  level: number;
  placeholder?: boolean;
};

export function ProfileSkillMeters({
  title,
  items,
  className,
  animateOnView = false,
}: {
  title: string;
  items: SkillMeterEntry[];
  className?: string;
  animateOnView?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const skillsInView = useInView(containerRef, { once: true, amount: 0.35 });
  const prefersReducedMotion = useReducedMotion();

  return (
    <div ref={containerRef}>
      <ProfileSidebarBlock title={title} className={className}>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={`${title}-${item.label}-${index}`} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <span className="type-body">{item.label}</span>
                <span className="type-meta text-muted-foreground">{item.placeholder ? "pending" : `${item.level}%`}</span>
              </div>
              <div className="h-2 border border-border/60 bg-transparent">
                <motion.div
                  className={`h-full origin-left ${item.placeholder ? "scale-x-0" : "bg-foreground"}`}
                  initial={prefersReducedMotion ? false : { scaleX: 0 }}
                  animate={
                    item.placeholder
                      ? { scaleX: 0 }
                      : prefersReducedMotion
                        ? { scaleX: 1 }
                        : animateOnView
                          ? { scaleX: skillsInView ? item.level / 100 : 0 }
                          : { scaleX: 1 }
                  }
                  transition={{
                    duration: 0.9,
                    delay: prefersReducedMotion ? 0 : index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </ProfileSidebarBlock>
    </div>
  );
}
