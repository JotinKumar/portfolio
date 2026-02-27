"use client";
import React, { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface Blob {
  x: number;
  y: number;
  size: number;
  color: string;
  dx: number;
  dy: number;
}

const COLORS = [
  "#ff6b6b", // Vibrant Red
  "#f7b731", // Vibrant Yellow
  "#45aaf2", // Vibrant Blue
  "#26de81", // Vibrant Green
  "#a55eea", // Vibrant Purple
  "#fd9644", // Vibrant Orange
  "#2bcbba", // Vibrant Teal
  "#ff00cc", // Neon Pink
  "#00ffea", // Neon Aqua
  "#fffb00", // Neon Yellow
  "#ff007f", // Hot Pink
  "#00ff00", // Bright Green
  "#00bfff", // Deep Sky Blue
  "#ff4500", // Orange Red
  "#9400d3", // Dark Violet
];

// Constants
const DEFAULT_HEIGHT = 76;
const DEFAULT_BLOB_COUNT = 7;
const BLOB_SIZE_MIN = 24;
const BLOB_SIZE_MAX = 56;
const HORIZONTAL_VELOCITY_RANGE = 0.8; // Moderate horizontal movement
const VERTICAL_VELOCITY_RANGE = 0.2; // Subtle vertical movement
const BLUR_RADIUS = 8;
const BLOB_OPACITY = 0.9;

const getRandom = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

interface FloatingBlobsBarProps {
  className?: string;
  height?: number;
  blobCount?: number;
}

export const FloatingBlobsBar: React.FC<FloatingBlobsBarProps> = ({
  className,
  height = DEFAULT_HEIGHT,
  blobCount = DEFAULT_BLOB_COUNT,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>(0);
  const isAnimatingRef = useRef(false);
  const blobsRef = useRef<Blob[]>([]);
  const dimensionsRef = useRef({ width: 0, height });

  // Memoize blob creation function
  const createBlobs = useCallback(
    (width: number, height: number): Blob[] => {
      return Array.from({ length: blobCount }, () => ({
        x: getRandom(0, width),
        y: getRandom(0, height),
        size: getRandom(BLOB_SIZE_MIN, BLOB_SIZE_MAX),
        color: COLORS[Math.floor(getRandom(0, COLORS.length))],
        dx: getRandom(-HORIZONTAL_VELOCITY_RANGE, HORIZONTAL_VELOCITY_RANGE),
        dy: getRandom(-VERTICAL_VELOCITY_RANGE, VERTICAL_VELOCITY_RANGE),
      }));
    },
    [blobCount]
  );

  // Optimized draw function using filter instead of temporary canvas
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.clearRect(0, 0, width, height);

      // Apply blur filter once to the entire context
      ctx.filter = `blur(${BLUR_RADIUS}px)`;
      ctx.globalAlpha = BLOB_OPACITY;

      blobsRef.current.forEach((blob) => {
        ctx.fillStyle = blob.color;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Update position
        blob.x += blob.dx;
        blob.y += blob.dy;

        // Bounce off edges with size consideration
        const radius = blob.size / 2;
        if (blob.x <= radius || blob.x >= width - radius) {
          blob.dx *= -1;
          blob.x = Math.max(radius, Math.min(width - radius, blob.x));
        }
        if (blob.y <= radius || blob.y >= height - radius) {
          blob.dy *= -1;
          blob.y = Math.max(radius, Math.min(height - radius, blob.y));
        }
      });

      // Reset filter and alpha
      ctx.filter = "none";
      ctx.globalAlpha = 1;
    },
    []
  );

  // Handle resize with debouncing
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newWidth = window.innerWidth;
    if (newWidth !== dimensionsRef.current.width) {
      dimensionsRef.current.width = newWidth;
      canvas.width = newWidth;
      canvas.height = height;

      // Recreate blobs for new dimensions
      blobsRef.current = createBlobs(newWidth, height);
    }
  }, [height, createBlobs]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    draw(ctx, dimensionsRef.current.width, height);
    animationIdRef.current = requestAnimationFrame(animate);
  }, [draw, height]);

  const startAnimation = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    animationIdRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const stopAnimation = useCallback(() => {
    if (!isAnimatingRef.current) return;
    isAnimatingRef.current = false;
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = 0;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize canvas dimensions
    const initialWidth = window.innerWidth;
    dimensionsRef.current.width = initialWidth;
    canvas.width = initialWidth;
    canvas.height = height;

    // Create initial blobs
    blobsRef.current = createBlobs(initialWidth, height);

    // Start animation
    startAnimation();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    // Add resize listener with cleanup
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopAnimation();
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [height, blobCount, createBlobs, handleResize, startAnimation, stopAnimation]);

  return (
    <div
      className={cn(
        "w-full relative flex items-center justify-center",
        className
      )}
      style={{ height }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full pointer-events-none"
        style={{
          height,
          background: "transparent",
        }}
      />
    </div>
  );
};
