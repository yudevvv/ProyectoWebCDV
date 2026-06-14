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
import { createProduct, updateProduct, deleteProduct, createProductSale, uploadFile } from "@/lib/firebase/admin-fns";
import { getProducts } from "@/lib/firebase/firestore";
import type { Product, ProductSale } from "@/types";
import { toast } from "sonner";
import { useDemoMode } from "@/lib/demo-mode";
import { Plus, FlaskConical, ShoppingCart, TrashIcon, X, PackageOpen, AlertTriangle } from "lucide-react";

type AdminTiendaPageProps = {
  params: Promise<{ clubId: string }>;
};

const LOW_STOCK_THRESHOLD = 5;

const categoryLabels: Record<string, string> = {
  clothing: "Ropa",
  accessories: "Accesorios",
  equipment: "Equipamiento",
  other: "Otro",
};

type ProductFormData = {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Product["category"];
  sku: string;
  images: string[];
};

const defaultForm: ProductFormData = {
  name: "", description: "", price: 0, stock: 0,
  category: "clothing", sku: "", images: [],
};

type SaleFormData = {
  productId: string;
  quantity: number;
  paymentMethod: ProductSale["paymentMethod"];
  notes: string;
};

export default function AdminTiendaPage({ params }: AdminTiendaPageProps) {
  const [clubId, setClubId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [saleDialogOpen, setSaleDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<ProductFormData>(defaultForm);
  const [saleForm, setSaleForm] = useState<SaleFormData>({ productId: "", quantity: 1, paymentMethod: "efectivo", notes: "" });
  const [loading, setLoading] = useState(false);
  const [savingSale, setSavingSale] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const { isDemo } = useDemoMode(clubId ?? "");

  const loadProducts = async (id: string) => {
    const data = await getProducts(id);
    setProducts(data);
  };

  useEffect(() => {
    params.then((p) => {
      setClubId(p.clubId);
      loadProducts(p.clubId);
    });
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    if (!clubId) return;
    setLoading(true);
    try {
      let imageUrls = productForm.images;

      if (imageFiles.length > 0) {
        setUploadingImages(true);
        const urls: string[] = [];
        for (const file of imageFiles) {
          const url = await uploadFile(`products/${clubId}/${Date.now()}-${file.name}`, file);
          urls.push(url);
        }
        imageUrls = [...imageUrls, ...urls];
        setUploadingImages(false);
      }

      const payload = {
        name: productForm.name,
        description: productForm.description,
        price: productForm.price,
        stock: productForm.stock,
        category: productForm.category,
        sku: productForm.sku,
        images: imageUrls,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        toast.success("Producto actualizado");
      } else {
        await createProduct(clubId, { ...payload, totalSold: 0 });
        toast.success("Producto creado");
      }
      setProductDialogOpen(false);
      setEditingProduct(null);
      setProductForm(defaultForm);
      setImageFiles([]);
      await loadProducts(clubId);
    } catch {
      toast.error("Error al guardar");
      setUploadingImages(false);
    } finally { setLoading(false); }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm("¿Eliminar producto?")) return;
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    await deleteProduct(product.id);
    toast.success("Producto eliminado");
    await loadProducts(clubId!);
  };

  const handleRegisterSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) { toast.error("Accion no disponible en modo demo"); return; }
    if (!clubId) return;
    const product = products.find((p) => p.id === saleForm.productId);
    if (!product) { toast.error("Selecciona un producto"); return; }
    if (saleForm.quantity < 1) { toast.error("La cantidad debe ser al menos 1"); return; }
    if (saleForm.quantity > product.stock) { toast.error(`Stock insuficiente. Disponible: ${product.stock}`); return; }

    setSavingSale(true);
    try {
      await createProductSale(clubId, {
        productId: product.id,
        productName: product.name,
        quantity: saleForm.quantity,
        unitPrice: product.price,
        total: product.price * saleForm.quantity,
        paymentMethod: saleForm.paymentMethod,
        notes: saleForm.notes || undefined,
      });

      await updateProduct(product.id, {
        stock: product.stock - saleForm.quantity,
        totalSold: (product.totalSold || 0) + saleForm.quantity,
      });

      toast.success(`Venta registrada: ${saleForm.quantity} x ${product.name}`);
      setSaleDialogOpen(false);
      setSaleForm({ productId: "", quantity: 1, paymentMethod: "efectivo", notes: "" });
      await loadProducts(clubId);
    } catch {
      toast.error("Error al registrar venta");
    } finally { setSavingSale(false); }
  };

  const openProductDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        sku: product.sku,
        images: product.images,
      });
      setImageFiles([]);
    } else {
      setEditingProduct(null);
      setProductForm(defaultForm);
      setImageFiles([]);
    }
    setProductDialogOpen(true);
  };

  const removeImage = (index: number) => {
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const lowStockProducts = products.filter((p) => p.stock <= LOW_STOCK_THRESHOLD && p.stock > 0);
  const outOfStock = products.filter((p) => p.stock === 0);
  const totalRevenue = products.reduce((sum, p) => sum + (p.totalSold || 0) * p.price, 0);
  const totalSoldUnits = products.reduce((sum, p) => sum + (p.totalSold || 0), 0);

  const columns = [
    {
      key: "name", header: "Producto",
      render: (p: Product) => (
        <div className="flex items-center gap-3">
          {p.images[0] ? (
            <img src={p.images[0]} alt="" className="h-10 w-10 rounded object-cover shrink-0" />
          ) : (
            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">
              <PackageOpen className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-medium truncate">{p.name}</p>
            {p.sku && <p className="text-xs text-muted-foreground truncate">SKU: {p.sku}</p>}
          </div>
        </div>
      ),
    },
    {
      key: "price", header: "Precio",
      render: (p: Product) => (
        <span className="font-mono text-sm">${p.price.toLocaleString("es-CL")}</span>
      ),
    },
    {
      key: "stock", header: "Stock",
      render: (p: Product) => {
        const isLow = p.stock <= LOW_STOCK_THRESHOLD;
        const isOut = p.stock === 0;
        return (
          <div className="flex items-center gap-1.5">
            {isOut ? (
              <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-400">
                Sin stock
              </Badge>
            ) : isLow ? (
              <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950 dark:text-amber-400">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {p.stock}
              </Badge>
            ) : (
              <span className="font-medium">{p.stock}</span>
            )}
            {(p.totalSold || 0) > 0 && (
              <span className="text-xs text-muted-foreground">({p.totalSold} vend.)</span>
            )}
          </div>
        );
      },
    },
    {
      key: "category", header: "Categoría",
      render: (p: Product) => (
        <span className="text-xs text-muted-foreground capitalize">{categoryLabels[p.category] || p.category}</span>
      ),
    },
  ];

  if (!clubId) return <div className="flex flex-col min-h-screen"><AdminNav clubId="" /><div className="container mx-auto px-4 py-12"><p className="text-muted-foreground">Cargando...</p></div></div>;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNav clubId={clubId} />
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">Tienda</h1>
            <p className="text-muted-foreground text-sm">
              {products.length} productos &middot; {totalSoldUnits} unidades vendidas &middot; ${totalRevenue.toLocaleString("es-CL")} en ventas
            </p>
          </div>
          <div className="flex gap-2">
            {process.env.NODE_ENV === "development" && (
              <>
                <Button variant="outline" size="sm" onClick={async () => {
                  const names = ["Polera Oficial", "Short de Básquetbol", "Zapatillas Pro", "Gorra Club", "Polerón Team", "Calcetas Deportivas", "Balón Oficial", "Mochila Team", "Botella Deportiva", "Pantalón Training", "Chaqueta Rompevientos", "Polera Entrenamiento", "Shorts Verano", "Gorro Invierno", "Medias Largas", "Rodillera Pro", "Muñequeras", "Bolso Deportivo", "Polera Mujer", "Short Mujer"];
                  const prices = [15000, 12000, 45000, 8000, 25000, 5000, 22000, 18000, 7000, 20000, 35000, 12000, 10000, 9000, 4000, 15000, 3000, 16000, 15000, 12000];
                  const stocks = [15, 8, 3, 20, 5, 30, 2, 10, 25, 12, 0, 18, 40, 7, 50, 4, 60, 6, 9, 14];
                  const categories: Product["category"][] = ["clothing", "clothing", "equipment", "accessories", "clothing", "clothing", "equipment", "accessories", "accessories", "clothing", "clothing", "clothing", "clothing", "accessories", "clothing", "equipment", "accessories", "accessories", "clothing", "clothing"];
                  const pendToast = toast.loading("Insertando 20 productos...");
                  for (let i = 0; i < names.length; i++) {
                    try {
                      await createProduct(clubId, {
                        name: names[i], price: prices[i],
                        description: `Producto oficial del club`,
                        stock: stocks[i],
                        category: categories[i],
                        sku: `SKU-${String(i + 1).padStart(4, "0")}`,
                        images: [],
                        totalSold: Math.floor(Math.random() * Math.max(1, stocks[i])),
                      });
                    } catch { /* skip */ }
                  }
                  toast.dismiss(pendToast);
                  toast.success("20 productos insertados");
                  await loadProducts(clubId);
                }}>
                  <FlaskConical className="h-4 w-4 mr-1" /> Seed 20
                </Button>
                <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-950" onClick={async () => {
                  if (!confirm("¿Eliminar TODOS los productos?")) return;
                  try {
                    const { collection, getDocs, writeBatch } = await import("firebase/firestore");
                    const { db } = await import("@/lib/firebase/client");
                    if (!db) { toast.error("Firestore no disponible"); return; }
                    const snap = await getDocs(collection(db, "products"));
                    const batch = writeBatch(db);
                    snap.docs.forEach((d) => batch.delete(d.ref));
                    await batch.commit();
                    toast.success("Productos eliminados");
                    await loadProducts(clubId);
                  } catch { toast.error("Error al eliminar"); }
                }}>
                  <TrashIcon className="h-4 w-4 mr-1" /> Limpiar
                </Button>
              </>
            )}
            <Button variant="outline" size="sm" onClick={() => { setSaleForm({ productId: "", quantity: 1, paymentMethod: "efectivo", notes: "" }); setSaleDialogOpen(true); }} disabled={isDemo || products.length === 0}>
              <ShoppingCart className="h-4 w-4 mr-1" /> Venta
            </Button>
            <Button size="sm" onClick={() => openProductDialog()} disabled={isDemo}>
              <Plus className="h-4 w-4 mr-1" /> Producto
            </Button>
          </div>
        </div>

        {(lowStockProducts.length > 0 || outOfStock.length > 0) && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50 p-3 flex items-start gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-amber-800 dark:text-amber-300">Alerta de stock: </span>
              {outOfStock.length > 0 && <span className="text-amber-700 dark:text-amber-400">{outOfStock.length} producto(s) sin stock. </span>}
              {lowStockProducts.length > 0 && <span className="text-amber-700 dark:text-amber-400">{lowStockProducts.length} producto(s) con stock bajo (&le;{LOW_STOCK_THRESHOLD}).</span>}
            </div>
          </div>
        )}

        <DataTable
          columns={columns}
          data={products}
          keyExtractor={(p) => p.id}
          onEdit={isDemo ? undefined : (p) => openProductDialog(p)}
          onDelete={isDemo ? undefined : handleDelete}
          searchable
          searchKeys={["name", "description", "category", "sku"]}
          searchPlaceholder="Buscar por producto, SKU, categoría..."
          pageSize={10}
        />

        {/* Product form dialog */}
        <Dialog open={productDialogOpen} onOpenChange={(open) => { if (!open) { setEditingProduct(null); setImageFiles([]); } setProductDialogOpen(open); }}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
              <DialogDescription>Completa los datos del producto</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Precio (CLP)</Label>
                  <Input type="number" value={productForm.price || ""} onChange={(e) => setProductForm({ ...productForm, price: parseInt(e.target.value) || 0 })} required />
                </div>
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input type="number" value={productForm.stock || ""} onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select value={productForm.category} onValueChange={(v) => setProductForm({ ...productForm, category: (v ?? "other") as Product["category"] })}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
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
                  <Input value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <textarea className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
              </div>

              {/* Image upload */}
              <div className="space-y-2">
                <Label>Imágenes del producto</Label>
                <p className="text-xs text-muted-foreground">PNG o JPG, máximo 5MB por imagen.</p>

                {productForm.images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {productForm.images.map((url, i) => (
                      <div key={url} className="relative group">
                        <img src={url} alt="" className="h-16 w-16 rounded object-cover border" />
                        <button type="button" className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeImage(i)}>
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <Input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  multiple
                  className="text-sm file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-cyan-50 file:text-cyan-700 dark:file:bg-cyan-950 dark:file:text-cyan-300 hover:file:bg-cyan-100"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    const valid = files.filter((f) => {
                      if (f.size > 5 * 1024 * 1024) {
                        toast.error(`${f.name} supera los 5MB`);
                        return false;
                      }
                      return true;
                    });
                    setImageFiles((prev) => [...prev, ...valid]);
                    e.target.value = "";
                  }}
                />

                {imageFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {imageFiles.map((f, i) => (
                      <div key={i} className="relative group">
                        <img src={URL.createObjectURL(f)} alt="" className="h-16 w-16 rounded object-cover border" />
                        <button type="button" className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setImageFiles((prev) => prev.filter((_, j) => j !== i))}>
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2 sticky bottom-0 bg-background py-2 border-t">
                <Button type="button" variant="outline" onClick={() => setProductDialogOpen(false)} disabled={loading}>Cancelar</Button>
                <Button type="submit" disabled={loading || uploadingImages}>
                  {uploadingImages ? "Subiendo imágenes..." : loading ? "Guardando..." : editingProduct ? "Actualizar" : "Guardar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Sale dialog */}
        <Dialog open={saleDialogOpen} onOpenChange={setSaleDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Venta</DialogTitle>
              <DialogDescription>Selecciona el producto y la cantidad vendida</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRegisterSale} className="space-y-4">
              <div className="space-y-2">
                <Label>Producto</Label>
                <Select value={saleForm.productId} onValueChange={(v) => setSaleForm({ ...saleForm, productId: v ?? "" })}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                  <SelectContent>
                    {products
                      .filter((p) => p.stock > 0)
                      .map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} — ${p.price.toLocaleString("es-CL")} ({p.stock} disp.)
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {saleForm.productId && (
                <div className="rounded-lg bg-muted/50 p-3 text-sm space-y-1">
                  {(() => {
                    const p = products.find((x) => x.id === saleForm.productId);
                    if (!p) return null;
                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Precio unitario</span>
                          <span className="font-mono">${p.price.toLocaleString("es-CL")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Stock disponible</span>
                          <span>{p.stock}</span>
                        </div>
                        <div className="flex justify-between font-medium border-t pt-1 mt-1">
                          <span>Total</span>
                          <span className="font-mono">${(p.price * saleForm.quantity).toLocaleString("es-CL")}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cantidad</Label>
                  <Input type="number" min={1} value={saleForm.quantity} onChange={(e) => setSaleForm({ ...saleForm, quantity: Math.max(1, parseInt(e.target.value) || 1) })} required />
                </div>
                <div className="space-y-2">
                  <Label>Pago</Label>
                  <Select value={saleForm.paymentMethod} onValueChange={(v) => setSaleForm({ ...saleForm, paymentMethod: (v ?? "efectivo") as ProductSale["paymentMethod"] })}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                      <SelectItem value="tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notas (opcional)</Label>
                <Input value={saleForm.notes} onChange={(e) => setSaleForm({ ...saleForm, notes: e.target.value })} placeholder="Ej: Venta en partido, descuento..." />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setSaleDialogOpen(false)} disabled={savingSale}>Cancelar</Button>
                <Button type="submit" disabled={savingSale || !saleForm.productId}>
                  {savingSale ? "Registrando..." : "Registrar Venta"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
