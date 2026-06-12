"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createMember, deleteMember, updateMember } from "@/lib/firebase/admin-fns";
import { getMembers } from "@/lib/firebase/firestore";
import { useClub } from "@/hooks/useFirestore";
import type { Member } from "@/types";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";
import { useDemoMode } from "@/lib/demo-mode";
import { FileDown, Plus, DollarSign } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  approved: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

function dateToTimestamp(dateStr: string) {
  if (!dateStr) return undefined;
  return Timestamp.fromDate(new Date(dateStr));
}

function timestampToDateStr(ts: Timestamp | undefined | null) {
  if (!ts) return "";
  return new Date(ts.seconds * 1000).toISOString().split("T")[0];
}

function formatDate(ts: Timestamp | undefined | null) {
  if (!ts) return "—";
  return new Date(ts.seconds * 1000).toLocaleDateString("es-CL");
}

type MemberFormData = {
  name: string;
  rut: string;
  email: string;
  phone: string;
  membershipType: Member["membershipType"];
  monthlyAmount: number;
  startDate: string;
  endDate: string;
};

const defaultForm: MemberFormData = {
  name: "", rut: "", email: "", phone: "", membershipType: "basic", monthlyAmount: 0,
  startDate: "", endDate: "",
};

type AdminSociosPageProps = {
  params: Promise<{ clubId: string }>;
};

export default function AdminSociosPage({ params }: AdminSociosPageProps) {
  const [clubId, setClubId] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentMember, setPaymentMember] = useState<Member | null>(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [form, setForm] = useState<MemberFormData>(defaultForm);
  const { isDemo } = useDemoMode(clubId ?? "");
  const { data: club } = useClub(clubId ?? "");

  const loadMembers = async (id: string) => {
    const data = await getMembers(id);
    setMembers(data);
  };

  useEffect(() => {
    params.then((p) => {
      setClubId(p.clubId);
      loadMembers(p.clubId);
    });
  }, [params]);

  const totalMonthly = members.reduce((sum, m) => sum + (m.status === "approved" ? m.monthlyAmount : 0), 0);
  const totalPaid = members.reduce((sum, m) => sum + (m.totalPaid || 0), 0);
  const activeMembers = members.filter((m) => m.status === "approved").length;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubId) return;
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    try {
      const payload = {
        ...form,
        startDate: dateToTimestamp(form.startDate),
        endDate: form.endDate ? dateToTimestamp(form.endDate) : undefined,
      };
      await createMember(clubId, payload);
      toast.success("Socio agregado");
      setDialogOpen(false);
      setForm(defaultForm);
      await loadMembers(clubId);
    } catch { toast.error("Error al guardar"); }
  };

  const handleDelete = async (member: Member) => {
    if (!confirm("¿Eliminar socio?")) return;
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    await deleteMember(member.id);
    toast.success("Socio eliminado");
    await loadMembers(clubId!);
  };

  const handleStatusChange = async (member: Member) => {
    const newStatus = member.status === "approved" ? "inactive" : "approved";
    await updateMember(member.id, { status: newStatus as Member["status"] });
    toast.success(`Estado cambiado a ${newStatus}`);
    await loadMembers(clubId!);
  };

  const handleRegisterPayment = async () => {
    if (!paymentMember || !clubId) return;
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    try {
      await updateMember(paymentMember.id, {
        totalPaid: (paymentMember.totalPaid || 0) + paymentAmount,
        lastPayment: Timestamp.now(),
      });
      toast.success("Pago registrado");
      setPaymentDialogOpen(false);
      setPaymentAmount(0);
      await loadMembers(clubId);
    } catch { toast.error("Error al registrar pago"); }
  };

  const downloadPDF = async () => {
    if (!club) return;
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    if (club.logo) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = club.logo;
      await new Promise((resolve) => { img.onload = resolve; });
      doc.addImage(img, "PNG", 80, 10, 50, 20);
    }
    doc.setFontSize(18);
    doc.text("Reporte de Socios", 105, 42, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Club: ${club.name}`, 105, 50, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleDateString("es-CL")}`, 105, 57, { align: "center" });
    doc.text(`Total socios activos: ${activeMembers}`, 105, 64, { align: "center" });
    doc.text(`Aporte mensual total: $${totalMonthly.toLocaleString("es-CL")}`, 105, 71, { align: "center" });
    doc.text(`Total recaudado: $${totalPaid.toLocaleString("es-CL")}`, 105, 78, { align: "center" });
    doc.text(`Promedio por socio: $${activeMembers > 0 ? Math.round(totalMonthly / activeMembers).toLocaleString("es-CL") : 0}`, 105, 85, { align: "center" });

    let y = 98;
    doc.setFontSize(8);
    doc.text("Nombre", 10, y);
    doc.text("RUT", 48, y);
    doc.text("Tipo", 74, y);
    doc.text("Mensual", 92, y);
    doc.text("Pagado", 112, y);
    doc.text("Inicio", 132, y);
    doc.text("Estado", 155, y);
    y += 5;
    doc.setDrawColor(200);
    doc.line(10, y - 1, 200, y - 1);

    for (const m of members) {
      if (y > 275) { doc.addPage(); y = 20; }
      doc.text(m.name.substring(0, 18), 10, y);
      doc.text(m.rut, 48, y);
      doc.text(m.membershipType, 74, y);
      doc.text(`$${m.monthlyAmount.toLocaleString("es-CL")}`, 92, y);
      doc.text(`$${(m.totalPaid || 0).toLocaleString("es-CL")}`, 112, y);
      doc.text(m.startDate ? formatDate(m.startDate) : "—", 132, y);
      doc.text(m.status === "approved" ? "Activo" : m.status, 155, y);
      y += 5;
    }
    doc.save(`socios-${club.slug}.pdf`);
  };

  const columns = [
    { key: "name", header: "Nombre", render: (m: Member) => <span className="font-medium">{m.name}</span> },
    { key: "rut", header: "RUT", render: (m: Member) => m.rut },
    { key: "email", header: "Email", render: (m: Member) => m.email },
    { key: "monthly", header: "Mensual", render: (m: Member) => `$${m.monthlyAmount.toLocaleString("es-CL")}` },
    { key: "paid", header: "Pagado", render: (m: Member) => `$${(m.totalPaid || 0).toLocaleString("es-CL")}` },
    {
      key: "plazo",
      header: "Plazo",
      render: (m: Member) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(m.startDate)} → {m.endDate ? formatDate(m.endDate) : "∞"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (m: Member) => (
        <button onClick={() => handleStatusChange(m)}>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[m.status]}`}>{m.status === "approved" ? "Activo" : m.status}</span>
        </button>
      ),
    },
  ];

  if (!clubId) return <div className="flex flex-col min-h-screen"><AdminNav clubId="" /><div className="container mx-auto px-4 py-12"><p className="text-muted-foreground">Cargando...</p></div></div>;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNav clubId={clubId} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-cyan-600">Socios</h1>
            <p className="text-muted-foreground text-sm">{members.length} registrados, {activeMembers} activos</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadPDF} disabled={members.length === 0}>
              <FileDown className="h-4 w-4 mr-1" /> Reporte
            </Button>
            <Button onClick={() => { setEditingMember(null); setForm(defaultForm); setDialogOpen(true); }} disabled={isDemo}>
              <Plus className="h-4 w-4 mr-1" /> Agregar Socio
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Aporte mensual total</p>
            <p className="text-2xl font-bold text-cyan-600">${totalMonthly.toLocaleString("es-CL")}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total recaudado</p>
            <p className="text-2xl font-bold text-cyan-600">${totalPaid.toLocaleString("es-CL")}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Socios activos</p>
            <p className="text-2xl font-bold text-cyan-600">{activeMembers}</p>
          </div>
        </div>

        <DataTable
          columns={[...columns, { key: "actions", header: "Pago", render: (m: Member) => (
            <Button size="sm" variant="outline" onClick={() => { setPaymentMember(m); setPaymentAmount(m.monthlyAmount); setPaymentDialogOpen(true); }} disabled={isDemo || m.status !== "approved"}>
              <DollarSign className="h-3 w-3 mr-1" /> Pago
            </Button>
          )}]}
          data={members}
          keyExtractor={(m) => m.id}
          onEdit={isDemo ? undefined : (m) => {
            setEditingMember(m);
            setForm({
              name: m.name, rut: m.rut, email: m.email, phone: m.phone || "",
              membershipType: m.membershipType, monthlyAmount: m.monthlyAmount,
              startDate: timestampToDateStr(m.startDate),
              endDate: timestampToDateStr(m.endDate),
            });
            setDialogOpen(true);
          }}
          onDelete={isDemo ? undefined : handleDelete}
        />

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingMember ? "Editar Socio" : "Nuevo Socio"}</DialogTitle>
              <DialogDescription>Ingresa los datos del socio</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre completo</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>RUT</Label>
                  <Input value={form.rut} onChange={(e) => setForm({ ...form, rut: e.target.value })} required placeholder="12.345.678-9" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de membresía</Label>
                  <Select value={form.membershipType} onValueChange={(v) => setForm({ ...form, membershipType: (v ?? "basic") as Member["membershipType"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Básico</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Aporte mensual (CLP)</Label>
                  <Input type="number" value={form.monthlyAmount || ""} onChange={(e) => setForm({ ...form, monthlyAmount: parseInt(e.target.value) || 0 })} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha de inicio</Label>
                  <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Fecha de término</Label>
                  <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Registrar Pago</DialogTitle>
              <DialogDescription>{paymentMember?.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Monto pagado (CLP)</Label>
                <Input type="number" value={paymentAmount || ""} onChange={(e) => setPaymentAmount(parseInt(e.target.value) || 0)} />
              </div>
              <p className="text-xs text-muted-foreground">
                Cuota mensual: ${paymentMember?.monthlyAmount.toLocaleString("es-CL")}
              </p>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setPaymentDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleRegisterPayment}>Registrar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
