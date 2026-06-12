import { notFound } from "next/navigation";
import { getAllClubs, getAllUsers } from "@/lib/firebase/firestore";
import Link from "next/link";

export default async function SuperAdminClubes({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const secret = process.env.SUPERADMIN_SECRET;
  if (!secret || slug !== secret) notFound();

  const [clubs, users] = await Promise.all([getAllClubs(), getAllUsers()]);

  const clubOwners = new Map<string, { email: string; role: string }[]>();
  for (const club of clubs) {
    const owners: { email: string; role: string }[] = [];
    for (const user of users) {
      const hasDirect = user.roles.clubs[club.id];
      if (hasDirect) {
        owners.push({ email: user.email, role: hasDirect === "club_admin" ? "admin" : hasDirect });
      }
      if (user.roles.superadmin) {
        owners.push({ email: user.email, role: "superadmin" });
      }
    }
    const seen = new Set<string>();
    clubOwners.set(club.id, owners.filter((o) => {
      if (seen.has(o.email)) return false;
      seen.add(o.email);
      return true;
    }));
  }

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
                <th className="px-4 py-3">Propietarios</th>
                <th className="px-4 py-3">Creado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clubs.map((club) => {
                const owners = clubOwners.get(club.id) ?? [];
                return (
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
                    <td className="px-4 py-3">
                      {owners.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {owners.map((o) => (
                            <span
                              key={o.email}
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-mono ${
                                o.role === "superadmin"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-cyan-50 text-cyan-700"
                              }`}
                            >
                              {o.email}
                              <span className={`ml-1 opacity-60 ${o.role === "superadmin" ? "text-emerald-400" : "text-cyan-400"}`}>
                                ({o.role})
                              </span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">Sin propietarios</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {club.createdAt?.seconds ? new Date(club.createdAt.seconds * 1000).toLocaleDateString("es-CL") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/${slug}/clientes/${club.slug}`} className="text-xs font-mono text-cyan-600 hover:underline">
                          Editar
                        </Link>
                        <Link href={`/admin/${club.slug}`} className="text-xs font-mono text-cyan-600 hover:underline">
                          Admin
                        </Link>
                        {club.published && (
                          <Link href={`/clubes/${club.slug}`} className="text-xs font-mono text-slate-400 hover:underline">
                            Ver
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
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
