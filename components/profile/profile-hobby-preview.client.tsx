"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BriefcaseBusiness, Gamepad2, Headphones, Plane, Podcast, Popcorn } from "lucide-react";
import { ProfileSidebarBlock } from "@/components/profile/profile-sidebar-block";

const HOBBY_PREVIEWS: Record<string, { src: string }> = {
  "video games": { src: "/images/gifs/videogame.gif" },
  podcast: { src: "/images/gifs/podcast.gif" },
  musci: { src: "/images/gifs/music.gif" },
  music: { src: "/images/gifs/music.gif" },
  movies: { src: "/images/gifs/movie.gif" },
  travel: { src: "/images/gifs/travel.gif" },
};

const PREVIEW_CURSOR_OFFSET = 18;
const PREVIEW_VIEWPORT_MARGIN = 16;
const HOBBY_PREVIEW_FRAME_SIZE = 200;

const resolvePreviewPosition = (x: number, y: number) => {
  const maxLeft = Math.max(PREVIEW_VIEWPORT_MARGIN, window.innerWidth - HOBBY_PREVIEW_FRAME_SIZE - PREVIEW_VIEWPORT_MARGIN);
  const maxTop = Math.max(PREVIEW_VIEWPORT_MARGIN, window.innerHeight - HOBBY_PREVIEW_FRAME_SIZE - PREVIEW_VIEWPORT_MARGIN);

  return {
    left: Math.min(Math.max(PREVIEW_VIEWPORT_MARGIN, x + PREVIEW_CURSOR_OFFSET), maxLeft),
    top: Math.min(Math.max(PREVIEW_VIEWPORT_MARGIN, y + PREVIEW_CURSOR_OFFSET), maxTop),
  };
};

export function ProfileHobbyPreview({
  hobbies,
  compact = false,
  className,
}: {
  hobbies: string[];
  compact?: boolean;
  className?: string;
}) {
  const [activePreviewSrc, setActivePreviewSrc] = useState<string | null>(null);
  const [previewPosition, setPreviewPosition] = useState({ left: 0, top: 0 });
  const [canPreviewHobbies, setCanPreviewHobbies] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    const syncPreviewCapability = () => setCanPreviewHobbies(mediaQuery.matches && !compact);

    syncPreviewCapability();
    mediaQuery.addEventListener?.("change", syncPreviewCapability);

    return () => mediaQuery.removeEventListener?.("change", syncPreviewCapability);
  }, [compact]);

  const hobbiesWithIcons = hobbies.map((hobby) => ({
    label: hobby,
    preview: HOBBY_PREVIEWS[hobby.toLowerCase()] ?? null,
    icon:
      hobby.toLowerCase() === "video games"
        ? Gamepad2
        : hobby.toLowerCase() === "podcast"
          ? Podcast
          : hobby.toLowerCase() === "music"
            ? Headphones
            : hobby.toLowerCase() === "movies"
              ? Popcorn
              : hobby.toLowerCase() === "travel"
                ? Plane
                : BriefcaseBusiness,
  }));

  const showHobbyPreview = (previewSrc: string, x: number, y: number) => {
    if (!canPreviewHobbies) return;
    setActivePreviewSrc(previewSrc);
    setPreviewPosition(resolvePreviewPosition(x, y));
  };

  const hideHobbyPreview = () => {
    setActivePreviewSrc(null);
  };

  return (
    <>
      <ProfileSidebarBlock title="Hobbies" className={className}>
        {compact ? (
          <div className="grid gap-2">
            {hobbiesWithIcons.length > 0 ? (
              hobbiesWithIcons.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={`mobile-hobby-${item.label}`}
                    className="flex min-w-0 items-center justify-start gap-3 rounded-none border border-border/60 bg-background/60 px-3 py-3"
                  >
                    <Icon className="size-4 shrink-0 text-foreground" />
                    <span className="min-w-0 truncate text-[0.7rem] uppercase tracking-[0.14em] text-foreground">
                      {item.label}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="type-body text-muted-foreground">Hobbies can be added from the content settings.</p>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {hobbiesWithIcons.length > 0 ? (
              hobbiesWithIcons.map((item) => {
                const Icon = item.icon;
                const shouldPreview = canPreviewHobbies && item.preview;

                return (
                  <button
                    key={item.label}
                    type="button"
                    title={item.label}
                    aria-label={item.label}
                    onMouseEnter={
                      shouldPreview ? (event) => showHobbyPreview((item.preview as { src: string }).src, event.clientX, event.clientY) : undefined
                    }
                    onMouseMove={
                      shouldPreview ? (event) => showHobbyPreview((item.preview as { src: string }).src, event.clientX, event.clientY) : undefined
                    }
                    onMouseLeave={shouldPreview ? hideHobbyPreview : undefined}
                    onFocus={
                      shouldPreview
                        ? (event) => {
                            const rect = event.currentTarget.getBoundingClientRect();
                            showHobbyPreview((item.preview as { src: string }).src, rect.right, rect.top + rect.height / 2);
                          }
                        : undefined
                    }
                    onBlur={shouldPreview ? hideHobbyPreview : undefined}
                    className="flex size-12 items-center justify-center border border-border/60 bg-background/60 transition-colors hover:border-primary/40 hover:bg-accent"
                  >
                    <Icon className="size-5 text-foreground" />
                  </button>
                );
              })
            ) : (
              <p className="type-body text-muted-foreground">Hobbies can be added from the content settings.</p>
            )}
          </div>
        )}
      </ProfileSidebarBlock>

      {!compact ? (
        <div
          aria-hidden={!activePreviewSrc}
          data-testid="hobby-hover-preview"
          className={`pointer-events-none fixed z-50 overflow-visible transition-[opacity,visibility] duration-150 ${
            activePreviewSrc ? "visible opacity-100" : "invisible opacity-0"
          }`}
          style={{
            width: activePreviewSrc ? HOBBY_PREVIEW_FRAME_SIZE : 0,
            height: activePreviewSrc ? HOBBY_PREVIEW_FRAME_SIZE : 0,
            left: previewPosition.left,
            top: previewPosition.top,
          }}
        >
          {activePreviewSrc ? (
            <div className="relative size-[200px] overflow-hidden bg-background/95">
              <Image
                data-testid="hobby-hover-image"
                src={activePreviewSrc}
                alt=""
                fill
                sizes="200px"
                className="object-contain"
                unoptimized
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
