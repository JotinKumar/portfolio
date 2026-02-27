import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export function TechHero({
  current = false,
  isInitial = false,
}: {
  current?: boolean;
  isInitial?: boolean;
}) {
  const techColors = [
    "bg-rose-500 hover:bg-rose-600",
    "bg-amber-500 hover:bg-amber-600",
    "bg-emerald-500 hover:bg-emerald-600",
    "bg-sky-500 hover:bg-sky-600",
    "bg-indigo-500 hover:bg-indigo-600",
    "bg-violet-500 hover:bg-violet-600",
    "bg-fuchsia-500 hover:bg-fuchsia-600",
    "bg-orange-500 hover:bg-orange-600",
  ];

  const allSkills = [
    "Python",
    "Node.js",
    "React",
    "Next.js",
    "TypeScript",
    "AI & ML",
    "Excel & VBA",
    "RPA & Automation",
    "Full Stack",
    "UI Design",
  ];

  const initialSkills = ["AI & ML", "Next.js", "Python", "Full Stack"];
  const displaySkills = isInitial ? initialSkills : allSkills;

  return (
    <motion.div 
      className="w-full h-full bg-background grid items-center overflow-hidden"
      initial={false}
      animate={{
        gridTemplateColumns: current 
          ? "0.1fr minmax(0, 1fr) minmax(0, 1.2fr)" 
          : "minmax(0, 1fr) 336px minmax(0, 1fr)"
      }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Left placeholder: Animate to nearly 0 */}
      <div className="w-full h-full overflow-hidden" />

      {/* Left/Middle: Image Area */}
      <div className="flex items-center justify-center h-full overflow-hidden">
        <motion.div 
          layout="position"
          className={`${current ? "w-[400px] h-[520px]" : "w-[336px] h-[432px]"} rounded-[2.5rem] overflow-hidden bg-muted relative shadow-[0_20px_50px_rgba(0,0,0,0.3)] group transition-all duration-700`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
          <Image
            src="/images/tech-portrait.jpg"
            alt="Tech Hero"
            width={400}
            height={520}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            priority
          />
        </motion.div>
      </div>

      {/* Right: Tech Content */}
      <div
        className={`flex justify-start items-center h-full transition-all duration-700 ${
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
                  <h1 className="text-2xl md:text-4xl font-black mb-1 text-foreground tracking-tighter uppercase whitespace-nowrap">
                    Jotin Kumar Madugula
                  </h1>
                  <motion.div 
                    layoutId="tech-underline"
                    className="h-1.5 w-20 bg-primary rounded-full" 
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className={`space-y-3 flex flex-col ${current ? "items-start" : "items-end"}`}>
              <h2 className={`${isInitial ? "text-lg" : "text-xl md:text-2xl"} text-primary font-bold uppercase tracking-wide whitespace-nowrap`}>
                Self-Taught Tech Enthusiast
              </h2>
              <p className={`${isInitial ? "text-base max-w-md" : "text-lg md:text-xl max-w-2xl"} text-muted-foreground leading-relaxed`}>
                An enthusiastic explorer of modern technologies, self-learning AI, Machine Learning, and Full Stack frameworks. Passionate about understanding how things work and building projects to stay on the pulse of innovation.
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
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      delay: index * 0.02 
                    }}
                  >
                    <Badge
                      variant="default"
                      className={`rounded-full px-3 py-1 text-[8px] md:text-[9px] uppercase tracking-widest font-black text-white border-none shadow-md whitespace-nowrap ${
                        techColors[index % techColors.length]
                      }`}
                    >
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 ${isInitial ? "scale-90 origin-right" : ""}`}>
              <Button variant="outline" asChild className="rounded-full px-8 py-5 text-base font-bold border-2 hover:bg-primary/5 transition-all active:scale-95">
                <a href="/projects">View Projects</a>
              </Button>
              <Button asChild className="rounded-full px-8 py-5 text-base font-bold shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
                <a href="/articles">View Articles</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
