"use client";
import { useState } from "react";
import { ProfessionalHero } from "./ProfessionalHero";
import { TechHero } from "./TechHero";
import { Briefcase, Code, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroSplit() {
  const [x, setX] = useState(0.5); // 0 = Tech fully shown, 1 = Professional fully shown
  const isInitial = x === 0.5;
  const isProfessional = x === 1;
  const isTech = x === 0;

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center bg-background overflow-hidden px-4 md:px-8">
      <div
        className="relative w-full max-w-7xl h-full md:h-[80vh] min-h-[600px] max-h-[800px] overflow-hidden md:rounded-[2.5rem] shadow-2xl border border-primary/5 bg-card"
      >
        {/* Navigation Buttons Layer */}
        <div className="absolute top-6 left-8 right-8 z-50 flex justify-between pointer-events-none">
          <div className="pointer-events-auto">
            {(isInitial || isTech) && (
              <Button
                variant="outline"
                className="rounded-full gap-2 bg-background/60 backdrop-blur-xl border-primary/20 hover:border-primary shadow-xl transition-all hover:scale-105 active:scale-95 px-5"
                onClick={() => setX(1)}
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
                onClick={() => setX(0.5)}
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
                onClick={() => setX(0)}
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
                onClick={() => setX(0.5)}
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
              initial={{ top: "12%", opacity: 0, scale: 0.9 }}
              animate={{ top: "12%", opacity: 1, scale: 1 }}
              exit={{ top: "5%", opacity: 0, scale: 0.9 }}
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
        <div className="relative w-full h-full">
          {/* Left content: ProfessionalHero */}
          <div className="absolute inset-0 z-20">
            <ProfessionalHero 
              current={isProfessional} 
              isInitial={isInitial}
            />
          </div>

          {/* Right content: TechHero (clipped) */}
          <motion.div
            className="absolute inset-0 z-30 overflow-hidden"
            initial={false}
            animate={{
              clipPath: `inset(0 0 0 ${x * 100}%)`,
            }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <TechHero 
              current={isTech} 
              isInitial={isInitial}
            />
          </motion.div>
        </div>

        {/* Thinner Separator Bar */}
        <motion.div
          className="absolute top-0 h-full w-[2px] bg-primary/30 z-40 shadow-[0_0_15px_rgba(var(--primary),0.3)]"
          initial={false}
          animate={{
            left: `${x * 100}%`,
          }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </section>
  );
}
