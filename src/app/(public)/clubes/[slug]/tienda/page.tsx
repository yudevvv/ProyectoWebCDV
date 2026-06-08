import { NoFirebaseMessage } from "@/components/shared/NoFirebaseMessage";
//import { notFound } from "next/navigation";
import { ClubNav } from "@/components/shared/ClubNav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getClubBySlug, getProducts } from "@/lib/firebase/firestore";

export default async function TiendaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const club = await getClubBySlug(slug);
  if (!club) { return <NoFirebaseMessage title="Club no encontrado" description="Agrega credenciales de Firebase en .env.local" />; }

  const products = await getProducts(club.id);

  return (
    <div className="flex flex-col min-h-screen">
      <ClubNav slug={slug} clubName={club.name} />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Tienda</h1>

        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden group">
                {product.images[0] && (
                  <div className="aspect-square bg-muted overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-xs text-muted-foreground capitalize">
                        {product.category}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-sm font-bold">
                      ${product.price.toLocaleString("es-CL")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {product.stock > 0
                      ? `${product.stock} en stock`
                      : "Agotado"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              No hay productos disponibles aún.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
