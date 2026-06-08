"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type PlayerFormData = {
  firstName: string;
  lastName: string;
  number: number;
  position: string;
  age: number;
  height: string;
  weight: string;
  bio: string;
};

const positions = [
  "Base", "Escolta", "Alero", "Ala-Pívot", "Pívot",
  "Arquero", "Defensa", "Mediocampo", "Delantero",
  "Armador", "Punta", "Opuesto", "Central", "Líbero",
];

type PlayerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PlayerFormData) => Promise<void>;
  defaultValues?: Partial<PlayerFormData>;
  title?: string;
};

export function PlayerDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Jugador",
}: PlayerDialogProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<PlayerFormData>({
    firstName: defaultValues?.firstName ?? "",
    lastName: defaultValues?.lastName ?? "",
    number: defaultValues?.number ?? 0,
    position: defaultValues?.position ?? "",
    age: defaultValues?.age ?? 0,
    height: defaultValues?.height ?? "",
    weight: defaultValues?.weight ?? "",
    bio: defaultValues?.bio ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
      toast.success("Jugador guardado");
      onOpenChange(false);
    } catch (err) {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Completa los datos del jugador
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Apellido</Label>
              <Input
                value={form.lastName}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Número</Label>
              <Input
                type="number"
                value={form.number || ""}
                onChange={(e) =>
                  setForm({ ...form, number: parseInt(e.target.value) || 0 })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Edad</Label>
              <Input
                type="number"
                value={form.age || ""}
                onChange={(e) =>
                  setForm({ ...form, age: parseInt(e.target.value) || 0 })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Posición</Label>
            <Select
              value={form.position}
              onValueChange={(v) => setForm({ ...form, position: v ?? "" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar posición" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Altura</Label>
              <Input
                placeholder="Ej: 1.92 m"
                value={form.height}
                onChange={(e) =>
                  setForm({ ...form, height: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Peso</Label>
              <Input
                placeholder="Ej: 85 kg"
                value={form.weight}
                onChange={(e) =>
                  setForm({ ...form, weight: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Biografía</Label>
            <textarea
              className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export type { PlayerFormData };
