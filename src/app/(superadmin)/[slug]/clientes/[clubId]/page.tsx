"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getClubBySlug, getAllUsers } from "@/lib/firebase/firestore";
import { updateClub, updateUserClubs } from "@/lib/firebase/admin-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Club, AppUser } from "@/types";
import { toast } from "sonner";

export default function EditarClubPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.clubId as string;
  const [club, setClub] = useState<Club | null>(null);
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [lnbTeamName, setLnbTeamName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getClubBySlug(slug).then((c) => {
      if (c) { setClub(c); setLnbTeamName(c.lnbTeamName || ""); }
    });
    getAllUsers().then(setAllUsers);
  }, [slug]);

  const handleSave = async () => {
    if (!club) return;
    setSaving(true);
    try {
      await updateClub(club.id, { lnbTeamName: lnbTeamName || "" });
      toast.success("Club actualizado");
    } catch {
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleAssignUser = async () => {
    if (!club || !selectedUser) return;
    try {
      const user = allUsers.find((u) => u.uid === selectedUser);
      const currentClubs = { ...(user?.roles?.clubs || {}), [club.id]: "club_admin" as const };
      await updateUserClubs(selectedUser, currentClubs);
      toast.success("Usuario asignado al club");
    } catch {
      toast.error("Error al asignar usuario");
    }
  };

  if (!club) return <div className="text-slate-500 font-mono text-sm p-8">Cargando club...</div>;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-mono text-slate-400 mb-1">$ ./clubes --edit {club.slug}</p>
        <h1 className="text-2xl font-bold text-slate-900">
          <span className="text-cyan-500">&gt;</span> {club.name}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuracion LNB</CardTitle>
          <CardDescription>
            Conecta este club con la Liga Nacional de Basquetbol de Chile para obtener estadisticas automaticas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre del equipo en LNB</Label>
            <Input
              value={lnbTeamName}
              onChange={(e) => setLnbTeamName(e.target.value)}
              placeholder="Ej: Espanol de Osorno, CD Valdivia, etc."
            />
            <p className="text-xs text-slate-400">
              Debe coincidir exactamente con el nombre usado en{" "}
              <a href="https://lnbchile.com/liga/uno/stats" target="_blank" className="text-cyan-600 hover:underline">
                lnbchile.com/liga/uno/stats
              </a>
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Asignar Propietario</CardTitle>
          <CardDescription>Asigna un usuario como administrador de este club.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Usuario</Label>
            <select
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Seleccionar usuario...</option>
              {allUsers.map((u) => (
                <option key={u.uid} value={u.uid}>{u.email} ({u.displayName})</option>
              ))}
            </select>
          </div>
          <Button onClick={handleAssignUser} disabled={!selectedUser}>
            Asignar como Admin
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
