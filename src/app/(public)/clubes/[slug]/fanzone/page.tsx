import { NoFirebaseMessage } from "@/components/shared/NoFirebaseMessage";
//import { notFound } from "next/navigation";
import { ClubNav } from "@/components/shared/ClubNav";
import { PollCard } from "@/components/fanzone/PollCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getClubBySlug, getMatches } from "@/lib/firebase/firestore";

export default async function FanZonePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const club = await getClubBySlug(slug);
  if (!club) { return <NoFirebaseMessage title="Club no encontrado" description="Agrega credenciales de Firebase en .env.local" />; }

  const matches = await getMatches(club.id);
  const upcomingMatch = matches.find((m) => m.status === "upcoming" || m.status === "live");

  return (
    <div className="flex flex-col min-h-screen">
      <ClubNav slug={slug} clubName={club.name} />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Fan Zone</h1>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold mb-4">Predicciones</h2>
            {upcomingMatch ? (
              <Card>
                <CardHeader>
                  <CardTitle>Predice el Resultado</CardTitle>
                  <CardDescription>
                    {club.name} vs {upcomingMatch.opponent}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Inicia sesión para predecir el marcador y ganar puntos.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground text-sm">
                    No hay partidos disponibles para predecir
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Encuestas</h2>
              <PollCard clubId={club.id} />
              {!club.id && (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground text-sm">
                      No hay encuestas activas
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Ranking de Hinchas</h2>
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-3xl mb-2">🏆</p>
                <p className="text-muted-foreground text-sm">
                  Próximamente: Ranking de hinchas con puntuaciones basadas en
                  predicciones y participación.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
