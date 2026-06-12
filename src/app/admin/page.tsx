"use client";

import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getClubsByUser } from "@/lib/firebase/firestore";
import { createUserDocument } from "@/lib/firebase/admin-fns";
import { getUserDocument } from "@/lib/firebase/firestore";
import type { Club } from "@/types";
import Link from "next/link";
import Image from "next/image";

export default function AdminPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const existing = await getUserDocument(user.uid);
        if (!existing) {
          await createUserDocument(user.uid, {
            email: user.email ?? "",
            displayName: user.displayName ?? user.email?.split("@")[0] ?? "",
          });
        }
        const userClubs = await getClubsByUser(user.uid);
        setClubs(userClubs);
      } catch {
        // silent
      } finally {
        setFetching(false);
      }
    })();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle>Acceso Restringido</CardTitle>
            <CardDescription>
              Debes iniciar sesión para acceder al panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => router.push("/login")}>
              Iniciar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <span className="font-bold">TOALESCO Admin</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Panel de Administracion</h1>
        <p className="text-muted-foreground mb-8">
          Selecciona un club para administrar
        </p>

        {fetching ? (
          <p className="text-muted-foreground">Cargando clubes...</p>
        ) : clubs.length === 0 ? (
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Sin clubes asignados</CardTitle>
              <CardDescription>
                No tienes clubes asignados todavia. Contacta al administrador para que te otorgue acceso.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club) => (
              <Link key={club.id} href={`/admin/${club.slug}`}>
                <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                  <CardHeader className="flex flex-row items-center gap-4 pb-3">
                    {club.logo ? (
                      <Image
                        src={club.logo}
                        alt={club.name}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground">
                        {club.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-base">{club.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{club.slug}</p>
                    </div>
                  </CardHeader>
                  {club.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {club.description}
                      </p>
                    </CardContent>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
