import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/ApiProvider';
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

interface PaginationInfo {
  current_page: number;
  last_page: number;
  page_size: number;
  total_count: number;
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useFetchData = <T,>(endpoint: string, options: FetchOptions = {}) => {
  const { tableState, pageSize = 10 } = options;
  const { token } = useAuth();
  const [data, setData] = useState<T | T[] | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!endpoint || !token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (tableState) {
        params.append('page', tableState.page.toString());
        params.append('pageSize', pageSize.toString());
      }
      
      const url = `${API_BASE_URL}${endpoint}?${params.toString()}`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      
      if (result.records) {
        setData(result.records || []);
        setPagination({
          current_page: result.current_page,
          last_page: result.last_page,
          page_size: result.page_size,
          total_count: result.total_count,
        });
      } else {
        setData(result.user || result.subject || result.task || result);
        setPagination(null);
      }
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, token, tableState?.page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, pagination, isLoading, error, refetch: fetchData };
};