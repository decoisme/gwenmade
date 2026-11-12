import { EditorialSite } from "./components";
import { RevealMotion } from "./reveal";
import { getPublicSiteContent, getPublishedClientLogos, getPublishedProjects } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [content, projects, clientLogos] = await Promise.all([getPublicSiteContent(), getPublishedProjects(), getPublishedClientLogos()]);

  return (
    <>
      <RevealMotion />
      <EditorialSite content={content} projects={projects} clientLogos={clientLogos} />
    </>
  );
}
