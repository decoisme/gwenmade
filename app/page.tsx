import { EditorialSite } from "./components";
import { RevealMotion } from "./reveal";
import { getPublicSiteContent, getPublishedProjects } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [content, projects] = await Promise.all([getPublicSiteContent(), getPublishedProjects()]);

  return (
    <>
      <RevealMotion />
      <EditorialSite content={content} projects={projects} />
    </>
  );
}
