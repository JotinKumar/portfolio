"use client";
import { useState } from "react";
import { ProfessionalHero } from "./ProfessionalHero";
import { TechHero } from "./TechHero";
import { Briefcase, Code, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <div 
          className={`absolute left-0 right-0 z-40 flex flex-col items-center pointer-events-none transition-all duration-700 ease-in-out ${
            isInitial ? "top-[12%] opacity-100 scale-100" : "top-[5%] opacity-0 scale-90"
          }`}
        >
          <div className="bg-background/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
            <h1 className="text-xl md:text-3xl font-black text-foreground tracking-tight text-center uppercase">
              Jotin Kumar Madugula
            </h1>
            <div className="h-1 w-10 bg-primary mx-auto mt-1 rounded-full" />
          </div>
        </div>

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
          <div
            className="absolute inset-0 z-30 overflow-hidden transition-all duration-700 ease-in-out"
            style={{
              clipPath: `inset(0 0 0 calc(${x} * 100%))`,
            }}
          >
            <TechHero 
              current={isTech} 
              isInitial={isInitial}
            />
          </div>
        </div>

        {/* Thinner Separator Bar */}
        <div
          className="absolute top-0 h-full w-[1px] bg-primary/20 z-40 transition-all duration-700 ease-in-out"
          style={{
            left: `calc(${x} * 100%)`,
          }}
        />
      </div>
    </section>
  );
}
