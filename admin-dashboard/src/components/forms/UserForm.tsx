import React, { useState, useEffect } from 'react';
import { useFetchData } from '../../hooks/useFetchData';
import { useMutateData } from '../../hooks/useMutateData';
import { useActions } from '../../context/ActionsContext';
import './UserForm.css';

interface UserFormProps {
  userId: string;
  mode?: 'admin' | 'profile';
  onSuccess?: () => void;
}

type User = {
  name: string;
  email: string;
  role: 'admin' | 'trainee';
  status: 'approved' | 'pending' | 'rejected';
  avatar_url: string | null;
}

export const UserForm: React.FC<UserFormProps> = ({ userId, mode = 'admin', onSuccess }) => {
  const { closeModal } = useActions();
     
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'trainee'>('trainee');
  const [status, setStatus] = useState<'approved' | 'pending' | 'rejected'>('pending');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { data: userData, isLoading: isLoadingUser } = useFetchData<User>(
    `/admin/users/${userId}`,
    { tableState: { page: 1, filters: [], sorters: [] } }
  );
     
  const { mutate: updateUser, isLoading: isMutating, error } = useMutateData();

  useEffect(() => {
    if (userData && !Array.isArray(userData)) {
      setName(userData.name);
      setEmail(userData.email);
      setRole(userData.role);
      setStatus(userData.status);
    }
  }, [userData]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(`/admin/users/${userId}/role`, 'PUT', { role });
      await updateUser(`/admin/users/${userId}/status`, 'PUT', { status });
      
      if (avatarFile) {
        console.log('Avatar file selected but not uploaded yet - API endpoint needed:', avatarFile.name);
      }
      
      console.log('Role and status updated successfully');
      
      closeModal();
      if (onSuccess) {
        onSuccess();
      }
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
      <div className="form-header">
        {user?.avatar_url ? (
          <img 
            src={user.avatar_url} 
            alt={user.name} 
            className="form-header-avatar"
          />
        ) : (
          <div className="form-header-avatar-placeholder">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
        )}
        <div className="form-header-info">
          <h1>
            {mode === 'profile' ? 'Edit Profile' : `Edit User: ${user?.name}`}
          </h1>
          <p>{user?.email}</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="form-container">
        <div className="avatar-upload-section">
          <div className="avatar-preview">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar preview" />
            ) : user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
          </div>
          <div className="avatar-upload-controls">
            <div className="file-input-wrapper">
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <label htmlFor="avatar-upload" className="file-input-label">
                Choose Photo
              </label>
            </div>
            {(avatarPreview || user?.avatar_url) && (
              <button type="button" onClick={removeAvatar} className="remove-avatar-btn">
                Remove Photo
              </button>
            )}
            <p className="upload-hint">JPG, PNG or GIF. Max size 2MB.</p>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="name" className="form-label">Full Name</label>
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
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role" className="form-label">Role</label>
          <select 
            id="role" 
            value={role} 
            onChange={(e) => setRole(e.target.value as User['role'])} 
            className="form-input"
          >
            <option value="trainee">Trainee</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="status" className="form-label">Status</label>
          <select 
            id="status" 
            value={status} 
            onChange={(e) => setStatus(e.target.value as User['status'])} 
            className="form-input"
          >
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
            {isMutating ? 'Saving...' : mode === 'profile' ? 'Update Profile' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};