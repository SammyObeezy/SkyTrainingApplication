import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { type TableState } from '../context/TableContext';

export const useUrlTableState = (route: any, defaultSorters: TableState['sorters'] = []) => {
  const navigate = useNavigate();
  const searchParams = route.useSearch();

  const [tableState, setTableState] = useState<TableState>({
    page: searchParams.page || 1,
    filters: searchParams.filters ? Object.entries(searchParams.filters).map(([column, value]) => ({
        column,
        value: String(value),
        relation: 'contains',
    })) : [],
    sorters: searchParams.sorters ? Object.entries(searchParams.sorters).map(([column, order]) => ({
        column,
        order: order as 'asc' | 'desc',
    })) : defaultSorters,
  });

  useEffect(() => {
    const newSearch: any = { page: tableState.page };

    if (tableState.filters.length > 0) {
        newSearch.filters = tableState.filters.reduce((acc, f) => ({ ...acc, [f.column]: f.value }), {});
    }
    if (tableState.sorters.length > 0) {
        newSearch.sorters = tableState.sorters.reduce((acc, s) => ({ ...acc, [s.column]: s.order }), {});
    } else {
        // Ensure sorters is undefined in the URL if empty, so the default can be used on reload
        newSearch.sorters = undefined;
    }

    navigate({
      search: newSearch,
      replace: true,
    });
  }, [tableState, navigate]);

  return [tableState, setTableState] as const;
};