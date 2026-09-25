export type Language = 'fr' | 'en';

export interface Project {
  id: string;
  title: string;
  category: 'fullstack' | 'mobile' | 'ai' | 'tools';
  categoryLabel: { fr: string; en: string };
  tagline: { fr: string; en: string };
  description: { fr: string; en: string };
  longDescription: { fr: string; en: string };
  tags: string[];
  metrics?: { fr: string; en: string };
  featured?: boolean;
  status: 'production' | 'opensource' | 'in-progress';
  statusLabel: { fr: string; en: string };
  githubUrl?: string;
  liveUrl?: string;
  gradient: string;
  features: { fr: string[]; en: string[] };
  architecture: { fr: string; en: string };
}

export interface SkillCategory {
  id: string;
  title: { fr: string; en: string };
  icon: string;
  skills: {
    name: string;
    level: number; // percentage (e.g. 90)
    highlight?: boolean;
    tag?: string;
  }[];
}

export interface Experience {
  id: string;
  role: { fr: string; en: string };
  company: string;
  period: { fr: string; en: string };
  location: string;
  description: { fr: string; en: string };
  achievements: { fr: string[]; en: string[] };
  technologies: string[];
  type: 'work' | 'education';
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  handle: string;
}

export interface PortfolioData {
  personal: {
    name: string;
    role: { fr: string; en: string };
    shortBio: { fr: string; en: string };
    fullBio: { fr: string; en: string };
    location: string;
    timezone: string;
    availability: {
      status: 'available' | 'busy';
      text: { fr: string; en: string };
    };
    email: string;
    phone?: string;
    resumeUrl: string;
  };
  stats: {
    value: string;
    label: { fr: string; en: string };
    subtext: { fr: string; en: string };
  }[];
  socials: SocialLink[];
  projects: Project[];
  skills: SkillCategory[];
  experiences: Experience[];
  interests: { fr: string[]; en: string[] };
}
