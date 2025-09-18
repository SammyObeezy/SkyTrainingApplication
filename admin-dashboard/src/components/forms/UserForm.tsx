import React, { useState, useEffect } from 'react';
import { useFetchData } from '../../hooks/useFetchData';
import { useMutateData } from '../../hooks/useMutateData';
import { useActions } from '../../context/ActionsContext';
import './UserForm.css';

interface UserFormProps {
  userId: string;
}

type User = {
  name: string;
  email: string;
  role: 'admin' | 'trainee';
  status: 'approved' | 'pending' | 'rejected';
}

export const UserForm: React.FC<UserFormProps> = ({ userId }) => {
  const { closeModal } = useActions();
  
  const [role, setRole] = useState<'admin' | 'trainee'>('trainee');
  const [status, setStatus] = useState<'approved' | 'pending' | 'rejected'>('pending');

  // --- THIS IS THE FIX ---
  // We provide a dummy tableState to satisfy the hook's required 'options' argument.
  const { data: userData, isLoading: isLoadingUser } = useFetchData<User>(
    `/admin/users/${userId}`,
    { tableState: { page: 1, filters: [], sorters: [] } }
  );
  
  const { mutate: updateUser, isLoading: isMutating, error } = useMutateData();

  useEffect(() => {
    if (userData && !Array.isArray(userData)) {
      setRole(userData.role);
      setStatus(userData.status);
    }
  }, [userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(`/admin/users/${userId}/role`, 'PUT', { role });
      await updateUser(`/admin/users/${userId}/status`, 'PUT', { status });
      closeModal();
      window.location.reload();
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  if (isLoadingUser) {
    return <div className="form-card">Loading user details...</div>;
  }
  
  const user = userData as User;

  return (
    <div className="form-card">
      <h1 className="form-title">Edit User: {user?.name}</h1>
      <p style={{color: 'var(--text-color-secondary)', marginTop: '-16px', marginBottom: '16px'}}>{user?.email}</p>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="role" className="form-label">Role</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value as User['role'])} className="form-input">
            <option value="trainee">Trainee</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="status" className="form-label">Status</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value as User['status'])} className="form-input">
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {error && <div className="form-error">Error: {error.message}</div>}

        <div className="form-actions">
          <button type="button" className="button-secondary" onClick={closeModal}>
            Cancel
          </button>
          <button type="submit" className="button-primary" disabled={isMutating}>
            {isMutating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
