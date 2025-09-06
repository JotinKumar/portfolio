'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Download, Mail, Code, Briefcase } from 'lucide-react';

export function HeroToggle() {
  const [mode, setMode] = useState<'professional' | 'tech'>('professional');
  
  useEffect(() => {
    const saved = localStorage.getItem('hero-mode');
    if (saved) setMode(saved as typeof mode);
  }, []);

  useEffect(() => {
    localStorage.setItem('hero-mode', mode);
  }, [mode]);

  const content = {
    professional: {
      title: "Business Process Expert",
      subtitle: "Transforming operations through intelligent automation",
      skills: ["Process Optimization", "Team Leadership", "AI Integration", "Strategic Planning"],
      primaryCTA: { label: "Download Resume", href: "/resume.pdf", icon: Download },
      secondaryCTA: { label: "Get in Touch", href: "/contact", icon: Mail }
    },
    tech: {
      title: "Full Stack Developer",
      subtitle: "Building scalable solutions with modern technologies",
      skills: ["Next.js", "React", "TypeScript", "Python", "AI/ML", "Cloud"],
      primaryCTA: { label: "View Projects", href: "/projects", icon: Code },
      secondaryCTA: { label: "Read Articles", href: "/articles", icon: Briefcase }
    }
  };

  const current = content[mode];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Mode Toggle */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3 p-1 bg-muted rounded-full">
              <span className={`px-3 py-1 ${mode === 'professional' ? 'font-semibold' : ''}`}>
                Professional
              </span>
              <Switch
                checked={mode === 'tech'}
                onCheckedChange={(checked) => setMode(checked ? 'tech' : 'professional')}
              />
              <span className={`px-3 py-1 ${mode === 'tech' ? 'font-semibold' : ''}`}>
                Tech
              </span>
            </div>
          </div>

          {/* Animated Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-4">
                Jotin Kumar Madugula
              </h1>
              <h2 className="text-2xl md:text-3xl text-muted-foreground mb-6">
                {current.title}
              </h2>
              <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
                {current.subtitle}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {current.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2" asChild>
                  <a href={current.primaryCTA.href}>
                    <current.primaryCTA.icon className="w-4 h-4" />
                    {current.primaryCTA.label}
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="gap-2" asChild>
                  <a href={current.secondaryCTA.href}>
                    <current.secondaryCTA.icon className="w-4 h-4" />
                    {current.secondaryCTA.label}
                  </a>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}