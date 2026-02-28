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
