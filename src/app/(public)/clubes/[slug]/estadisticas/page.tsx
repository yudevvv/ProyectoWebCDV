import { NoFirebaseMessage } from "@/components/shared/NoFirebaseMessage";
//import { notFound } from "next/navigation";
import { ClubNav } from "@/components/shared/ClubNav";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getClubBySlug, getTeamStats, getActivePlayers } from "@/lib/firebase/firestore";

export default async function EstadisticasPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const club = await getClubBySlug(slug);
  if (!club) { return <NoFirebaseMessage title="Club no encontrado" description="Agrega credenciales de Firebase en .env.local" />; }

  const [teamStats] = await Promise.all([getTeamStats(club.id)]);

  return (
    <div className="flex flex-col min-h-screen">
      <ClubNav slug={slug} clubName={club.name} />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Estadísticas</h1>

        {teamStats && (
          <>
            <div className="grid gap-4 md:grid-cols-4 mb-8">
              <StatCard
                title="Victorias"
                value={teamStats.wins}
                icon="🏆"
              />
              <StatCard
                title="Derrotas"
                value={teamStats.losses}
                icon="📊"
              />
              <StatCard
                title="Puntos a favor"
                value={teamStats.pointsFor}
                icon="🎯"
              />
              <StatCard
                title="Puntos en contra"
                value={teamStats.pointsAgainst}
                icon="🛡️"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Resumen de Temporada</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Temporada</dt>
                    <dd className="font-semibold">{teamStats.season}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Posición</dt>
                    <dd className="font-semibold">#{teamStats.position}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Diferencia de puntos</dt>
                    <dd className="font-semibold">{teamStats.pointDifference}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Porcentaje de victorias</dt>
                    <dd className="font-semibold">
                      {(teamStats.winPercentage * 100).toFixed(1)}%
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Racha</dt>
                    <dd className="font-semibold">
                      {teamStats.streak > 0
                        ? `${teamStats.streak} victorias consecutivas`
                        : teamStats.streak < 0
                          ? `${Math.abs(teamStats.streak)} derrotas consecutivas`
                          : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Últimos 5</dt>
                    <dd className="font-semibold">
                      {teamStats.lastFive?.map((r, i) => (
                        <span
                          key={i}
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-1 ${
                            r === "W"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {r === "W" ? "W" : "L"}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </>
        )}

        {!teamStats && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              No hay estadísticas disponibles aún.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
