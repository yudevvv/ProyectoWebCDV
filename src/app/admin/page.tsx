"use client";

import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [clubSlug, setClubSlug] = useState("");

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
            <Button
              className="w-full"
              onClick={() => router.push("/login")}
            >
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
            <span className="text-sm text-muted-foreground">
              {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
        <p className="text-muted-foreground mb-8">
          Selecciona un club para administrar
        </p>

        <div className="flex gap-2 mb-8">
          <input
            className="flex h-9 w-full max-w-sm rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm"
            placeholder="Slug del club (ej: valdivia-basquet)"
            value={clubSlug}
            onChange={(e) => setClubSlug(e.target.value)}
          />
          <Button
            onClick={() => {
              if (clubSlug.trim()) {
                router.push(`/admin/${clubSlug.trim()}`);
              }
            }}
            disabled={!clubSlug.trim()}
          >
            Ir al Panel
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"></div>
      </main>
    </div>
  );
}
