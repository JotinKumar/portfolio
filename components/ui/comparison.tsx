"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ComparisonProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultPosition?: number;
  onPositionChange?: (position: number) => void;
}

const Comparison = React.forwardRef<HTMLDivElement, ComparisonProps>(
  ({ className, defaultPosition = 50, onPositionChange, children, ...props }, ref) => {
    const [position, setPosition] = React.useState(defaultPosition);
    const [isDragging, setIsDragging] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const handleMove = (clientX: number) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const newPosition = ((clientX - rect.left) / rect.width) * 100;
      const clampedPosition = Math.max(0, Math.min(100, newPosition));
      setPosition(clampedPosition);
      onPositionChange?.(clampedPosition);
    };

    const handleStart = (clientX: number) => {
      setIsDragging(true);
      handleMove(clientX);
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    // Mouse events
    React.useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
          handleMove(e.clientX);
        }
      };

      const handleMouseUp = () => {
        handleEnd();
      };

      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }, [isDragging]);

    // Touch events
    React.useEffect(() => {
      const handleTouchMove = (e: TouchEvent) => {
        if (isDragging && e.touches.length > 0) {
          e.preventDefault();
          handleMove(e.touches[0].clientX);
        }
      };

      const handleTouchEnd = () => {
        handleEnd();
      };

      if (isDragging) {
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
      }

      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }, [isDragging]);

    const childrenArray = React.Children.toArray(children);

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <div ref={containerRef} className="relative h-full w-full">
          {/* Left side */}
          <div 
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            {childrenArray[0]}
          </div>
          
          {/* Right side */}
          <div 
            className="absolute inset-0"
            style={{ clipPath: `inset(0 0 0 ${position}%)` }}
          >
            {childrenArray[1]}
          </div>
          
          {/* Handle line */}
          <div
            className="absolute top-0 h-full w-0.5 bg-white shadow-lg z-10"
            style={{ left: `${position}%` }}
          />
          
          {/* Draggable handle */}
          <div
            className={cn(
              "absolute top-1/2 w-12 h-12 bg-white rounded-full shadow-lg border-2 border-gray-300 z-20 cursor-grab flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform",
              isDragging && "cursor-grabbing scale-110"
            )}
            style={{ left: `${position}%` }}
            onMouseDown={(e) => {
              e.preventDefault();
              handleStart(e.clientX);
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              if (e.touches.length > 0) {
                handleStart(e.touches[0].clientX);
              }
            }}
          >
            {/* Arrows */}
            <div className="flex items-center space-x-1">
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="text-gray-600">
                <path d="M7 1L2 6L7 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="text-gray-600">
                <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Comparison.displayName = "Comparison";

interface ComparisonItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const ComparisonItem = React.forwardRef<HTMLDivElement, ComparisonItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("h-full w-full", className)} {...props}>
        {children}
      </div>
    );
  }
);

ComparisonItem.displayName = "ComparisonItem";

const ComparisonHandle = () => null;

export { Comparison, ComparisonItem, ComparisonHandle };