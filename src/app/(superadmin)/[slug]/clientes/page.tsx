import { notFound } from "next/navigation";

export default async function SuperAdminClientes({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const secret = process.env.SUPERADMIN_SECRET;
  if (!secret || slug !== secret) notFound();

  return (
    <div>
      <p className="text-[10px] font-mono text-slate-400 mb-1">$ ./clientes --list</p>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        <span className="text-cyan-500">&gt;</span> Clientes
      </h1>
      <p className="text-sm text-slate-500 font-mono">
        Gestion de clubes y usuarios del SaaS. Proximamente.
      </p>
    </div>
  );
}
