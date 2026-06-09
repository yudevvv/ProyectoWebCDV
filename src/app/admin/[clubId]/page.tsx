import { notFound } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getClubBySlug, getTeamStats, getActivePlayers, getMatches, getMembers, getNews, getProducts, getSponsors } from "@/lib/firebase/firestore";
import Image from "next/image";

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
      getTeamStats(club.id),
      getActivePlayers(club.id),
      getMatches(club.id),
      getMembers(club.id),
      getNews(club.id),
      getProducts(club.id),
      getSponsors(club.id),
    ]);

  const primary = club.colors.primary ?? "#0891b2";
  const secondary = club.colors.secondary ?? "#059669";

  const kpis = [
    { title: "Socios", value: members.length, icon: "🤝", color: primary },
    { title: "Jugadores", value: players.length, icon: "🏃", color: secondary },
    { title: "Partidos", value: matches.length, icon: "⚡", color: primary },
    { title: "Productos", value: products.length, icon: "🛒", color: secondary },
    { title: "Noticias", value: news.length, icon: "📰", color: primary },
    { title: "Auspiciadores", value: sponsors.length, icon: "🏢", color: secondary },
    {
      title: "Victorias",
      value: teamStats?.wins ?? 0,
      icon: "🏆",
      color: secondary,
      description: `Temporada ${teamStats?.season ?? "—"}`,
    },
    {
      title: "Posición",
      value: `#${teamStats?.position ?? "—"}`,
      icon: "📊",
      color: primary,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <AdminNav clubId={clubId} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          {club.logo && (
            <Image
              src={club.logo}
              alt={club.name}
              width={56}
              height={56}
              className="rounded-xl object-cover"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold" style={{ color: primary }}>
              {club.name}
            </h1>
            <p className="text-muted-foreground">Panel de Administración</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {kpis.map((kpi) => (
            <Card key={kpi.title} className="border-l-4" style={{ borderLeftColor: kpi.color }}>
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
              <CardTitle style={{ color: primary }}>Accesos Rápidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href={`/admin/${clubId}/jugadores`}
                className="block p-3 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                style={{ borderLeft: `3px solid ${primary}`, paddingLeft: "12px" }}
              >
                ➕ Agregar jugador
              </a>
              <a
                href={`/admin/${clubId}/partidos`}
                className="block p-3 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                style={{ borderLeft: `3px solid ${secondary}`, paddingLeft: "12px" }}
              >
                ➕ Crear partido
              </a>
              <a
                href={`/admin/${clubId}/noticias`}
                className="block p-3 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                style={{ borderLeft: `3px solid ${primary}`, paddingLeft: "12px" }}
              >
                📝 Publicar noticia
              </a>
              <a
                href={`/admin/${clubId}/socios`}
                className="block p-3 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                style={{ borderLeft: `3px solid ${secondary}`, paddingLeft: "12px" }}
              >
                👥 Ver socios
              </a>
            </CardContent>
          </Card>

          {teamStats && (
            <Card>
              <CardHeader>
                <CardTitle style={{ color: primary }}>Rendimiento del Equipo</CardTitle>
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
                        className="h-full rounded-full"
                        style={{
                          width: `${
                            teamStats.wins + teamStats.losses > 0
                              ? (teamStats.wins / (teamStats.wins + teamStats.losses)) * 100
                              : 0
                          }%`,
                          backgroundColor: secondary,
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
                        className="h-full rounded-full"
                        style={{
                          width: `${
                            teamStats.wins + teamStats.losses > 0
                              ? (teamStats.losses / (teamStats.wins + teamStats.losses)) * 100
                              : 0
                          }%`,
                          backgroundColor: "#ef4444",
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
