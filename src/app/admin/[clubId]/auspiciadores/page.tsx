"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { createSponsor, updateSponsor, deleteSponsor } from "@/lib/firebase/admin-fns";
import { getSponsors } from "@/lib/firebase/firestore";
import type { Sponsor } from "@/types";
import { toast } from "sonner";
import { useDemoMode } from "@/lib/demo-mode";

const tierColors: Record<string, string> = {
  gold: "bg-yellow-100 text-yellow-700",
  silver: "bg-gray-100 text-gray-600",
  bronze: "bg-orange-100 text-orange-700",
};

type AdminAuspiciadoresPageProps = {
  params: Promise<{ clubId: string }>;
};

export default function AdminAuspiciadoresPage({ params }: AdminAuspiciadoresPageProps) {
  const [clubId, setClubId] = useState<string | null>(null);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [form, setForm] = useState({ name: "", logo: "", website: "", tier: "bronze" as Sponsor["tier"], description: "" });
  const [loading, setLoading] = useState(false);
  const { isDemo, guard } = useDemoMode(clubId ?? "");

  useEffect(() => {
    params.then((p) => {
      setClubId(p.clubId);
      loadSponsors(p.clubId);
    });
  }, [params]);

  const loadSponsors = async (id: string) => {
    const data = await getSponsors(id);
    setSponsors(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    if (!clubId) return;
    setLoading(true);
    try {
      if (editingSponsor) {
        await updateSponsor(editingSponsor.id, form);
        toast.success("Auspiciador actualizado");
      } else {
        await createSponsor(clubId, form);
        toast.success("Auspiciador creado");
      }
      setDialogOpen(false);
      await loadSponsors(clubId);
    } catch { toast.error("Error al guardar"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (sponsor: Sponsor) => {
    if (!confirm("¿Eliminar auspiciador?")) return;
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    await deleteSponsor(sponsor.id);
    toast.success("Auspiciador eliminado");
    await loadSponsors(clubId!);
  };

  const columns = [
    { key: "name", header: "Nombre", render: (s: Sponsor) => <span className="font-medium">{s.name}</span> },
    {
      key: "tier",
      header: "Categoría",
      render: (s: Sponsor) => <Badge className={tierColors[s.tier]}>{s.tier}</Badge>,
    },
    { key: "website", header: "Sitio Web", render: (s: Sponsor) => s.website ? <a href={s.website} target="_blank" className="text-primary hover:underline text-sm">{s.website}</a> : "—" },
    { key: "impressions", header: "Impresiones", render: (s: Sponsor) => s.impressions.toLocaleString() },
    { key: "clicks", header: "Clics", render: (s: Sponsor) => s.clicks.toLocaleString() },
    { key: "ctr", header: "CTR", render: (s: Sponsor) => `${s.ctr.toFixed(1)}%` },
  ];

  if (!clubId) return <div className="flex flex-col min-h-screen"><AdminNav clubId="" /><div className="container mx-auto px-4 py-12"><p className="text-muted-foreground">Cargando...</p></div></div>;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNav clubId={clubId} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Auspiciadores</h1>
          <Button onClick={() => { setEditingSponsor(null); setForm({ name: "", logo: "", website: "", tier: "bronze", description: "" }); setDialogOpen(true); }} disabled={isDemo}>+ Agregar Auspiciador</Button>
        </div>
        <DataTable columns={columns} data={sponsors} keyExtractor={(s) => s.id} onEdit={isDemo ? undefined : (s) => { setEditingSponsor(s); setForm({ name: s.name, logo: s.logo, website: s.website || "", tier: s.tier, description: s.description || "" }); setDialogOpen(true); }} onDelete={isDemo ? undefined : handleDelete} />

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingSponsor ? "Editar Auspiciador" : "Nuevo Auspiciador"}</DialogTitle>
              <DialogDescription>Completa los datos del auspiciador</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>URL del Logo</Label>
                  <Input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>URL del Sitio Web</Label>
                  <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select value={form.tier} onValueChange={(v) => setForm({ ...form, tier: (v ?? "bronze") as Sponsor["tier"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gold">🥇 Gold</SelectItem>
                    <SelectItem value="silver">🥈 Silver</SelectItem>
                    <SelectItem value="bronze">🥉 Bronze</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <textarea className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={loading}>{loading ? "Guardando..." : "Guardar"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
