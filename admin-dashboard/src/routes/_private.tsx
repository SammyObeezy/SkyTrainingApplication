import { createFileRoute, Navigate } from '@tanstack/react-router';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../context/ApiProvider';

export const Route = createFileRoute('/_private')({
  component: PrivateRouteLayout,
});

function PrivateRouteLayout() {
  const { isAuthenticated } = useAuth();

  // This is the guard clause that protects all child routes.
  // If the user is not authenticated, they are redirected.
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If the user is authenticated, render the main AppLayout.
  // The AppLayout will then render the specific page (e.g., Users, Subjects)
  // via its <Outlet />.
  return <AppLayout />;
}