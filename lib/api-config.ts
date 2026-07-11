export const getApiBase = () => {
  // Use relative proxy path to bypass CORS via Next.js rewrites
  return '/api/admin-proxy';
};

export const getPublicApiBase = () => {
  // Use relative proxy path for public APIs
  return '/api/public-proxy';
};

export const getAbsoluteBackendUrl = () => {
  return process.env.BACKEND_URL || "https://womb-care-backend-76858014616.europe-west1.run.app";
};

export const API_BASE = getApiBase();
