import { WorkspaceApiSettingsPageContent } from "./__components/WorkspaceApiSettingsPageContent";

type WorkspaceApiSettingsPageProps = {
  params: Promise<{ publicId: string }>;
};

export default async function WorkspaceApiSettingsPage({ params }: WorkspaceApiSettingsPageProps) {
  const { publicId } = await params;
  return <WorkspaceApiSettingsPageContent workspacePublicId={publicId} />;
}
