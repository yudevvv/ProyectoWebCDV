import { NoFirebaseMessage } from "@/components/shared/NoFirebaseMessage";
import { ClubNav } from "@/components/shared/ClubNav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getClubBySlug, getSponsors } from "@/lib/firebase/firestore";

const tierConfig = {
  gold: { label: "Gold", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
  silver: { label: "Silver", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" },
  bronze: { label: "Bronze", className: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300" },
};

const complianceLabels: Record<string, string> = {
  cumpliendo: "Cumpliendo",
  pendiente: "Pendiente",
  incumplido: "Incumplido",
};

const complianceColors: Record<string, string> = {
  cumpliendo: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  pendiente: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  incumplido: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

export default async function AuspiciadoresPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const club = await getClubBySlug(slug);
  if (!club) { return <NoFirebaseMessage title="Club no encontrado" description="Agrega credenciales de Firebase en .env.local" />; }

  const sponsors = await getSponsors(club.id);

  return (
    <div className="flex flex-col min-h-screen">
      <ClubNav slug={slug} clubName={club.name} />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Auspiciadores</h1>
        <p className="text-muted-foreground mb-8">Empresas y marcas que confían en nosotros</p>

        {sponsors.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sponsors.map((sponsor) => {
              const tier = tierConfig[sponsor.tier] || tierConfig.bronze;
              return (
                <Card key={sponsor.id} className="overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <Badge className={tier.className + " mb-4"}>
                      {tier.label}
                    </Badge>
                    {sponsor.logo && (
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="h-16 w-auto mx-auto mb-4 object-contain"
                      />
                    )}
                    <h3 className="font-semibold mb-2">{sponsor.name}</h3>
                    {sponsor.website && (
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Visitar sitio
                      </a>
                    )}
                    {sponsor.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {sponsor.description}
                      </p>
                    )}
                    {sponsor.contributionType && (
                      <div className="mt-3 pt-3 border-t text-xs text-muted-foreground space-y-1">
                        <p>
                          Aporte:{" "}
                          {sponsor.contributionType === "monetario"
                            ? `${(sponsor.contributionAmount || 0).toLocaleString("es-CL")} ${sponsor.contributionCurrency || "CLP"}`
                            : sponsor.contributionType === "servicio"
                              ? "Servicios"
                              : "Productos"}
                        </p>
                        {sponsor.complianceStatus && (
                          <Badge className={complianceColors[sponsor.complianceStatus] || complianceColors.pendiente}>
                            {complianceLabels[sponsor.complianceStatus] || "Pendiente"}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              No hay auspiciadores registrados aún.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
