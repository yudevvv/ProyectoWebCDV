"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTeamStats, getActivePlayers, getMatches, getLNBStats } from "@/lib/firebase/firestore";
import { saveLNBStats } from "@/lib/firebase/admin-fns";
import { useClub } from "@/hooks/useFirestore";
import type { TeamStats, Player, Match, LNBPlayerStat } from "@/types";
import { toast } from "sonner";
import { RefreshCw, Database } from "lucide-react";

type AdminEstadisticasPageProps = {
  params: Promise<{ clubId: string }>;
};

export default function AdminEstadisticasPage({ params }: AdminEstadisticasPageProps) {
  const [clubId, setClubId] = useState<string | null>(null);
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [lnbStats, setLnbStats] = useState<LNBPlayerStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const { data: club } = useClub(clubId ?? "");

  useEffect(() => {
    params.then((p) => {
      setClubId(p.clubId);
      loadData(p.clubId);
    });
  }, [params]);

  const loadData = async (id: string) => {
    setLoading(true);
    const [s, p, m, lnb] = await Promise.all([
      getTeamStats(id),
      getActivePlayers(id),
      getMatches(id),
      getLNBStats(id),
    ]);
    setStats(s);
    setPlayers(p);
    setMatches(m);
    setLnbStats(lnb);
    setLoading(false);
  };

  const handleScrape = async () => {
    if (!club?.lnbTeamName || !clubId) return;
    setScraping(true);
    try {
      const res = await fetch("/api/lnb/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lnbTeamName: club.lnbTeamName }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Error al obtener datos LNB");
        if (data.teamsFound) {
          toast.info(`Equipos disponibles: ${data.teamsFound.slice(0, 5).join(", ")}`);
        }
        return;
      }
      await saveLNBStats(clubId, data.players);
      toast.success(`${data.count} jugadores importados desde LNB`);
      await loadData(clubId);
    } catch {
      toast.error("Error de conexion con LNB");
    } finally {
      setScraping(false);
    }
  };

  if (!clubId) return null;
  if (loading) return <div className="flex flex-col min-h-screen"><AdminNav clubId={clubId} /><div className="container mx-auto px-4 py-12"><p className="text-muted-foreground">Cargando...</p></div></div>;

  const finishedMatches = matches.filter((m) => m.status === "finished");
  const wins = finishedMatches.filter((m) => m.homeScore > m.awayScore).length;
  const losses = finishedMatches.filter((m) => m.homeScore < m.awayScore).length;
  const winRate = finishedMatches.length > 0 ? ((wins / finishedMatches.length) * 100).toFixed(1) : "0";

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNav clubId={clubId} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold" style={{ color: "var(--club-primary, #0891b2)" }}>Estadisticas</h1>
          {club?.lnbTeamName && (
            <Button variant="outline" size="sm" onClick={handleScrape} disabled={scraping}>
              <RefreshCw className={`h-4 w-4 mr-1 ${scraping ? "animate-spin" : ""}`} />
              {scraping ? "Scrapeando..." : "Sincronizar LNB"}
            </Button>
          )}
        </div>
        <p className="text-muted-foreground mb-8">Rendimiento del equipo y jugadores</p>

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

        {club?.lnbTeamName && (
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5" style={{ color: "var(--club-primary, #0891b2)" }} />
                <CardTitle>LNB Chile — {club.lnbTeamName}</CardTitle>
              </div>
              {lnbStats.length > 0 && (
                <Badge variant="outline" className="font-mono">
                  {lnbStats.length} jugadores
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              {lnbStats.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="pb-2 pr-3">Jugador</th>
                        <th className="pb-2 pr-3">Pos</th>
                        <th className="pb-2 pr-3">PJ</th>
                        <th className="pb-2 pr-3">MIN</th>
                        <th className="pb-2 pr-3">PTS</th>
                        <th className="pb-2 pr-3">REB</th>
                        <th className="pb-2 pr-3">AST</th>
                        <th className="pb-2 pr-3">ROB</th>
                        <th className="pb-2 pr-3">TAP</th>
                        <th className="pb-2 pr-3">TC%</th>
                        <th className="pb-2 pr-3">3P%</th>
                        <th className="pb-2 pr-3">TL%</th>
                        <th className="pb-2 pr-3">EFF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lnbStats.map((p, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                          <td className="py-1.5 pr-3 font-medium">{p.playerName}</td>
                          <td className="py-1.5 pr-3 text-muted-foreground">{p.position}</td>
                          <td className="py-1.5 pr-3 font-mono">{p.gamesPlayed}</td>
                          <td className="py-1.5 pr-3 font-mono">{p.minutesPerGame.toFixed(1)}</td>
                          <td className="py-1.5 pr-3 font-mono font-bold">{p.pointsPerGame.toFixed(1)}</td>
                          <td className="py-1.5 pr-3 font-mono">{p.reboundsPerGame.toFixed(1)}</td>
                          <td className="py-1.5 pr-3 font-mono">{p.assistsPerGame.toFixed(1)}</td>
                          <td className="py-1.5 pr-3 font-mono">{p.stealsPerGame.toFixed(1)}</td>
                          <td className="py-1.5 pr-3 font-mono">{p.blocksPerGame.toFixed(1)}</td>
                          <td className="py-1.5 pr-3 font-mono">{(p.fieldGoalPct * 100).toFixed(1)}%</td>
                          <td className="py-1.5 pr-3 font-mono">{(p.threePointPct * 100).toFixed(1)}%</td>
                          <td className="py-1.5 pr-3 font-mono">{(p.freeThrowPct * 100).toFixed(1)}%</td>
                          <td className="py-1.5 pr-3 font-mono">{p.efficiency.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground mb-3">
                    Conectado a LNB Chile como &quot;{club.lnbTeamName}&quot;. Presiona &quot;Sincronizar LNB&quot; para importar estadisticas.
                  </p>
                  <Button variant="outline" size="sm" onClick={handleScrape} disabled={scraping}>
                    <RefreshCw className={`h-4 w-4 mr-1 ${scraping ? "animate-spin" : ""}`} />
                    {scraping ? "Scrapeando..." : "Sincronizar LNB"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Jugadores del Club ({players.length})</CardTitle>
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
