import { notFound } from "next/navigation";
import { getAllUsers, getAllClubs } from "@/lib/firebase/firestore";

export default async function SuperAdminUsuarios({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const secret = process.env.SUPERADMIN_SECRET;
  if (!secret || slug !== secret) notFound();

  const [users, clubs] = await Promise.all([
    getAllUsers(),
    getAllClubs(),
  ]);

  const clubMap = new Map(clubs.map((c) => [c.id, c]));

  return (
    <div>
      <div className="mb-6">
        <p className="text-[10px] font-mono text-slate-400 mb-1">$ ./usuarios --list</p>
        <h1 className="text-2xl font-bold text-slate-900">
          <span className="text-cyan-500">&gt;</span> Usuarios ({users.length})
        </h1>
      </div>

      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-xs font-mono text-slate-500 uppercase">
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">UID</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Clubes Asignados</th>
                <th className="px-4 py-3">Registro</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const clubIds = Object.keys(user.roles.clubs);
                const userClubs = clubIds.map((id) => clubMap.get(id)).filter(Boolean);

                return (
                  <tr key={user.uid} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-900">{user.email}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-slate-400">
                      {user.uid.slice(0, 12)}...
                    </td>
                    <td className="px-4 py-3">
                      {user.roles.superadmin ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-700">
                          superadmin
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">cliente</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {userClubs.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {userClubs.map((club) => (
                            <span
                              key={club!.id}
                              className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-600"
                            >
                              {club!.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {user.createdAt?.seconds
                        ? new Date(user.createdAt.seconds * 1000).toLocaleDateString("es-CL")
                        : "—"}
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400 font-mono">
                    No hay usuarios registrados
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
