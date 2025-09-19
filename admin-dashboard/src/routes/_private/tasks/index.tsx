import { createFileRoute } from '@tanstack/react-router';
import {
  TableProvider,
  TableWithContext,
  TableControlsWithContext,
  LoadingOverlay,
  ErrorMessage,
} from '../../../context/TableContext';
import { PageHeader } from '../../../components/PageHeader/PageHeader';
import { useUrlTableState } from '../../../hooks/useUrlTableState';
import './styles.css';

// 1. Define the schema for the URL search parameters
const tableSearchSchema = {
    page: (page: number | undefined) => page || 1,
    filters: (filters: Record<string, string> | undefined) => filters || {},
    sorters: (sorters: Record<string, string> | undefined) => sorters || {},
};

export const Route = createFileRoute('/_private/tasks/')({
  // 2. Validate the search params to make them type-safe
  validateSearch: (search: Record<string, unknown>) => ({
    page: tableSearchSchema.page(search.page as number | undefined),
    filters: tableSearchSchema.filters(search.filters as Record<string, string> | undefined),
    sorters: tableSearchSchema.sorters(search.sorters as Record<string, string> | undefined),
  }),
  component: TasksPage,
});

function TasksPage() {
  // 3. Use our custom hook to manage state and sync it with the URL
  const [tableState, setTableState] = useUrlTableState(Route);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-unit)' }}>
      <TableProvider
        config={{ type: 'tasks' }}
        state={tableState}
        onStateChange={(newState) => setTableState((prev) => ({ ...prev, ...newState }))}
      >
        <PageHeader title="Manage Tasks">
          <TableControlsWithContext />
        </PageHeader>
        
        <ErrorMessage />
        <LoadingOverlay />
        <TableWithContext />
      </TableProvider>
    </div>
  );
}