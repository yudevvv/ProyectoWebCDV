"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { saveClubHistory, createTimelineEvent, deleteTimelineEvent, createAchievement, deleteAchievement } from "@/lib/firebase/admin-fns";
import { getClubHistory, getTimelineEvents, getAchievements } from "@/lib/firebase/firestore";
import { toast } from "sonner";
import { useDemoMode } from "@/lib/demo-mode";

type AdminHistoriaPageProps = {
  params: Promise<{ clubId: string }>;
};

export default function AdminHistoriaPage({ params }: AdminHistoriaPageProps) {
  const [clubId, setClubId] = useState<string | null>(null);
  const [history, setHistory] = useState<{ id?: string; history: string; mission: string; vision: string }>({ history: "", mission: "", vision: "" });
  const [timelineEvents, setTimelineEvents] = useState<{ id?: string; year: number; title: string; description: string }[]>([]);
  const [achievements, setAchievements] = useState<{ id?: string; year: number; title: string; description: string }[]>([]);
  const [newTimeline, setNewTimeline] = useState({ year: new Date().getFullYear(), title: "", description: "" });
  const [newAchievement, setNewAchievement] = useState({ year: new Date().getFullYear(), title: "", description: "" });
  const { isDemo } = useDemoMode(clubId ?? "");

  const loadData = async (id: string) => {
    const [h, t, a] = await Promise.all([
      getClubHistory(id),
      getTimelineEvents(id),
      getAchievements(id),
    ]);
    if (h) setHistory({ id: h.id, history: h.history, mission: h.mission, vision: h.vision });
    setTimelineEvents(t.map((e) => ({ id: e.id, year: e.year, title: e.title, description: e.description })));
    setAchievements(a.map((e) => ({ id: e.id, year: e.year, title: e.title, description: e.description })));
  };

  useEffect(() => {
    params.then((p) => {
      setClubId(p.clubId);
      loadData(p.clubId);
    });
  }, [params]);

  const saveHistory = async () => {
    if (!clubId) return;
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    try {
      await saveClubHistory(clubId, history);
      toast.success("Historia guardada");
    } catch { toast.error("Error al guardar"); }
  };

  const addTimeline = async () => {
    if (!clubId || !newTimeline.title) return;
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    try {
      await createTimelineEvent(clubId, newTimeline);
      toast.success("Evento agregado");
      setNewTimeline({ year: new Date().getFullYear(), title: "", description: "" });
      await loadData(clubId);
    } catch { toast.error("Error al agregar"); }
  };

  const addAchievement = async () => {
    if (!clubId || !newAchievement.title) return;
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    try {
      await createAchievement(clubId, newAchievement);
      toast.success("Logro agregado");
      setNewAchievement({ year: new Date().getFullYear(), title: "", description: "" });
      await loadData(clubId);
    } catch { toast.error("Error al agregar"); }
  };

  const removeTimeline = async (id: string | undefined) => {
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    if (!id) return;
    if (!confirm("¿Eliminar evento?")) return;
    await deleteTimelineEvent(id);
    toast.success("Evento eliminado");
    await loadData(clubId!);
  };

  const removeAchievement = async (id: string | undefined) => {
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    if (!id) return;
    if (!confirm("¿Eliminar logro?")) return;
    await deleteAchievement(id);
    toast.success("Logro eliminado");
    await loadData(clubId!);
  };

  if (!clubId) return <div className="flex flex-col min-h-screen"><AdminNav clubId="" /><div className="container mx-auto px-4 py-12"><p className="text-muted-foreground">Cargando...</p></div></div>;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNav clubId={clubId} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-cyan-600">Historia del Club</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Misión</Label>
              <textarea className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={history.mission} onChange={(e) => setHistory({ ...history, mission: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Visión</Label>
              <textarea className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={history.vision} onChange={(e) => setHistory({ ...history, vision: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Historia</Label>
              <textarea className="flex min-h-[150px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={history.history} onChange={(e) => setHistory({ ...history, history: e.target.value })} />
            </div>
            <Button onClick={saveHistory} disabled={isDemo}>Guardar Historia</Button>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Línea de Tiempo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              {timelineEvents.map((event, idx) => (
                <div key={event.id ?? idx} className="flex items-start justify-between p-3 rounded-lg border">
                  <div>
                    <span className="text-sm font-bold text-primary">{event.year}</span>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeTimeline(event.id)}>Eliminar</Button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Input type="number" placeholder="Año" value={newTimeline.year} onChange={(e) => setNewTimeline({ ...newTimeline, year: parseInt(e.target.value) || 2025 })} />
              <Input placeholder="Título" value={newTimeline.title} onChange={(e) => setNewTimeline({ ...newTimeline, title: e.target.value })} />
              <Button onClick={addTimeline} disabled={isDemo}>Agregar Evento</Button>
            </div>
            <Input className="mt-3" placeholder="Descripción" value={newTimeline.description} onChange={(e) => setNewTimeline({ ...newTimeline, description: e.target.value })} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              {achievements.map((ach, idx) => (
                <div key={ach.id ?? idx} className="flex items-start justify-between p-3 rounded-lg border">
                  <div>
                    <span className="text-sm font-bold text-primary">{ach.year}</span>
                    <p className="font-medium">{ach.title}</p>
                    <p className="text-sm text-muted-foreground">{ach.description}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeAchievement(ach.id)}>Eliminar</Button>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Input type="number" className="w-24" placeholder="Año" value={newAchievement.year} onChange={(e) => setNewAchievement({ ...newAchievement, year: parseInt(e.target.value) || 2025 })} />
              <Input placeholder="Título" value={newAchievement.title} onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })} />
              <Input placeholder="Descripción" value={newAchievement.description} onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })} />
              <Button onClick={addAchievement} disabled={isDemo}>Agregar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
