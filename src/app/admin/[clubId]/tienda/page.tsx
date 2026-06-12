"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { createProduct, updateProduct, deleteProduct } from "@/lib/firebase/admin-fns";
import { getProducts } from "@/lib/firebase/firestore";
import type { Product } from "@/types";
import { toast } from "sonner";
import { useDemoMode } from "@/lib/demo-mode";

type AdminTiendaPageProps = {
  params: Promise<{ clubId: string }>;
};

export default function AdminTiendaPage({ params }: AdminTiendaPageProps) {
  const [clubId, setClubId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: 0, stock: 0, category: "clothing" as Product["category"], sku: "", images: [] as string[] });
  const [loading, setLoading] = useState(false);
  const { isDemo, guard } = useDemoMode(clubId ?? "");

  useEffect(() => {
    params.then((p) => {
      setClubId(p.clubId);
      loadProducts(p.clubId);
    });
  }, [params]);

  const loadProducts = async (id: string) => {
    const data = await getProducts(id);
    setProducts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    if (!clubId) return;
    setLoading(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, form);
        toast.success("Producto actualizado");
      } else {
        await createProduct(clubId, form);
        toast.success("Producto creado");
      }
      setDialogOpen(false);
      await loadProducts(clubId);
    } catch { toast.error("Error al guardar"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm("¿Eliminar producto?")) return;
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    await deleteProduct(product.id);
    toast.success("Producto eliminado");
    await loadProducts(clubId!);
  };

  const columns = [
    { key: "name", header: "Producto", render: (p: Product) => <span className="font-medium">{p.name}</span> },
    { key: "price", header: "Precio", render: (p: Product) => `$${p.price.toLocaleString("es-CL")}` },
    { key: "stock", header: "Stock", render: (p: Product) => p.stock },
    { key: "category", header: "Categoría", render: (p: Product) => <span className="capitalize">{p.category}</span> },
  ];

  if (!clubId) return <div className="flex flex-col min-h-screen"><AdminNav clubId="" /><div className="container mx-auto px-4 py-12"><p className="text-muted-foreground">Cargando...</p></div></div>;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNav clubId={clubId} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold" style={{ color: "var(--club-primary, #0891b2)" }}>Tienda</h1>
          <Button onClick={() => { setEditingProduct(null); setForm({ name: "", description: "", price: 0, stock: 0, category: "clothing", sku: "", images: [] }); setDialogOpen(true); }} disabled={isDemo}>+ Nuevo Producto</Button>
        </div>
        <DataTable columns={columns} data={products} keyExtractor={(p) => p.id} onEdit={isDemo ? undefined : (p) => { setEditingProduct(p); setForm({ name: p.name, description: p.description, price: p.price, stock: p.stock, category: p.category, sku: p.sku, images: p.images }); setDialogOpen(true); }} onDelete={isDemo ? undefined : handleDelete} />

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
              <DialogDescription>Completa los datos del producto</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Precio (CLP)</Label>
                  <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })} required />
                </div>
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: (v ?? "other") as Product["category"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clothing">Ropa</SelectItem>
                      <SelectItem value="accessories">Accesorios</SelectItem>
                      <SelectItem value="equipment">Equipamiento</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>SKU</Label>
                  <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
                </div>
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
