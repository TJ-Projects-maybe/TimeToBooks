import EditProjectClient from "../../../../components/EditProjectClient";

// Disable static generation for this page (client-side only)
export const dynamic = 'force-dynamic';

export default function Page({ params }: { params: { id: string } }) {
  return <EditProjectClient params={params} />;
}
