import { createRootRoute, Outlet, Link } from '@tanstack/react-router';
// Corrected import path for the devtools
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ApiProvider } from '../context/ApiProvider';
import { ActionsProvider } from '../context/ActionsContext';
import { ActionsModal } from '../components/modals/ActionsModal';

function RootComponent() {
  return (
    <ApiProvider>
      <ActionsProvider>
        <Outlet />
        <ActionsModal />
      </ActionsProvider>
      {/* This will now work correctly */}
      <TanStackRouterDevtools />
    </ApiProvider>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <Link to="/" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>
          Go to the Dashboard
        </Link>
      </div>
    );
  },
});

