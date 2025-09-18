import { useState } from 'react';
import { useAuth } from '../context/ApiProvider';

type HttpMethod = 'POST' | 'PUT' | 'DELETE';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useMutateData = <T,>() => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const mutate = async (endpoint: string, method: HttpMethod, body?: any) => {
    if (!token) {
        setError(new Error("No authentication token found."));
        return;
    }
    
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Request failed with status ' + response.status }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, data, isLoading, error };
};
