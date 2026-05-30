import { WorkspaceTeamPageContent } from "./__components/WorkspaceTeamPageContent";

type TeamPageProps = {
  params: Promise<{ publicId: string }>;
};

export default async function WorkspaceTeamPage({ params }: TeamPageProps) {
  const { publicId } = await params;
  return <WorkspaceTeamPageContent workspacePublicId={publicId} />;
}
