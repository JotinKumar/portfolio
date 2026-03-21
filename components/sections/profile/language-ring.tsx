type LanguageRingProps = {
  label: string;
  proficiency: number;
  detail: string;
  placeholder?: boolean;
};

export function LanguageRing({ label, proficiency, detail, placeholder = false }: LanguageRingProps) {
  return (
    <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-center gap-3">
      <div
        className={`grid size-[4.75rem] place-items-center rounded-full border ${
          placeholder ? "border-dashed border-border/60 bg-transparent" : "border-border/70 bg-background"
        }`}
        style={
          placeholder
            ? undefined
            : {
                backgroundImage: `conic-gradient(from 180deg, var(--color-foreground) ${proficiency}%, transparent ${proficiency}% 100%)`,
              }
        }
      >
        <div className="grid size-[3.55rem] place-items-center rounded-full bg-card">
          <span className="type-body text-[0.88rem]">{placeholder ? "..." : `${proficiency}%`}</span>
        </div>
      </div>
      <div className="space-y-1">
        <p className="type-body">{label}</p>
        <p className="type-meta text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}
