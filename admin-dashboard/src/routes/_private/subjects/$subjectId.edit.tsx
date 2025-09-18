import { createFileRoute } from '@tanstack/react-router';
import { SubjectForm } from '../../../components/forms/SubjectForm';

export const Route = createFileRoute('/_private/subjects/$subjectId/edit')({
  component: EditSubjectPage,
});

function EditSubjectPage() {
  // Get the subjectId from the route's parameters
  const { subjectId } = Route.useParams();

  // We pass the subjectId to the form, so it knows to be in "edit" mode.
  return <SubjectForm subjectId={subjectId} />;
}