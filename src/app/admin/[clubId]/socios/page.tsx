"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createMember, createPayment, deleteMember, updateMember } from "@/lib/firebase/admin-fns";
import { getMembers, getPayments } from "@/lib/firebase/firestore";
import { useClub } from "@/hooks/useFirestore";
import type { Member, Payment } from "@/types";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";
import { useDemoMode } from "@/lib/demo-mode";
import { FileDown, Plus, DollarSign, History, AlertTriangle, UserCheck, UserX, Calendar } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  inactive: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const paymentMethodLabels: Record<string, string> = {
  transferencia: "Transferencia",
  efectivo: "Efectivo",
  tarjeta: "Tarjeta",
  otro: "Otro",
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

function formatCurrency(n: number) {
  return `$${n.toLocaleString("es-CL")}`;
}

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

type MemberFormData = {
  name: string;
  rut: string;
  email: string;
  phone: string;
  address: string;
  membershipType: Member["membershipType"];
  monthlyAmount: number;
  startDate: string;
  endDate: string;
  notes: string;
};

const defaultForm: MemberFormData = {
  name: "", rut: "", email: "", phone: "", address: "", membershipType: "basic", monthlyAmount: 0,
  startDate: "", endDate: "", notes: "",
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
  const [paymentMethod, setPaymentMethod] = useState<"transferencia" | "efectivo" | "tarjeta" | "otro">("transferencia");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [form, setForm] = useState<MemberFormData>(defaultForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof MemberFormData, string>>>({});
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [historyMember, setHistoryMember] = useState<Member | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const { isDemo } = useDemoMode(clubId ?? "");
  const { data: club } = useClub(clubId ?? "");

  const loadMembers = useCallback(async (id: string) => {
    const data = await getMembers(id);
    setMembers(data);
  }, []);

  useEffect(() => {
    params.then((p) => {
      setClubId(p.clubId);
      loadMembers(p.clubId);
    });
  }, [params, loadMembers]);

  const today = new Date();

  const expiringMembers = members.filter((m) => {
    if (!m.endDate || m.status !== "approved") return false;
    const end = new Date(m.endDate.seconds * 1000);
    const diff = (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 30;
  });

  const overdueMembers = members.filter((m) => {
    if (!m.endDate || m.status !== "approved") return false;
    const end = new Date(m.endDate.seconds * 1000);
    return end < today;
  });

  const totalMonthly = members.reduce((sum, m) => sum + (m.status === "approved" ? m.monthlyAmount : 0), 0);
  const totalPaid = members.reduce((sum, m) => sum + (m.totalPaid || 0), 0);
  const totalPending = Math.max(0, totalMonthly - (members.reduce((sum, m) => sum + (m.lastPaymentDate ? m.monthlyAmount : 0), 0)));
  const activeMembers = members.filter((m) => m.status === "approved").length;

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof MemberFormData, string>> = {};
    if (!form.name.trim()) errors.name = "Nombre requerido";
    if (!form.rut.trim()) errors.rut = "RUT requerido";
    else if (!/^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}[-][0-9kK]$/.test(form.rut) && !/^[0-9]{7,8}[-][0-9kK]$/.test(form.rut))
      errors.rut = "Formato RUT inválido (ej: 12.345.678-9)";
    if (!form.email.trim()) errors.email = "Email requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Email inválido";
    if (!form.phone.trim()) errors.phone = "Teléfono requerido";
    if (form.monthlyAmount <= 0) errors.monthlyAmount = "Aporte debe ser > 0";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStartDateChange = (val: string) => {
    setForm({ ...form, startDate: val, endDate: val ? timestampToDateStr(Timestamp.fromDate(addMonths(new Date(val), 1))) : "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubId) return;
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    if (!validateForm()) return;

    const payload = {
      name: form.name,
      rut: form.rut,
      email: form.email,
      phone: form.phone,
      membershipType: form.membershipType as Member["membershipType"],
      monthlyAmount: form.monthlyAmount,
      address: form.address,
      notes: form.notes,
      startDate: dateToTimestamp(form.startDate) as Timestamp,
      endDate: form.endDate ? (dateToTimestamp(form.endDate) as Timestamp) : undefined,
    };

    try {
      if (editingMember) {
        await updateMember(editingMember.id, payload);
        toast.success("Socio actualizado");
      } else {
        await createMember(clubId, payload);
        toast.success("Socio agregado");
      }
      setDialogOpen(false);
      setEditingMember(null);
      setForm(defaultForm);
      setFormErrors({});
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
    toast.success(`Estado cambiado a ${newStatus === "approved" ? "Activo" : "Inactivo"}`);
    await loadMembers(clubId!);
  };

  const handleRegisterPayment = async () => {
    if (!paymentMember || !clubId) return;
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    if (paymentAmount <= 0) { toast.error("Ingresa un monto válido"); return; }
    try {
      const now = Timestamp.now();
      await createPayment(paymentMember.id, clubId, {
        amount: paymentAmount,
        paymentMethod,
        notes: paymentNotes,
        periodStart: paymentMember.nextDueDate ? undefined : paymentMember.startDate,
        periodEnd: paymentMember.nextDueDate ? undefined : undefined,
      });
      await updateMember(paymentMember.id, {
        totalPaid: (paymentMember.totalPaid || 0) + paymentAmount,
        lastPayment: now,
        lastPaymentDate: now,
        nextDueDate: Timestamp.fromDate(addMonths(new Date(), 1)),
      });
      toast.success("Pago registrado");
      setPaymentDialogOpen(false);
      setPaymentAmount(0);
      setPaymentMethod("transferencia");
      setPaymentNotes("");
      await loadMembers(clubId);
    } catch { toast.error("Error al registrar pago"); }
  };

  const loadPaymentHistory = async (member: Member) => {
    setHistoryMember(member);
    setHistoryDialogOpen(true);
    setLoadingPayments(true);
    const data = await getPayments(member.id);
    setPayments(data);
    setLoadingPayments(false);
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
    doc.text(`Aporte mensual total: ${formatCurrency(totalMonthly)}`, 105, 71, { align: "center" });
    doc.text(`Total recaudado: ${formatCurrency(totalPaid)}`, 105, 78, { align: "center" });
    doc.text(`Promedio por socio: ${activeMembers > 0 ? formatCurrency(Math.round(totalMonthly / activeMembers)) : formatCurrency(0)}`, 105, 85, { align: "center" });

    let y = 98;
    doc.setFontSize(7);
    const colWidths = [38, 22, 18, 18, 18, 18, 18, 18, 18];
    const headers = ["Nombre", "RUT", "Email", "Teléfono", "Tipo", "Mensual", "Pagado", "Inicio", "Estado"];
    let x = 10;
    headers.forEach((h, i) => {
      doc.text(h, x + (colWidths[i] - doc.getTextWidth(h)) / 2, y);
      x += colWidths[i];
    });
    y += 4;
    doc.setDrawColor(200);
    doc.line(10, y - 1, 200, y - 1);

    for (const m of members) {
      if (y > 275) { doc.addPage(); y = 20; }
      x = 10;
      const vals = [
        m.name.substring(0, 20), m.rut, m.email.substring(0, 16),
        m.phone || "—", m.membershipType,
        formatCurrency(m.monthlyAmount), formatCurrency(m.totalPaid || 0),
        m.startDate ? formatDate(m.startDate) : "—",
        m.status === "approved" ? "Activo" : m.status,
      ];
      vals.forEach((v, i) => {
        doc.text(v, x + 1, y);
        x += colWidths[i];
      });
      y += 5;
    }
    doc.save(`socios-${club.slug}.pdf`);
  };

  const columns = [
    {
      key: "name",
      header: "Nombre",
      render: (m: Member) => (
        <div className="flex flex-col">
          <span className="font-medium">{m.name}</span>
          <span className="text-xs text-muted-foreground">{m.email}</span>
        </div>
      ),
    },
    { key: "rut", header: "RUT", render: (m: Member) => <span className="text-sm">{m.rut}</span> },
    {
      key: "monthly",
      header: "Aporte",
      render: (m: Member) => (
        <span className="font-mono text-sm">{formatCurrency(m.monthlyAmount)}</span>
      ),
    },
    {
      key: "paid",
      header: "Pagado",
      render: (m: Member) => (
        <span className="font-mono text-sm">{formatCurrency(m.totalPaid || 0)}</span>
      ),
    },
    {
      key: "period",
      header: "Período",
      render: (m: Member) => {
        const start = m.startDate ? new Date(m.startDate.seconds * 1000) : null;
        const end = m.endDate ? new Date(m.endDate.seconds * 1000) : null;
        const now = new Date();
        let pct = 0;
        if (start && end) {
          const total = end.getTime() - start.getTime();
          const elapsed = now.getTime() - start.getTime();
          pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
        }
        return (
          <div className="flex flex-col gap-1 min-w-[120px]">
            <span className="text-xs text-muted-foreground">
              {formatDate(m.startDate)} → {m.endDate ? formatDate(m.endDate) : "∞"}
            </span>
            {m.endDate && (
              <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-amber-400" : "bg-emerald-400"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Estado",
      render: (m: Member) => {
        const hasExpired = m.endDate && new Date(m.endDate.seconds * 1000) < new Date();
        const isExpiring = m.endDate && !hasExpired && (new Date(m.endDate.seconds * 1000).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 7;
        return (
          <div className="flex items-center gap-2">
            <button onClick={() => handleStatusChange(m)}>
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[m.status]}`}>
                {m.status === "approved" ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                {m.status === "approved" ? "Activo" : m.status === "inactive" ? "Inactivo" : m.status}
              </span>
            </button>
            {hasExpired && m.status === "approved" && (
              <span className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                <AlertTriangle className="h-3 w-3" /> Vencido
              </span>
            )}
            {isExpiring && m.status === "approved" && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                <Calendar className="h-3 w-3" /> Próximo a vencer
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "type",
      header: "Tipo",
      render: (m: Member) => (
        <span className="text-xs capitalize">{m.membershipType}</span>
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
            <Button onClick={() => { setEditingMember(null); setForm(defaultForm); setFormErrors({}); setDialogOpen(true); }} disabled={isDemo}>
              <Plus className="h-4 w-4 mr-1" /> Socio
            </Button>
          </div>
        </div>

        {(overdueMembers.length > 0 || expiringMembers.length > 0) && (
          <div className="mb-6 space-y-2">
            {overdueMembers.length > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <span><strong>{overdueMembers.length}</strong> socio{overdueMembers.length > 1 ? "s" : ""} con membresía vencida</span>
              </div>
            )}
            {expiringMembers.length > 0 && overdueMembers.length === 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
                <Calendar className="h-5 w-5 shrink-0" />
                <span><strong>{expiringMembers.length}</strong> socio{expiringMembers.length > 1 ? "s" : ""} próximo{expiringMembers.length > 1 ? "s" : ""} a vencer (próximos 30 días)</span>
              </div>
            )}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-4 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Aporte mensual total</p>
            <p className="text-2xl font-bold text-cyan-600">{formatCurrency(totalMonthly)}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total recaudado</p>
            <p className="text-2xl font-bold text-cyan-600">{formatCurrency(totalPaid)}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Socios activos</p>
            <p className="text-2xl font-bold text-cyan-600">{activeMembers}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Pendiente este mes</p>
            <p className="text-2xl font-bold text-amber-600">{formatCurrency(totalPending)}</p>
          </div>
        </div>

        <DataTable
          columns={[
            ...columns,
            {
              key: "actions",
              header: "Acciones",
              render: (m: Member) => (
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" onClick={() => loadPaymentHistory(m)} title="Historial de pagos">
                    <History className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setPaymentMember(m); setPaymentAmount(m.monthlyAmount); setPaymentMethod("transferencia"); setPaymentNotes(""); setPaymentDialogOpen(true); }} disabled={isDemo || m.status !== "approved"} title="Registrar pago">
                    <DollarSign className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ),
            },
          ]}
          data={members}
          keyExtractor={(m) => m.id}
          onEdit={isDemo ? undefined : (m) => {
            setEditingMember(m);
            setForm({
              name: m.name, rut: m.rut, email: m.email, phone: m.phone || "",
              address: m.address || "", membershipType: m.membershipType,
              monthlyAmount: m.monthlyAmount, startDate: timestampToDateStr(m.startDate),
              endDate: timestampToDateStr(m.endDate), notes: m.notes || "",
            });
            setFormErrors({});
            setDialogOpen(true);
          }}
          onDelete={isDemo ? undefined : handleDelete}
        />

        <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) { setEditingMember(null); setFormErrors({}); } setDialogOpen(open); }}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingMember ? "Editar Socio" : "Nuevo Socio"}</DialogTitle>
              <DialogDescription>Ingresa los datos del socio</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre completo</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label>RUT</Label>
                  <Input value={form.rut} onChange={(e) => setForm({ ...form, rut: e.target.value })} required placeholder="12.345.678-9" />
                  {formErrors.rut && <p className="text-xs text-red-500">{formErrors.rut}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                  {formErrors.phone && <p className="text-xs text-red-500">{formErrors.phone}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Dirección</Label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
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
                  {formErrors.monthlyAmount && <p className="text-xs text-red-500">{formErrors.monthlyAmount}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha de inicio</Label>
                  <Input type="date" value={form.startDate} onChange={(e) => handleStartDateChange(e.target.value)} />
                  <p className="text-xs text-muted-foreground">Término se auto-asigna +1 mes</p>
                </div>
                <div className="space-y-2">
                  <Label>Fecha de término</Label>
                  <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notas</Label>
                <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button type="submit">{editingMember ? "Actualizar" : "Guardar"}</Button>
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
                <Label>Monto (CLP)</Label>
                <Input type="number" value={paymentAmount || ""} onChange={(e) => setPaymentAmount(parseInt(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label>Método de pago</Label>
                <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod((v ?? "transferencia") as typeof paymentMethod)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notas</Label>
                <Input value={paymentNotes} onChange={(e) => setPaymentNotes(e.target.value)} placeholder="Opcional" />
              </div>
              <p className="text-xs text-muted-foreground">
                Cuota mensual: {formatCurrency(paymentMember?.monthlyAmount ?? 0)}
                {paymentMember?.nextDueDate && ` · Próximo vencimiento: ${formatDate(paymentMember.nextDueDate)}`}
              </p>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setPaymentDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleRegisterPayment}>Registrar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Historial de Pagos</DialogTitle>
              <DialogDescription>{historyMember?.name}</DialogDescription>
            </DialogHeader>
            {loadingPayments ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Cargando...</p>
            ) : payments.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Sin pagos registrados</p>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-2">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium text-sm">{formatCurrency(p.amount)}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(p.paymentDate)}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        {paymentMethodLabels[p.paymentMethod] || p.paymentMethod}
                      </span>
                      {p.notes && <p className="text-xs text-muted-foreground mt-1">{p.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={() => setHistoryDialogOpen(false)}>Cerrar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
