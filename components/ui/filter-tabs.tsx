import Link from "next/link";
import { cn } from "@/lib/utils";

type FilterOption = {
  label: string;
  value: string;
};

type QueryValue = string | undefined;

const buildHref = (path: string, query: URLSearchParams) => {
  const value = query.toString();
  return value ? `${path}?${value}` : path;
};

export function FilterTabs({
  basePath,
  allLabel = "All",
  options,
  queryKey,
  activeValue,
  preservedQuery = {},
}: {
  basePath: string;
  allLabel?: string;
  options: FilterOption[];
  queryKey: string;
  activeValue?: QueryValue;
  preservedQuery?: Record<string, string | undefined>;
}) {
  const toHref = (value?: string) => {
    const query = new URLSearchParams();

    Object.entries(preservedQuery).forEach(([key, currentValue]) => {
      if (currentValue) query.set(key, currentValue);
    });

    if (value) query.set(queryKey, value);
    else query.delete(queryKey);

    return buildHref(basePath, query);
  };

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Link
        href={toHref(undefined)}
        className={cn(
          "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
          !activeValue
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-muted/50 hover:bg-muted"
        )}
      >
        {allLabel}
      </Link>

      {options.map((option) => (
        <Link
          key={option.value}
          href={toHref(option.value)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            activeValue === option.value
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-muted/50 hover:bg-muted"
          )}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}
