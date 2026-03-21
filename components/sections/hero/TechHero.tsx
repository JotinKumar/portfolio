import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import type { HeroContent } from "@/lib/db-types";

export function TechHero({
  heroContent,
  current = false,
  isInitial = false,
  skillsExitEarly = false,
}: {
  heroContent: HeroContent;
  current?: boolean;
  isInitial?: boolean;
  skillsExitEarly?: boolean;
}) {
  const allSkills = heroContent.techSkills;
  const initialSkills = heroContent.techInitialSkills;
  const displaySkills = isInitial ? initialSkills : allSkills;

  return (
    <motion.div 
      className="w-full h-full grid items-center overflow-hidden bg-background/50"
      initial={false}
      animate={{
        gridTemplateColumns: current 
          ? "minmax(0px, 0.1fr) 400px minmax(0, 1.2fr)" 
          : "minmax(0, 1fr) 336px minmax(0, 1fr)"
      }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Left placeholder: Animate to nearly 0 */}
      <div className="w-full h-full overflow-hidden" />

      {/* Left/Middle: Image Area */}
      <div className="flex items-center justify-center h-full overflow-hidden">
        <motion.div 
          layout
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className={`${current ? "w-[400px] h-[520px]" : "w-[336px] h-[432px]"} rounded-[2.5rem] overflow-hidden bg-muted relative group`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
          <Image
            src={heroContent.techImageUrl}
            alt="Tech Hero"
            fill
            sizes="(max-width: 768px) 336px, 400px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
        </motion.div>
      </div>

      {/* Right: Tech Content */}
      <div
        className={`flex ${current ? "justify-end" : "justify-start"} items-center h-full transition-all duration-700 ${
          current || isInitial ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
        } ${current ? "px-12 md:px-20" : "px-4 md:px-6"}`}
      >
        <div className={`${current ? "h-[480px]" : "h-[432px]"} w-full max-w-xl flex flex-col py-2 overflow-hidden ${current ? "text-left" : "text-right"}`}>
          {/* Top Section: Heading and Description */}
          <div className={`flex flex-col ${current ? "items-start" : "items-end"}`}>
            <AnimatePresence mode="wait">
              {current && (
                <motion.div 
                  key="tech-title"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: "1.5rem" }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden flex flex-col items-start"
                >
                  <h1 className="type-section-title mb-1 text-[clamp(2rem,2vw+1rem,3rem)] whitespace-nowrap">
                    {heroContent.displayName}
                  </h1>
                  <motion.div 
                    layoutId="tech-underline"
                    className="h-px w-20 bg-primary" 
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className={`space-y-3 flex flex-col ${current ? "items-start" : "items-end"}`}>
              <h2 className={`${isInitial ? "type-nav text-[0.95rem]" : "type-card-title text-[1.35rem] md:text-[1.7rem]"} whitespace-nowrap`}>
                {heroContent.techTitle}
              </h2>
              <p className={`${isInitial ? "type-body max-w-md" : "type-body-lg max-w-2xl"} text-muted-foreground`}>
                {heroContent.techSubtitle}
              </p>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom Section: Skills and Buttons */}
          <div className={`flex flex-col gap-6 ${current ? "items-start" : "items-end"}`}>
            <motion.div 
              layout
              className={`flex flex-wrap gap-2 max-w-xl pb-2 ${current ? "justify-start" : "justify-end"}`}
            >
              <AnimatePresence mode="popLayout">
                {displaySkills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                      transition: {
                        duration: skillsExitEarly ? 0.16 : 0.28,
                        ease: "easeIn",
                      },
                    }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      delay: index * 0.02 
                    }}
                  >
                    <Badge
                      variant="outline"
                      className="border-foreground/18 bg-transparent px-3 py-1 text-[8px] md:text-[9px] text-foreground shadow-none whitespace-nowrap"
                    >
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 ${isInitial ? "scale-90 origin-right" : ""}`}>
              <Button variant="outline" asChild className="rounded-full border-2 px-8 py-5 text-base transition-all hover:bg-primary/5 active:scale-95">
                <Link href="/projects">{heroContent.viewProjectsLabel}</Link>
              </Button>
              <Button asChild className="rounded-full px-8 py-5 text-base shadow-lg transition-all hover:shadow-primary/20 active:scale-95">
                <Link href="/blogs">{heroContent.viewArticlesLabel}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
