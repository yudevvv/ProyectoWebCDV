"use client";

import { useEffect, useState, useCallback, use } from "react";
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
import { FileDown, Plus, DollarSign, History, AlertTriangle, UserCheck, UserX, Calendar, Pencil, Trash2, FlaskConical } from "lucide-react";

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

const PAYMENT_METHODS = [
  { value: "transferencia", label: "Transferencia" },
  { value: "efectivo", label: "Efectivo" },
  { value: "tarjeta", label: "Tarjeta" },
  { value: "otro", label: "Otro" },
] as const;

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

function cleanPayload<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
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
  const { clubId } = use(params);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentMemberId, setPaymentMemberId] = useState<string | null>(null);
  const paymentMember = paymentMemberId ? (members.find((m) => m.id === paymentMemberId) ?? null) : null;
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMonths, setPaymentMonths] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"transferencia" | "efectivo" | "tarjeta" | "otro">("transferencia");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [form, setForm] = useState<MemberFormData>(defaultForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof MemberFormData, string>>>({});
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [historyMember, setHistoryMember] = useState<Member | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [saving, setSaving] = useState(false);
  const { isDemo } = useDemoMode(clubId);
  const { data: club } = useClub(clubId);

  const refreshMembers = useCallback(async (id: string) => {
    const data = await getMembers(id);
    setMembers(data);
  }, []);

  useEffect(() => {
    getMembers(clubId).then((data) => {
      setMembers(data);
      setLoading(false);
    });
  }, [clubId]);

  const today = new Date();

  const overdueMembers = members.filter((m) => {
    if (!m.endDate || m.status !== "approved") return false;
    return new Date(m.endDate.seconds * 1000) < today;
  });

  const expiringMembers = members.filter((m) => {
    if (!m.endDate || m.status !== "approved") return false;
    const end = new Date(m.endDate.seconds * 1000);
    const diff = (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 5;
  });

  const totalMonthly = members.reduce((sum, m) => sum + (m.status === "approved" ? m.monthlyAmount : 0), 0);
  const totalPaid = members.reduce((sum, m) => sum + (m.totalPaid || 0), 0);
  const activeMembers = members.filter((m) => m.status === "approved").length;

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof MemberFormData, string>> = {};
    if (!form.name.trim()) errors.name = "Nombre requerido";
    if (!form.rut.trim()) errors.rut = "RUT requerido";
    else if (!/^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}[-][0-9kK]$/.test(form.rut) && !/^[0-9]{7,8}[-][0-9kK]$/.test(form.rut))
      errors.rut = "Formato inválido (ej: 12.345.678-9)";
    if (!form.email.trim()) errors.email = "Email requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Email inválido";
    if (!form.phone.trim()) errors.phone = "Teléfono requerido";
    if (form.monthlyAmount <= 0) errors.monthlyAmount = "Debe ser > 0";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStartDateChange = (val: string) => {
    setForm({
      ...form,
      startDate: val,
      endDate: val ? timestampToDateStr(Timestamp.fromDate(addMonths(new Date(val), 1))) : "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    if (!validateForm()) return;

    const payload = cleanPayload({
      name: form.name,
      rut: form.rut,
      email: form.email,
      phone: form.phone,
      membershipType: form.membershipType as Member["membershipType"],
      monthlyAmount: form.monthlyAmount,
      address: form.address || undefined,
      notes: form.notes || undefined,
      startDate: dateToTimestamp(form.startDate),
      endDate: dateToTimestamp(form.endDate),
    });

    setSaving(true);
    try {
      if (editingMember) {
        await updateMember(editingMember.id, payload as Partial<Member>);
        toast.success("Socio actualizado");
      } else {
        await createMember(clubId, payload as Parameters<typeof createMember>[1]);
        toast.success("Socio agregado");
      }
      setDialogOpen(false);
      setEditingMember(null);
      setForm(defaultForm);
      setFormErrors({});
      await refreshMembers(clubId);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      toast.error(`Error al guardar: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (member: Member) => {
    if (!confirm("¿Eliminar socio?")) return;
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    try {
      await deleteMember(member.id);
      toast.success("Socio eliminado");
      await refreshMembers(clubId);
    } catch (e) {
      console.error("Error al eliminar:", e);
      toast.error("Error al eliminar");
    }
  };

  const handleStatusChange = async (member: Member) => {
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    const newStatus = member.status === "approved" ? "inactive" : "approved";
    try {
      await updateMember(member.id, { status: newStatus as Member["status"] });
      toast.success(`Estado cambiado a ${newStatus === "approved" ? "Activo" : "Inactivo"}`);
      await refreshMembers(clubId);
    } catch (e) {
      console.error("Error al cambiar estado:", e);
      toast.error("Error al cambiar estado");
    }
  };

  const handleRegisterPayment = async () => {
    if (!paymentMember) return;
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    if (paymentAmount <= 0) { toast.error("Ingresa un monto válido"); return; }
    if (paymentMonths < 1) { toast.error("Debes cubrir al menos 1 mes"); return; }

    const monthsPaid = paymentMonths;

    try {
      const now = Timestamp.now();
      const nowDate = new Date();

      let newEndDate: Date;
      const currentEndDate = paymentMember.endDate
        ? new Date(paymentMember.endDate.seconds * 1000)
        : null;

      if (monthsPaid >= 1) {
        const baseDate = currentEndDate && currentEndDate > nowDate
          ? currentEndDate
          : nowDate;
        newEndDate = addMonths(baseDate, monthsPaid);
      } else {
        newEndDate = currentEndDate || nowDate;
      }

      const nextDue = addMonths(nowDate, 1);

      await createPayment(paymentMember.id, clubId, {
        amount: paymentAmount,
        paymentMethod,
        notes: paymentNotes,
      });

      const updateData = cleanPayload({
        totalPaid: (paymentMember.totalPaid || 0) + paymentAmount,
        lastPayment: now,
        lastPaymentDate: now,
        nextDueDate: Timestamp.fromDate(nextDue),
        endDate: monthsPaid >= 1
          ? Timestamp.fromDate(newEndDate)
          : paymentMember.endDate,
        ...(paymentMember.status === "approved" && paymentMember.endDate && new Date(paymentMember.endDate.seconds * 1000) < nowDate
          ? { status: "approved" as const }
          : {}),
      });

      await updateMember(paymentMember.id, updateData as Partial<Member>);

      const msg = `Pago registrado · ${formatCurrency(paymentAmount)} · ${monthsPaid} mes${monthsPaid > 1 ? "es" : ""}`;
      toast.success(msg);

      setPaymentDialogOpen(false);
      setPaymentAmount(0);
      setPaymentMethod("transferencia");
      setPaymentNotes("");
      await refreshMembers(clubId);
    } catch (e) {
      console.error("Error al registrar pago:", e);
      toast.error("Error al registrar pago");
    }
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
    doc.text(`Generado: ${today.toLocaleDateString("es-CL")}`, 105, 57, { align: "center" });
    doc.text(`Total socios activos: ${activeMembers}`, 105, 64, { align: "center" });
    doc.text(`Aporte mensual total: ${formatCurrency(totalMonthly)}`, 105, 71, { align: "center" });
    doc.text(`Total recaudado: ${formatCurrency(totalPaid)}`, 105, 78, { align: "center" });
    doc.text(`Promedio por socio: ${activeMembers > 0 ? formatCurrency(Math.round(totalMonthly / activeMembers)) : formatCurrency(0)}`, 105, 85, { align: "center" });

    let y = 98;
    doc.setFontSize(7);
    const colWidths = [38, 22, 18, 18, 14, 16, 16, 18, 18];
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
      vals.forEach((v) => {
        doc.text(v, x + 1, y);
        x += 18;
      });
      y += 5;
    }
    doc.save(`socios-${club.slug}.pdf`);
  };

  const daysUntil = (m: Member) => {
    if (!m.endDate) return Infinity;
    return Math.ceil((new Date(m.endDate.seconds * 1000).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  };
  const isOverdue = (m: Member) => m.endDate && new Date(m.endDate.seconds * 1000) < new Date();
  const isExpiringSoon = (m: Member) => {
    const d = daysUntil(m);
    return d > 0 && d <= 5;
  };

  const columns = [
    {
      key: "name",
      header: "Nombre",
      render: (m: Member) => (
        <div className="flex flex-col">
          <span className="font-medium">{m.name}</span>
          <span className="text-xs text-muted-foreground">{m.rut}</span>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contacto",
      render: (m: Member) => (
        <div className="flex flex-col text-xs text-muted-foreground">
          <span>{m.email}</span>
          <span>{m.phone || "—"}</span>
        </div>
      ),
    },
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
        const overdue = end && end < now;
        let pct = 0;
        if (start && end) {
          const total = end.getTime() - start.getTime();
          const elapsed = now.getTime() - start.getTime();
          pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
        }
        return (
          <div className="flex flex-col gap-1 min-w-[130px]">
            <span className="text-xs text-muted-foreground">
              {formatDate(m.startDate)} → {m.endDate ? formatDate(m.endDate) : "∞"}
            </span>
            {m.endDate && (
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${overdue ? "bg-red-500" : pct >= 80 ? "bg-amber-400" : "bg-emerald-400"}`}
                  style={{ width: `${overdue ? 100 : pct}%` }}
                />
              </div>
            )}
            {overdue && (
              <span className="text-xs text-red-500 dark:text-red-400 font-medium">Vencido</span>
            )}
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Estado",
      render: (m: Member) => (
        <button
          onClick={() => handleStatusChange(m)}
          className="hover:opacity-80 transition-opacity"
          title="Cambiar estado"
        >
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[m.status]}`}>
            {m.status === "approved" ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
            {m.status === "approved" ? "Activo" : m.status === "inactive" ? "Inactivo" : m.status}
          </span>
        </button>
      ),
    },
    {
      key: "type",
      header: "Tipo",
      render: (m: Member) => (
        <span className="text-xs capitalize text-muted-foreground">{m.membershipType}</span>
      ),
    },
    {
      key: "alerts",
      header: "",
      render: (m: Member) => {
        const overdue = isOverdue(m);
        const expiring = isExpiringSoon(m);
        if (!overdue && !expiring) return null;
        if (overdue) {
          return (
            <span className="text-xs text-red-500 dark:text-red-400 font-medium whitespace-nowrap">
              Vencido
            </span>
          );
        }
        return (
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium whitespace-nowrap">
            {daysUntil(m)} día{daysUntil(m) !== 1 ? "s" : ""}
          </span>
        );
      },
    },
  ];

  const actionColumn = {
    key: "actions",
    header: "",
    render: (m: Member) => (
      <div className="flex items-center justify-end gap-0.5">
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => loadPaymentHistory(m)}
          title="Ver pagos"
        >
          <History className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => {
            setPaymentMemberId(m.id);
            setPaymentAmount(m.monthlyAmount);
            setPaymentMonths(1);
            setPaymentMethod("transferencia");
            setPaymentNotes("");
            setPaymentDialogOpen(true);
          }}
          disabled={isDemo || m.status !== "approved"}
          title="Registrar pago"
        >
          <DollarSign className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => {
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
          disabled={isDemo}
          title="Editar"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          onClick={() => handleDelete(m)}
          disabled={isDemo}
          title="Eliminar"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    ),
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminNav clubId={clubId} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="h-4 w-64 bg-muted rounded" />
            <div className="grid gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-lg" />
              ))}
            </div>
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
            <h1 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">Socios</h1>
            <p className="text-muted-foreground text-sm">{members.length} registrados, {activeMembers} activos</p>
          </div>
          <div className="flex gap-2">
            {process.env.NODE_ENV === "development" && (
              <Button variant="outline" size="sm" onClick={async () => {
                const names = [
                  "Carlos Muñoz", "María González", "José Pérez", "Ana Soto", "Pedro López",
                  "Claudia Rojas", "Francisco Díaz", "Valentina Torres", "Andrés Silva", "Camila Moreno",
                  "Diego Castillo", "Javiera Fernández", "Matías Martínez", "Isidora Álvarez", "Benjamín Ruiz",
                  "Antonia Vega", "Sebastián Herrera", "Emilia Campos", "Joaquín Ortiz", "Florencia Morales",
                ];
                const ruts = [
                  "12.345.678-9", "13.246.579-0", "14.789.123-4", "15.987.654-3", "16.543.210-k",
                  "17.890.123-5", "18.765.432-1", "19.234.567-8", "20.876.543-2", "21.345.678-6",
                  "22.654.321-7", "23.987.654-0", "24.123.456-9", "25.789.012-3", "26.456.789-k",
                  "27.012.345-5", "28.678.901-1", "29.234.567-8", "30.890.123-4", "31.567.890-2",
                ];
                const types: Member["membershipType"][] = ["basic", "basic", "premium", "basic", "vip", "basic", "premium", "basic", "basic", "premium", "basic", "vip", "basic", "premium", "basic", "basic", "basic", "premium", "basic", "vip"];
                const amounts = [15000, 10000, 25000, 12000, 40000, 10000, 25000, 15000, 10000, 30000, 10000, 50000, 15000, 25000, 10000, 12000, 10000, 20000, 15000, 35000];
                const statuses: Member["status"][] = ["approved", "approved", "approved", "approved", "approved", "approved", "approved", "approved", "approved", "approved", "approved", "approved", "approved", "inactive", "approved", "approved", "inactive", "approved", "approved", "approved"];
                const pendingToast = toast.loading("Insertando 20 socios...");
                for (let i = 0; i < names.length; i++) {
                  const startDate = new Date();
                  startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 6));
                  const endDate = new Date(startDate);
                  endDate.setMonth(endDate.getMonth() + 3);
                  try {
                    const id = await createMember(clubId, {
                      name: names[i], rut: ruts[i], email: `${names[i].toLowerCase().replace(/\s+/g, ".")}@correo.cl`,
                      phone: `+56 9 ${String(7000 + i).padStart(4, "0")} ${String(1000 + i).padStart(4, "0")}`,
                      membershipType: types[i], monthlyAmount: amounts[i],
                      address: `Calle ${i + 1} #${100 + i}, Santiago`,
                      startDate: Timestamp.fromDate(startDate),
                      endDate: Timestamp.fromDate(endDate),
                      notes: statuses[i] === "inactive" ? "Retiro voluntario" : "",
                    });
                    if (statuses[i] === "inactive") {
                      await updateMember(id, { status: "inactive" as const });
                    }
                  } catch { /* skip */ }
                }
                toast.dismiss(pendingToast);
                toast.success("20 socios insertados");
                await refreshMembers(clubId);
              }}>
                <FlaskConical className="h-4 w-4 mr-1" /> Seed 20
              </Button>
            )}
            <Button variant="outline" onClick={downloadPDF} disabled={members.length === 0} size="sm">
              <FileDown className="h-4 w-4 mr-1" /> Reporte
            </Button>
            <Button onClick={() => { setEditingMember(null); setForm(defaultForm); setFormErrors({}); setDialogOpen(true); }} disabled={isDemo} size="sm">
              <Plus className="h-4 w-4 mr-1" /> Socio
            </Button>
          </div>
        </div>

        {(overdueMembers.length > 0 || expiringMembers.length > 0) && (
          <div className="space-y-2">
            {overdueMembers.length > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <span><strong>{overdueMembers.length}</strong> socio{overdueMembers.length > 1 ? "s" : ""} con membresía vencida</span>
              </div>
            )}
            {overdueMembers.length === 0 && expiringMembers.length > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
                <Calendar className="h-5 w-5 shrink-0" />
                <span><strong>{expiringMembers.length}</strong> socio{expiringMembers.length > 1 ? "s" : ""} vence{expiringMembers.length > 1 ? "n" : ""} en menos de 5 días</span>
              </div>
            )}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Aporte mensual total</p>
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{formatCurrency(totalMonthly)}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total recaudado</p>
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{formatCurrency(totalPaid)}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Socios activos</p>
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{activeMembers}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Membresías vencidas</p>
            <p className="text-2xl font-bold text-red-500 dark:text-red-400">{overdueMembers.length}</p>
          </div>
        </div>

        <DataTable
          columns={[...columns, actionColumn]}
          data={members}
          keyExtractor={(m) => m.id}
        />

        <Dialog open={dialogOpen} onOpenChange={(open) => {
          if (!open) { setEditingMember(null); setFormErrors({}); }
          setDialogOpen(open);
        }}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingMember ? "Editar Socio" : "Nuevo Socio"}</DialogTitle>
              <DialogDescription>Ingresa los datos del socio</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rut">RUT</Label>
                  <Input id="rut" value={form.rut} onChange={(e) => setForm({ ...form, rut: e.target.value })} required placeholder="12.345.678-9" />
                  {formErrors.rut && <p className="text-xs text-red-500">{formErrors.rut}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                  {formErrors.phone && <p className="text-xs text-red-500">{formErrors.phone}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="membershipType">Tipo de membresía</Label>
                  <Select value={form.membershipType} onValueChange={(v) => setForm({ ...form, membershipType: (v ?? "basic") as Member["membershipType"] })}>
                    <SelectTrigger id="membershipType"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Básico</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyAmount">Aporte mensual (CLP)</Label>
                  <Input id="monthlyAmount" type="number" value={form.monthlyAmount || ""} onChange={(e) => setForm({ ...form, monthlyAmount: parseInt(e.target.value) || 0 })} required />
                  {formErrors.monthlyAmount && <p className="text-xs text-red-500">{formErrors.monthlyAmount}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de inicio</Label>
                  <Input id="startDate" type="date" value={form.startDate} onChange={(e) => handleStartDateChange(e.target.value)} />
                  <p className="text-xs text-muted-foreground">Término se auto-asigna +1 mes</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Fecha de término</Label>
                  <Input id="endDate" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Input id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancelar</Button>
                <Button type="submit" disabled={saving}>{saving ? "Guardando..." : editingMember ? "Actualizar" : "Guardar"}</Button>
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
                <Label htmlFor="paymentMonths">Meses a cubrir</Label>
                <Input
                  id="paymentMonths"
                  type="number"
                  min={1}
                  value={paymentMonths || ""}
                  onChange={(e) => {
                    const m = parseInt(e.target.value) || 0;
                    setPaymentMonths(m);
                    if (paymentMember) setPaymentAmount(m * paymentMember.monthlyAmount);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentAmount">Monto total (CLP)</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  value={paymentAmount || ""}
                  onChange={(e) => {
                    const a = parseInt(e.target.value) || 0;
                    setPaymentAmount(a);
                    if (paymentMember && paymentMember.monthlyAmount > 0) {
                      setPaymentMonths(Math.max(1, Math.floor(a / paymentMember.monthlyAmount)));
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Método de pago</Label>
                <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod((v ?? "transferencia") as typeof paymentMethod)}>
                  <SelectTrigger id="paymentMethod"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((pm) => (
                      <SelectItem key={pm.value} value={pm.value}>{pm.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentNotes">Notas</Label>
                <Input id="paymentNotes" value={paymentNotes} onChange={(e) => setPaymentNotes(e.target.value)} placeholder="Opcional" />
              </div>
              {paymentMember && paymentAmount > 0 && paymentMonths >= 1 && (() => {
                const now = new Date();
                const currentEnd = paymentMember.endDate
                  ? new Date(paymentMember.endDate.seconds * 1000)
                  : null;
                const baseEnd = currentEnd && currentEnd > now ? currentEnd : now;
                const newEnd = addMonths(baseEnd, paymentMonths);
                const newDue = addMonths(now, 1);
                return (
                  <div className="rounded-lg bg-muted p-3 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Cuota mensual</span>
                      <strong>{formatCurrency(paymentMember.monthlyAmount)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Meses a cubrir</span>
                      <strong>{paymentMonths}</strong>
                    </div>
                    <div className="border-t border-border my-1.5" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Nuevo fin de membresía</span>
                      <span>{formatDate(Timestamp.fromDate(newEnd))}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Próximo vencimiento</span>
                      <span>{formatDate(Timestamp.fromDate(newDue))}</span>
                    </div>
                  </div>
                );
              })()}
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
                  <div key={p.id} className="flex items-center justify-between rounded-lg border bg-card p-3">
                    <div>
                      <p className="font-medium text-sm">{formatCurrency(p.amount)}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(p.paymentDate)}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
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
