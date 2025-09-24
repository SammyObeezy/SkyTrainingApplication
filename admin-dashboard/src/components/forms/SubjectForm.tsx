import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useFetchData } from '../../hooks/useFetchData';
import { useMutateData } from '../../hooks/useMutateData';
import { useActions } from '../../context/ActionsContext';
import './SubjectForm.css';
import { useIdEncoder } from '../../hooks/useIdEncoder';

interface SubjectFormProps {
  subjectId?: string;
}

export const SubjectForm: React.FC<SubjectFormProps> = ({ subjectId }) => {
  const { closeModal } = useActions();
  const navigate = useNavigate();
  const { decode } = useIdEncoder();
  const isEditMode = !!subjectId;

  const actualSubjectId = isEditMode ? decode(subjectId) : null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const { data: subjectResponse, isLoading: isLoadingSubject } = useFetchData(
    isEditMode ? `/admin/subjects/${actualSubjectId}` : ''
  );

  const { mutate, isPending: isMutating, error } = useMutateData();

  useEffect(() => {
    if (isEditMode && subjectResponse?.data && !Array.isArray(subjectResponse.data)) {
      setName(subjectResponse.data.name);
      setDescription(subjectResponse.data.description);
    }
  }, [subjectResponse, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, description };
        
    try {
      if (isEditMode) {
        await mutate({ 
          endpoint: `/admin/subjects/${actualSubjectId}`, 
          method: 'PUT', 
          body: payload 
        });
        closeModal();
      } else {
        await mutate({ 
          endpoint: '/admin/subjects', 
          method: 'POST', 
          body: payload 
        });
        
        // For new subjects, navigate to subjects page
        navigate({ to: '/subjects', search: { page: 1, filters: {}, sorters: {} } });
      }
    } catch (err) {
      console.error("Failed to save subject:", err);
    }
  };
    
  const handleCancel = () => {
    if (isEditMode) {
      closeModal();
    } else {
      navigate({ to: '/subjects', search: { page: 1, filters: {}, sorters: {} } });
    }
  };

  if (isLoadingSubject) {
    return <div className="form-card">Loading subject details...</div>;
  }

  return (
    <div className="form-card">
      <h1 className="form-title">{isEditMode ? 'Edit Subject' : 'Create New Subject'}</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Subject Name</label>
          <input 
            id="name" 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="form-input" 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="form-textarea" 
            rows={5} 
            required 
          />
        </div>
        {error && <div className="form-error">Error: {error.message}</div>}
        <div className="form-actions">
          <button type="button" className="button-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="button-primary" disabled={isMutating}>
            {isMutating ? 'Saving...' : 'Save Subject'}
          </button>
        </div>
      </form>
    </div>
  );
};