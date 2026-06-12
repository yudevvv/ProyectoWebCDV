"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { DataTable } from "@/components/admin/DataTable";
import { PlayerDialog, type PlayerFormData } from "@/components/admin/PlayerDialog";
import { Button } from "@/components/ui/button";
import { createPlayer, updatePlayer, deletePlayer } from "@/lib/firebase/admin-fns";
import { getActivePlayers } from "@/lib/firebase/firestore";
import type { Player } from "@/types";
import { toast } from "sonner";
import { useDemoMode } from "@/lib/demo-mode";

type AdminJugadoresPageProps = {
  params: Promise<{ clubId: string }>;
};

export default function AdminJugadoresPage({
  params,
}: AdminJugadoresPageProps) {
  const [clubId, setClubId] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const { isDemo } = useDemoMode(clubId ?? "");

  const loadPlayers = async (id: string) => {
    const data = await getActivePlayers(id);
    setPlayers(data);
  };

  useEffect(() => {
    params.then((p) => {
      setClubId(p.clubId);
      loadPlayers(p.clubId);
    });
  }, [params]);

  const handleCreate = async (data: PlayerFormData) => {
    if (!clubId) return;
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    try {
      await createPlayer(clubId, data);
      await loadPlayers(clubId);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const handleUpdate = async (data: PlayerFormData) => {
    if (!editingPlayer) return;
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    await updatePlayer(editingPlayer.id, data);
    await loadPlayers(clubId!);
    setEditingPlayer(null);
  };

  const handleDelete = async (player: Player) => {
    if (!confirm("¿Eliminar jugador?")) return;
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    await deletePlayer(player.id);
    toast.success("Jugador eliminado");
    await loadPlayers(clubId!);
  };

  const columns = [
    {
      key: "number",
      header: "#",
      render: (p: Player) => <span className="font-bold">#{p.number}</span>,
    },
    {
      key: "name",
      header: "Nombre",
      render: (p: Player) => `${p.firstName} ${p.lastName}`,
    },
    {
      key: "position",
      header: "Posición",
      render: (p: Player) => p.position,
    },
    {
      key: "age",
      header: "Edad",
      render: (p: Player) => p.age,
    },
    {
      key: "height",
      header: "Altura",
      render: (p: Player) => p.height || "—",
    },
    {
      key: "status",
      header: "Estado",
      render: (p: Player) => (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${p.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {p.active ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ];

  if (!clubId) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminNav clubId="" />
        <div className="container mx-auto px-4 py-12">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNav clubId={clubId} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold" style={{ color: "var(--club-primary, #0891b2)" }}>Jugadores</h1>
          <Button onClick={() => { setEditingPlayer(null); setDialogOpen(true); }} disabled={isDemo}>
            + Agregar Jugador
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={players}
          keyExtractor={(p) => p.id}
          onEdit={isDemo ? undefined : (p) => {
            setEditingPlayer(p);
            setDialogOpen(true);
          }}
          onDelete={isDemo ? undefined : handleDelete}
        />

        <PlayerDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={editingPlayer ? handleUpdate : handleCreate}
          defaultValues={editingPlayer ? {
            firstName: editingPlayer.firstName,
            lastName: editingPlayer.lastName,
            number: editingPlayer.number,
            position: editingPlayer.position,
            age: editingPlayer.age,
            height: editingPlayer.height,
            weight: editingPlayer.weight,
            bio: editingPlayer.bio,
          } : undefined}
          title={editingPlayer ? "Editar Jugador" : "Nuevo Jugador"}
        />
      </div>
    </div>
  );
}
