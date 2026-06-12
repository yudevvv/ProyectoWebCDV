"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const params = useParams();
  const slug = params?.slug as string;

  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-slate-900 text-white p-4 flex flex-col">
        <div className="mb-8">
          <h2 className="text-sm font-mono text-emerald-400">SUPER_ADMIN v1.0</h2>
          <p className="text-[10px] font-mono text-slate-500">TOALESCO SaaS</p>
        </div>
        <nav className="space-y-1 flex-1">
          <Link href={`/${slug}`} className="block px-3 py-2 rounded text-sm font-mono text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
            $ Dashboard
          </Link>
          <Link href={`/${slug}/clientes`} className="block px-3 py-2 rounded text-sm font-mono text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
            $ Clientes
          </Link>
          <Link href={`/${slug}/configuracion`} className="block px-3 py-2 rounded text-sm font-mono text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
            $ Config
          </Link>
        </nav>
        <Link href="/admin" className="block px-3 py-2 rounded text-xs font-mono text-slate-500 hover:bg-slate-800 transition-colors">
          &lt; Volver al Admin
        </Link>
      </aside>
      <main className="flex-1 bg-slate-50 p-8">
        {children}
      </main>
    </div>
  );
}
