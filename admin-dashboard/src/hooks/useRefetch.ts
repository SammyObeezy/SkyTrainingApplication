import { useContext } from 'react';
import { TableContext } from '../context/TableContext';

interface RefetchOptions {
  resetToFirstPage?: boolean;
}

interface UseRefetchReturn {
  refetch: (options?: RefetchOptions) => void;
  isRefetching: boolean;
}

/**
 * Custom hook to refetch table data from forms and other components
 * Provides seamless data refresh without page reloads
 */
export const useRefetch = (): UseRefetchReturn => {
  const tableContext = useContext(TableContext);
  
  const refetch = (options: RefetchOptions = {}) => {
    const { resetToFirstPage = false } = options;
    
    // Try window fallback first
    const windowRefetch = (window as any).__tableRefetch;
    const availableRefetch = tableContext?.refetch || windowRefetch;
    
    if (!availableRefetch) {
      console.warn('useRefetch: No refetch function available, falling back to page reload');
      setTimeout(() => window.location.reload(), 100);
      return;
    }
    
    console.log('useRefetch: Using refetch function');
    
    if (resetToFirstPage && tableContext?.updateState) {
      tableContext.updateState({ page: 1 });
    }
    
    availableRefetch();
  };
  
  return {
    refetch,
    isRefetching: tableContext?.isLoading || false
  };
};