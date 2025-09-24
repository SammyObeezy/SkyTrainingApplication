import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useFetchData } from '../../../hooks/useFetchData';
import { useIdEncoder } from '../../../hooks/useIdEncoder';

export const Route = createFileRoute('/_private/tasks/$taskId')({
  component: TaskDetailPage,
});

function TaskDetailPage() {
  const { taskId } = Route.useParams();

  const { decode } = useIdEncoder();
  
  const actualTaskId = decode(taskId);

  const { data: taskResponse, isLoading, error } = useFetchData(`/admin/tasks/${actualTaskId}`);

  if (isLoading) return <div>Loading task details...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  // Extract task from React Query response structure
  const task = taskResponse?.data;
  
  if (!task || Array.isArray(task)) return <div>Task not found.</div>;
  
  return (
    <div style={styles.card}>
      <p style={styles.subject}>{task.subject_name}</p>
      <h1 style={styles.title}>{task.title}</h1>
      <div style={styles.meta}>
        <span><strong>Due:</strong> {new Date(task.due_date).toLocaleString()}</span>
        <span><strong>Max Score:</strong> {task.max_score}</span>
      </div>
      <div style={styles.section}>
        <h2>Description</h2>
        <p>{task.description}</p>
      </div>
      <div style={styles.section}>
        <h2>Requirements</h2>
        <p>{task.requirements}</p>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
    card: { backgroundColor: 'var(--surface-color)', padding: 'calc(var(--spacing-unit) * 4)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-md)' },
    subject: { color: 'var(--primary-color)', fontWeight: 600, margin: '0 0 4px 0' },
    title: { margin: '0 0 var(--spacing-unit) 0', fontSize: '1.8rem', color: 'var(--text-color-primary)'},
    meta: { display: 'flex', gap: '24px', color: 'var(--text-color-secondary)', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' },
    section: { marginBottom: '16px' },
};