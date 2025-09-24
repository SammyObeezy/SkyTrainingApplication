export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createHeaders = (token: string | null, isFormData = false) => {
  const headers: Record<string, string> = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};