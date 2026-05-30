import { WorkspaceDashboardContent } from "./__components/WorkspaceDashboardContent";

type WorkspaceDashboardPageProps = {
  params: Promise<{ publicId: string }>;
};

export default async function WorkspaceDashboardPage({ params }: WorkspaceDashboardPageProps) {
  const { publicId } = await params;
  return <WorkspaceDashboardContent workspacePublicId={publicId} />;
}
