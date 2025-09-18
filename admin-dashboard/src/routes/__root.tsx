import React from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { ApiProvider } from '../context/ApiProvider';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <ApiProvider>
      <Outlet />
    </ApiProvider>
  );
}
