import ProjectDetailClient from "../../../components/ProjectDetailClient";

// Disable prerendering for this page (client-side only)
export const dynamic = 'force-dynamic';

// Static export: Generate empty paths (client-side fetching)
export const generateStaticParams = async () => {
  return [];
};

export default function Page({ params }: { params: { id: string } }) {
  return <ProjectDetailClient params={params} />;
}
