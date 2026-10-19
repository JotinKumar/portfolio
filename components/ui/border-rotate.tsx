import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

type AnimationMode =
  | "auto-rotate"
  | "rotate-on-hover"
  | "stop-rotate-on-hover";

type GradientColors = {
  primary: string;
  secondary: string;
  accent: string;
};

interface BorderRotateProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "className" | "style"> {
  children: ReactNode;
  className?: string;
  animationMode?: AnimationMode;
  animationSpeed?: number;
  gradientColors?: GradientColors;
  backgroundColor?: string;
  borderWidth?: number;
  borderRadius?: CSSProperties["borderRadius"];
  style?: CSSProperties;
}

const defaultGradientColors: GradientColors = {
  primary: "#584827",
  secondary: "#c7a03c",
  accent: "#f9de90",
};

const animationClasses: Record<AnimationMode, string> = {
  "auto-rotate": "gradient-border-auto",
  "rotate-on-hover": "gradient-border-hover",
  "stop-rotate-on-hover": "gradient-border-stop-hover",
};

export function BorderRotate({
  children,
  className = "",
  animationMode = "auto-rotate",
  animationSpeed = 8,
  gradientColors = defaultGradientColors,
  backgroundColor = "var(--background)",
  borderWidth = 2,
  borderRadius,
  style = {},
  ...props
}: BorderRotateProps) {
  const radius =
    typeof borderRadius === "number"
      ? `${borderRadius}px`
      : borderRadius ?? "var(--border-radius, 20px)";

  const combinedStyle = {
    "--gradient-primary": gradientColors.primary,
    "--gradient-secondary": gradientColors.secondary,
    "--gradient-accent": gradientColors.accent,
    "--bg-color": backgroundColor,
    "--border-width": `${borderWidth}px`,
    "--animation-duration": `${animationSpeed}s`,
    border: `${borderWidth}px solid transparent`,
    borderRadius: radius,
    backgroundImage: `
      linear-gradient(${backgroundColor}, ${backgroundColor}),
      conic-gradient(
        from var(--gradient-angle),
        ${gradientColors.primary} 0%,
        ${gradientColors.secondary} 27%,
        ${gradientColors.accent} 30%,
        ${gradientColors.secondary} 33%,
        ${gradientColors.primary} 40%,
        ${gradientColors.primary} 50%,
        ${gradientColors.secondary} 77%,
        ${gradientColors.accent} 80%,
        ${gradientColors.secondary} 83%,
        ${gradientColors.primary} 90%,
        ${gradientColors.primary} 100%
      )
    `,
    backgroundClip: "padding-box, border-box",
    backgroundOrigin: "padding-box, border-box",
    ...style,
  } as CSSProperties;

  return (
    <div
      className={`gradient-border-component ${animationClasses[animationMode]} ${className}`.trim()}
      style={combinedStyle}
      {...props}
    >
      {children}
    </div>
  );
}

export type { AnimationMode, BorderRotateProps, GradientColors };
