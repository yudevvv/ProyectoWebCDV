import { NoFirebaseMessage } from "@/components/shared/NoFirebaseMessage";
//import { notFound } from "next/navigation";
import Link from "next/link";
import { ClubNav } from "@/components/shared/ClubNav";
import { MatchCard } from "@/components/shared/MatchCard";
import { getClubBySlug, getMatches } from "@/lib/firebase/firestore";

export default async function PartidosPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const club = await getClubBySlug(slug);
  if (!club) { return <NoFirebaseMessage title="Club no encontrado" description="Agrega credenciales de Firebase en .env.local" />; }

  const matches = await getMatches(club.id);

  const upcoming = matches.filter(
    (m) => m.status === "upcoming" || m.status === "live"
  );
  const finished = matches.filter((m) => m.status === "finished");

  return (
    <div className="flex flex-col min-h-screen">
      <ClubNav slug={slug} clubName={club.name} />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Partidos</h1>

        {upcoming.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Próximos Partidos</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((match) => (
                <Link key={match.id} href={`/clubes/${slug}/partidos/${match.id}`}>
                  <MatchCard
                    opponent={match.opponent}
                    date={match.date.toDate()}
                    location={match.location}
                    status={match.status}
                    homeScore={match.homeScore}
                    awayScore={match.awayScore}
                    competition={match.competition}
                    homeTeam={club.name}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}

        {finished.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Resultados</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {finished.map((match) => (
                <Link key={match.id} href={`/clubes/${slug}/partidos/${match.id}`}>
                  <MatchCard
                    opponent={match.opponent}
                    date={match.date.toDate()}
                    location={match.location}
                    status={match.status}
                    homeScore={match.homeScore}
                    awayScore={match.awayScore}
                    competition={match.competition}
                    homeTeam={club.name}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}

        {matches.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              No hay partidos registrados aún.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
