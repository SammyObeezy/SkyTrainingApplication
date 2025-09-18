import React from 'react';
import { CancelIcon, FilterIcon, SortIcon } from '../Icons/Icons';
import './TableControls.css';

interface TableControlsProps {
  tableManagerRef: React.RefObject<any>;
  status: {
    filterCount: number;
    sorterCount: number;
  };
}

const TableControls: React.FC<TableControlsProps> = ({ tableManagerRef, status }) => {
  const { filterCount, sorterCount } = status;

  return (
    <div className="table-controls">
      <div className="filter-sort-controls">
        <button className="table-control-btn" onClick={() => tableManagerRef.current?.openSortModal()}>
          <SortIcon /> Sort
        </button>
        {sorterCount > 0 && (
          <div className="control-badge">
            <span>{sorterCount} Sort</span>
            <button className="clear-badge" onClick={() => tableManagerRef.current?.resetSorters()} title="Clear Sort">
              <CancelIcon width={12} height={12} color="white" />
            </button>
          </div>
        )}
        <button className="table-control-btn" onClick={() => tableManagerRef.current?.openFilterModal()}>
          <FilterIcon /> Filter
        </button>
        {filterCount > 0 && (
          <div className="control-badge">
            <span>{filterCount} Filter</span>
            <button className="clear-badge" onClick={() => tableManagerRef.current?.resetFilters()} title="Clear Filter">
              <CancelIcon width={12} height={12} color="white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableControls;