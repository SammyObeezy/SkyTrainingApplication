import { useState, useEffect } from 'react';
import { createFileRoute, Navigate } from '@tanstack/react-router';
import { useAuth } from '../context/ApiProvider';
import { AppLayout } from '../components/layout/AppLayout';

export const Route = createFileRoute('/_private')({
  component: PrivateRouteLayout,
});

function PrivateRouteLayout() {
  const { token } = useAuth();
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);

  useEffect(() => {
    // This effect runs once to check if the token has been loaded from localStorage
    setIsAuthCheckComplete(true);
  }, [token]);

  // While we're checking for the token, show a loading screen
  if (!isAuthCheckComplete) {
    return <div>Loading session...</div>;
  }

  // After the check is complete, if there's no token, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If a token exists, show the main application layout
  return <AppLayout />;
}