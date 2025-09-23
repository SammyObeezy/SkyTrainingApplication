import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useFetchData } from '../../hooks/useFetchData';
import { useMutateData } from '../../hooks/useMutateData';
import { useActions } from '../../context/ActionsContext';
import { useRefetch } from '../../hooks/useRefetch';
import './SubjectForm.css';

interface SubjectFormProps {
  subjectId?: string;
}

type Subject = {
  name: string;
  description: string;
}

export const SubjectForm: React.FC<SubjectFormProps> = ({ subjectId }) => {
  const { closeModal } = useActions();
  const { refetch } = useRefetch();
  const navigate = useNavigate();
  const isEditMode = !!subjectId;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { data: subjectData, isLoading: isLoadingSubject } = useFetchData<Subject>(
    isEditMode ? `/admin/subjects/${subjectId}` : ''
  );

  const { mutate, isLoading: isMutating, error } = useMutateData();

  useEffect(() => {
    if (isEditMode && subjectData && !Array.isArray(subjectData)) {
      setName(subjectData.name);
      setDescription(subjectData.description);
    }
  }, [subjectData, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, description };
        
    try {
      if (isEditMode) {
        await mutate(`/admin/subjects/${subjectId}`, 'PUT', payload);
        closeModal();
        
        // Use seamless refetch for edits
        refetch({ resetToFirstPage: false });
      } else {
        await mutate('/admin/subjects', 'POST', payload);
        
        // For new subjects, navigate to subjects page and trigger refetch
        navigate({ to: '/subjects', search: { page: 1, filters: {}, sorters: {} } });
        
        // Small delay to ensure navigation completes before refetch
        setTimeout(() => {
          refetch({ resetToFirstPage: true });
        }, 100);
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