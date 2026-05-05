import { WorkspaceWidgetPageContent } from "./__components/WorkspaceWidgetPageContent";

type WorkspaceWidgetPageProps = {
  params: Promise<{ publicId: string }>;
};

export default async function WorkspaceWidgetPage({ params }: WorkspaceWidgetPageProps) {
  const { publicId } = await params;
  return <WorkspaceWidgetPageContent workspacePublicId={publicId} />;
}
