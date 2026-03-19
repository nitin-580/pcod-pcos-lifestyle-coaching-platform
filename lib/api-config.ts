export const getApiBase = () => {
  // Use relative proxy path to bypass CORS via Next.js rewrites
  return '/api/admin-proxy';
};

export const API_BASE = getApiBase();
