import { WorkspaceBillingPageContent } from "./__components/WorkspaceBillingPageContent";

type BillingPageProps = {
  params: Promise<{ publicId: string }>;
};

export default async function WorkspaceBillingPage({ params }: BillingPageProps) {
  const { publicId } = await params;
  return <WorkspaceBillingPageContent workspacePublicId={publicId} />;
}
