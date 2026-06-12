import { getClubBySlug } from "@/lib/firebase/firestore";
import { notFound } from "next/navigation";

export default async function ClubLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const club = await getClubBySlug(slug);

  if (!club) notFound();

  if (!club.published) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center max-w-md px-4">
          <p className="text-[10px] font-mono text-slate-300 mb-2">$ ./sitio --status</p>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Sitio no disponible</h1>
          <p className="text-sm text-slate-500 font-mono">
            Este sitio aun no ha sido publicado. Vuelve mas tarde.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
