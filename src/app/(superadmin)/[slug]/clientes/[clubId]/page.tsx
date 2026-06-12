"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getClubBySlug, getAllUsers, getProballersStats } from "@/lib/firebase/firestore";
import { updateClub, updateUserClubs, saveProballersStats } from "@/lib/firebase/admin-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Club, AppUser } from "@/types";
import type { ProballersPlayerStat } from "@/lib/firebase/firestore";
import { toast } from "sonner";
import { RefreshCw, Globe } from "lucide-react";

export default function EditarClubPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.clubId as string;
  const [club, setClub] = useState<Club | null>(null);
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [proballersUrl, setProballersUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [syncingProballers, setSyncingProballers] = useState(false);
  const [proballersCount, setProballersCount] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    getClubBySlug(slug).then((c) => {
      if (c) {
        setClub(c);
        setProballersUrl(c.proballersUrl || "");
        loadStats(c.id);
      }
    });
    getAllUsers().then(setAllUsers);
  }, [slug]);

  const loadStats = async (clubId: string) => {
    const prob = await getProballersStats(clubId);
    setProballersCount(prob.length);
  };

  const handleSave = async () => {
    if (!club) return;
    setSaving(true);
    try {
      await updateClub(club.id, { proballersUrl: proballersUrl || "" });
      toast.success("Club actualizado");
    } catch {
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleSyncProballers = async () => {
    if (!club?.proballersUrl || !club) return;
    setSyncingProballers(true);
    try {
      const res = await fetch("/api/proballers/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proballersUrl: club.proballersUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Error al obtener datos de Proballers");
        return;
      }
      await saveProballersStats(club.id, data.players);
      toast.success(`${data.count} jugadores importados desde Proballers`);
      await loadStats(club.id);
    } catch {
      toast.error("Error de conexion con Proballers");
    } finally {
      setSyncingProballers(false);
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
          <CardTitle>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Proballers
            </div>
          </CardTitle>
          <CardDescription>
            Conecta este club con Proballers.com para obtener estadisticas detalladas de jugadores.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>URL del equipo en Proballers</Label>
            <Input
              value={proballersUrl}
              onChange={(e) => setProballersUrl(e.target.value)}
              placeholder="Ej: https://www.proballers.com/basketball/team/15651/cd-las-animas"
            />
            <p className="text-xs text-slate-400">
              URL de la pagina del equipo en{" "}
              <a href="https://www.proballers.com" target="_blank" className="text-cyan-600 hover:underline">
                proballers.com
              </a>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
            {club.proballersUrl && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSyncProballers} disabled={syncingProballers}>
                  <RefreshCw className={`h-4 w-4 mr-1 ${syncingProballers ? "animate-spin" : ""}`} />
                  {syncingProballers ? "Sincronizando..." : "Sincronizar Proballers"}
                </Button>
                {proballersCount !== null && (
                  <span className="text-xs text-slate-400">{proballersCount} jugadores</span>
                )}
              </div>
            )}
          </div>
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
