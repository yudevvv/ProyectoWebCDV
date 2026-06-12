import { notFound } from "next/navigation";

export default async function SuperAdminDashboard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const secret = process.env.SUPERADMIN_SECRET;

  if (!secret || slug !== secret) notFound();

  return (
    <div>
      <p className="text-[10px] font-mono text-slate-400 mb-1">$ ./superadmin --status</p>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        <span className="text-emerald-500">&gt;</span> Panel Super Admin
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { label: "Clubes Activos", value: "—" },
          { label: "Usuarios Registrados", value: "—" },
          { label: "Partidos Totales", value: "—" },
          { label: "Ingresos Estimados", value: "—" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-white p-5">
            <p className="text-xs font-mono text-slate-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
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
