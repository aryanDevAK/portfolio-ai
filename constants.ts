
import type { Experience, Project, Blog, ContactMessage, Certification } from './types';

// This file is intentionally left with minimal data.
// All portfolio content is now loaded from public/data.json
// to create a single source of truth that can be updated and redeployed.

export const INITIAL_ABOUT = {
    name: "User",
    title: "Developer",
    bio: ``,
    heroImage: ""
};

export const INITIAL_EXPERIENCES: Experience[] = [];
export const INITIAL_PROJECTS: Project[] = [];
export const INITIAL_CERTIFICATIONS: Certification[] = [];
export const INITIAL_BLOGS: Blog[] = [];
export const INITIAL_MESSAGES: ContactMessage[] = [];
