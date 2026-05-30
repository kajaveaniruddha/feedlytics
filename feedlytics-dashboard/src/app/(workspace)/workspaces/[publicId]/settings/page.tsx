import { WorkspaceSettingsContent } from "./__components/WorkspaceSettingsContent";

type WorkspaceSettingsPageProps = {
  params: Promise<{ publicId: string }>;
};

export default async function WorkspaceSettingsPage({ params }: WorkspaceSettingsPageProps) {
  const { publicId } = await params;
  return <WorkspaceSettingsContent workspacePublicId={publicId} />;
}
