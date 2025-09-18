import React, { useState, useEffect } from 'react';
import { useFetchData } from '../../hooks/useFetchData';
import { useMutateData } from '../../hooks/useMutateData';
import { useActions } from '../../context/ActionsContext';
import './TaskForm.css';

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
  const isEditMode = taskId !== 'new';

  const [formState, setFormState] = useState<Partial<Task>>({});

  const { data: taskData, isLoading: isLoadingTask } = useFetchData<Task>(
    isEditMode ? `/admin/tasks/${taskId}` : ''
  );
  
  const { data: subjects, isLoading: isLoadingSubjects } = useFetchData<Subject[]>('/admin/subjects');

  const { mutate, isLoading: isMutating, error } = useMutateData();

  useEffect(() => {
    if (isEditMode && taskData && !Array.isArray(taskData)) {
      const formattedDate = new Date(taskData.due_date).toISOString().slice(0, 16);
      setFormState({ ...taskData, due_date: formattedDate });
    }
  }, [taskData, isEditMode]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await mutate(`/admin/tasks/${taskId}`, 'PUT', formState);
      } else {
        await mutate('/admin/tasks', 'POST', formState);
      }
      closeModal();
      window.location.reload();
    } catch (err) {
      console.error("Failed to save task:", err);
    }
  };
  
  if (isLoadingTask || isLoadingSubjects) {
    return <div className="form-card">Loading...</div>;
  }
  
  // --- THIS IS THE FIX ---
  // We now flatten the array to ensure it's a simple list of subjects.
  const subjectList: Subject[] = (subjects && Array.isArray(subjects)) ? subjects.flat() : [];

  return (
    <div className="form-card">
      <h1 className="form-title">{isEditMode ? 'Edit Task' : 'Create New Task'}</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="subject_id" className="form-label">Subject</label>
          <select name="subject_id" value={formState.subject_id || ''} onChange={handleChange} className="form-input" required>
            <option value="">Select a Subject</option>
            {subjectList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title</label>
          <input name="title" type="text" value={formState.title || ''} onChange={handleChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea name="description" value={formState.description || ''} onChange={handleChange} className="form-textarea" rows={3} required />
        </div>
         <div className="form-group">
          <label htmlFor="requirements" className="form-label">Requirements</label>
          <textarea name="requirements" value={formState.requirements || ''} onChange={handleChange} className="form-textarea" rows={3} required />
        </div>
        <div className="form-group">
          <label htmlFor="due_date" className="form-label">Due Date</label>
          <input name="due_date" type="datetime-local" value={formState.due_date || ''} onChange={handleChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label htmlFor="max_score" className="form-label">Max Score</label>
          <input name="max_score" type="number" value={formState.max_score || ''} onChange={handleChange} className="form-input" required />
        </div>
        {error && <div className="form-error">Error: {error.message}</div>}
        <div className="form-actions">
          <button type="button" className="button-secondary" onClick={closeModal}>Cancel</button>
          <button type="submit" className="button-primary" disabled={isMutating}>
            {isMutating ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Task')}
          </button>
        </div>
      </form>
    </div>
  );
};