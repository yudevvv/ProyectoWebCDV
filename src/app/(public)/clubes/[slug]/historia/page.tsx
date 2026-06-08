import { NoFirebaseMessage } from "@/components/shared/NoFirebaseMessage";
//import { notFound } from "next/navigation";
import { ClubNav } from "@/components/shared/ClubNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getClubBySlug, getClubHistory, getTimelineEvents, getAchievements } from "@/lib/firebase/firestore";

export default async function HistoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const club = await getClubBySlug(slug);
  if (!club) { return <NoFirebaseMessage title="Club no encontrado" description="Agrega credenciales de Firebase en .env.local" />; }

  const [history, timelineEvents, achievements] = await Promise.all([
    getClubHistory(club.id),
    getTimelineEvents(club.id),
    getAchievements(club.id),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <ClubNav slug={slug} clubName={club.name} />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Historia</h1>

        {history && (
          <Card className="mb-12">
            <CardContent className="pt-6">
              {history.mission && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Misión</h2>
                  <p className="text-lg">{history.mission}</p>
                </div>
              )}
              {history.vision && (
                <div>
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Visión</h2>
                  <p className="text-lg">{history.vision}</p>
                </div>
              )}
              {history.history && (
                <div className="mt-8">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{history.history}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {achievements.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Logros</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement) => (
                <Card key={`${achievement.year}-${achievement.title}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">🏆</span>
                      <span>{achievement.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {achievement.description}
                    </p>
                    <p className="text-xs font-bold text-muted-foreground">
                      {achievement.year}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {timelineEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Línea de Tiempo</h2>
            <div className="relative pl-8 border-l-2 border-muted">
              {timelineEvents.map((event, idx) => (
                <div key={idx} className="mb-8 relative">
                  <div className="absolute -left-[calc(2.25rem)] top-1 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                  <div>
                    <span className="text-sm font-bold text-primary">{event.year}</span>
                    <h3 className="font-semibold mt-1">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!history && achievements.length === 0 && timelineEvents.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No hay historia registrada aún.</p>
          </div>
        )}
      </div>
    </div>
  );
}
