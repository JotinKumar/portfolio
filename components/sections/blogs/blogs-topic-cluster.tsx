import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type TopicPreview = {
  category: string;
  href: string;
  image?: string | null;
};

export function BlogsTopicCluster({
  topics,
  activeCategory,
}: {
  topics: TopicPreview[];
  activeCategory?: string;
}) {
  if (topics.length === 0) return null;

  return (
    <section className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-4 border-y border-border/60 py-6">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="kicker text-muted-foreground">Top Trending Topics</p>
          <h2 className="type-card-title text-[1.7rem]">Browse the archive by mood, discipline, or thread.</h2>
        </div>
        <p className="type-body hidden max-w-[28ch] text-right text-muted-foreground lg:block">
          A visual index of the ideas shaping the journal right now.
        </p>
      </div>

      <div className="grid auto-cols-[minmax(10rem,14rem)] grid-flow-col gap-3 overflow-x-auto pb-2">
        {topics.map((topic, index) => {
          const active = activeCategory === topic.category;

          return (
            <Link
              key={topic.category}
              href={topic.href}
              className={cn(
                "group relative isolate block min-h-[8.5rem] overflow-hidden rounded-[1.8rem] border border-border/60 bg-card/70 p-3 transition-[transform,border-color,box-shadow] duration-[var(--duration-standard)] ease-[var(--ease-out-quart)] hover:-translate-y-1 hover:border-primary/25 hover:shadow-md",
                active && "border-primary/35 bg-accent/55"
              )}
            >
              <div className="absolute inset-0">
                {topic.image ? (
                  <Image
                    src={topic.image}
                    alt={topic.category}
                    fill
                    sizes="224px"
                    className="object-cover opacity-90 transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="h-full w-full bg-[linear-gradient(135deg,rgba(188,143,108,0.18),rgba(82,60,47,0.7))]" />
                )}
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,22,19,0.12)_0%,rgba(28,22,19,0.8)_100%)]" />

              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="type-meta text-white/78">{String(index + 1).padStart(2, "0")}</span>
                  <ArrowRight className="size-4 text-white/70 transition-transform duration-[var(--duration-standard)] ease-[var(--ease-out-quart)] group-hover:translate-x-1" />
                </div>
                <div className="space-y-2">
                  <p className="kicker text-white/76">{active ? "Current filter" : "Topic"}</p>
                  <h3 className="font-serif text-[1.45rem] leading-[0.95] tracking-[-0.03em] text-white">{topic.category}</h3>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
