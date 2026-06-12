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
import type { Sponsor, ContributionType } from "@/types";
import { toast } from "sonner";
import { useDemoMode } from "@/lib/demo-mode";

const tierColors: Record<string, string> = {
  gold: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  silver: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  bronze: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
};

const complianceColors: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  cumpliendo: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  incumplido: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

type SponsorFormData = {
  name: string;
  logo: string;
  website: string;
  tier: Sponsor["tier"];
  description: string;
  contributionType: ContributionType;
  contributionAmount: number;
  contributionCurrency: "CLP" | "USD";
  complianceStatus: Sponsor["complianceStatus"];
  complianceNotes: string;
};

const defaultForm: SponsorFormData = {
  name: "", logo: "", website: "", tier: "bronze", description: "",
  contributionType: "monetario", contributionAmount: 0, contributionCurrency: "CLP",
  complianceStatus: "pendiente", complianceNotes: "",
};

type AdminAuspiciadoresPageProps = {
  params: Promise<{ clubId: string }>;
};

export default function AdminAuspiciadoresPage({ params }: AdminAuspiciadoresPageProps) {
  const [clubId, setClubId] = useState<string | null>(null);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [form, setForm] = useState<SponsorFormData>(defaultForm);
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

  const totalContributions = sponsors
    .filter((s) => s.active && s.contributionType === "monetario")
    .reduce((sum, s) => sum + (s.contributionAmount || 0), 0);

  const columns = [
    { key: "name", header: "Nombre", render: (s: Sponsor) => <span className="font-medium">{s.name}</span> },
    {
      key: "tier",
      header: "Categoría",
      render: (s: Sponsor) => <Badge className={tierColors[s.tier]}>{s.tier}</Badge>,
    },
    {
      key: "contribution",
      header: "Aporte",
      render: (s: Sponsor) => {
        if (s.contributionType === "monetario") {
          return `$${(s.contributionAmount || 0).toLocaleString("es-CL")} ${s.contributionCurrency || "CLP"}`;
        }
        return s.contributionType === "servicio" ? "Servicio" : "Producto";
      },
    },
    {
      key: "compliance",
      header: "Cumplimiento",
      render: (s: Sponsor) => (
        <Badge className={complianceColors[s.complianceStatus || "pendiente"]}>
          {s.complianceStatus === "cumpliendo" ? "Cumpliendo" : s.complianceStatus === "incumplido" ? "Incumplido" : "Pendiente"}
        </Badge>
      ),
    },
    { key: "website", header: "Sitio", render: (s: Sponsor) => s.website ? <a href={s.website} target="_blank" className="text-primary hover:underline text-sm">{s.website}</a> : "—" },
    { key: "impressions", header: "Impresiones", render: (s: Sponsor) => s.impressions.toLocaleString() },
  ];

  if (!clubId) return <div className="flex flex-col min-h-screen"><AdminNav clubId="" /><div className="container mx-auto px-4 py-12"><p className="text-muted-foreground">Cargando...</p></div></div>;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNav clubId={clubId} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "var(--club-primary, #0891b2)" }}>Auspiciadores</h1>
            <p className="text-muted-foreground text-sm">
              {sponsors.filter((s) => s.active).length} activos &middot; Aporte total: ${totalContributions.toLocaleString("es-CL")}
            </p>
          </div>
          <Button
            onClick={() => { setEditingSponsor(null); setForm(defaultForm); setDialogOpen(true); }}
            disabled={isDemo}
            className="font-semibold shadow-sm"
          >
            + Agregar Auspiciador
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={sponsors}
          keyExtractor={(s) => s.id}
          onEdit={isDemo ? undefined : (s) => {
            setEditingSponsor(s);
            setForm({
              name: s.name, logo: s.logo, website: s.website || "", tier: s.tier,
              description: s.description || "",
              contributionType: s.contributionType || "monetario",
              contributionAmount: s.contributionAmount || 0,
              contributionCurrency: s.contributionCurrency || "CLP",
              complianceStatus: s.complianceStatus || "pendiente",
              complianceNotes: s.complianceNotes || "",
            });
            setDialogOpen(true);
          }}
          onDelete={isDemo ? undefined : handleDelete}
        />

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
                  <Label>Sitio Web</Label>
                  <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                  <Label>Tipo de aporte</Label>
                  <Select value={form.contributionType} onValueChange={(v) => setForm({ ...form, contributionType: (v ?? "monetario") as ContributionType })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monetario">💰 Monetario</SelectItem>
                      <SelectItem value="servicio">🔧 Servicio</SelectItem>
                      <SelectItem value="producto">📦 Producto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {form.contributionType === "monetario" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Monto</Label>
                    <Input type="number" value={form.contributionAmount || ""} onChange={(e) => setForm({ ...form, contributionAmount: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Moneda</Label>
                    <Select value={form.contributionCurrency} onValueChange={(v) => setForm({ ...form, contributionCurrency: (v ?? "CLP") as "CLP" | "USD" })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CLP">CLP</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label>Descripción</Label>
                <textarea className="flex min-h-[60px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Estado de cumplimiento</Label>
                  <Select value={form.complianceStatus} onValueChange={(v) => setForm({ ...form, complianceStatus: (v ?? "pendiente") as Sponsor["complianceStatus"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="cumpliendo">Cumpliendo</SelectItem>
                      <SelectItem value="incumplido">Incumplido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notas de cumplimiento</Label>
                  <Input value={form.complianceNotes} onChange={(e) => setForm({ ...form, complianceNotes: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={loading} className="font-semibold">{loading ? "Guardando..." : "Guardar"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
