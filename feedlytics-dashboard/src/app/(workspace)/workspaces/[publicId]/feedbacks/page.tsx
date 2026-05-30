import { WorkspaceFeedbacksPageContent } from "./__components/WorkspaceFeedbacksPageContent";

type WorkspaceFeedbacksPageProps = {
  params: Promise<{ publicId: string }>;
};

export default async function WorkspaceFeedbacksPage({ params }: WorkspaceFeedbacksPageProps) {
  const { publicId } = await params;
  return <WorkspaceFeedbacksPageContent workspacePublicId={publicId} />;
}
