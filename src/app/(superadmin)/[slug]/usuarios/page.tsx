import { notFound } from "next/navigation";
import { getAllUsers, getAllClubs } from "@/lib/firebase/firestore";
import UserTable from "@/components/superadmin/UserTable";

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

  return (
    <div>
      <div className="mb-6">
        <p className="text-[10px] font-mono text-slate-400 mb-1">$ ./usuarios --list</p>
        <h1 className="text-2xl font-bold text-slate-900">
          <span className="text-cyan-500">&gt;</span> Usuarios ({users.length})
        </h1>
      </div>

      <UserTable users={users} clubs={clubs} />
    </div>
  );
}
