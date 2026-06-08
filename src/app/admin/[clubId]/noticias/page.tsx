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
import { createNews, updateNews, deleteNews } from "@/lib/firebase/admin-fns";
import { getNews } from "@/lib/firebase/firestore";
import type { News } from "@/types";
import { toast } from "sonner";

type AdminNoticiasPageProps = {
  params: Promise<{ clubId: string }>;
};

export default function AdminNoticiasPage({ params }: AdminNoticiasPageProps) {
  const [clubId, setClubId] = useState<string | null>(null);
  const [news, setNews] = useState<News[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", author: "", coverImage: "", published: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    params.then((p) => {
      setClubId(p.clubId);
      loadNews(p.clubId);
    });
  }, [params]);

  const loadNews = async (id: string) => {
    const data = await getNews(id);
    setNews(data);
  };

  const openCreate = () => {
    setEditingNews(null);
    setForm({ title: "", excerpt: "", content: "", author: "", coverImage: "", published: false });
    setDialogOpen(true);
  };

  const openEdit = (item: News) => {
    setEditingNews(item);
    setForm({ title: item.title, excerpt: item.excerpt || "", content: item.content, author: item.author, coverImage: item.coverImage, published: item.published });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubId) return;
    setLoading(true);
    try {
      if (editingNews) {
        await updateNews(editingNews.id, form);
        toast.success("Noticia actualizada");
      } else {
        await createNews(clubId, form);
        toast.success("Noticia creada");
      }
      setDialogOpen(false);
      await loadNews(clubId);
    } catch {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item: News) => {
    if (!confirm("¿Eliminar noticia?")) return;
    await deleteNews(item.id);
    toast.success("Noticia eliminada");
    await loadNews(clubId!);
  };

  const columns = [
    { key: "title", header: "Título", render: (n: News) => <span className="font-medium">{n.title}</span> },
    { key: "author", header: "Autor", render: (n: News) => n.author },
    {
      key: "published",
      header: "Estado",
      render: (n: News) => (
        <Badge variant={n.published ? "default" : "secondary"}>
          {n.published ? "Publicada" : "Borrador"}
        </Badge>
      ),
    },
  ];

  if (!clubId) return <div className="flex flex-col min-h-screen"><AdminNav clubId="" /><div className="container mx-auto px-4 py-12"><p className="text-muted-foreground">Cargando...</p></div></div>;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNav clubId={clubId} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Noticias</h1>
          <Button onClick={openCreate}>+ Nueva Noticia</Button>
        </div>

        <DataTable columns={columns} data={news} keyExtractor={(n) => n.id} onEdit={openEdit} onDelete={handleDelete} />

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingNews ? "Editar Noticia" : "Nueva Noticia"}</DialogTitle>
              <DialogDescription>Completa los campos de la noticia</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Autor</Label>
                  <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>URL Imagen</Label>
                  <Input value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Extracto</Label>
                <textarea className="flex min-h-[60px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Contenido</Label>
                <textarea className="flex min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="published" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                <Label htmlFor="published">Publicar inmediatamente</Label>
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
