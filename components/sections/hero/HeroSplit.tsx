"use client";
import { useState, useEffect, useRef } from "react";
import { ProfessionalHero } from "./ProfessionalHero";
import { TechHero } from "./TechHero";
import { Briefcase, Code, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";

export default function HeroSplit() {
  const [x, setX] = useState(0.5); // 0 = Tech fully shown, 1 = Professional fully shown
  const [skillsExitEarly, setSkillsExitEarly] = useState(false);
  const exitEarlyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitial = x === 0.5;
  const isProfessional = x === 1;
  const isTech = x === 0;
  const split = useSpring(0.5, { stiffness: 140, damping: 22, mass: 0.8 });
  const splitPercent = useTransform(split, (value) => `${value * 100}%`);
  const techClipPath = useMotionTemplate`inset(0 0 0 ${splitPercent})`;

  useEffect(() => {
    split.set(x);
  }, [x, split]);

  useEffect(() => {
    return () => {
      if (exitEarlyTimerRef.current) {
        clearTimeout(exitEarlyTimerRef.current);
      }
    };
  }, []);

  const goTo = (nextX: number) => {
    const returningToInitial = nextX === 0.5 && x !== 0.5;
    if (exitEarlyTimerRef.current) {
      clearTimeout(exitEarlyTimerRef.current);
      exitEarlyTimerRef.current = null;
    }
    setSkillsExitEarly(returningToInitial);
    setX(nextX);
    if (returningToInitial) {
      exitEarlyTimerRef.current = setTimeout(() => {
        setSkillsExitEarly(false);
      }, 420);
    }
  };

  return (
    <section className="relative w-full flex flex-col items-center overflow-hidden px-4 py-1">
      <Glassmorphism
        noShadow
        className="relative w-full max-w-7xl h-[600px] md:h-[80vh] min-h-[600px] max-h-[600px] overflow-hidden md:rounded-[2.5rem]"
      >
        {/* Navigation Buttons Layer */}
        <div className="absolute top-6 left-8 right-8 z-40 flex justify-between pointer-events-none">
          <div className="pointer-events-auto">
            {(isInitial || isTech) && (
              <Button
                variant="outline"
                className="rounded-full gap-2 bg-background/60 backdrop-blur-xl border-primary/20 hover:border-primary shadow-xl transition-all hover:scale-105 active:scale-95 px-5"
                onClick={() => goTo(1)}
              >
                <Briefcase size={16} className="text-primary" />
                <span className="font-bold text-sm">Explore Professional</span>
              </Button>
            )}
            {isProfessional && (
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-primary text-primary-foreground shadow-xl transition-all hover:scale-105 active:scale-95"
                onClick={() => goTo(0.5)}
                title="Reset View"
              >
                <RotateCcw size={18} />
              </Button>
            )}
          </div>

          <div className="pointer-events-auto">
            {(isInitial || isProfessional) && (
              <Button
                variant="outline"
                className="rounded-full gap-2 bg-background/60 backdrop-blur-xl border-primary/20 hover:border-primary shadow-xl transition-all hover:scale-105 active:scale-95 px-5"
                onClick={() => goTo(0)}
              >
                <span className="font-bold text-sm">Explore Tech Side</span>
                <Code size={16} className="text-primary" />
              </Button>
            )}
            {isTech && (
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-primary text-primary-foreground shadow-xl transition-all hover:scale-105 active:scale-95"
                onClick={() => goTo(0.5)}
                title="Reset View"
              >
                <RotateCcw size={18} />
              </Button>
            )}
          </div>
        </div>

        {/* Name Overlay */}
        <AnimatePresence>
          {isInitial && (
            <motion.div
              initial={{ top: "6%", opacity: 0, scale: 0.9 }}
              animate={{ top: "6%", opacity: 1, scale: 1 }}
              exit={{ top: "3%", opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute left-0 right-0 z-40 flex flex-col items-center pointer-events-none"
            >
              <div className="bg-background/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg p-2">
                <h1 className="text-xl md:text-3xl font-black text-foreground tracking-tight text-center uppercase whitespace-nowrap">
                  Jotin Kumar Madugula
                </h1>
                <div className="h-1 w-10 bg-primary mx-auto mt-1 rounded-full" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Content Container */}
        <div
          className={`relative w-full h-full pb-2 ${
            isInitial ? "pt-36 md:pt-40" : "pt-16 md:pt-20"
          }`}
        >
          {/* Left content: ProfessionalHero */}
          <motion.div
            className={`absolute inset-0 z-20 ${
              isInitial ? "translate-y-5 md:translate-y-6" : ""
            }`}
            initial={false}
            animate={{ opacity: isTech ? 0 : 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <ProfessionalHero
              current={isProfessional}
              isInitial={isInitial}
              skillsExitEarly={skillsExitEarly}
            />
          </motion.div>

          {/* Right content: TechHero (clipped) */}
          <motion.div
            className={`absolute inset-0 z-30 overflow-hidden ${
              isInitial ? "translate-y-5 md:translate-y-6" : ""
            }`}
            initial={false}
            style={{ clipPath: techClipPath }}
          >
            <TechHero
              current={isTech}
              isInitial={isInitial}
              skillsExitEarly={skillsExitEarly}
            />
          </motion.div>
        </div>

        {/* Thinner Separator Bar */}
        <motion.div
          className="absolute top-0 h-full w-[2px] -translate-x-1/2 bg-primary/30 z-40 shadow-[0_0_15px_rgba(var(--primary),0.3)]"
          initial={false}
          style={{ left: splitPercent }}
        />
      </Glassmorphism>
    </section>
  );
}
