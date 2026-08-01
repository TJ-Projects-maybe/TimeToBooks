import EditProjectClient from "../../../../components/EditProjectClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page({ params }: { params: { id: string } }) {
  return <EditProjectClient params={params} />;
}
