import { ClubNav } from "@/components/shared/ClubNav";
import { HeroBanner } from "@/components/shared/HeroBanner";
import { StatCard } from "@/components/shared/StatCard";
import { MatchCard } from "@/components/shared/MatchCard";
import { getClubBySlug, getTeamStats, getUpcomingMatches, getLatestResults, getSponsors } from "@/lib/firebase/firestore";
import { NoFirebaseMessage } from "@/components/shared/NoFirebaseMessage";
import Link from "next/link";

export default async function ClubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const club = await getClubBySlug(slug);

  if (!club) {
    return <NoFirebaseMessage title="Club no encontrado" description="No se encontró un club con el slug &quot;{slug}&quot;. Agrega credenciales de Firebase en .env.local y crea un documento en la colección &quot;clubs&quot;." />;
  }

  const [teamStats, upcomingMatches, latestResults, sponsors] = await Promise.all([
    getTeamStats(club.id),
    getUpcomingMatches(club.id, 3),
    getLatestResults(club.id, 3),
    getSponsors(club.id),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <ClubNav slug={slug} clubName={club.name} />

      <HeroBanner
        name={club.name}
        description={club.description}
        banner={club.banner}
        primaryColor={club.colors?.primary}
      />

      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Victorias"
            value={teamStats?.wins ?? 0}
            icon="🏆"
            description={`Temporada ${teamStats?.season ?? "actual"}`}
          />
          <StatCard
            title="Derrotas"
            value={teamStats?.losses ?? 0}
            icon="📊"
          />
          <StatCard
            title="Posición"
            value={`#${teamStats?.position ?? "-"}`}
            icon="📈"
          />
          <StatCard
            title="Puntos a favor"
            value={teamStats?.pointsFor ?? 0}
            icon="🎯"
          />
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Próximos Partidos</h2>
              <Link
                href={`/clubes/${slug}/partidos`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Ver todos
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingMatches.length > 0 ? (
                upcomingMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    opponent={match.opponent}
                    date={match.date.toDate()}
                    location={match.location}
                    status={match.status}
                    homeScore={match.homeScore}
                    awayScore={match.awayScore}
                    competition={match.competition}
                    homeTeam={club.name}
                  />
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  No hay partidos programados
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Últimos Resultados</h2>
              <Link
                href={`/clubes/${slug}/partidos`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Ver todos
              </Link>
            </div>
            <div className="space-y-4">
              {latestResults.length > 0 ? (
                latestResults.map((match) => (
                  <MatchCard
                    key={match.id}
                    opponent={match.opponent}
                    date={match.date.toDate()}
                    location={match.location}
                    status={match.status}
                    homeScore={match.homeScore}
                    awayScore={match.awayScore}
                    competition={match.competition}
                    homeTeam={club.name}
                  />
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  No hay resultados disponibles
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {sponsors.length > 0 && (
        <section className="border-t py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold mb-6 text-center">
              Auspiciadores
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {sponsors.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-60 hover:opacity-100 transition-opacity"
                >
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="h-12 w-auto"
                  />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {club.name} — Powered by TOALESCO</p>
        </div>
      </footer>
    </div>
  );
}
