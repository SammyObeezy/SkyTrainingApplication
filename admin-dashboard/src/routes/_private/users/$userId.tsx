import { createFileRoute } from '@tanstack/react-router';
import { useFetchData } from '../../../hooks/useFetchData';
import './UserDetail.css';
import { useIdEncoder } from '../../../hooks/useIdEncoder';

export const Route = createFileRoute('/_private/users/$userId')({
  component: UserDetailPage,
});

function UserDetailPage() {
  const { userId } = Route.useParams();
  const { decode } = useIdEncoder();
  
  // Decode the URL parameter
  const actualUserId = decode(userId);
  
  const { data: userResponse, isLoading, error } = useFetchData(`/admin/users/${actualUserId}`);
        
  if (isLoading) return (
    <div className="page-container">
      <div className="user-card">
        <div className="loading-state">Loading user details...</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="page-container">
      <div className="user-card">
        <div className="error-state">Error: {error.message}</div>
      </div>
    </div>
  );
  
  // Extract user from React Query response structure
  const user = userResponse?.data;
  
  if (!user || Array.isArray(user)) return (
    <div className="page-container">
      <div className="user-card">
        <div className="error-state">User not found.</div>
      </div>
    </div>
  );

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  const getRoleClass = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'role-admin';
      case 'trainee': return 'role-trainee';
      case 'moderator': return 'role-moderator';
      default: return '';
    }
  };
        
  return (
    <div className="page-container">
      <div className="user-card">
        <div className="user-header">
          <div className="avatar-container">
            {user.avatar_url ? (
              <img 
                src={user.avatar_url} 
                alt={user.name} 
                className="user-avatar"
              />
            ) : (
              <div className="user-avatar-placeholder">
                {user.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
          </div>
          <div className="user-info">
            <h1 className="user-name">{user.name}</h1>
            <p className="user-email">{user.email}</p>
            <div className="user-badges">
              <span className={`badge role-badge ${getRoleClass(user.role)}`}>
                {user.role}
              </span>
              <span className={`badge status-badge ${getStatusClass(user.status)}`}>
                {user.status}
              </span>
            </div>
          </div>
        </div>

        <div className="user-details">
          <div className="detail-row">
            <span className="detail-label">User ID</span>
            <span className="detail-value">#{user.id}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Member Since</span>
            <span className="detail-value">
              {new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Account Status</span>
            <span className={`detail-value badge status-badge ${getStatusClass(user.status)}`}>
              {user.status}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Role</span>
            <span className={`detail-value badge role-badge ${getRoleClass(user.role)}`}>
              {user.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}