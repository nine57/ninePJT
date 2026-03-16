export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Auth
  SIGNUP: '/api/auth/signup',
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  TOKEN_REFRESH: '/api/auth/refresh',
  ME: '/api/auth/me',

  // Organizations
  ORGANIZATIONS: '/api/organizations',

  // Posts
  POSTS: '/api/posts',

  // Expenses
  EXPENSES: '/api/expenses',
  EXPENSES_ANALYZE_IMAGE: '/api/expenses/analyze-image',

  // Pictures
  PICTURES: '/api/pictures',

  // System
  HEALTH: '/api/health',
} as const;

