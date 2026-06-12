"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTeamStats, getActivePlayers, getMatches } from "@/lib/firebase/firestore";
import type { TeamStats, Player, Match } from "@/types";

type AdminEstadisticasPageProps = {
  params: Promise<{ clubId: string }>;
};

export default function AdminEstadisticasPage({ params }: AdminEstadisticasPageProps) {
  const [clubId, setClubId] = useState<string | null>(null);
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => {
      setClubId(p.clubId);
      loadData(p.clubId);
    });
  }, [params]);

  const loadData = async (id: string) => {
    setLoading(true);
    const [s, p, m] = await Promise.all([
      getTeamStats(id),
      getActivePlayers(id),
      getMatches(id),
    ]);
    setStats(s);
    setPlayers(p);
    setMatches(m);
    setLoading(false);
  };

  if (!clubId) return null;
  if (loading) return <div className="flex flex-col min-h-screen"><AdminNav clubId={clubId} /><div className="container mx-auto px-4 py-12"><p className="text-muted-foreground">Cargando...</p></div></div>;

  const finishedMatches = matches.filter((m) => m.status === "finished");
  const wins = finishedMatches.filter((m) => m.homeScore !== undefined && m.awayScore !== undefined && m.homeScore > m.awayScore).length;
  const losses = finishedMatches.filter((m) => m.homeScore !== undefined && m.awayScore !== undefined && m.homeScore < m.awayScore).length;
  const winRate = finishedMatches.length > 0 ? ((wins / finishedMatches.length) * 100).toFixed(1) : "0";

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNav clubId={clubId} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--club-primary, #0891b2)" }}>Estadisticas</h1>
        <p className="text-muted-foreground mb-8">
          Rendimiento del equipo y jugadores
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Partidos Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{finishedMatches.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Victorias</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-600">{wins}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Derrotas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-500">{losses}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Efectividad</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{winRate}%</p>
            </CardContent>
          </Card>
        </div>

        {stats && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Stats de Temporada {stats.season}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Posicion</p>
                  <p className="text-xl font-bold">#{stats.position ?? "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Diferencia de Puntos</p>
                  <p className="text-xl font-bold">{stats.pointDifference ?? "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Racha</p>
                  <p className="text-xl font-bold">
                    {stats.streak > 0 ? `+${stats.streak}` : stats.streak < 0 ? `${stats.streak}` : "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Jugadores ({players.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {players.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      <th className="pb-2 pr-4">#</th>
                      <th className="pb-2 pr-4">Nombre</th>
                      <th className="pb-2 pr-4">Posicion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((p) => (
                      <tr key={p.id} className="border-b last:border-0">
                        <td className="py-2 pr-4 font-mono text-muted-foreground">{p.number}</td>
                        <td className="py-2 pr-4 font-medium">{p.firstName} {p.lastName}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{p.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No hay jugadores activos</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
