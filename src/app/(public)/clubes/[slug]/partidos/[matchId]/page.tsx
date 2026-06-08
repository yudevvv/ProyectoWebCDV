import { notFound } from "next/navigation";
import { ClubNav } from "@/components/shared/ClubNav";
import { MatchCard } from "@/components/shared/MatchCard";
import { MVPVotingSection } from "@/components/mvp/MVPVotingSection";
import { Button } from "@/components/ui/button";
import { getClubBySlug, getMatch, getActivePlayers } from "@/lib/firebase/firestore";
import Link from "next/link";

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ slug: string; matchId: string }>;
}) {
  const { slug, matchId } = await params;
  const club = await getClubBySlug(slug);
  if (!club) notFound();

  const match = await getMatch(matchId);
  if (!match) notFound();

  const players = await getActivePlayers(club.id);

  return (
    <div className="flex flex-col min-h-screen">
      <ClubNav slug={slug} clubName={club.name} />
      <div className="container mx-auto px-4 py-12">
        <Link
          href={`/clubes/${slug}/partidos`}
          className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block"
        >
          ← Volver a partidos
        </Link>

        <div className="mb-8">
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
        </div>

        {(match.status === "live" || match.status === "finished") && players.length > 0 && (
          <div className="max-w-lg mx-auto">
            <MVPVotingSection
              matchId={match.id}
              players={players}
              matchStatus={match.status}
              matchEndedAt={match.status === "finished" ? match.updatedAt?.toDate() : undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
}
