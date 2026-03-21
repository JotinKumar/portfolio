import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
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
          buttonVariants({ variant: !activeValue ? "default" : "outline", size: "sm" }),
          "min-w-[7rem] justify-center",
          !activeValue
            ? ""
            : "bg-muted/40"
        )}
      >
        {allLabel}
      </Link>

      {options.map((option) => (
        <Link
          key={option.value}
          href={toHref(option.value)}
          className={cn(
            buttonVariants({ variant: activeValue === option.value ? "default" : "outline", size: "sm" }),
            "min-w-[7rem] justify-center",
            activeValue === option.value
              ? ""
              : "bg-muted/40"
          )}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}
