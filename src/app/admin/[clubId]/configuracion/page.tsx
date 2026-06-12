"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClub } from "@/hooks/useFirestore";
import { updateClub, uploadFile, publishClub } from "@/lib/firebase/admin-fns";
import { toast } from "sonner";
import { useDemoMode } from "@/lib/demo-mode";

type AdminConfigPageProps = {
  params: Promise<{ clubId: string }>;
};

export default function AdminConfigPage({ params }: AdminConfigPageProps) {
  const [clubId, setClubId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setClubId(p.clubId));
  }, [params]);

  if (!clubId) return <div className="flex flex-col min-h-screen"><AdminNav clubId="" /><div className="container mx-auto px-4 py-12"><p className="text-muted-foreground">Cargando...</p></div></div>;

  return <AdminConfigForm clubId={clubId} />;
}

function AdminConfigForm({ clubId }: { clubId: string }) {
  const { data: club, refetch } = useClub(clubId);
  const { isDemo, guard } = useDemoMode(clubId);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
    logo: "",
    primaryColor: "#0891b2",
    secondaryColor: "#059669",
    facebookPageId: "",
    facebookAccessToken: "",
    instagramBusinessId: "",
  });

  useEffect(() => {
    if (club) {
      setForm({
        name: club.name ?? "",
        description: club.description ?? "",
        email: club.email ?? "",
        phone: club.phone ?? "",
        whatsapp: club.whatsapp ?? "",
        instagram: club.instagram ?? "",
        facebook: club.facebook ?? "",
        logo: club.logo ?? "",
        primaryColor: club.colors?.primary ?? "#0891b2",
        secondaryColor: club.colors?.secondary ?? "#059669",
        facebookPageId: club.social?.facebookPageId ?? "",
        facebookAccessToken: club.social?.facebookAccessToken ?? "",
        instagramBusinessId: club.social?.instagramBusinessId ?? "",
      });
    }
  }, [club]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !clubId) return;
    setUploading(true);
    try {
      const url = await uploadFile(`clubs/${clubId}/logo-${Date.now()}`, file);
      setForm((prev) => ({ ...prev, logo: url }));
      toast.success("Logo subido");
    } catch {
      toast.error("Error al subir logo");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    if (!club) return;
    setSaving(true);
    try {
      const social: Record<string, string> = {};
      if (form.facebookPageId) social.facebookPageId = form.facebookPageId;
      if (form.facebookAccessToken) social.facebookAccessToken = form.facebookAccessToken;
      if (form.instagramBusinessId) social.instagramBusinessId = form.instagramBusinessId;

      await updateClub(club.id, {
        name: form.name,
        description: form.description,
        email: form.email,
        phone: form.phone,
        whatsapp: form.whatsapp,
        instagram: form.instagram,
        facebook: form.facebook,
        logo: form.logo,
        colors: {
          primary: form.primaryColor,
          secondary: form.secondaryColor,
        },
        social: Object.keys(social).length > 0 ? social : {},
      });
      toast.success("Configuración guardada");
      refetch();
    } catch {
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (!club) return <div className="flex flex-col min-h-screen"><AdminNav clubId={clubId} /><div className="container mx-auto px-4 py-12"><p className="text-muted-foreground">Cargando...</p></div></div>;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNav clubId={clubId} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--club-primary, #0891b2)" }}>Configuración</h1>
        <p className="text-muted-foreground mb-8">
          Personaliza la apariencia y conecta tus redes sociales
        </p>

        <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Información del Club</CardTitle>
              <CardDescription>
                Datos básicos que se muestran en la página pública
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre del Club</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="+56912345678" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logo y Apariencia</CardTitle>
              <CardDescription>
                El logo se muestra en el panel y en la página del club. Los colores personalizan toda la interfaz.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Logo del Club</Label>
                <div className="flex gap-2">
                  <Input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} placeholder="URL del logo" />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={uploading}
                    />
                    <Button type="button" variant="outline" disabled={uploading} className="relative pointer-events-none">
                      {uploading ? "Subiendo..." : "Subir"}
                    </Button>
                  </div>
                </div>
                {form.logo && (
                  <img src={form.logo} alt="Preview" className="w-16 h-16 rounded-full object-cover mt-2" />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Color Primario</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={form.primaryColor}
                      onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer border"
                    />
                    <Input value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Color Secundario</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={form.secondaryColor}
                      onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer border"
                    />
                    <Input value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Vista previa:</span>
                  <span
                    className="px-3 py-1 rounded-full text-white text-xs font-medium"
                    style={{ backgroundColor: form.primaryColor }}
                  >
                    Primario
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-white text-xs font-medium"
                    style={{ backgroundColor: form.secondaryColor }}
                  >
                    Secundario
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Redes Sociales</CardTitle>
              <CardDescription>
                Conecta Facebook e Instagram para importar publicaciones como noticias automáticamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>URL de Instagram</Label>
                <Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="https://instagram.com/tuclub" />
              </div>
              <div className="space-y-2">
                <Label>URL de Facebook</Label>
                <Input value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} placeholder="https://facebook.com/tuclub" />
              </div>
              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-medium mb-2">Integración API (opcional)</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Para sincronizar publicaciones automáticamente, necesitas una App de Facebook y un Token de Acceso. 
                  Sin estos datos, las redes se muestran como enlaces.
                </p>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Facebook Page ID</Label>
                    <Input value={form.facebookPageId} onChange={(e) => setForm({ ...form, facebookPageId: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Facebook Access Token</Label>
                    <Input value={form.facebookAccessToken} onChange={(e) => setForm({ ...form, facebookAccessToken: e.target.value })} type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Instagram Business ID</Label>
                    <Input value={form.instagramBusinessId} onChange={(e) => setForm({ ...form, instagramBusinessId: e.target.value })} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publicar Sitio Web</CardTitle>
              <CardDescription>
                Una vez que tengas todo configurado, publica el sitio para que sea visible al público.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {club.published ? "Sitio publicado" : "Sitio en borrador"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {club.published
                      ? "Tu sitio es visible en /clubes/" + club.slug
                      : "Solo tú puedes verlo desde el panel de administración"}
                  </p>
                </div>
                <Button
                  type="button"
                  variant={club.published ? "outline" : "default"}
                  onClick={async () => {
                    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
                    try {
                      await publishClub(club.id, !club.published);
                      toast.success(club.published ? "Sitio despublicado" : "Sitio publicado exitosamente");
                      refetch();
                    } catch {
                      toast.error("Error al cambiar estado");
                    }
                  }}
                  className={club.published ? "border-orange-300 text-orange-600 hover:bg-orange-50" : "bg-emerald-600 hover:bg-emerald-700"}
                >
                  {club.published ? "Despublicar" : "Publicar Sitio"}
                </Button>
              </div>
              {club.published && club.publishedAt && (
                <p className="text-xs text-muted-foreground mt-3">
                  Publicado el {new Date(club.publishedAt.seconds * 1000).toLocaleDateString("es-CL")}
                </p>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pb-12">
            <Button type="submit" disabled={saving} size="lg">
              {saving ? "Guardando..." : "Guardar Configuración"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
