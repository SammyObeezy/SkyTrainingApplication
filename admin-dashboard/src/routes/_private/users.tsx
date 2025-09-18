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
  const [tableState, setTableState] = useState<TableState>({
    page: 1,
    filters: [],
    sorters: [],
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
        
        {/* These components from the context will automatically handle
            the loading, error, and "No users found" states. */}
        <ErrorMessage />
        <LoadingOverlay />
        <TableWithContext />
      </TableProvider>
    </div>
  );
}