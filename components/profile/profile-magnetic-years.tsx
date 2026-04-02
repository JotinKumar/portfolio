"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

function MagnetIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M7 7v4a5 5 0 0 0 10 0V7" />
      <path d="M7 7V4H4v7a8 8 0 0 0 16 0V4h-3v3" />
    </svg>
  );
}

const CURRENT_YEAR = new Date().getFullYear();
const BASE_YEARS = Array.from({ length: CURRENT_YEAR - 2004 + 1 }, (_, i) => 2004 + i);

type YearParticle = {
  year: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  scale: number;
  dissolving: boolean;
  dissolveProgress: number;
  waveAmp: number;
  waveFreq: number;
  wavePhase: number;
  age: number;
  fontSize: number;
};

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

export function ProfileMagneticYears({ initialExperience }: { initialExperience: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const magnetRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<YearParticle[]>([]);
  const yearQueueRef = useRef<number[]>([...BASE_YEARS]);
  const lastSpawnRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [magnetPulse, setMagnetPulse] = useState(false);
  const [animationActive, setAnimationActive] = useState(false);
  const [collectedYears, setCollectedYears] = useState<number | null>(null);
  const inView = useInView(containerRef, { once: false, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!animationActive) {
      particlesRef.current = [];
      yearQueueRef.current = [...BASE_YEARS];
      lastSpawnRef.current = 0;
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      setCollectedYears(null);
    }
  }, [animationActive]);

  useEffect(() => {
    if (!animationActive || !inView || prefersReducedMotion) {
      return;
    }

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };

    const pulse = () => {
      setMagnetPulse(true);
      setCollectedYears((prev) => Math.min(initialExperience, (prev ?? 0) + 1));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setMagnetPulse(false), 280);
    };

    const spawnParticle = () => {
      if (yearQueueRef.current.length === 0) return;
      const year = yearQueueRef.current.shift();
      if (!year) return;
      const width = canvas.width || container.offsetWidth;

      particlesRef.current.push({
        year,
        x: randomBetween(24, Math.max(28, width - 24)),
        y: randomBetween(-52, -18),
        vx: randomBetween(-0.45, 0.45),
        vy: randomBetween(0.6, 1.05),
        opacity: 0,
        scale: randomBetween(0.84, 1.08),
        dissolving: false,
        dissolveProgress: 0,
        waveAmp: randomBetween(1.1, 2.4),
        waveFreq: randomBetween(0.018, 0.032),
        wavePhase: randomBetween(0, Math.PI * 2),
        age: 0,
        fontSize: Math.floor(randomBetween(13, 19)),
      });
    };

    const getMagnetCenter = () => {
      const magnet = magnetRef.current;
      if (!magnet) {
        return { mx: canvas.width - 64, my: canvas.height - 38 };
      }

      const magnetRect = magnet.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      return {
        mx: magnetRect.left - containerRect.left + magnetRect.width / 2,
        my: magnetRect.top - containerRect.top + magnetRect.height / 2,
      };
    };

    resize();
    window.addEventListener("resize", resize);

    const SPAWN_INTERVAL = 220;
    const MAX_ON_SCREEN = 6;
    const DISSOLVE_DIST = 46;
    const ATTRACT_STRENGTH = 0.024;

    const loop = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (yearQueueRef.current.length > 0 && now - lastSpawnRef.current > SPAWN_INTERVAL && particlesRef.current.length < MAX_ON_SCREEN) {
        spawnParticle();
        lastSpawnRef.current = now;
      }

      const { mx, my } = getMagnetCenter();

      particlesRef.current = particlesRef.current.filter((particle) => {
        if (particle.dissolving) {
          particle.dissolveProgress += 0.045;
          particle.opacity = Math.max(0, 1 - particle.dissolveProgress * 1.6);
          particle.scale *= 0.92;

          if (particle.opacity <= 0) {
            pulse();
            return false;
          }
        } else {
          const dx = mx - particle.x;
          const dy = my - particle.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          if (dist < DISSOLVE_DIST) {
            particle.dissolving = true;
          } else {
            particle.age += 1;
            const attractThreshold = canvas.height * 0.42;
            const inAttractZone = particle.y > attractThreshold;

            if (inAttractZone) {
              const closeness = Math.max(0, (particle.y - attractThreshold) / Math.max(1, canvas.height * 0.58));
              const pull = ATTRACT_STRENGTH * (1 + closeness * 12);
              particle.vx += (dx / dist) * pull;
              particle.vy += (dy / dist) * pull;
              particle.vx *= 0.94;
              particle.vy *= 0.94;
            } else {
              const wave = Math.sin(particle.age * particle.waveFreq + particle.wavePhase) * particle.waveAmp;
              particle.vx = wave;
              particle.vy = Math.min(particle.vy + 0.008, 1.4);
            }

            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.opacity = Math.min(1, particle.opacity + 0.04);
          }
        }

        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.translate(particle.x, particle.y);
        ctx.scale(particle.scale, particle.scale);
        ctx.font = `200 ${particle.fontSize}px 'Space Mono', monospace`;
        ctx.fillStyle = `rgba(255,255,255,${particle.opacity * 0.76})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(particle.year), 0, 0);
        ctx.restore();

        return true;
      });

      if (yearQueueRef.current.length === 0 && particlesRef.current.length === 0) {
        setAnimationActive(false);
        return;
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [animationActive, inView, prefersReducedMotion, initialExperience]);

  const startAnimation = () => {
    if (prefersReducedMotion || animationActive) return;
    yearQueueRef.current = [...BASE_YEARS];
    particlesRef.current = [];
    lastSpawnRef.current = 0;
    setCollectedYears(0);
    setAnimationActive(true);
  };

  const counterLabel = collectedYears === null ? `${initialExperience}+` : `${collectedYears}/${initialExperience}`;

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-10 h-full w-full" />
      <div className="absolute bottom-4 right-4 z-30 hidden items-center justify-end sm:flex sm:bottom-5 sm:right-6">
        <div
          ref={magnetRef}
          data-testid="profile-experience-badge-centered"
          onMouseEnter={startAnimation}
          onPointerEnter={startAnimation}
          onFocus={startAnimation}
          className={`inline-flex items-center gap-1.5 whitespace-nowrap border-b border-white/35 pb-1 text-[0.55rem] font-medium uppercase tracking-[0.14em] text-white/88 transition-transform duration-200 sm:text-[0.62rem] ${
            magnetPulse ? "scale-[1.03]" : "scale-100"
          }`}
        >
          <MagnetIcon className="size-4 shrink-0 text-white/70 sm:size-5" />
          <span>
            <span className="text-[0.72rem] font-bold tracking-[0.18em] text-white sm:text-[0.8rem]">
              {counterLabel}
            </span>{" "}
            years of experience
          </span>
        </div>
      </div>
    </div>
  );
}
