import type React from 'react';

export interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface Project {
  id:string;
  name: string;
  description: string;
  techStack: string;
  liveLink?: string;
  githubLink?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer?: string;
  isAward: boolean;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  slug: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

export type AdminSection = 'about' | 'experience' | 'projects' | 'blogs' | 'messages' | 'certifications';