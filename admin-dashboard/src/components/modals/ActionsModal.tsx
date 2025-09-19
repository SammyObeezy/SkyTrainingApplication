import { useActions } from '../../context/ActionsContext';
import { useMutateData } from '../../hooks/useMutateData';
import { UserForm } from '../forms/UserForm';
import { SubjectForm } from '../forms/SubjectForm';
import { TaskForm } from '../forms/TaskForm';
import './ActionsModal.css';

// The 'export' keyword here makes the component available for other files to import.
export const ActionsModal = () => {
  const { modalType, entityType, entityId, closeModal } = useActions();
  const { mutate, isLoading } = useMutateData();

  const handleDelete = async () => {
    if (!entityType || !entityId) return;

    const endpoint = `/admin/${entityType}/${entityId}`;
    try {
      await mutate(endpoint, 'DELETE');
      closeModal();
      window.location.reload(); 
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

