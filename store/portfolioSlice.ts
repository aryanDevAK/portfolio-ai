
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Experience, Project, Blog, ContactMessage, Certification } from '../types';

interface PortfolioState {
  about: {
    name: string;
    title: string;
    bio: string;
    heroImage: string;
  };
  experiences: Experience[];
  projects: Project[];
  blogs: Blog[];
  messages: ContactMessage[];
  certifications: Certification[];
}

const initialState: PortfolioState = {
  about: { name: '', title: '', bio: '', heroImage: '' },
  experiences: [],
  projects: [],
  blogs: [],
  messages: [],
  certifications: [],
};

type ImportExportPortfolioState = Omit<PortfolioState, 'messages'>;


const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setPortfolio: (state, action: PayloadAction<ImportExportPortfolioState>) => {
      // Ensure all expected keys exist in the payload before updating
      if (action.payload.about && action.payload.experiences && action.payload.projects && action.payload.blogs && action.payload.certifications) {
        state.about = action.payload.about;
        state.experiences = action.payload.experiences;
        state.projects = action.payload.projects;
        state.blogs = action.payload.blogs;
        state.certifications = action.payload.certifications;
      }
    },
    updateAbout: (state, action: PayloadAction<PortfolioState['about']>) => {
      state.about = action.payload;
    },
    addExperience: (state, action: PayloadAction<Omit<Experience, 'id'>>) => {
      state.experiences.push({ ...action.payload, id: `exp${Date.now()}` });
    },
    updateExperience: (state, action: PayloadAction<Experience>) => {
      const index = state.experiences.findIndex(exp => exp.id === action.payload.id);
      if (index !== -1) {
        state.experiences[index] = action.payload;
      }
    },
    deleteExperience: (state, action: PayloadAction<string>) => {
      state.experiences = state.experiences.filter(exp => exp.id !== action.payload);
    },
    addProject: (state, action: PayloadAction<Omit<Project, 'id'>>) => {
      state.projects.push({ ...action.payload, id: `proj${Date.now()}` });
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
    },
    addBlog: (state, action: PayloadAction<Omit<Blog, 'id' | 'slug'>>) => {
      const slug = action.payload.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      state.blogs.push({ ...action.payload, id: `blog${Date.now()}`, slug });
    },
    updateBlog: (state, action: PayloadAction<Blog>) => {
      const index = state.blogs.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.blogs[index] = action.payload;
      }
    },
    deleteBlog: (state, action: PayloadAction<string>) => {
      state.blogs = state.blogs.filter(b => b.id !== action.payload);
    },
    addMessage: (state, action: PayloadAction<Omit<ContactMessage, 'id' | 'date'>>) => {
        const newMessage = { ...action.payload, id: `msg${Date.now()}`, date: new Date().toISOString().split('T')[0] };
        state.messages.push(newMessage);
    },
    deleteMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(m => m.id !== action.payload);
    },
    addCertification: (state, action: PayloadAction<Omit<Certification, 'id'>>) => {
      state.certifications.push({ ...action.payload, id: `cert${Date.now()}` });
    },
    updateCertification: (state, action: PayloadAction<Certification>) => {
      const index = state.certifications.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.certifications[index] = action.payload;
      }
    },
    deleteCertification: (state, action: PayloadAction<string>) => {
      state.certifications = state.certifications.filter(c => c.id !== action.payload);
    },
  },
});

export const { 
    setPortfolio,
    updateAbout,
    addExperience, updateExperience, deleteExperience,
    addProject, updateProject, deleteProject,
    addBlog, updateBlog, deleteBlog,
    addMessage, deleteMessage,
    addCertification, updateCertification, deleteCertification
} = portfolioSlice.actions;

export default portfolioSlice.reducer;
