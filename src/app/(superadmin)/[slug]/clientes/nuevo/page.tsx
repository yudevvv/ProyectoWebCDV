"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClub } from "@/lib/firebase/admin-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export default function NuevoClubPage() {
  const router = useRouter();
  const params = useParams();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) return;
    setSaving(true);
    try {
      await createClub({
        name: form.name,
        slug: form.slug,
        ownerId: "",
        logo: "",
        banner: "",
        description: form.description,
        city: "",
        region: "",
        email: "",
        phone: "",
        whatsapp: "",
        instagram: "",
        facebook: "",
        website: "",
        foundationDate: null as unknown as import("firebase/firestore").Timestamp,
        published: false,
      });
      toast.success("Club creado exitosamente");
      router.push(`/${params?.slug}/clientes`);
    } catch {
      toast.error("Error al crear club");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <p className="text-[10px] font-mono text-slate-400 mb-1">$ ./clubes --create</p>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        <span className="text-emerald-500">&gt;</span> Nuevo Club
      </h1>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Crear Club</CardTitle>
          <CardDescription>
            Crea un nuevo club en la plataforma. Luego asigna un owner y configura los detalles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre del Club</Label>
              <Input
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (!form.slug || form.slug === form.name.toLowerCase().replace(/[^a-z0-9-]/g, "-")) {
                    setForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"),
                    }));
                  }
                }}
                placeholder="Club Deportivo Ejemplo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Slug (URL)</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
                placeholder="club-ejemplo"
                required
              />
              <p className="text-[10px] font-mono text-slate-400">
                El club sera visible en /clubes/{form.slug || "..."}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Descripcion</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Breve descripcion del club"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving || !form.name || !form.slug}>
                {saving ? "Creando..." : "Crear Club"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
