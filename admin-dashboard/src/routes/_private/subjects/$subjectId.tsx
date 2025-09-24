import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useFetchData } from '../../../hooks/useFetchData';
import { useIdEncoder } from '../../../hooks/useIdEncoder';

// Defines the route for /subjects/:subjectId
export const Route = createFileRoute('/_private/subjects/$subjectId')({
  component: SubjectDetailPage,
});

function SubjectDetailPage() {
  // Get the subjectId from the type-safe route parameters
  const { subjectId } = Route.useParams();
  const { decode } = useIdEncoder();
  
  const actualSubjectId = decode(subjectId);

  const { data: subjectResponse, isLoading, error } = useFetchData(`/admin/subjects/${actualSubjectId}`);

  if (isLoading) {
    return <div>Loading subject details...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Extract subject from React Query response structure
  const subject = subjectResponse?.data;

  // We add this check because `subject` could be null initially
  if (!subject || Array.isArray(subject)) {
    return <div>Subject not found.</div>;
  }

  return (
    <div style={styles.card}>
      <h1 style={styles.title}>{subject.name}</h1>
      <p style={styles.description}>{subject.description}</p>
      <p style={styles.meta}>Created by: {subject.created_by_name}</p>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
    card: { backgroundColor: 'var(--surface-color)', padding: 'calc(var(--spacing-unit) * 4)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-md)' },
    title: { margin: '0 0 var(--spacing-unit) 0', fontSize: '1.8rem', color: 'var(--text-color-primary)'},
    description: { margin: '0 0 calc(var(--spacing-unit) * 2) 0', color: 'var(--text-color-secondary)', fontSize: '1rem', lineHeight: 1.6 },
    meta: { margin: 0, color: 'var(--text-color-secondary)', fontSize: '0.875rem', fontStyle: 'italic' }
};