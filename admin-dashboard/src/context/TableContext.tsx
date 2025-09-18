import React, { createContext, useContext, useMemo, useRef, type ReactNode } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Link } from '@tanstack/react-router';
import TableManager, { type TableColumn, type FilterRule, type SortRule, type TableAction } from '../components/TableManager/TableManager';
import TableControls from '../components/TableControls/TableControls';
import { useFetchData } from '../hooks/useFetchData';
import { useActions } from './ActionsContext';
import { ViewIcon, EditIcon, DeleteIcon } from '../components/Icons/Icons';

// ... (StatusBadge component and interfaces remain the same) ...
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusStyles: React.CSSProperties = { padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 500, textTransform: 'capitalize' };
  const statusColors = { active: { backgroundColor: '#e7f7ef', color: '#00c853' }, approved: { backgroundColor: '#e7f7ef', color: '#00c853' }, inactive: { backgroundColor: '#fff4e5', color: '#ff9800' }, pending: { backgroundColor: '#fff4e5', color: '#ff9800' }, moderator: { backgroundColor: '#e3f2fd', color: '#2196f3' }, admin: { backgroundColor: '#ede7f6', color: '#673ab7' }, user: { backgroundColor: '#f3e5f5', color: '#9c27b0' }, trainee: { backgroundColor: '#f3e5f5', color: '#9c27b0' }, rejected: { backgroundColor: '#fbeae9', color: '#dc3545' } };
  const style = statusColors[status.toLowerCase() as keyof typeof statusColors] || {};
  return <span style={{ ...statusStyles, ...style }}>{status}</span>;
};
export interface TableState { page: number; filters: FilterRule[]; sorters: SortRule[]; }
type UserConfig = { type: 'users' };
type SubjectConfig = { type: 'subjects' };
type TaskConfig = { type: 'tasks' };
type TableProviderConfig = UserConfig | SubjectConfig | TaskConfig;
interface TableProviderProps { children: ReactNode; config: TableProviderConfig; state: TableState; onStateChange: (newState: Partial<TableState>) => void; rowsPerPage?: number; }
const TableContext = createContext<any>(null);
export const useTableContext = () => {
  const context = useContext(TableContext);
  if (!context) throw new Error('useTableContext must be used within a TableProvider');
  return context;
};

export const TableProvider: React.FC<TableProviderProps> = ({
  children, config, state, onStateChange, rowsPerPage = 10,
}) => {
  const tableManagerRef = useRef<any>(null);
  const { openModal } = useActions();
  const endpoint = useMemo(() => {
    switch (config.type) {
      case 'users': return '/admin/users';
      case 'subjects': return '/admin/subjects';
      case 'tasks': return '/admin/tasks';
      default: throw new Error('Invalid table config type');
    }
  }, [config.type]);
  const { data: pageData, pagination, isLoading, error } = useFetchData(endpoint, {
    tableState: state,
    pageSize: rowsPerPage,
  });
  const processedData = useMemo(() => {
    if (!pageData || !Array.isArray(pageData)) return [];
    let processed = [...pageData];
    if (state.filters.length > 0) {
      processed = processed.filter((item: any) =>
        state.filters.every(filter => {
          if (!filter.column || !filter.value) return true;
          const itemValue = (item[filter.column] || '').toString().toLowerCase();
          const filterValue = filter.value.toLowerCase();
          switch (filter.relation) {
            case 'equals': return itemValue === filterValue;
            case 'startsWith': return itemValue.startsWith(filterValue);
            case 'contains': default: return itemValue.includes(filterValue);
          }
        })
      );
    }
    if (state.sorters.length > 0) {
      processed.sort((a: any, b: any) => {
        for (const sorter of state.sorters) {
          const valA = a[sorter.column];
          const valB = b[sorter.column];
          let comparison = 0;
          if (valA > valB) comparison = 1;
          else if (valA < valB) comparison = -1;
          if (comparison !== 0) {
            return sorter.order === 'asc' ? comparison : -comparison;
          }
        }
        return 0;
      });
    }
    return processed;
  }, [pageData, state.filters, state.sorters]);
  const columns: TableColumn[] = useMemo(() => {
    switch (config.type) {
      case 'users':
        return [{ id: 'id', caption: 'ID', sortable: true, size: 80 }, { id: 'name', caption: 'Name', filterable: true, sortable: true, size: 200 }, { id: 'email', caption: 'Email', filterable: true, sortable: true }, { id: 'role', caption: 'Role', filterable: true, sortable: true, render: (row) => <StatusBadge status={row.role} />, size: 150 }, { id: 'status', caption: 'Status', filterable: true, sortable: true, render: (row) => <StatusBadge status={row.status} />, size: 150 }, { id: 'created_at', caption: 'Created', sortable: true, render: (row) => new Date(row.created_at).toLocaleDateString(), size: 150 }];
      case 'subjects':
        return [{ id: 'name', caption: 'Name', filterable: true, sortable: true, size: 300, render: (row) => <Link to="/subjects/$subjectId" params={{ subjectId: row.id.toString() }}>{row.name}</Link> }, { id: 'description', caption: 'Description', filterable: true }, { id: 'created_by_name', caption: 'Created By', filterable: true, sortable: true }];
      case 'tasks':
        return [{ id: 'title', caption: 'Title', filterable: true, sortable: true }, { id: 'subject_name', caption: 'Subject', filterable: true, sortable: true }, { id: 'due_date', caption: 'Due Date', sortable: true, type: 'date' }, { id: 'max_score', caption: 'Score', sortable: true, type: 'number', align: 'center' }];
      default: return [];
    }
  }, [config.type]);

   const actions: TableAction[] = useMemo(() => {
    const viewIcon = ReactDOMServer.renderToStaticMarkup(<ViewIcon />);
    const editIcon = ReactDOMServer.renderToStaticMarkup(<EditIcon />);
    const deleteIcon = ReactDOMServer.renderToStaticMarkup(<DeleteIcon />);

    // This function now creates simple, direct links for all types
    const createActions = (type: 'users' | 'subjects' | 'tasks') => [
        { id: 'view', title: `View ${type}`, icon: viewIcon, type: 'link' as const, href: (row: any) => `/${type}/${row.id}` },
        { id: 'edit', title: `Edit ${type}`, icon: editIcon, handler: (rowId: any) => openModal('edit', type, rowId) },
        { id: 'delete', title: `Delete ${type}`, icon: deleteIcon, handler: (rowId: any) => openModal('delete', type, rowId) },
    ];
    return createActions(config.type);
  }, [config.type, openModal]);

  const contextValue = { state, data: processedData, totalRecords: pagination?.total_count || 0, isLoading, error: error?.message || null, updateState: onStateChange, columns, actions, rowsPerPage, emptyMessage: `No ${config.type} found.`, tableManagerRef, getControlStatus: () => ({ filterCount: state.filters.length, sorterCount: state.sorters.length }) };

  return (<TableContext.Provider value={contextValue}>{children}</TableContext.Provider>);
};

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
  return (<div className="loading-overlay"><div className="spinner"></div></div>);
};

export const ErrorMessage: React.FC = () => {
  const { error } = useTableContext();
  if (!error) return null;
  return <div className="error-message">Error: {error}</div>;
};