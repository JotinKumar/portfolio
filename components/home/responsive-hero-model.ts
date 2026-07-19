export type HeroVariant = "mobile" | "tablet" | "desktop";

export type DetailAction = {
  href: string;
  label: string;
  primary?: boolean;
};

type ProfessionalActionInput = {
  resumeUrl: string | null | undefined;
  downloadResumeLabel: string;
  getInTouchLabel: string;
};

export function getHeroVariant(viewportWidth: number): HeroVariant {
  if (viewportWidth < 768) {
    return "mobile";
  }

  if (viewportWidth < 1024) {
    return "tablet";
  }

  return "desktop";
}

export function getProfessionalActions({
  resumeUrl,
  downloadResumeLabel,
  getInTouchLabel,
}: ProfessionalActionInput): DetailAction[] {
  const normalizedResumeUrl = resumeUrl?.trim();
  const contactAction: DetailAction = {
    href: "/contact",
    label: getInTouchLabel,
  };

  if (!normalizedResumeUrl) {
    return [{ ...contactAction, primary: true }];
  }

  return [
    {
      href: normalizedResumeUrl,
      label: downloadResumeLabel,
      primary: true,
    },
    contactAction,
  ];
}
