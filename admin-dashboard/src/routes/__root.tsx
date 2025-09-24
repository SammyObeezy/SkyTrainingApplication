import { createRootRoute, Outlet, Link } from '@tanstack/react-router';
// Corrected import path for the devtools
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ApiProvider } from '../context/ApiProvider';
import { ActionsProvider } from '../context/ActionsContext';
import { ActionsModal } from '../components/modals/ActionsModal';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    },
  },
});

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <ApiProvider>
        <ActionsProvider>
          <Outlet />
          <ActionsModal />
        </ActionsProvider>
        {/* This will now work correctly */}
        <TanStackRouterDevtools />
        <ReactQueryDevtools initialIsOpen={false} />
      </ApiProvider>
    </QueryClientProvider>
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