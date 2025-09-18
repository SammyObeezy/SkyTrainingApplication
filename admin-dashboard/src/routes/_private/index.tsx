import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/')({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div style={styles.card}>
      <h1 style={styles.title}>Welcome to the Admin Dashboard</h1>
      <p style={styles.text}>
        Select an option from the sidebar to view and manage your data.
      </p>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
    card: { backgroundColor: 'var(--surface-color)', padding: 'calc(var(--spacing-unit) * 4)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-md)' },
    title: { margin: '0 0 var(--spacing-unit) 0', fontSize: '1.8rem', color: 'var(--text-color-primary)'},
    text: { margin: 0, color: 'var(--text-color-secondary)', fontSize: '1rem' }
};