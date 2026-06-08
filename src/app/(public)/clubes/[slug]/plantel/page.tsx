import { NoFirebaseMessage } from "@/components/shared/NoFirebaseMessage";
//import { notFound } from "next/navigation";
import { ClubNav } from "@/components/shared/ClubNav";
import { PlayerCard } from "@/components/shared/PlayerCard";
import { getClubBySlug, getActivePlayers } from "@/lib/firebase/firestore";

export default async function PlantelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const club = await getClubBySlug(slug);
  if (!club) { return <NoFirebaseMessage title="Club no encontrado" description="Agrega credenciales de Firebase en .env.local" />; }

  const players = await getActivePlayers(club.id);

  const positions = [...new Set(players.map((p) => p.position))];

  return (
    <div className="flex flex-col min-h-screen">
      <ClubNav slug={slug} clubName={club.name} />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Plantel</h1>
        <p className="text-muted-foreground mb-8">
          {players.length} jugadores activos
        </p>

        {positions.map((position) => {
          const positionPlayers = players.filter(
            (p) => p.position === position
          );
          return (
            <div key={position} className="mb-10">
              <h2 className="text-lg font-semibold mb-4 text-muted-foreground">
                {position}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {positionPlayers.map((player) => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>
            </div>
          );
        })}

        {players.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              No hay jugadores registrados aún.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
