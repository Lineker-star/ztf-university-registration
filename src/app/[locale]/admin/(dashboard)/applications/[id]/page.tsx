import { ApplicationDetail } from '@/components/admin/ApplicationDetail';

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  return <ApplicationDetail applicationId={params.id} />;
}
