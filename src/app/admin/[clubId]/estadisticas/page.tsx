"use client";

import { AdminNav } from "@/components/admin/AdminNav";
import { useClub } from "@/hooks/useFirestore";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AdminEstadisticasPageProps = {
  params: Promise<{ clubId: string }>;
};

export default function AdminEstadisticasPage({ params }: AdminEstadisticasPageProps) {
  const clubId = params.then((p) => p.clubId);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNav clubId={clubId as unknown as string} />
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
