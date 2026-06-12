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
import { useClub } from "@/hooks/useFirestore";
import type { Sponsor, ContributionType } from "@/types";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";
import { useDemoMode } from "@/lib/demo-mode";
import { FileDown } from "lucide-react";

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

function dateToTimestamp(dateStr: string) {
  if (!dateStr) return undefined;
  return Timestamp.fromDate(new Date(dateStr));
}

function timestampToDateStr(ts: Timestamp | undefined | null) {
  if (!ts) return "";
  return new Date(ts.seconds * 1000).toISOString().split("T")[0];
}

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
  startDate: string;
  endDate: string;
};

const defaultForm: SponsorFormData = {
  name: "", logo: "", website: "", tier: "bronze", description: "",
  contributionType: "monetario", contributionAmount: 0, contributionCurrency: "CLP",
  complianceStatus: "pendiente", complianceNotes: "",
  startDate: "", endDate: "",
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
  const { isDemo } = useDemoMode(clubId ?? "");
  const { data: club } = useClub(clubId ?? "");

  const loadSponsors = async (id: string) => {
    const data = await getSponsors(id);
    setSponsors(data);
  };

  useEffect(() => {
    params.then((p) => {
      setClubId(p.clubId);
      loadSponsors(p.clubId);
    });
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    if (!clubId) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        startDate: dateToTimestamp(form.startDate),
        endDate: form.endDate ? dateToTimestamp(form.endDate) : undefined,
      };
      if (editingSponsor) {
        await updateSponsor(editingSponsor.id, payload);
        toast.success("Auspiciador actualizado");
      } else {
        await createSponsor(clubId, payload);
        toast.success("Auspiciador creado");
      }
      setDialogOpen(false);
      await loadSponsors(clubId);
    } catch (e) {
      console.error(e);
      toast.error("Error al guardar");
    }
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

  const downloadReport = async () => {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    if (club?.logo) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = club.logo;
      await new Promise((resolve) => { img.onload = resolve; });
      doc.addImage(img, "PNG", 80, 10, 50, 20);
    }
    doc.setFontSize(18);
    doc.text("Informe de Auspiciadores", 105, 45, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Club: ${club?.name ?? ""}`, 105, 55, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleDateString("es-CL")}`, 105, 62, { align: "center" });
    doc.text(`Total auspiciadores: ${sponsors.length}`, 105, 69, { align: "center" });
    doc.text(`Aporte total monetario: $${totalContributions.toLocaleString("es-CL")}`, 105, 76, { align: "center" });

    let y = 92;
    doc.setFontSize(8);
    doc.text("Nombre", 12, y);
    doc.text("Categoria", 52, y);
    doc.text("Aporte", 72, y);
    doc.text("Inicio", 100, y);
    doc.text("Fin", 122, y);
    doc.text("Cumplimiento", 142, y);
    y += 5;
    doc.setDrawColor(200);
    doc.line(12, y - 1, 198, y - 1);

    for (const s of sponsors) {
      if (y > 275) { doc.addPage(); y = 20; }
      doc.text(s.name.substring(0, 20), 12, y);
      doc.text(s.tier, 52, y);
      if (s.contributionType === "monetario") {
        doc.text(`$${(s.contributionAmount || 0).toLocaleString("es-CL")}`, 72, y);
      } else {
        doc.text(s.contributionType, 72, y);
      }
      doc.text(s.startDate ? new Date(s.startDate.seconds * 1000).toLocaleDateString("es-CL") : "—", 100, y);
      doc.text(s.endDate ? new Date(s.endDate.seconds * 1000).toLocaleDateString("es-CL") : "—", 122, y);
      doc.text(s.complianceStatus === "cumpliendo" ? "Cumpliendo" : s.complianceStatus === "incumplido" ? "Incumplido" : "Pendiente", 142, y);
      y += 5;
    }
    doc.save(`auspiciadores-${club?.slug || clubId}.pdf`);
  };

  function computeStatus(sp: Sponsor): Sponsor["complianceStatus"] {
    if (sp.complianceStatus === "incumplido") return "incumplido";
    if (!sp.startDate) return sp.complianceStatus || "pendiente";
    const now = new Date();
    const start = new Date(sp.startDate.seconds * 1000);
    if (now < start) return "pendiente";
    if (sp.endDate) {
      const end = new Date(sp.endDate.seconds * 1000);
      if (now > end) {
        return sp.complianceStatus === "cumpliendo" ? "cumpliendo" : "incumplido";
      }
    }
    if (sp.complianceStatus === "pendiente") return "cumpliendo";
    return sp.complianceStatus;
  }

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
      key: "plazo",
      header: "Plazo",
      render: (s: Sponsor) => {
        const start = s.startDate ? new Date(s.startDate.seconds * 1000).toLocaleDateString("es-CL") : "—";
        const end = s.endDate ? new Date(s.endDate.seconds * 1000).toLocaleDateString("es-CL") : "∞";
        return <span className="text-xs text-muted-foreground">{start} → {end}</span>;
      },
    },
    {
      key: "compliance",
      header: "Cumplimiento",
      render: (s: Sponsor) => {
        const status = computeStatus(s);
        return (
          <Badge className={complianceColors[status]}>
            {status === "cumpliendo" ? "Cumpliendo" : status === "incumplido" ? "Incumplido" : "Pendiente"}
          </Badge>
        );
      },
    },
    { key: "website", header: "Sitio", render: (s: Sponsor) => s.website ? <a href={s.website} target="_blank" className="text-primary hover:underline text-sm">{s.website}</a> : "—" },
  ];

  if (!clubId) return <div className="flex flex-col min-h-screen"><AdminNav clubId="" /><div className="container mx-auto px-4 py-12"><p className="text-muted-foreground">Cargando...</p></div></div>;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNav clubId={clubId} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-cyan-600">Auspiciadores</h1>
            <p className="text-muted-foreground text-sm">
              {sponsors.filter((s) => s.active).length} activos &middot; Aporte total: ${totalContributions.toLocaleString("es-CL")}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadReport} disabled={sponsors.length === 0}>
              <FileDown className="h-4 w-4 mr-1" /> Informe
            </Button>
            <Button
              onClick={() => { setEditingSponsor(null); setForm(defaultForm); setDialogOpen(true); }}
              disabled={isDemo}
              className="font-semibold shadow-sm"
            >
              + Agregar Auspiciador
            </Button>
          </div>
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
              startDate: timestampToDateStr(s.startDate),
              endDate: timestampToDateStr(s.endDate),
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
                  <Label>Fecha de inicio (plazo)</Label>
                  <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Fecha de término</Label>
                  <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                </div>
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
