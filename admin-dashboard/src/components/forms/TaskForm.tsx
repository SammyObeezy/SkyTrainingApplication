import React, { useState, useEffect, useMemo } from 'react';
import { useFetchData } from '../../hooks/useFetchData';
import { useMutateData } from '../../hooks/useMutateData';
import { useActions } from '../../context/ActionsContext';
import { useRefetch } from '../../hooks/useRefetch';
import './TaskForm.css';
import { useIdEncoder } from '../../hooks/useIdEncoder';

interface TaskFormProps {
  taskId: string;
}

type Task = {
  title: string;
  description: string;
  requirements: string;
  due_date: string;
  max_score: number;
  subject_id: number;
}

type Subject = {
    id: number;
    name: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({ taskId }) => {
  const { closeModal } = useActions();
  const { refetch } = useRefetch();
  const { decode } = useIdEncoder();
  const isEditMode = taskId !== 'new';

  const actualTaskId = isEditMode ? decode(taskId) : null;

  const [formState, setFormState] = useState<Partial<Task>>({});

  const { data: taskResponse, isLoading: isLoadingTask } = useFetchData<any>(
    `/admin/tasks/${actualTaskId}`
  );
  
  const { data: subjectsResponse, isLoading: isLoadingSubjects } = useFetchData<any>('/admin/subjects');

  const { mutate, isLoading: isMutating, error } = useMutateData();

  // Handle subjects response - move this BEFORE the loading check
  const subjectList: Subject[] = useMemo(() => {
    if (!subjectsResponse) return [];
    
    if (Array.isArray(subjectsResponse)) {
      return subjectsResponse.flat();
    }
    
    if (subjectsResponse.records && Array.isArray(subjectsResponse.records)) {
      return subjectsResponse.records.flat();
    }
    
    return [];
  }, [subjectsResponse]);

  useEffect(() => {
    if (isEditMode && taskResponse && !Array.isArray(taskResponse)) {
      // Handle both direct task object and API response with records
      const taskData = taskResponse.records ? taskResponse.records[0] : taskResponse;
      
      if (taskData && taskData.id == taskId) { // Only use data if it matches the requested task
        const formattedDate = new Date(taskData.due_date).toISOString().slice(0, 16);
        setFormState({
          ...taskData,
          due_date: formattedDate,
        });
      }
    }
  }, [taskResponse, isEditMode, taskId]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormState({ ...formState, [name]: value ? Number(value) : '' });
    } else {
      setFormState({ ...formState, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Define which fields are allowed to be sent to API
    const allowedFields = ['title', 'description', 'requirements', 'due_date', 'max_score', 'subject_id'];
    
    // Filter formState to only include allowed fields
    const submitData: any = {};
    allowedFields.forEach(field => {
      if (formState[field as keyof Task] !== undefined && formState[field as keyof Task] !== '') {
        submitData[field] = formState[field as keyof Task];
      }
    });
    
    // Ensure proper data types
    if (submitData.subject_id) {
      submitData.subject_id = Number(submitData.subject_id);
    }
    if (submitData.max_score) {
      submitData.max_score = Number(submitData.max_score);
    }
    if (submitData.due_date) {
      submitData.due_date = new Date(submitData.due_date).toISOString();
    }
    
    console.log('Filtered data for API:', submitData);
    
    try {
      if (isEditMode) {
        await mutate(`/admin/tasks/${actualTaskId}`, 'PUT', submitData);
      } else {
        await mutate('/admin/tasks', 'POST', submitData);
      }
      
      closeModal();
      
      // Use seamless refetch instead of page reload
      refetch({ resetToFirstPage: !isEditMode });
    } catch (err) {
      console.error("Failed to save task:", err);
      console.error("Form data that failed:", submitData);
    }
  };
  
  if (isLoadingTask || isLoadingSubjects) {
    return <div className="form-card">Loading...</div>;
  }

  return (
    <div className="form-card">
      <h1 className="form-title">{isEditMode ? 'Edit Task' : 'Create New Task'}</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="subject_id" className="form-label">Subject</label>
          <select 
            name="subject_id" 
            value={formState.subject_id || ''} 
            onChange={handleChange} 
            className="form-input" 
            required
          >
            <option value="">Select a Subject</option>
            {subjectList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title</label>
          <input 
            name="title" 
            type="text" 
            value={formState.title || ''} 
            onChange={handleChange} 
            className="form-input" 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea 
            name="description" 
            value={formState.description || ''} 
            onChange={handleChange} 
            className="form-textarea" 
            rows={3} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="requirements" className="form-label">Requirements</label>
          <textarea 
            name="requirements" 
            value={formState.requirements || ''} 
            onChange={handleChange} 
            className="form-textarea" 
            rows={3} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="due_date" className="form-label">Due Date</label>
          <input 
            name="due_date" 
            type="datetime-local" 
            value={formState.due_date || ''} 
            onChange={handleChange} 
            className="form-input" 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="max_score" className="form-label">Max Score</label>
          <input 
            name="max_score" 
            type="number" 
            min="1"
            value={formState.max_score || ''} 
            onChange={handleChange} 
            className="form-input" 
            required 
          />
        </div>
        
        {error && <div className="form-error">Error: {error.message}</div>}
        
        <div className="form-actions">
          <button type="button" className="button-secondary" onClick={closeModal}>
            Cancel
          </button>
          <button type="submit" className="button-primary" disabled={isMutating}>
            {isMutating ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Task')}
          </button>
        </div>
      </form>
    </div>
  );
};