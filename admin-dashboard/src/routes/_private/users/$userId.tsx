import { createFileRoute } from '@tanstack/react-router';
import { useFetchData } from '../../../hooks/useFetchData';

export const Route = createFileRoute('/_private/users/$userId')({
  component: UserDetailPage,
});

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  avatar_url: string | null;
}

function UserDetailPage() {
  const { userId } = Route.useParams();
  const { data: user, isLoading, error } = useFetchData<User>(`/admin/users/${userId}`);
       
  if (isLoading) return <div className="detail-card">Loading user details...</div>;
  if (error) return <div className="detail-card">Error: {error.message}</div>;
  if (!user || Array.isArray(user)) return <div className="detail-card">User not found.</div>;
     
  return (
    <div className="detail-card">
      <div className="detail-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt={user.name} 
              style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                objectFit: 'cover',
                border: '2px solid #e2e8f0'
              }} 
            />
          ) : (
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              backgroundColor: '#e2e8f0', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '24px', 
              fontWeight: 'bold',
              color: '#718096',
              border: '2px solid #e2e8f0'
            }}>
              {user.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
          )}
          <h1 className="detail-title">{user.name}</h1>
        </div>
      </div>
      <p className="detail-item"><strong>Email:</strong> {user.email}</p>
      <p className="detail-item"><strong>Role:</strong> {user.role}</p>
      <p className="detail-item"><strong>Status:</strong> {user.status}</p>
      <p className="detail-item"><strong>Member Since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
    </div>
  );
}