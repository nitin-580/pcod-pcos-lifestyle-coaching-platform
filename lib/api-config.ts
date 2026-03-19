export const getApiBase = () => {
  // Use relative proxy path to bypass CORS via Next.js rewrites
  return '/api/admin-proxy';
};

export const getPublicApiBase = () => {
  // Use relative proxy path for public APIs
  return '/api/public-proxy';
};

export const API_BASE = getApiBase();
