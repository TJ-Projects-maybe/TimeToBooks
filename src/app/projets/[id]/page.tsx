import ProjectDetailClient from "../../../components/ProjectDetailClient";

export const runtime = 'edge';

export default function Page({ params }: { params: { id: string } }) {
  return <ProjectDetailClient params={params} />;
}
