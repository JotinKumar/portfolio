export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  tags: string;
  category: string;
  published: boolean;
  featured: boolean;
  readTime: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc: string;
  category: string;
  status: string;
  order: number;
  featured: boolean;
  liveUrl: string | null;
  githubUrl: string | null;
  coverImage: string;
  screenshots: string;
  techStack: string;
  tags: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  companyLogo: string | null;
  role: string;
  location: string;
  type: string;
  description: string;
  achievements: string;
  skills: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkExperienceCard {
  id: string;
  company: string;
  role: string;
  location: string;
  description: string;
  achievements: string;
  skills: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface Settings {
  id: string;
  resumeUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  twitterUrl: string | null;
  emailAddress: string;
  heroTitle: string;
  heroSubtitle: string;
  techHeroTitle: string;
  techHeroSubtitle: string;
  aboutMe: string;
  profileImage: string;
  updatedAt: string;
}

export type NavPosition = "HEADER" | "FOOTER_QUICK" | "FOOTER_RESOURCE" | "FOOTER_LEGAL";
export type SocialPosition = "FOOTER" | "CONTACT";
export type PublicPage = "HOME" | "PROFILE" | "ARTICLES" | "PROJECTS" | "CONTACT";

export interface SiteConfig {
  id: string;
  siteName: string;
  siteTagline: string;
  logoUrl: string;
  logoAlt: string;
  resumeUrl: string;
  primaryEmail: string;
  locationLabel: string;
  defaultTitle: string;
  defaultDescription: string;
  updatedAt: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  order: number;
  position: NavPosition;
  visible: boolean;
  isExternal: boolean;
  openInNewTab: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  position: SocialPosition;
  order: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HeroContent {
  id: string;
  displayName: string;
  professionalTitle: string;
  professionalSubtitle: string;
  techTitle: string;
  techSubtitle: string;
  professionalSkills: string[];
  professionalInitialSkills: string[];
  techSkills: string[];
  techInitialSkills: string[];
  professionalImageUrl: string;
  techImageUrl: string;
  exploreProfessionalLabel: string;
  exploreTechLabel: string;
  resetViewLabel: string;
  downloadResumeLabel: string;
  getInTouchLabel: string;
  viewProjectsLabel: string;
  viewArticlesLabel: string;
  homeWorkSectionTitle: string;
  homeFeaturedArticlesTitle: string;
  homeFeaturedProjectsTitle: string;
  homeViewAllArticlesLabel: string;
  homeViewAllProjectsLabel: string;
  updatedAt: string;
}

export interface PageContent {
  id: string;
  page: PublicPage;
  title: string;
  subtitle: string;
  emptyTitle: string | null;
  emptyMessage: string | null;
  primaryCta: string | null;
  secondaryCta: string | null;
  content: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface Competency {
  id: string;
  name: string;
  category: string;
  order: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}
