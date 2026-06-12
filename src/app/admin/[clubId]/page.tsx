import { notFound } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getClubBySlug, getTeamStats, getActivePlayers, getMatches, getMembers, getNews, getProducts, getSponsors } from "@/lib/firebase/firestore";
export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;
  const club = await getClubBySlug(clubId);
  if (!club) notFound();

  const [teamStats, players, matches, members, news, products, sponsors] =
    await Promise.all([
      getTeamStats(clubId),
      getActivePlayers(clubId),
      getMatches(clubId),
      getMembers(clubId),
      getNews(clubId),
      getProducts(clubId),
      getSponsors(clubId),
    ]);

  const kpis = [
    { title: "Socios", value: members.length, icon: "🤝" },
    { title: "Jugadores", value: players.length, icon: "🏃" },
    { title: "Partidos", value: matches.length, icon: "⚡" },
    { title: "Productos", value: products.length, icon: "🛒" },
    { title: "Noticias", value: news.length, icon: "📰" },
    { title: "Auspiciadores", value: sponsors.length, icon: "🏢" },
    {
      title: "Victorias",
      value: teamStats?.wins ?? 0,
      icon: "🏆",
      description: `Temporada ${teamStats?.season ?? "—"}`,
    },
    {
      title: "Posición",
      value: `#${teamStats?.position ?? "—"}`,
      icon: "📊",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNav clubId={clubId} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          {club.logo && (
            <img
              src={club.logo}
              alt={club.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">{club.name}</h1>
            <p className="text-sm font-mono text-cyan-600">
              $ Panel de Administracion
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {kpis.map((kpi) => (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <span className="text-lg">{kpi.icon}</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                {kpi.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {kpi.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-cyan-600">Accesos Rápidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href={`/admin/${clubId}/jugadores`}
                className="block p-3 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
              >
                ➕ Agregar jugador
              </a>
              <a
                href={`/admin/${clubId}/partidos`}
                className="block p-3 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
              >
                ➕ Crear partido
              </a>
              <a
                href={`/admin/${clubId}/noticias`}
                className="block p-3 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
              >
                📝 Publicar noticia
              </a>
              <a
                href={`/admin/${clubId}/socios`}
                className="block p-3 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
              >
                👥 Ver socios
              </a>
              {club.published && (
                <a
                  href={`/clubes/${club.slug}`}
                  target="_blank"
                  className="block p-3 rounded-lg hover:bg-muted transition-colors text-sm font-medium text-cyan-600"
                >
                  🌐 Ir al sitio web
                </a>
              )}
            </CardContent>
          </Card>

          {teamStats && (
            <Card>
              <CardHeader>
                <CardTitle className="text-cyan-600">Rendimiento del Equipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Victorias</span>
                      <span className="font-bold">{teamStats.wins}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{
                          width: `${
                            teamStats.wins + teamStats.losses > 0
                              ? (teamStats.wins / (teamStats.wins + teamStats.losses)) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Derrotas</span>
                      <span className="font-bold">{teamStats.losses}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{
                          width: `${
                            teamStats.wins + teamStats.losses > 0
                              ? (teamStats.losses / (teamStats.wins + teamStats.losses)) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span className="text-muted-foreground">Diferencia</span>
                    <span className="font-bold">{teamStats.pointDifference}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Posición</span>
                    <span className="font-bold">#{teamStats.position}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Racha</span>
                    <span className="font-bold">
                      {teamStats.streak > 0
                        ? `+${teamStats.streak}`
                        : teamStats.streak < 0
                          ? `${teamStats.streak}`
                          : "—"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
