"use client";
import { useRef, useState } from "react";
import { ProfessionalHero } from "./ProfessionalHero";
import { TechHero } from "./TechHero";
import { SeparatorVertical } from "lucide-react";

export default function HeroSplit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0.5); // 0 = left, 1 = right
  const EDGE_MARGIN = 16; // px

  const handleDrag = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Clamp mouse position to EDGE_MARGIN from edges
    const minX = EDGE_MARGIN;
    const maxX = rect.width - EDGE_MARGIN;
    let mouseX = event.clientX - rect.left;
    mouseX = Math.max(minX, Math.min(maxX, mouseX));
    // Normalize so 0 = left margin, 1 = right margin
    const pos = (mouseX - EDGE_MARGIN) / (rect.width - 2 * EDGE_MARGIN);
    setX(pos);
  };

  // Switch thresholds (in px, then normalized)
  const imageWidth = 336;
  const containerWidth = 1280;
  // Convert pixel thresholds to normalized [0,1] for x
  const professionalThreshold =
    (containerWidth + imageWidth) / 2 / containerWidth; // (1280+336)/2/1280 = 0.63125
  const techThreshold = (containerWidth - imageWidth) / 2 / containerWidth; // (1280-336)/2/1280 = 0.36875

  return (
    <section className="relative h-screen w-full flex items-center justify-center">
      <div
        ref={containerRef}
        className="relative w-full h-[80vh] min-h-[600px] overflow-hidden rounded-2xl shadow-2xl"
        onMouseMove={(e) => e.buttons === 1 && handleDrag(e)}
        onMouseDown={handleDrag}
      >
        {/* Left content: ProfessionalHero left aligned, pass current prop if x > professionalThreshold */}
        <div className="absolute inset-0">
          <ProfessionalHero current={x > professionalThreshold} />
        </div>
        {/* Right content: TechHero right aligned, pass current prop if x < techThreshold */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: `inset(0 0 0 calc(${EDGE_MARGIN}px + ${x} * (100% - ${
              2 * EDGE_MARGIN
            }px)))`,
          }}
        >
          <TechHero current={x < techThreshold} />
        </div>
        {/* Handle */}
        <div
          className="absolute top-0 h-full w-1 bg-white shadow-lg cursor-col-resize active:cursor-grabbing z-20 flex items-center justify-center"
          style={{
            left: `calc(${EDGE_MARGIN}px + ${x} * (100% - ${
              2 * EDGE_MARGIN
            }px) - 0.5rem)`,
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            const move = (ev: MouseEvent) => {
              if (!containerRef.current) return;
              const rect = containerRef.current.getBoundingClientRect();
              // Clamp mouse position to EDGE_MARGIN from edges
              const minX = EDGE_MARGIN;
              const maxX = rect.width - EDGE_MARGIN;
              let mouseX = ev.clientX - rect.left;
              mouseX = Math.max(minX, Math.min(maxX, mouseX));
              // Normalize so 0 = left margin, 1 = right margin
              const pos =
                (mouseX - EDGE_MARGIN) / (rect.width - 2 * EDGE_MARGIN);
              setX(pos);
            };
            const up = () => {
              document.removeEventListener("mousemove", move);
              document.removeEventListener("mouseup", up);
            };
            document.addEventListener("mousemove", move);
            document.addEventListener("mouseup", up);
          }}
        >
          {/* Move SeparatorVertical to top of image area */}
          <span
            className="absolute left-1/2 -translate-x-1/2 bg-white rounded-full p-1 shadow-md"
            style={{ top: `calc(50% - 216px - 32px)` }}
          >
            <SeparatorVertical size={32} className="text-gray-500" />
          </span>
          <div className="w-4 h-16 rounded flex items-center justify-center relative">
            {/* Bar handle */}
          </div>
        </div>
      </div>
    </section>
  );
}
