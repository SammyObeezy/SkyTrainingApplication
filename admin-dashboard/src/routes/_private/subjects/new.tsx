import { createFileRoute } from '@tanstack/react-router';
import { SubjectForm } from '../../../components/forms/SubjectForm';

export const Route = createFileRoute('/_private/subjects/new')({
  component: CreateSubjectPage,
});

function CreateSubjectPage() {
  // We render the SubjectForm without a subjectId, so it knows to be in "create" mode.
  return <SubjectForm />;
}