"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createMatch, updateMatch, deleteMatch } from "@/lib/firebase/admin-fns";
import { getMatches } from "@/lib/firebase/firestore";
import type { Match } from "@/types";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useDemoMode } from "@/lib/demo-mode";

const statusColors: Record<string, string> = {
  upcoming: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  live: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  finished: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

const statusLabels: Record<string, string> = {
  upcoming: "Próximo",
  live: "En Vivo",
  finished: "Finalizado",
  cancelled: "Cancelado",
};

type MatchFormData = {
  opponent: string;
  date: string;
  location: string;
  status: string;
  competition: string;
  homeScore: number;
  awayScore: number;
};

type AdminPartidosPageProps = {
  params: Promise<{ clubId: string }>;
};

export default function AdminPartidosPage({ params }: AdminPartidosPageProps) {
  const [clubId, setClubId] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [form, setForm] = useState<MatchFormData>({
    opponent: "", date: "", location: "", status: "upcoming",
    competition: "", homeScore: 0, awayScore: 0,
  });
  const [loading, setLoading] = useState(false);
  const { isDemo, guard } = useDemoMode(clubId ?? "");

  useEffect(() => {
    params.then((p) => {
      setClubId(p.clubId);
      loadMatches(p.clubId);
    });
  }, [params]);

  const loadMatches = async (id: string) => {
    const data = await getMatches(id);
    setMatches(data);
  };

  const openCreate = () => {
    setEditingMatch(null);
    setForm({ opponent: "", date: "", location: "", status: "upcoming", competition: "", homeScore: 0, awayScore: 0 });
    setDialogOpen(true);
  };

  const openEdit = (match: Match) => {
    setEditingMatch(match);
    setForm({
      opponent: match.opponent,
      date: match.date ? new Date(match.date.seconds * 1000).toISOString().slice(0, 16) : "",
      location: match.location,
      status: match.status,
      competition: match.competition || "",
      homeScore: match.homeScore,
      awayScore: match.awayScore,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    if (!clubId) return;
    setLoading(true);
    try {
      const matchData = {
        opponent: form.opponent,
        location: form.location,
        status: form.status as Match["status"],
        competition: form.competition,
        homeScore: form.homeScore,
        awayScore: form.awayScore,
        season: new Date().getFullYear().toString(),
        date: { seconds: new Date(form.date).getTime() / 1000, nanoseconds: 0 } as unknown as Match["date"],
        opponentLogo: editingMatch?.opponentLogo,
        ticketUrl: editingMatch?.ticketUrl,
        streamUrl: editingMatch?.streamUrl,
      };

      if (editingMatch) {
        await updateMatch(editingMatch.id, matchData);
        toast.success("Partido actualizado");
      } else {
        await createMatch(clubId, matchData);
        toast.success("Partido creado");
      }
      setDialogOpen(false);
      await loadMatches(clubId);
    } catch {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (match: Match) => {
    if (!confirm("¿Eliminar partido?")) return;
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    await deleteMatch(match.id);
    toast.success("Partido eliminado");
    await loadMatches(clubId!);
  };

  const columns = [
    {
      key: "opponent",
      header: "Rival",
      render: (m: Match) => m.opponent,
    },
    {
      key: "date",
      header: "Fecha",
      render: (m: Match) =>
        m.date ? format(new Date(m.date.seconds * 1000), "d MMM yyyy HH:mm", { locale: es }) : "—",
    },
    {
      key: "result",
      header: "Resultado",
      render: (m: Match) =>
        m.status === "finished" || m.status === "live"
          ? `${m.homeScore} - ${m.awayScore}`
          : "—",
    },
    {
      key: "status",
      header: "Estado",
      render: (m: Match) => (
        <Badge className={statusColors[m.status]}>{statusLabels[m.status]}</Badge>
      ),
    },
    {
      key: "location",
      header: "Lugar",
      render: (m: Match) => m.location,
    },
  ];

  if (!clubId) return <div className="flex flex-col min-h-screen"><AdminNav clubId="" /><div className="container mx-auto px-4 py-12"><p className="text-muted-foreground">Cargando...</p></div></div>;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNav clubId={clubId} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Partidos</h1>
          <Button onClick={openCreate} disabled={isDemo}>+ Crear Partido</Button>
        </div>

        <DataTable
          columns={columns}
          data={matches}
          keyExtractor={(m) => m.id}
          onEdit={isDemo ? undefined : openEdit}
          onDelete={isDemo ? undefined : handleDelete}
        />

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingMatch ? "Editar Partido" : "Nuevo Partido"}</DialogTitle>
              <DialogDescription>Completa los datos del partido</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Rival</Label>
                <Input value={form.opponent} onChange={(e) => setForm({ ...form, opponent: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha y Hora</Label>
                  <Input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v ?? "upcoming" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Próximo</SelectItem>
                      <SelectItem value="live">En Vivo</SelectItem>
                      <SelectItem value="finished">Finalizado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Lugar</Label>
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Competencia</Label>
                <Input value={form.competition} onChange={(e) => setForm({ ...form, competition: e.target.value })} />
              </div>
              {(form.status === "finished" || form.status === "live") && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Local</Label>
                    <Input type="number" value={form.homeScore} onChange={(e) => setForm({ ...form, homeScore: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Visita</Label>
                    <Input type="number" value={form.awayScore} onChange={(e) => setForm({ ...form, awayScore: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={loading}>{loading ? "Guardando..." : "Guardar"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
