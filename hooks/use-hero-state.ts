'use client';

import { useState, useMemo, useEffect } from 'react';

export type HeroMode = 'professional' | 'professional-lean' | 'neutral-center' | 'tech-lean' | 'tech';

interface ContentConfig {
  title: string;
  subtitle: string;
  description: string;
  skills: string[];
  primaryCTA: {
    label: string;
    href: string;
  };
  secondaryCTA: {
    label: string;
    href: string;
  };
  gradient: string;
}

const contentConfig: Record<HeroMode, ContentConfig> = {
  professional: {
    title: "Jotin Kumar Madugula",
    subtitle: "Business Process Expert", 
    description: "Transforming operations through intelligent automation and strategic process optimization",
    skills: ["Process Optimization", "Team Leadership", "AI Integration", "Strategic Planning"],
    primaryCTA: {
      label: "Download Resume",
      href: "/resume.pdf"
    },
    secondaryCTA: {
      label: "Get in Touch", 
      href: "/contact"
    },
    gradient: "linear-gradient(135deg, #3b82f6, #1e40af)"
  },
  'professional-lean': {
    title: "Jotin Kumar Madugula",
    subtitle: "Business Expert with Tech Edge",
    description: "Strategic process optimization enhanced by modern technology solutions",
    skills: ["Process Optimization", "Team Leadership", "AI Integration", "TypeScript"],
    primaryCTA: {
      label: "Download Resume",
      href: "/resume.pdf"
    },
    secondaryCTA: {
      label: "View Tech Skills",
      href: "/projects"
    },
    gradient: "linear-gradient(135deg, #3b82f6, #6366f1)"
  },
  'neutral-center': {
    title: "Jotin Kumar Madugula", 
    subtitle: "Multi-faceted Professional",
    description: "Combining business expertise with technical innovation to drive transformational change",
    skills: ["Process Optimization", "AI/ML", "Team Leadership", "Next.js", "Strategic Planning", "TypeScript"],
    primaryCTA: {
      label: "Explore My Work",
      href: "/about"
    },
    secondaryCTA: {
      label: "Get In Touch",
      href: "/contact"
    },
    gradient: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #f43f5e 100%)"
  },
  'tech-lean': {
    title: "Jotin Kumar Madugula",
    subtitle: "Developer with Business Insight", 
    description: "Building scalable solutions with deep understanding of business processes",
    skills: ["Next.js", "React", "TypeScript", "Process Optimization", "AI/ML", "Python"],
    primaryCTA: {
      label: "View Projects",
      href: "/projects"
    },
    secondaryCTA: {
      label: "Business Experience", 
      href: "/experience"
    },
    gradient: "linear-gradient(135deg, #8b5cf6, #f43f5e)"
  },
  tech: {
    title: "Jotin Kumar Madugula",
    subtitle: "Full Stack Developer",
    description: "Building scalable solutions with modern technologies and cutting-edge development practices", 
    skills: ["Next.js", "React", "TypeScript", "Python", "AI/ML", "Cloud"],
    primaryCTA: {
      label: "View Projects",
      href: "/projects"
    },
    secondaryCTA: {
      label: "Read Articles",
      href: "/articles"
    },
    gradient: "linear-gradient(135deg, #f43f5e, #be185d)"
  }
};

export function useHeroState() {
  const [sliderPosition, setSliderPosition] = useState(50);
  
  // Persist slider position in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hero-slider-position');
    if (saved) {
      const position = parseFloat(saved);
      if (!isNaN(position) && position >= 0 && position <= 100) {
        setSliderPosition(position);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('hero-slider-position', sliderPosition.toString());
  }, [sliderPosition]);

  const currentMode = useMemo((): HeroMode => {
    if (sliderPosition < 25) return 'professional';
    if (sliderPosition > 75) return 'tech';
    if (sliderPosition >= 45 && sliderPosition <= 55) return 'neutral-center';
    return sliderPosition < 50 ? 'professional-lean' : 'tech-lean';
  }, [sliderPosition]);

  const currentContent = contentConfig[currentMode];

  const handleSliderChange = (position: number) => {
    setSliderPosition(position);
  };

  // Helper function to get mode-specific styling
  const getModeStyles = () => {
    const baseOpacity = 0.3;
    const activeOpacity = 1;
    
    return {
      professionalOpacity: currentMode.includes('professional') ? activeOpacity : baseOpacity,
      techOpacity: currentMode.includes('tech') ? activeOpacity : baseOpacity,
      neutralOpacity: currentMode === 'neutral-center' ? activeOpacity : 0,
      backgroundGradient: currentContent.gradient
    };
  };

  return {
    sliderPosition,
    setSliderPosition: handleSliderChange,
    currentMode,
    currentContent,
    getModeStyles
  };
}