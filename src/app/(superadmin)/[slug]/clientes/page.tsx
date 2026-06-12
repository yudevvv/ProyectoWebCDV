import { notFound } from "next/navigation";
import { getAllClubs } from "@/lib/firebase/firestore";
import Link from "next/link";

export default async function SuperAdminClubes({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const secret = process.env.SUPERADMIN_SECRET;
  if (!secret || slug !== secret) notFound();

  const clubs = await getAllClubs();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-mono text-slate-400 mb-1">$ ./clubes --list</p>
          <h1 className="text-2xl font-bold text-slate-900">
            <span className="text-cyan-500">&gt;</span> Clubes ({clubs.length})
          </h1>
        </div>
        <Link
          href={`/${slug}/clientes/nuevo`}
          className="inline-flex h-9 items-center rounded bg-emerald-600 hover:bg-emerald-700 px-4 text-xs font-mono font-bold text-white border-b-2 border-emerald-800 transition-all"
        >
          + Nuevo Club
        </Link>
      </div>

      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-xs font-mono text-slate-500 uppercase">
                <th className="px-4 py-3">Club</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Creado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clubs.map((club) => (
                <tr key={club.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {club.logo && (
                        <img src={club.logo} alt="" className="h-6 w-6 rounded-full object-cover" />
                      )}
                      <span className="font-medium text-slate-900">{club.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{club.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                      club.published
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${club.published ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {club.published ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{club.ownerId ? `${club.ownerId.slice(0, 8)}...` : "—"}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {club.createdAt?.seconds ? new Date(club.createdAt.seconds * 1000).toLocaleDateString("es-CL") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/admin/${club.slug}`} className="text-xs font-mono text-cyan-600 hover:underline">
                        Admin
                      </Link>
                      <Link href={`/clubes/${club.slug}`} className="text-xs font-mono text-slate-400 hover:underline">
                        Ver
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {clubs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400 font-mono">
                    No hay clubes registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
