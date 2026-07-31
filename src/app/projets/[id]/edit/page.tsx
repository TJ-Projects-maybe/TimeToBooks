import EditProjectClient from "../../../../components/EditProjectClient";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default function Page({ params }: { params: { id: string } }) {
  return <EditProjectClient params={params} />;
}
