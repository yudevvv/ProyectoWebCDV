"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteMember } from "@/lib/firebase/admin-fns";
import { getMembers } from "@/lib/firebase/firestore";
import type { Member } from "@/types";
import { toast } from "sonner";
import { useDemoMode } from "@/lib/demo-mode";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-500",
  rejected: "bg-red-100 text-red-700",
};

type AdminSociosPageProps = {
  params: Promise<{ clubId: string }>;
};

export default function AdminSociosPage({ params }: AdminSociosPageProps) {
  const [clubId, setClubId] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const { isDemo, guard } = useDemoMode(clubId ?? "");

  useEffect(() => {
    params.then((p) => {
      setClubId(p.clubId);
      loadMembers(p.clubId);
    });
  }, [params]);

  const loadMembers = async (id: string) => {
    const data = await getMembers(id);
    setMembers(data);
  };

  const handleDelete = async (member: Member) => {
    if (!confirm("¿Eliminar socio?")) return;
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    await deleteMember(member.id);
    toast.success("Socio eliminado");
    await loadMembers(clubId!);
  };

  const handleStatusChange = async (member: Member) => {
    const { updateMember } = await import("@/lib/firebase/admin-fns");
    const newStatus = member.status === "approved" ? "inactive" : "approved";
    await updateMember(member.id, { status: newStatus as Member["status"] });
    toast.success(`Estado cambiado a ${newStatus}`);
    await loadMembers(clubId!);
  };

  const columns = [
    { key: "name", header: "Nombre", render: (m: Member) => m.name },
    { key: "email", header: "Email", render: (m: Member) => m.email },
    { key: "phone", header: "Teléfono", render: (m: Member) => m.phone || "—" },
    { key: "type", header: "Tipo", render: (m: Member) => <span className="capitalize">{m.membershipType}</span> },
    {
      key: "status",
      header: "Estado",
      render: (m: Member) => (
        <button onClick={() => handleStatusChange(m)}>
          <Badge className={statusColors[m.status]}>{m.status}</Badge>
        </button>
      ),
    },
  ];

  if (!clubId) return <div className="flex flex-col min-h-screen"><AdminNav clubId="" /><div className="container mx-auto px-4 py-12"><p className="text-muted-foreground">Cargando...</p></div></div>;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNav clubId={clubId} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Socios</h1>
          <p className="text-muted-foreground text-sm">{members.length} registrados</p>
        </div>
        <DataTable columns={columns} data={members} keyExtractor={(m) => m.id} onDelete={isDemo ? undefined : handleDelete} />
        {members.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No hay socios registrados</div>
        )}
      </div>
    </div>
  );
}
