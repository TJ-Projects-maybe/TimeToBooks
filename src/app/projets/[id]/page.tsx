import ProjectDetailClient from "../../../components/ProjectDetailClient";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default function Page({ params }: { params: { id: string } }) {
  return <ProjectDetailClient params={params} />;
}
