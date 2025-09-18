import React, { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  TableProvider,
  type TableState,
  TableWithContext,
  TableControlsWithContext,
  LoadingOverlay,
  ErrorMessage,
} from '../../../context/TableContext';
import { PageHeader } from '../../../components/PageHeader/PageHeader';

// Add this import statement
import './subjects.css';

// This defines the route for /subjects
export const Route = createFileRoute('/_private/subjects/')({
  component: SubjectsPage,
});

function SubjectsPage() {
  const [tableState, setTableState] = useState<TableState>({
    page: 1,
    filters: [],
    sorters: [],
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-unit)' }}>
      <TableProvider
        config={{ type: 'subjects' }}
        state={tableState}
        onStateChange={(newState) => setTableState((prev) => ({ ...prev, ...newState }))}
      >
        <PageHeader title="Manage Subjects">
          {/* This Link will eventually go to the 'Create Subject' page */}
          <Link to="/subjects/new" className="create-button">
            Create Subject
          </Link>
          <TableControlsWithContext />
        </PageHeader>
        
        <ErrorMessage />
        <LoadingOverlay />
        <TableWithContext />
      </TableProvider>
    </div>
  );
}