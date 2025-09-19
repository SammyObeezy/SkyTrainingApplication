import React, { useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import { Link } from '@tanstack/react-router';
import "./TableManager.css";

// --- INTERFACES ---
export interface TableAction { id: string; icon: string; title: string; handler?: (rowId: any) => void; type?: 'button' | 'link'; to?: string; getParams?: (row: any) => Record<string, string>; }
export interface TableColumn { id: string; caption: string; filterable?: boolean; sortable?: boolean; size?: number; align?: 'left' | 'center' | 'right'; type?: 'string' | 'number' | 'date'; hide?: boolean; render?: (row: any) => React.ReactNode; }
export interface FilterRule { column: string; relation: 'equals' | 'contains' | 'startsWith'; value: string; }
export interface SortRule { column: string; order: 'asc' | 'desc'; }
export interface TableState { page: number; filters: FilterRule[]; sorters: SortRule[]; }
export interface TableManagerProps {
  data: any[];
  columns: TableColumn[];
  actions?: TableAction[];
  rowsPerPage?: number;
  emptyMessage?: string;
  className?: string;
  filters: FilterRule[];
  sorters: SortRule[];
  currentPage: number;
  totalRecords: number;
  onStateChange: (newState: Partial<TableState>) => void;
}
interface ModalProps { isOpen: boolean; onClose: () => void; title: React.ReactNode; children: React.ReactNode; footer: React.ReactNode; className?: string; }

// --- INTERNAL ICONS & UTILS ---
const SVGIcons = {
  close: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/></svg>,
  filter: <svg width="20" height="20" viewBox="0 0 19 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.61743 7.0542H15.6174V5.0542H3.61743M0.617432 0.0541992V2.0542H18.6174V0.0541992M7.61743 12.0542H11.6174V10.0542H7.61743V12.0542Z" fill="currentColor"/></svg>,
  sort: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 640 640" fill="currentColor"><path d="M278.6 438.6L182.6 534.6C170.1 547.1 149.8 547.1 137.3 534.6L41.3 438.6C28.8 426.1 28.8 405.8 41.3 393.3C53.8 380.8 74.1 380.8 86.6 393.3L128 434.7V128c0-17.7 14.3-32 32-32s32 14.3 32 32v306.7L233.4 393.3c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3zM352 96h32c17.7 0 32 14.3 32 32s-14.3 32-32 32h-32c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 128h96c17.7 0 32 14.3 32 32s-14.3 32-32 32h-96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 128h160c17.7 0 32 14.3 32 32s-14.3 32-32 32H352c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 128h224c17.7 0 32 14.3 32 32s-14.3 32-32 32H352c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/></svg>,
  add: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 8H8V13C8 13.55 7.55 14 7 14C6.45 14 6 13.55 6 13V8H1C0.45 8 0 7.55 0 7C0 6.45 0.45 6 1 6H6V1C6 0.45 6.45 0 7 0C7.55 0 8 0.45 8 1V6H13C13.55 6 14 6.45 14 7C14 7.55 13.55 8 13 8Z" fill="currentColor"/></svg>,
  delete: <svg width="24" height="24" viewBox="0 0 24 24"><path d="M9 3V4H4V6H5V19C5 20.1 5.9 21 7 21H17c1.1 0 2-.9 2-2V6h1V4h-5V3H9zM7 6h10v13H7V6zm2 2v9h2V8H9zm4 0v9h2V8h-2z" fill="#A10900"/></svg>,
};
const escapeHtml = (unsafe: any): string => {
  if (unsafe === null || unsafe === undefined) return '—';
  return unsafe.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
};

// --- SUB-COMPONENTS ---
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, className = '' }) => {
  if (!isOpen) return null;
  return (<div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}><div className={`modal-content ${className}`}><div className="modal-header"><h3 className="modal-title">{title}</h3><button className="modal-close" title="Close" onClick={onClose}>{SVGIcons.close}</button></div><div className="modal-body">{children}</div><div className="modal-footer">{footer}</div></div></div>);
};
const FilterRow: React.FC<{ filter: Partial<FilterRule>; columns: TableColumn[]; onChange: (filter: Partial<FilterRule>) => void; onRemove: () => void; }> = ({ filter, columns, onChange, onRemove }) => {
  const filterableColumns = columns.filter(c => c.filterable && !c.hide);
  return (<div className="filter-row"><select value={filter.column || ''} onChange={(e) => onChange({ ...filter, column: e.target.value })}><option value="">Select Column</option>{filterableColumns.map(c => (<option key={c.id} value={c.id}>{c.caption}</option>))}</select><select value={filter.relation || 'contains'} onChange={(e) => onChange({ ...filter, relation: e.target.value as FilterRule['relation'] })}><option value="contains">Contains</option><option value="equals">Equals</option><option value="startsWith">Starts With</option></select><input type="text" placeholder="Enter Value" value={filter.value || ''} onChange={(e) => onChange({ ...filter, value: e.target.value })} /><button className="delete-filter-btn" title="Remove Filter" onClick={onRemove}>{SVGIcons.delete}</button></div>);
};
const SortRow: React.FC<{ sorter: Partial<SortRule>; columns: TableColumn[]; onChange: (sorter: Partial<SortRule>) => void; onRemove: () => void; }> = ({ sorter, columns, onChange, onRemove }) => {
    const sortableColumns = columns.filter(c => c.sortable && !c.hide);
    return (<div className="sort-row"><select value={sorter.column || ''} onChange={(e) => onChange({ ...sorter, column: e.target.value })}><option value="">Select Column</option>{sortableColumns.map(c => (<option key={c.id} value={c.id}>{c.caption}</option>))}</select><select value={sorter.order || 'asc'} onChange={(e) => onChange({ ...sorter, order: e.target.value as SortRule['order'] })}><option value="asc">Ascending</option><option value="desc">Descending</option></select><button className="delete-sort-btn" title="Remove Sort Level" onClick={onRemove}>{SVGIcons.delete}</button></div>);
};

// --- MAIN COMPONENT ---
const TableManager = forwardRef<any, TableManagerProps>(({
  data = [], columns = [], actions = [], rowsPerPage = 10, emptyMessage = "No data available.", className = '',
  filters, sorters, currentPage, totalRecords, onStateChange,
}, ref) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<Partial<FilterRule>[]>([]);
  const [tempSorters, setTempSorters] = useState<Partial<SortRule>[]>([]);
  useImperativeHandle(ref, () => ({
    openFilterModal: () => { setTempFilters(filters.length > 0 ? [...filters] : [{}]); setIsFilterModalOpen(true); },
    openSortModal: () => { setTempSorters(sorters.length > 0 ? [...sorters] : [{}]); setIsSortModalOpen(true); },
    resetFilters: () => onStateChange({ filters: [] }),
    resetSorters: () => onStateChange({ sorters: [] }),
  }));
  const totalPages = useMemo(() => Math.ceil(totalRecords / rowsPerPage), [totalRecords, rowsPerPage]);
  const handlePageChange = (page: number) => { onStateChange({ page: Math.max(1, Math.min(page, totalPages || 1)) }); };
  const applyFilters = () => { onStateChange({ filters: tempFilters.filter(f => f.column && f.value) as FilterRule[], page: 1 }); setIsFilterModalOpen(false); };
  const applySorters = () => { const validSorters = tempSorters.filter(s => s.column) as SortRule[]; validSorters.forEach(s => { if (!s.order) s.order = 'asc'; }); onStateChange({ sorters: validSorters, page: 1 }); setIsSortModalOpen(false); };
  const paginationButtons = useMemo(() => {
    if (totalPages <= 1) return null;
    return (<div className="pagination-controls"><button className="pagination-btn" disabled={currentPage === 1} onClick={() => handlePageChange(1)}>First</button><button className="pagination-btn" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Prev</button><span className="page-indicator">Page {currentPage} of {totalPages}</span><button className="pagination-btn" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next</button><button className="pagination-btn" disabled={currentPage === totalPages} onClick={() => handlePageChange(totalPages)}>Last</button></div>);
  }, [totalPages, currentPage, handlePageChange]);
  
  if (!data || data.length === 0) {
    return ( <div className={`table-container ${className}`}><div className="no-data-message">{emptyMessage}</div></div> );
  }

  return (
    <>
      <div className={`table-container ${className}`}>
        <div className="table-content-wrapper">
          <table className="tickets-table">
            <thead><tr>{columns.filter(col => !col.hide).map(col => (<th key={col.id} style={{ width: col.size ? `${col.size}px` : 'auto', textAlign: col.align || 'left' }}>{escapeHtml(col.caption)}</th>))}{actions.length > 0 && (<th style={{ textAlign: 'center' }}>Actions</th>)}</tr></thead>
            <tbody>
              {data.map((row, index) => {
                const rowId = row.id ?? index;
                return (
                  <tr key={rowId} data-id={rowId}>
                    {columns.filter(col => !col.hide).map(col => (<td key={col.id} style={{ textAlign: col.align || 'left' }}>{col.render ? col.render(row) : escapeHtml(row[col.id])}</td>))}
                    {actions.length > 0 && (
                      <td style={{ textAlign: 'center' }}>
                        <div className="ticket-actions">
                          {actions.map(action => {
                            if (action.type === 'link' && action.to && action.getParams) {
                              return (
                                <Link key={action.id} to={action.to} params={action.getParams(row)} className="action-btn" title={action.title}>
                                  <span dangerouslySetInnerHTML={{ __html: action.icon }} />
                                </Link>
                              );
                            }
                            return (
                              <button key={action.id} className="action-btn" title={action.title} onClick={() => action.handler!(rowId)}>
                                <span dangerouslySetInnerHTML={{ __html: action.icon }} />
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (<div className="table-footer">{paginationButtons}</div>)}
      </div>
      <Modal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} className="filter-modal" title={<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{SVGIcons.filter} Filter Table</div>} footer={<><button className="secondary-btn" onClick={() => setTempFilters([{}])}>Reset</button><button className="submit-btn" onClick={applyFilters}>Apply</button></>}>
        <div className="filter-row filter-header"><label>Column:</label><label>Relation:</label><label>Value:</label></div>
        {tempFilters.map((filter, index) => (<FilterRow key={index} filter={filter} columns={columns} onChange={(newFilter) => { const updated = [...tempFilters]; updated[index] = newFilter; setTempFilters(updated); }} onRemove={() => { setTempFilters(tempFilters.filter((_, i) => i !== index)); }} />))}
        <button className="add-filter-btn" onClick={() => setTempFilters([...tempFilters, {}])}>{SVGIcons.add} Add Filter</button>
      </Modal>
      <Modal isOpen={isSortModalOpen} onClose={() => setIsSortModalOpen(false)} className="sort-modal" title={<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{SVGIcons.sort} Sort Table</div>} footer={<><button className="secondary-btn" onClick={() => setTempSorters([{}])}>Reset</button><button className="submit-btn" onClick={applySorters}>Apply</button></>}>
        <div className="sort-row sort-header"><label>Column:</label><label>Order:</label></div>
        {tempSorters.map((sorter, index) => (<SortRow key={index} sorter={sorter} columns={columns} onChange={(newSorter) => { const updated = [...tempSorters]; updated[index] = newSorter; setTempSorters(updated); }} onRemove={() => { setTempSorters(tempSorters.filter((_, i) => i !== index)); }} />))}
        <button className="add-sort-btn" onClick={() => setTempSorters([...tempSorters, {}])}>{SVGIcons.add} Add Sort Level</button>
      </Modal>
    </>
  );
});

export default TableManager;