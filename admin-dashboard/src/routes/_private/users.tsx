import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  TableProvider,
  type TableState,
  TableWithContext,
  TableControlsWithContext,
  LoadingOverlay,
  ErrorMessage,
} from '../../context/TableContext';
import { PageHeader } from '../../components/PageHeader/PageHeader';

export const Route = createFileRoute('/_private/users')({
  component: UsersPage,
});

function UsersPage() {
  // Add the default sorter back in
  const [tableState, setTableState] = useState<TableState>({
    page: 1,
    filters: [],
    sorters: [{ column: 'id', order: 'asc' }],
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-unit)' }}>
      <TableProvider
        config={{ type: 'users' }}
        state={tableState}
        onStateChange={(newState) => setTableState((prev) => ({ ...prev, ...newState }))}
      >
        <PageHeader title="Manage Users">
          <TableControlsWithContext />
        </PageHeader>
        
        <ErrorMessage />
        <LoadingOverlay />
        <TableWithContext />
      </TableProvider>
    </div>
  );
}