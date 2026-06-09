"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";

type AdminEstadisticasPageProps = {
  params: Promise<{ clubId: string }>;
};

export default function AdminEstadisticasPage({ params }: AdminEstadisticasPageProps) {
  const [clubId, setClubId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setClubId(p.clubId));
  }, [params]);

  if (!clubId) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNav clubId={clubId} />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Estadísticas</h1>
        <p className="text-muted-foreground mb-8">
          Sincronización manual y automática de estadísticas
        </p>
        <p className="text-muted-foreground">
          Próximamente: integración automática con Flashscore, LatinBasket y ligas oficiales.
        </p>
      </div>
    </div>
  );
}
