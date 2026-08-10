import ProjectDetailClient from "../../../components/ProjectDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return <ProjectDetailClient params={resolvedParams} />;
}
