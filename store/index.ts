import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import portfolioReducer from './portfolioSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  portfolio: portfolioReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in React elements for project icons
        ignoredPaths: ['portfolio.projects'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;