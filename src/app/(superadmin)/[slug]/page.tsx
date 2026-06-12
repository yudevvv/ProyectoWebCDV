import { notFound } from "next/navigation";
import { getAllClubs, getAllUsers } from "@/lib/firebase/firestore";
import Link from "next/link";

export default async function SuperAdminDashboard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const secret = process.env.SUPERADMIN_SECRET;
  if (!secret || slug !== secret) notFound();

  const [clubs, users] = await Promise.all([
    getAllClubs(),
    getAllUsers(),
  ]);

  const publishedClubs = clubs.filter((c) => c.published);
  const totalPlayers = 0; // would need aggregation
  const totalMatches = 0;

  return (
    <div>
      <p className="text-[10px] font-mono text-slate-400 mb-1">$ ./superadmin --status</p>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        <span className="text-emerald-500">&gt;</span> Panel Super Admin
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-lg border bg-white p-5">
          <p className="text-xs font-mono text-slate-400 mb-1">Clubes Totales</p>
          <p className="text-2xl font-bold text-slate-900">{clubs.length}</p>
          <p className="text-xs text-emerald-600 mt-1">{publishedClubs.length} publicados</p>
        </div>
        <div className="rounded-lg border bg-white p-5">
          <p className="text-xs font-mono text-slate-400 mb-1">Usuarios</p>
          <p className="text-2xl font-bold text-slate-900">{users.length}</p>
        </div>
        <div className="rounded-lg border bg-white p-5">
          <p className="text-xs font-mono text-slate-400 mb-1">Jugadores</p>
          <p className="text-2xl font-bold text-slate-900">{totalPlayers}</p>
        </div>
        <div className="rounded-lg border bg-white p-5">
          <p className="text-xs font-mono text-slate-400 mb-1">Partidos</p>
          <p className="text-2xl font-bold text-slate-900">{totalMatches}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="rounded-lg border bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-mono text-slate-400">$ ./clubes --recent</p>
            <Link href={`/${slug}/clientes`} className="text-xs font-mono text-cyan-600 hover:underline">Ver todos &rarr;</Link>
          </div>
          <div className="space-y-3">
            {clubs.slice(0, 5).map((club) => (
              <div key={club.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${club.published ? "bg-emerald-500" : "bg-slate-300"}`} />
                  <span className="font-medium text-slate-900">{club.name}</span>
                </div>
                <span className="text-xs font-mono text-slate-400">{club.slug}</span>
              </div>
            ))}
            {clubs.length === 0 && (
              <p className="text-sm text-slate-400 font-mono">No hay clubes registrados</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-mono text-slate-400">$ ./usuarios --list</p>
            <Link href={`/${slug}/usuarios`} className="text-xs font-mono text-cyan-600 hover:underline">Ver todos &rarr;</Link>
          </div>
          <div className="space-y-3">
            {users.slice(0, 5).map((user) => (
              <div key={user.uid} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{user.email}</p>
                    <p className="text-[10px] font-mono text-slate-400">
                      {Object.keys(user.roles.clubs).length} club(es)
                    </p>
                  </div>
                </div>
                {user.roles.superadmin && (
                  <span className="text-[10px] font-mono text-emerald-600">superadmin</span>
                )}
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-sm text-slate-400 font-mono">No hay usuarios registrados</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <p className="text-xs font-mono text-slate-400 mb-4">$ ./system --info</p>
        <div className="space-y-3 text-sm font-mono text-slate-600">
          <div className="flex justify-between border-b pb-2">
            <span>Plataforma</span>
            <span className="text-emerald-600">OPERANDO 24/7</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>Version</span>
            <span>v1.0.0</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>Entorno</span>
            <span>{process.env.NODE_ENV}</span>
          </div>
          <div className="flex justify-between">
            <span>Firebase Project</span>
            <span className="text-cyan-600">{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
