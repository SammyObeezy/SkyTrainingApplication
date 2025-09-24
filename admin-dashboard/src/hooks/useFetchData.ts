import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/ApiProvider';
import { API_BASE_URL, createHeaders } from '../components/config/api';
import type { FilterRule, SortRule } from '../components/TableManager/TableManager';

interface TableState {
  page: number;
  filters: FilterRule[];
  sorters: SortRule[];
}

interface FetchOptions {
  tableState?: TableState;
  pageSize?: number;
}

export const useFetchData = (endpoint: string, options: FetchOptions = {}) => {
  const { tableState, pageSize = 10 } = options;
  const { token } = useAuth();

  return useQuery({
    queryKey: ['data', endpoint, tableState?.page, pageSize],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const params = new URLSearchParams();
      if (tableState) {
        params.append('page', tableState.page.toString());
        params.append('pageSize', pageSize.toString());
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}?${params}`, {
        headers: createHeaders(token),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      
      // Handle different API response structures
      if (result.records) {
        return {
          data: result.records || [],
          pagination: {
            current_page: result.current_page,
            last_page: result.last_page,
            page_size: result.page_size,
            total_count: result.total_count,
          }
        };
      } else {
        return {
          data: result.user || result.subject || result.task || result,
          pagination: null
        };
      }
    },
    enabled: !!endpoint && !!token,
  });
};