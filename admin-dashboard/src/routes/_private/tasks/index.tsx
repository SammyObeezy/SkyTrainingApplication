import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  TableProvider,
  type TableState,
  TableWithContext,
  TableControlsWithContext,
  LoadingOverlay,
  ErrorMessage,
} from '../../../context/TableContext';
import { PageHeader } from '../../../components/PageHeader/PageHeader';
import './styles.css';

// This defines the route for /tasks
export const Route = createFileRoute('/_private/tasks/')({
  component: TasksPage,
});

function TasksPage() {
  const [tableState, setTableState] = useState<TableState>({
    page: 1,
    filters: [],
    sorters: [],
  });

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