import ClientShell from "@/components/ClientShell";
import NewsHome from "@/components/news/NewsHome";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return (
    <ClientShell>
      <NewsHome />
    </ClientShell>
  );
}