import React, { createContext, useContext, useMemo, useRef, type ReactNode } from 'react';
import ReactDOMServer from 'react-dom/server';
import TableManager, { type TableColumn, type FilterRule, type SortRule, type TableAction } from '../components/TableManager/TableManager';
import TableControls from '../components/TableControls/TableControls';
import { useFetchData } from '../hooks/useFetchData';
import { useActions } from './ActionsContext';
import { ViewIcon, EditIcon, DeleteIcon } from '../components/Icons/Icons';
import { useIdEncoder } from '../hooks/useIdEncoder';

export interface TableState { page: number; filters: FilterRule[]; sorters: SortRule[]; }
type UserConfig = { type: 'users' };
type SubjectConfig = { type: 'subjects' };
type TaskConfig = { type: 'tasks' };
type TableProviderConfig = UserConfig | SubjectConfig | TaskConfig;
interface TableProviderProps { children: ReactNode; config: TableProviderConfig; state: TableState; onStateChange: (newState: Partial<TableState>) => void; rowsPerPage?: number; }
const TableContext = createContext<any>(null);

export { TableContext }; // Export the context

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

  const { data: apiResponse, pagination, isLoading, error, refetch } = useFetchData<any>(endpoint, {
    tableState: state,
    pageSize: rowsPerPage,
  });

  // Handle API response structure - extract records array for tasks
  const pageData = useMemo(() => {
    if (!apiResponse) return [];

    // For tasks API, data comes in records array
    if (config.type === 'tasks' && apiResponse.records && Array.isArray(apiResponse.records)) {
      console.log('Raw API data for tasks:', apiResponse.records);
      return apiResponse.records;
    }

    // For other APIs, data might be direct array
    if (Array.isArray(apiResponse)) {
      console.log('Raw API data (array):', apiResponse);
      return apiResponse;
    }

    return [];
  }, [apiResponse, config.type]);

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

  const statusColors = {
    active: { backgroundColor: '#d4edda', color: '#155724' },
    approved: { backgroundColor: '#d4edda', color: '#155724' },
    inactive: { backgroundColor: '#f8f9fa', color: '#6c757d' },
    pending: { backgroundColor: '#fff3cd', color: '#856404' },
    moderator: { backgroundColor: '#cce5ff', color: '#004085' },
    admin: { backgroundColor: '#e2e3e5', color: '#383d41' },
    user: { backgroundColor: '#f8f9fa', color: '#495057' },
    trainee: { backgroundColor: '#f8f9fa', color: '#495057' },
    rejected: { backgroundColor: '#f8d7da', color: '#721c24' }
  };

  const columns: TableColumn[] = useMemo(() => {
    switch (config.type) {
      case 'users':
        return [
          { id: 'id', caption: 'ID', sortable: true, size: 80 },
          {
            id: 'avatar_url',
            caption: 'Avatar',
            size: 60,
            align: 'center',
            render: (row) => row.avatar_url ?
              <img src={row.avatar_url} alt={row.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} /> :
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#718096' }}>
                {row.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
          },
          { id: 'name', caption: 'Name', filterable: true, sortable: true, size: 200 },
          { id: 'email', caption: 'Email', filterable: true, sortable: true },
          {
            id: 'role',
            caption: 'Role',
            filterable: true,
            sortable: true,
            type: 'status',
            statusColors,
            size: 150
          },
          {
            id: 'status',
            caption: 'Status',
            filterable: true,
            sortable: true,
            type: 'status',
            statusColors,
            size: 150
          },
          {
            id: 'created_at',
            caption: 'Created',
            sortable: true,
            render: (row) => new Date(row.created_at).toLocaleDateString(),
            size: 150
          },
        ];
      case 'subjects':
        return [
          { id: 'name', caption: 'Name', filterable: true, sortable: true, size: 300 },
          { id: 'description', caption: 'Description', filterable: true },
          { id: 'created_by_name', caption: 'Created By', filterable: true, sortable: true }
        ];
      case 'tasks':
        return [
          { id: 'id', caption: 'ID', sortable: true, size: 80 },
          { id: 'title', caption: 'Title', filterable: true, sortable: true, size: 200 },
          { id: 'subject_name', caption: 'Subject', filterable: true, sortable: true, size: 150 },
          { id: 'description', caption: 'Description', filterable: true, size: 250 },
          {
            id: 'due_date', caption: 'Due Date', sortable: true, type: 'date', size: 150,
            render: (row) => new Date(row.due_date).toLocaleDateString()
          },
          { id: 'max_score', caption: 'Score', sortable: true, type: 'number', align: 'center', size: 100 },
          {
            id: 'is_active',
            caption: 'Status',
            filterable: true,
            sortable: true,
            type: 'status',
            statusColors,
            size: 100,
            render: (row) => row.is_active ? 'Active' : 'Inactive'
          },
          { id: 'created_by_name', caption: 'Created By', filterable: true, sortable: true, size: 150 },
          {
            id: 'created_at',
            caption: 'Created',
            sortable: true,
            render: (row) => new Date(row.created_at).toLocaleDateString(),
            size: 150
          }
        ];
      default: return [];
    }
  }, [config.type, statusColors]);

  const actions: TableAction[] = useMemo(() => {
    const { encode } = useIdEncoder();
    const viewIcon = ReactDOMServer.renderToStaticMarkup(<ViewIcon />);
    const editIcon = ReactDOMServer.renderToStaticMarkup(<EditIcon />);
    const deleteIcon = ReactDOMServer.renderToStaticMarkup(<DeleteIcon />);
    const createActions = (type: 'users' | 'subjects' | 'tasks') => {
      const paramMap = {
        users: 'userId',
        subjects: 'subjectId',
        tasks: 'taskId',
      };
      const paramKey = paramMap[type];
      return [
        {
          id: 'view',
          title: `View ${type}`,
          icon: viewIcon,
          type: 'link' as const,
          to: `/${type}/$${paramKey}`,
          getParams: (row: any) => ({ [paramKey]: encode(row.id) })
        },
        {
          id: 'edit',
          title: `Edit ${type}`,
          icon: editIcon,
          handler: (rowId: any) => openModal('edit', type, encode(rowId))
        },
        { id: 'delete', title: `Delete ${type}`, icon: deleteIcon, handler: (rowId: any) => openModal('delete', type, rowId) },
      ];
    }
    return createActions(config.type);
  }, [config.type, openModal]);

  // Update pagination to handle both API response structures
  const totalRecords = useMemo(() => {
    if (config.type === 'tasks' && apiResponse?.total_count) {
      return apiResponse.total_count;
    }
    return pagination?.total_count || 0;
  }, [apiResponse, pagination, config.type]);

  const contextValue = {
    state,
    data: processedData,
    totalRecords,
    isLoading,
    error: error?.message || null,
    updateState: onStateChange,
    columns,
    actions,
    rowsPerPage,
    emptyMessage: `No ${config.type} found.`,
    tableManagerRef,
    getControlStatus: () => ({ filterCount: state.filters.length, sorterCount: state.sorters.length }),
    refetch
  };

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
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