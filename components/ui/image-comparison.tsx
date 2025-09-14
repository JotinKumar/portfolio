'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageComparisonProps {
  leftImage: string;
  rightImage: string;
  leftAlt?: string;
  rightAlt?: string;
  onSliderChange: (position: number) => void;
  initialPosition?: number;
  className?: string;
}

export function ImageComparison({
  leftImage,
  rightImage,
  leftAlt = "Professional portrait",
  rightAlt = "Tech portrait", 
  onSliderChange,
  initialPosition = 50,
  className
}: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updateSliderPosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    setSliderPosition(percentage);
    onSliderChange(percentage);
  }, [onSliderChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    updateSliderPosition(e.clientX);
  }, [updateSliderPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging.current) {
      updateSliderPosition(e.clientX);
    }
  }, [updateSliderPosition]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isDragging.current = true;
    updateSliderPosition(e.touches[0].clientX);
  }, [updateSliderPosition]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging.current) {
      e.preventDefault();
      updateSliderPosition(e.touches[0].clientX);
    }
  }, [updateSliderPosition]);

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    let newPosition = sliderPosition;
    
    switch (e.key) {
      case 'ArrowLeft':
        newPosition = Math.max(0, sliderPosition - 5);
        break;
      case 'ArrowRight':
        newPosition = Math.min(100, sliderPosition + 5);
        break;
      case 'Home':
        newPosition = 0;
        break;
      case 'End':
        newPosition = 100;
        break;
      case ' ':
        newPosition = 50;
        e.preventDefault();
        break;
      default:
        return;
    }
    
    setSliderPosition(newPosition);
    onSliderChange(newPosition);
    e.preventDefault();
  }, [sliderPosition, onSliderChange]);

  const isInDeadZone = sliderPosition >= 45 && sliderPosition <= 55;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden rounded-2xl shadow-2xl cursor-ew-resize select-none",
        className
      )}
      data-testid="image-comparison-container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Base Image (Professional) */}
      <div className="absolute inset-0">
        <Image
          src={leftImage}
          alt={leftAlt}
          fill
          className="object-cover"
          priority
          data-testid="professional-image"
        />
      </div>

      {/* Overlay Image (Tech) with clip-path */}
      <motion.div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
        }}
        transition={{ type: 'tween', duration: 0 }}
      >
        <Image
          src={rightImage}
          alt={rightAlt}
          fill
          className="object-cover"
          priority
          data-testid="tech-image"
        />
      </motion.div>

      {/* Dead Zone Overlay (45-55%) */}
      {isInDeadZone && (
        <motion.div
          className="absolute inset-y-0 bg-white/10 backdrop-blur-sm border-x-2 border-white/30"
          style={{
            left: '45%',
            width: '10%'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          data-testid="dead-zone-overlay"
        />
      )}

      {/* Draggable Handle */}
      <motion.div
        className={cn(
          "absolute top-0 bottom-0 bg-white shadow-lg cursor-ew-resize",
          "before:absolute before:inset-y-2 before:left-1/2 before:-translate-x-1/2",
          "before:w-1 before:bg-gray-400 before:rounded-full",
          "hover:scale-110 transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50",
          isInDeadZone ? "w-5 rounded-full bg-gradient-to-b from-white to-slate-200" : "w-1"
        )}
        style={{
          left: `${sliderPosition}%`,
          transform: 'translateX(-50%)'
        }}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(sliderPosition)}
        aria-label="Image comparison slider - drag to reveal different portraits"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        data-testid="image-comparison-handle"
      >
        {/* Handle visual indicators */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center gap-1">
            <div className="w-0.5 h-4 bg-gray-600 rounded-full" />
            <div className="w-0.5 h-4 bg-gray-600 rounded-full" />
            <div className="w-0.5 h-4 bg-gray-600 rounded-full" />
          </div>
        </div>
      </motion.div>

      {/* Screen reader helper text */}
      <div className="sr-only" aria-live="polite">
        Slider at {Math.round(sliderPosition)}%. 
        {sliderPosition < 25 && "Professional mode active"}
        {sliderPosition >= 25 && sliderPosition < 45 && "Professional-leaning mode active"}
        {sliderPosition >= 45 && sliderPosition <= 55 && "Neutral center mode active"}
        {sliderPosition > 55 && sliderPosition <= 75 && "Tech-leaning mode active"}
        {sliderPosition > 75 && "Tech mode active"}
      </div>
    </div>
  );
}