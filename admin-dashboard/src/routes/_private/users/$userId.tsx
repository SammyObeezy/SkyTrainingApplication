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
            <h1 className="detail-title">{user.name}</h1>
        </div>
      <p className="detail-item"><strong>Email:</strong> {user.email}</p>
      <p className="detail-item"><strong>Role:</strong> {user.role}</p>
      <p className="detail-item"><strong>Status:</strong> {user.status}</p>
      <p className="detail-item"><strong>Member Since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
    </div>
  );
}