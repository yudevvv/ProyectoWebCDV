import { NoFirebaseMessage } from "@/components/shared/NoFirebaseMessage";
//import { notFound } from "next/navigation";
import Link from "next/link";
import { ClubNav } from "@/components/shared/ClubNav";
import { Card, CardContent } from "@/components/ui/card";
import { getClubBySlug, getNews } from "@/lib/firebase/firestore";

export default async function NoticiasPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const club = await getClubBySlug(slug);
  if (!club) { return <NoFirebaseMessage title="Club no encontrado" description="Agrega credenciales de Firebase en .env.local" />; }

  const news = await getNews(club.id);

  return (
    <div className="flex flex-col min-h-screen">
      <ClubNav slug={slug} clubName={club.name} />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Noticias</h1>

        {news.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <Card key={item.id} className="overflow-hidden group">
                {item.coverImage && (
                  <div className="aspect-video bg-muted overflow-hidden">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground mb-2">
                    {item.author}
                  </p>
                  <h2 className="font-semibold mb-2 line-clamp-2">
                    {item.title}
                  </h2>
                  {item.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {item.excerpt}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No hay noticias publicadas aún.</p>
          </div>
        )}
      </div>
    </div>
  );
}
