"use client";

import { useEffect, useState, useCallback, use } from "react";
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
import { FileDown, Plus, FlaskConical, ShieldAlert } from "lucide-react";

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
  const [y, m, d] = dateStr.split("-").map(Number);
  return Timestamp.fromDate(new Date(y, m - 1, d));
}

function timestampToDateStr(ts: Timestamp | undefined | null) {
  if (!ts) return "";
  const d = new Date(ts.seconds * 1000);
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${da}`;
}

function formatDate(ts: Timestamp | undefined | null) {
  if (!ts) return "—";
  return new Date(ts.seconds * 1000).toLocaleDateString("es-CL");
}

function formatCurrency(n: number, currency = "CLP") {
  return `$${n.toLocaleString(currency === "CLP" ? "es-CL" : "en-US")} ${currency}`;
}

function cleanPayload<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
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
  incumplidoReason: string;
  startDate: string;
  endDate: string;
};

const defaultForm: SponsorFormData = {
  name: "", logo: "", website: "", tier: "bronze", description: "",
  contributionType: "monetario", contributionAmount: 0, contributionCurrency: "CLP",
  complianceStatus: "pendiente", complianceNotes: "", incumplidoReason: "",
  startDate: "", endDate: "",
};

type AdminAuspiciadoresPageProps = {
  params: Promise<{ clubId: string }>;
};

export default function AdminAuspiciadoresPage({ params }: AdminAuspiciadoresPageProps) {
  const { clubId } = use(params);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [form, setForm] = useState<SponsorFormData>(defaultForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof SponsorFormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const { isDemo } = useDemoMode(clubId);
  const { data: club } = useClub(clubId);

  const refreshSponsors = useCallback(async (id: string) => {
    const data = await getSponsors(id);
    setSponsors(data);
  }, []);

  useEffect(() => {
    getSponsors(clubId).then((data) => {
      setSponsors(data);
      setLoading(false);
    });
  }, [clubId]);

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof SponsorFormData, string>> = {};
    if (!form.name.trim()) errors.name = "Nombre requerido";
    if (form.complianceStatus === "incumplido" && !form.incumplidoReason.trim())
      errors.incumplidoReason = "Debes indicar el motivo del incumplimiento";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    if (!validateForm()) return;

    const payload = cleanPayload({
      name: form.name,
      logo: form.logo || undefined,
      website: form.website || undefined,
      tier: form.tier,
      description: form.description || undefined,
      contributionType: form.contributionType,
      contributionAmount: form.contributionType === "monetario" ? form.contributionAmount : 0,
      contributionCurrency: form.contributionType === "monetario" ? form.contributionCurrency : undefined,
      complianceStatus: form.complianceStatus,
      complianceNotes: form.complianceNotes || undefined,
      incumplidoReason: form.complianceStatus === "incumplido" ? form.incumplidoReason : undefined,
      startDate: dateToTimestamp(form.startDate),
      endDate: dateToTimestamp(form.endDate),
    });

    setSaving(true);
    try {
      if (editingSponsor) {
        await updateSponsor(editingSponsor.id, payload as Partial<Sponsor>);
        toast.success("Auspiciador actualizado");
      } else {
        await createSponsor(clubId, payload as Parameters<typeof createSponsor>[1]);
        toast.success("Auspiciador creado");
      }
      setDialogOpen(false);
      setEditingSponsor(null);
      setForm(defaultForm);
      setFormErrors({});
      await refreshSponsors(clubId);
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : "Error desconocido";
      toast.error(`Error al guardar: ${msg}`);
    } finally { setSaving(false); }
  };

  const handleDelete = async (sponsor: Sponsor) => {
    if (!confirm("¿Eliminar auspiciador?")) return;
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    try {
      await deleteSponsor(sponsor.id);
      toast.success("Auspiciador eliminado");
      await refreshSponsors(clubId);
    } catch (e) {
      console.error(e);
      toast.error("Error al eliminar");
    }
  };

  const totalContributions = sponsors
    .filter((s) => s.active && s.contributionType === "monetario")
    .reduce((sum, s) => sum + (s.contributionAmount || 0), 0);

  const today = new Date();

  const computeStatus = (sp: Sponsor): Sponsor["complianceStatus"] => {
    if (sp.complianceStatus === "incumplido") return "incumplido";
    if (!sp.startDate) return sp.complianceStatus || "pendiente";
    const start = new Date(sp.startDate.seconds * 1000);
    if (today < start) return "pendiente";
    if (sp.endDate) {
      const end = new Date(sp.endDate.seconds * 1000);
      if (today > end) return sp.complianceStatus === "cumpliendo" ? "cumpliendo" : "incumplido";
    }
    if (sp.complianceStatus === "pendiente") return "cumpliendo";
    return sp.complianceStatus;
  };

  const downloadReport = async () => {
    if (!club) return;
    const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
      import("jspdf"),
      import("jspdf-autotable"),
    ]);
    const doc = new jsPDF();
    let y = 20;

    const addFooter = () => {
      const pages = doc.getNumberOfPages();
      for (let i = 1; i <= pages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`${club.name} · ${today.toLocaleDateString("es-CL")} · Página ${i} de ${pages}`, 105, 290, { align: "center" });
      }
    };

    if (club.logo) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = club.logo;
      await new Promise((resolve) => { img.onload = resolve; });
      doc.addImage(img, "PNG", 83, y, 44, 18);
      y += 24;
    } else { y += 4; }

    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text("Informe de Auspiciadores", 105, y, { align: "center" });
    y += 8;
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(club.name, 105, y, { align: "center" });
    y += 6;
    doc.setFontSize(9);
    doc.text(`Generado el ${today.toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" })}`, 105, y, { align: "center" });
    y += 6;
    doc.setDrawColor(0, 150, 136);
    doc.setLineWidth(0.5);
    doc.line(14, y, 196, y);
    y += 8;

    const summaryLeft = 14;
    const summaryRight = 196;
    const summaryColW = (summaryRight - summaryLeft) / 4;
    const sVals = [`${sponsors.length}`, `${sponsors.filter((s) => s.active).length}`, formatCurrency(totalContributions), `${sponsors.filter((s) => computeStatus(s) === "incumplido").length}`];
    const sLabels = ["Total", "Activos", "Aporte total", "Incumplidos"];
    doc.setFontSize(16);
    doc.setTextColor(0, 150, 136);
    sVals.forEach((v, i) => doc.text(v, summaryLeft + summaryColW * i + summaryColW / 2, y, { align: "center" }));
    y += 7;
    doc.setFontSize(7);
    doc.setTextColor(120);
    sLabels.forEach((l, i) => doc.text(l, summaryLeft + summaryColW * i + summaryColW / 2, y, { align: "center" }));
    y += 8;
    doc.setDrawColor(200);
    doc.setLineWidth(0.3);
    doc.line(14, y, 196, y);
    y += 6;

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("Listado de Auspiciadores", 14, y);
    y += 5;

    const rows = sponsors.map((s) => [
      s.name, s.tier,
      s.contributionType === "monetario" ? `${formatCurrency(s.contributionAmount || 0, s.contributionCurrency || "CLP")}` : s.contributionType === "servicio" ? "Servicio" : "Producto",
      formatDate(s.startDate), formatDate(s.endDate),
      computeStatus(s) === "cumpliendo" ? "Cumpliendo" : computeStatus(s) === "incumplido" ? "Incumplido" : "Pendiente",
    ]);

    autoTable(doc, {
      head: [["Nombre", "Categoría", "Aporte", "Inicio", "Término", "Estado"]],
      body: rows,
      startY: y,
      margin: { left: 14, right: 14 },
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [0, 150, 136], textColor: 255, fontStyle: "bold", fontSize: 8 },
      columnStyles: { 0: { cellWidth: 44 }, 1: { cellWidth: 18 }, 2: { cellWidth: 30, halign: "right" }, 3: { cellWidth: 22, halign: "center" }, 4: { cellWidth: 22, halign: "center" }, 5: { cellWidth: 22, halign: "center" } },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    addFooter();
    doc.save(`auspiciadores-${club.slug}.pdf`);
  };

  const columns = [
    { key: "name", header: "Nombre", render: (s: Sponsor) => <span className="font-medium">{s.name}</span> },
    {
      key: "tier", header: "Categoría",
      render: (s: Sponsor) => <Badge className={tierColors[s.tier]}>{s.tier === "gold" ? "Gold" : s.tier === "silver" ? "Silver" : "Bronze"}</Badge>,
    },
    {
      key: "contribution", header: "Aporte",
      render: (s: Sponsor) => {
        if (s.contributionType === "monetario") return <span className="font-mono text-sm">{formatCurrency(s.contributionAmount || 0, s.contributionCurrency || "CLP")}</span>;
        return <span className="text-sm">{s.contributionType === "servicio" ? "Servicio" : "Producto"}</span>;
      },
    },
    {
      key: "period", header: "Período",
      render: (s: Sponsor) => (
        <span className="text-xs text-muted-foreground">{formatDate(s.startDate)} → {s.endDate ? formatDate(s.endDate) : "∞"}</span>
      ),
    },
    {
      key: "compliance", header: "Cumplimiento",
      render: (s: Sponsor) => {
        const status = computeStatus(s);
        const isIncumplido = status === "incumplido" || s.complianceStatus === "incumplido";
        return (
          <div className="flex items-center gap-1.5">
            <Badge className={complianceColors[status]}>
              {status === "cumpliendo" ? "Cumpliendo" : status === "incumplido" ? "Incumplido" : "Pendiente"}
            </Badge>
            {isIncumplido && s.incumplidoReason && (
              <span className="text-xs text-muted-foreground" title={s.incumplidoReason}>
                <ShieldAlert className="h-3 w-3 text-red-400" />
              </span>
            )}
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminNav clubId={clubId} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="h-4 w-64 bg-muted rounded" />
            <div className="h-64 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNav clubId={clubId} />
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">Auspiciadores</h1>
            <p className="text-muted-foreground text-sm">
              {sponsors.filter((s) => s.active).length} activos &middot; Aporte total: {formatCurrency(totalContributions)}
            </p>
          </div>
          <div className="flex gap-2">
            {process.env.NODE_ENV === "development" && (
              <Button variant="outline" size="sm" onClick={async () => {
                const names = ["Deportes Martínez", "SportFit Chile", "BasketPro Store", "Gatorade Chile", "Nike Chile", "Adidas Chile", "Spalding Latinoamérica", "Powerade Chile", "Wilson Sports", "Molec Sports", "Clínica Deportiva", "Radio Sport Chile", "Cerveza Andes", "Transportes Rápidos", "Hotel Deportivo", "Agencia BasketTotal", "Agua Vital", "Seguros Deportivos", "Gimnasio FIT24", "Distribuidora Deportiva"];
                const logos = ["", "", "https://logo.clearbit.com/basketpro.store", "", "https://logo.clearbit.com/nike.com", "https://logo.clearbit.com/adidas.com", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
                const tiers: Sponsor["tier"][] = ["gold", "gold", "gold", "silver", "gold", "gold", "silver", "silver", "silver", "bronze", "bronze", "bronze", "silver", "bronze", "bronze", "gold", "bronze", "silver", "bronze", "bronze"];
                const cTypes: ContributionType[] = ["monetario", "monetario", "producto", "monetario", "producto", "producto", "producto", "monetario", "producto", "servicio", "servicio", "servicio", "monetario", "servicio", "servicio", "servicio", "producto", "servicio", "servicio", "producto"];
                const amounts = [5000000, 3000000, 0, 8000000, 0, 0, 0, 2000000, 0, 0, 0, 0, 1500000, 0, 0, 0, 0, 0, 0, 0];
                const currencies = ["CLP", "CLP", "CLP", "CLP", "CLP", "CLP", "CLP", "USD", "CLP", "CLP", "CLP", "CLP", "CLP", "CLP", "CLP", "CLP", "CLP", "CLP", "CLP", "CLP"];
                const cStatuses: Sponsor["complianceStatus"][] = ["cumpliendo", "cumpliendo", "cumpliendo", "cumpliendo", "cumpliendo", "cumpliendo", "cumpliendo", "pendiente", "cumpliendo", "incumplido", "cumpliendo", "cumpliendo", "cumpliendo", "cumpliendo", "pendiente", "cumpliendo", "cumpliendo", "pendiente", "cumpliendo", "incumplido"];
                const pendToast = toast.loading("Insertando 20 auspiciadores...");
                for (let i = 0; i < names.length; i++) {
                  const startDate = new Date();
                  startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 4));
                  const endDate = new Date(startDate);
                  endDate.setMonth(endDate.getMonth() + 6 + Math.floor(Math.random() * 6));
                  try {
                    await createSponsor(clubId, {
                      name: names[i], logo: logos[i], website: "",
                      tier: tiers[i], description: `Auspiciador oficial del club`,
                      contributionType: cTypes[i], contributionAmount: amounts[i],
                      contributionCurrency: currencies[i] as "CLP" | "USD",
                      complianceStatus: cStatuses[i],
                      complianceNotes: cStatuses[i] === "incumplido" ? "No ha realizado el aporte comprometido" : "",
                      startDate: Timestamp.fromDate(startDate),
                      endDate: Timestamp.fromDate(endDate),
                    });
                  } catch { /* skip */ }
                }
                toast.dismiss(pendToast);
                toast.success("20 auspiciadores insertados");
                await refreshSponsors(clubId);
              }}>
                <FlaskConical className="h-4 w-4 mr-1" /> Seed 20
              </Button>
            )}
            <Button variant="outline" onClick={downloadReport} disabled={sponsors.length === 0} size="sm">
              <FileDown className="h-4 w-4 mr-1" /> Informe
            </Button>
            <Button onClick={() => { setEditingSponsor(null); setForm(defaultForm); setFormErrors({}); setDialogOpen(true); }} disabled={isDemo} size="sm">
              <Plus className="h-4 w-4 mr-1" /> Auspiciador
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={sponsors}
          keyExtractor={(s) => s.id}
          searchable
          searchPlaceholder="Buscar auspiciador..."
          searchKeys={["name", "tier", "contributionType", "complianceStatus"]}
          pageSize={10}
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
              incumplidoReason: s.incumplidoReason || "",
              startDate: timestampToDateStr(s.startDate),
              endDate: timestampToDateStr(s.endDate),
            });
            setFormErrors({});
            setDialogOpen(true);
          }}
          onDelete={isDemo ? undefined : handleDelete}
        />

        <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) { setEditingSponsor(null); setFormErrors({}); } setDialogOpen(open); }}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingSponsor ? "Editar Auspiciador" : "Nuevo Auspiciador"}</DialogTitle>
              <DialogDescription>Completa los datos del auspiciador</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sp-name">Nombre</Label>
                  <Input id="sp-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sp-tier">Categoría</Label>
                  <Select value={form.tier} onValueChange={(v) => setForm({ ...form, tier: (v ?? "bronze") as Sponsor["tier"] })}>
                    <SelectTrigger id="sp-tier"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="bronze">Bronze</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sp-logo">URL del Logo</Label>
                  <Input id="sp-logo" value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sp-web">Sitio Web</Label>
                  <Input id="sp-web" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sp-desc">Descripción</Label>
                <textarea id="sp-desc" className="flex min-h-[60px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sp-ctype">Tipo de aporte</Label>
                  <Select value={form.contributionType} onValueChange={(v) => setForm({ ...form, contributionType: (v ?? "monetario") as ContributionType })}>
                    <SelectTrigger id="sp-ctype"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monetario">Monetario</SelectItem>
                      <SelectItem value="servicio">Servicio</SelectItem>
                      <SelectItem value="producto">Producto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.contributionType === "monetario" ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="sp-amount">Monto</Label>
                      <Input id="sp-amount" type="number" value={form.contributionAmount || ""} onChange={(e) => setForm({ ...form, contributionAmount: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sp-currency">Moneda</Label>
                      <Select value={form.contributionCurrency} onValueChange={(v) => setForm({ ...form, contributionCurrency: (v ?? "CLP") as "CLP" | "USD" })}>
                        <SelectTrigger id="sp-currency"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CLP">CLP</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Detalle</Label>
                    <p className="text-xs text-muted-foreground pt-2">Aporte en {form.contributionType === "servicio" ? "servicios" : "productos"}</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sp-start">Fecha de inicio</Label>
                  <Input id="sp-start" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sp-end">Fecha de término</Label>
                  <Input id="sp-end" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sp-status">Estado de cumplimiento</Label>
                  <Select value={form.complianceStatus} onValueChange={(v) => {
                    const status = (v ?? "pendiente") as Sponsor["complianceStatus"];
                    setForm({ ...form, complianceStatus: status, incumplidoReason: status !== "incumplido" ? "" : form.incumplidoReason });
                  }}>
                    <SelectTrigger id="sp-status"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="cumpliendo">Cumpliendo</SelectItem>
                      <SelectItem value="incumplido">Incumplido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sp-notes">Notas</Label>
                  <Input id="sp-notes" value={form.complianceNotes} onChange={(e) => setForm({ ...form, complianceNotes: e.target.value })} />
                </div>
              </div>
              {form.complianceStatus === "incumplido" && (
                <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50 p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
                    <ShieldAlert className="h-4 w-4" />
                    <span className="font-medium">Motivo del incumplimiento</span>
                  </div>
                  <textarea
                    id="sp-reason"
                    className="flex min-h-[60px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    value={form.incumplidoReason}
                    onChange={(e) => setForm({ ...form, incumplidoReason: e.target.value })}
                    placeholder="Explica por qué el auspiciador está incumpliendo..."
                    required
                  />
                  {formErrors.incumplidoReason && <p className="text-xs text-red-500">{formErrors.incumplidoReason}</p>}
                </div>
              )}
              <div className="flex justify-end gap-3 pt-2 sticky bottom-0 bg-background py-2 border-t">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancelar</Button>
                <Button type="submit" disabled={saving}>{saving ? "Guardando..." : editingSponsor ? "Actualizar" : "Guardar"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
