import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export function ProfessionalHero({
  current = false,
  isInitial = false,
  skillsExitEarly = false,
}: {
  current?: boolean;
  isInitial?: boolean;
  skillsExitEarly?: boolean;
}) {
  const professionalColors = [
    "bg-slate-600",
    "bg-blue-700",
    "bg-indigo-800",
    "bg-cyan-700",
    "bg-teal-700",
    "bg-sky-700",
    "bg-zinc-700",
    "bg-blue-900",
  ];

  const allSkills = [
    "Pricing & RFX",
    "Ops Leadership",
    "Cost Modeling",
    "Process Re-engineering",
    "Financial Analysis",
    "RPA & Automation",
    "Price-to-Win Strategy",
    "US Healthcare",
    "Analytics & MIS",
    "Global Governance",
  ];

  const initialSkills = ["Pricing & RFX", "Ops Leadership", "Financial Analysis", "US Healthcare"];
  const displaySkills = isInitial ? initialSkills : allSkills;

  return (
    <motion.div 
      className="w-full h-full grid items-center overflow-hidden bg-background/50"
      initial={false}
      animate={{
        gridTemplateColumns: current 
          ? "minmax(0, 1.2fr) 400px minmax(0px, 0.1fr)" 
          : "minmax(0, 1fr) 336px minmax(0, 1fr)"
      }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Left: Professional Content */}
      <div
        className={`flex ${current ? "justify-start" : "justify-end"} items-center h-full transition-all duration-700 ${
          current || isInitial ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
        } ${current ? "px-12 md:px-20" : "px-4 md:px-6"}`}
      >
        <div className={`${current ? "h-[480px]" : "h-[432px]"} w-full max-w-xl flex flex-col py-2 overflow-hidden`}>
          {/* Top Section: Heading and Description */}
          <div className="flex flex-col">
            <AnimatePresence mode="wait">
              {current && (
                <motion.div 
                  key="prof-title"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: "1.5rem" }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <h1 className="text-2xl md:text-4xl font-black mb-1 text-foreground tracking-tighter uppercase whitespace-nowrap">
                    Jotin Kumar Madugula
                  </h1>
                  <motion.div 
                    layoutId="prof-underline"
                    className="h-1.5 w-20 bg-primary rounded-full" 
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="space-y-3">
              <h2 className={`${isInitial ? "text-lg" : "text-xl md:text-2xl"} text-primary font-bold uppercase tracking-wide whitespace-nowrap`}>
                Pricing and Solutions Director
              </h2>
              <p className={`${isInitial ? "text-base max-w-md" : "text-base md:text-lg max-w-2xl"} text-muted-foreground leading-relaxed`}>
                A seasoned professional with 21+ years of experience in the BPO/ITES industry, including 13 years in US Healthcare Operations and 8+ years in Pricing and Financial Strategy.
              </p>
            </div>
          </div>

          {/* Spacer to push skills/buttons down if expanded */}
          <div className="flex-1" />

          {/* Bottom Section: Skills and Buttons */}
          <div className="flex flex-col gap-6">
            <motion.div 
              layout
              className="flex flex-wrap gap-2 max-w-xl pb-2"
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
                      variant="default"
                      className={`rounded-full px-3 py-1 text-[8px] md:text-[9px] uppercase tracking-widest font-black text-white border-none shadow-md whitespace-nowrap ${
                        professionalColors[index % professionalColors.length]
                      }`}
                    >
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 ${isInitial ? "scale-90 origin-left" : ""}`}>
              <Button asChild className="rounded-full px-8 py-5 text-base font-bold shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
                <a href="/jotin-madugula-resume.pdf">Download Resume</a>
              </Button>
              <Button variant="outline" asChild className="rounded-full px-8 py-5 text-base font-bold border-2 hover:bg-primary/5 transition-all active:scale-95">
                <a href="/contact">Get in Touch</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Middle/Right: Image Area */}
      <div className="flex items-center justify-center h-full overflow-hidden">
        <motion.div 
          layout
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className={`${current ? "w-[400px] h-[520px]" : "w-[336px] h-[432px]"} rounded-[2.5rem] overflow-hidden bg-muted relative group`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
          <Image
            src="/images/professional-portrait.jpg"
            alt="Professional Portrait"
            fill
            sizes="(max-width: 768px) 336px, 400px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
        </motion.div>
      </div>

      {/* Right Placeholder: Animate to nearly 0 */}
      <div className="w-full h-full overflow-hidden" />
    </motion.div>
  );
}
