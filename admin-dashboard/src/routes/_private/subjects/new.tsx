import { createFileRoute } from '@tanstack/react-router';
import { SubjectForm } from '../../../components/forms/SubjectForm';
import { ActionsProvider } from '../../../context/ActionsContext';

export const Route = createFileRoute('/_private/subjects/new')({
  component: CreateSubjectPage,
});

function CreateSubjectPage() {
  // We wrap the form in the ActionsProvider so it has access to the closeModal function
  return (
    <ActionsProvider>
      <SubjectForm />
    </ActionsProvider>
  );
}