import React, { useContext } from 'react';
import { useActions } from '../../context/ActionsContext';
import { useMutateData } from '../../hooks/useMutateData';
import { UserForm } from '../forms/UserForm';
import { SubjectForm } from '../forms/SubjectForm';
import { TaskForm } from '../forms/TaskForm';
import './ActionsModal.css';

// Import TableContext directly but use it safely
import { TableContext } from '../../context/TableContext';

// Create a RefetchProvider for the modal forms
const RefetchContext = React.createContext<(() => void) | null>(null);

// Safe hook that doesn't throw if not in TableProvider
const useSafeTableContext = () => {
  const context = useContext(TableContext);
  return context || { refetch: null };
};

export const ActionsModal = () => {
  const { modalType, entityType, entityId, closeModal } = useActions();
  const tableContext = useSafeTableContext();
  
  // Get refetch function from table context
  const refetch = tableContext?.refetch;
  const { mutate, isLoading } = useMutateData();

  const handleDelete = async () => {
    if (!entityType || !entityId) return;

    const endpoint = `/admin/${entityType}/${entityId}`;
    try {
      await mutate(endpoint, 'DELETE');
      closeModal();
      if (refetch) {
        refetch();
      } else {
        window.location.reload();
      }
    } catch (err) {
      if (err instanceof Error) {
        alert(`Failed to delete: ${err.message}`);
      } else {
        alert('An unknown error occurred.');
      }
    }
  };

  if (!modalType) {
    return null;
  }
        
  if (modalType === 'delete') {
    return (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2 className="modal-title">Confirm Deletion</h2>
          <p className="modal-body-text">
            Are you sure you want to delete this {entityType?.slice(0, -1)}? This action cannot be undone.
          </p>
          <div className="modal-footer">
            <button onClick={closeModal} className="button-secondary">Cancel</button>
            <button onClick={handleDelete} className="button-danger" disabled={isLoading}>
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderEditForm = () => {
    if (!entityId) return null;
    
    // Provide refetch context to forms
    return (
      <RefetchContext.Provider value={refetch}>
        {(() => {
          switch (entityType) {
            case 'users':
              return <UserForm userId={entityId.toString()} />;
            case 'subjects':
              return <SubjectForm subjectId={entityId.toString()} />;
            case 'tasks':
              return <TaskForm taskId={entityId.toString()} />;
            default:
              return null;
          }
        })()}
      </RefetchContext.Provider>
    );
  };

  if (modalType === 'edit') {
    return (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content form-modal" onClick={(e) => e.stopPropagation()}>
          {renderEditForm()}
        </div>
      </div>
    );
  }

  return null;
};