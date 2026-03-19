export const getApiBase = () => {
  if (typeof window !== 'undefined') {
    // If running on localhost, default to localhost backend, otherwise prod
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3001/api/admin';
    }
  }
  return 'https://womb-care-backend-76858014616.us-central1.run.app/api/admin';
};

export const API_BASE = getApiBase();
