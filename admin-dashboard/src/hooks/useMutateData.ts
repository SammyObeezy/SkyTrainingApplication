import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/ApiProvider';
import { API_BASE_URL, createHeaders } from '../components/config/api';

type HttpMethod = 'POST' | 'PUT' | 'DELETE';

export const useMutateData = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ endpoint, method, body }: {
      endpoint: string;
      method: HttpMethod;
      body?: any;
    }) => {
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const isFormData = body instanceof FormData;
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: createHeaders(token, isFormData),
        body: body ? (isFormData ? body : JSON.stringify(body)) : null,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          message: 'Request failed with status ' + response.status 
        }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries based on endpoint
      const endpointParts = variables.endpoint.split('/');
      const resourceType = endpointParts[2]; // e.g., 'users', 'subjects', 'tasks'
      
      if (resourceType) {
        queryClient.invalidateQueries({ queryKey: ['data', `/admin/${resourceType}`] });
      }
    },
  });
};