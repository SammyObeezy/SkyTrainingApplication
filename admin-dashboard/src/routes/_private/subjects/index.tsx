import { createFileRoute, Link } from '@tanstack/react-router';
import {
  TableProvider,
  TableWithContext,
  TableControlsWithContext,
  LoadingOverlay,
  ErrorMessage,
  useTableContext,
} from '../../../context/TableContext';
import { PageHeader } from '../../../components/PageHeader/PageHeader';
import { useUrlTableState } from '../../../hooks/useUrlTableState';
import { useEffect } from 'react';
import './subjects.css';

// Define the schema for the URL search parameters
const tableSearchSchema = {
    page: (page: number | undefined) => page || 1,
    filters: (filters: Record<string, string> | undefined) => filters || {},
    sorters: (sorters: Record<string, string> | undefined) => sorters || {},
};

export const Route = createFileRoute('/_private/subjects/')({
  // Validate the search params to make them type-safe
  validateSearch: (search: Record<string, unknown>) => ({
    page: tableSearchSchema.page(search.page as number | undefined),
    filters: tableSearchSchema.filters(search.filters as Record<string, string> | undefined),
    sorters: tableSearchSchema.sorters(search.sorters as Record<string, string> | undefined),
  }),
  component: SubjectsPage,
});

// Component that has access to TableContext
const SubjectsPageContent = () => {
  const { refetch } = useTableContext();
  
  // Register the refetch function for ActionsModal to access
  useEffect(() => {
    // Set refetch on window for ActionsModal to access
    (window as any).__tableRefetch = refetch;
    
    return () => {
      delete (window as any).__tableRefetch;
    };
  }, [refetch]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-unit)' }}>
      <PageHeader title="Manage Subjects">
        <Link to="/subjects/new" className="create-button">
          Create Subject
        </Link>
        <TableControlsWithContext />
      </PageHeader>
      
      <ErrorMessage />
      <LoadingOverlay />
      <TableWithContext />
    </div>
  );
};

function SubjectsPage() {
  // Use custom hook to manage state and sync it with the URL
  const [tableState, setTableState] = useUrlTableState(Route);

  return (
    <TableProvider
      config={{ type: 'subjects' }}
      state={tableState}
      onStateChange={(newState) => setTableState((prev) => ({ ...prev, ...newState }))}
    >
      <SubjectsPageContent />
    </TableProvider>
  );
}