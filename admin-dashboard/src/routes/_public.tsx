import { createFileRoute, Outlet, Navigate } from '@tanstack/react-router';
import { useAuth } from '../context/ApiProvider';


export const Route = createFileRoute('/_public')({
  component: PublicLayout,
});

function PublicLayout() {
  const { isAuthenticated } = useAuth();

  // If the user is already authenticated, redirect them away from public pages
  // like /login and send them straight to the main dashboard.
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="public-layout-container">
      <Outlet />
    </div>
  );
}