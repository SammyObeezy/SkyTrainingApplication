import React, { createContext, useContext, useMemo, useRef, type ReactNode } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Link } from '@tanstack/react-router';
import TableManager, { type TableColumn, type FilterRule, type SortRule, type TableAction } from '../components/TableManager/TableManager';
import TableControls from '../components/TableControls/TableControls';
import { useFetchData } from '../hooks/useFetchData';
import { useMutateData } from '../hooks/useMutateData';
import { ViewIcon, EditIcon, DeleteIcon } from '../components/Icons/Icons';

// --- TYPE DEFINITIONS ---
export interface TableState { page: number; filters: FilterRule[]; sorters: SortRule[]; }
type UserConfig = { type: 'users' };
type SubjectConfig = { type: 'subjects' };
type TaskConfig = { type: 'tasks' };
type TableProviderConfig = UserConfig | SubjectConfig | TaskConfig;
interface TableProviderProps { children: ReactNode; config: TableProviderConfig; state: TableState; onStateChange: (newState: Partial<TableState>) => void; rowsPerPage?: number; }

// --- CONTEXT ---
const TableContext = createContext<any>(null);
export const useTableContext = () => {
  const context = useContext(TableContext);
  if (!context) throw new Error('useTableContext must be used within a TableProvider');
  return context;
};

// --- PROVIDER COMPONENT ---
export const TableProvider: React.FC<TableProviderProps> = ({
  children, config, state, onStateChange, rowsPerPage = 10,
}) => {
  const tableManagerRef = useRef<any>(null);
  const { mutate: deleteItem } = useMutateData();

  const endpoint = useMemo(() => {
    switch (config.type) {
      case 'users': return '/admin/users';
      case 'subjects': return '/admin/subjects';
      case 'tasks': return '/admin/tasks';
      default: throw new Error('Invalid table config type');
    }
  }, [config.type]);

  // Get the refetch function from our updated hook
  const { data, pagination, isLoading, error, refetch } = useFetchData(endpoint, {
    tableState: state,
    pageSize: rowsPerPage,
  });
  
  const columns: TableColumn[] = useMemo(() => {
    switch (config.type) {
      case 'users':
        return [{ id: 'name', caption: 'Name', filterable: true, sortable: true }, { id: 'email', caption: 'Email', filterable: true, sortable: true }, { id: 'role', caption: 'Role', filterable: true, sortable: true }, { id: 'status', caption: 'Status', filterable: true, sortable: true, align: 'center' }];
      case 'subjects':
        return [{ id: 'name', caption: 'Name', filterable: true, sortable: true, size: 300, render: (row) => <Link to="/subjects/$subjectId" params={{ subjectId: row.id }}>{row.name}</Link> }, { id: 'description', caption: 'Description', filterable: true }, { id: 'created_by_name', caption: 'Created By', filterable: true, sortable: true }];
      case 'tasks':
        return [{ id: 'title', caption: 'Title', filterable: true, sortable: true }, { id: 'subject_name', caption: 'Subject', filterable: true, sortable: true }, { id: 'due_date', caption: 'Due Date', sortable: true, type: 'date' }, { id: 'max_score', caption: 'Score', sortable: true, type: 'number', align: 'center' }];
      default: return [];
    }
  }, [config.type]);

  const actions: TableAction[] = useMemo(() => {
    const handleDelete = (id: number) => {
      if (window.confirm('Are you sure you want to delete this item?')) {
        deleteItem(`${endpoint}/${id}`, 'DELETE')
          .then(() => { refetch(); }) // Refetch data on successful delete
          .catch(err => { alert(`Failed to delete: ${err.message}`); });
      }
    };

    // Convert React components to HTML strings for the table manager
    const viewIcon = ReactDOMServer.renderToStaticMarkup(<ViewIcon />);
    const editIcon = ReactDOMServer.renderToStaticMarkup(<EditIcon />);
    const deleteIcon = ReactDOMServer.renderToStaticMarkup(<DeleteIcon />);

    const commonActions = (type: 'users' | 'subjects' | 'tasks') => [
        { id: 'view', title: `View ${type}`, icon: viewIcon, type: 'link' as const, href: (row: any) => `/${type}/${row.id}` },
        { id: 'edit', title: `Edit ${type}`, icon: editIcon, type: 'link' as const, href: (row: any) => `/${type}/${row.id}/edit` },
        { id: 'delete', title: `Delete ${type}`, icon: deleteIcon, handler: (rowId: any) => handleDelete(rowId) },
    ];
    
    return commonActions(config.type);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.type, endpoint, refetch]);

  const contextValue = { state, data: data || [], totalRecords: pagination?.total_count || 0, isLoading, error: error?.message || null, updateState: onStateChange, columns, actions, rowsPerPage, emptyMessage: `No ${config.type} found.`, tableManagerRef, getControlStatus: () => ({ filterCount: state.filters.length, sorterCount: state.sorters.length }) };

  return (<TableContext.Provider value={contextValue}>{children}</TableContext.Provider>);
};

// --- HELPER COMPONENTS ---
export const TableWithContext: React.FC = () => {
  const { data, columns, actions, rowsPerPage, emptyMessage, state, totalRecords, updateState, tableManagerRef } = useTableContext();
  return (<TableManager ref={tableManagerRef} data={data} columns={columns} actions={actions} rowsPerPage={rowsPerPage} emptyMessage={emptyMessage} filters={state.filters} sorters={state.sorters} currentPage={state.page} totalRecords={totalRecords} onStateChange={updateState} />);
};

export const TableControlsWithContext: React.FC = () => {
  const { tableManagerRef, getControlStatus } = useTableContext();
  return <TableControls tableManagerRef={tableManagerRef} status={getControlStatus()} />;
};

export const LoadingOverlay: React.FC = () => {
  const { isLoading } = useTableContext();
  if (!isLoading) return null;
  return <div className="loading-overlay">Loading...</div>;
};

export const ErrorMessage: React.FC = () => {
  const { error } = useTableContext();
  if (!error) return null;
  return <div className="error-message">Error: {error}</div>;
};