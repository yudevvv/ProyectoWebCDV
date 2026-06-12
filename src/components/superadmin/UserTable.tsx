"use client";

import { useState } from "react";
import { updateUserClubs } from "@/lib/firebase/admin-fns";
import { createUserDocument } from "@/lib/firebase/admin-fns";
import { getUserDocument } from "@/lib/firebase/firestore";
import type { AppUser, Club, UserRole } from "@/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UserTableProps = {
  users: AppUser[];
  clubs: Club[];
};

export default function UserTable({ users, clubs }: UserTableProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const [selectedClubs, setSelectedClubs] = useState<Record<string, UserRole>>({});
  const [saving, setSaving] = useState(false);

  const [newUid, setNewUid] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [syncing, setSyncing] = useState(false);

  const clubMap = new Map(clubs.map((c) => [c.id, c]));

  const handleSyncUser = async () => {
    if (!newUid || !newEmail) {
      toast.error("Ingresa UID y email");
      return;
    }
    setSyncing(true);
    try {
      const existing = await getUserDocument(newUid);
      if (existing) {
        toast.error("Ese usuario ya existe en Firestore");
        return;
      }
      await createUserDocument(newUid, { email: newEmail, displayName: newEmail.split("@")[0] });
      toast.success("Usuario sincronizado desde Firebase Auth");
      setNewUid("");
      setNewEmail("");
      window.location.reload();
    } catch {
      toast.error("Error al sincronizar usuario");
    } finally {
      setSyncing(false);
    }
  };

  const openEditor = (user: AppUser) => {
    setEditing(user.uid);
    setSelectedClubs({ ...user.roles.clubs });
  };

  const toggleClub = (clubId: string) => {
    setSelectedClubs((prev) => {
      const next = { ...prev };
      if (next[clubId]) {
        delete next[clubId];
      } else {
        next[clubId] = "club_admin";
      }
      return next;
    });
  };

  const save = async (uid: string) => {
    setSaving(true);
    try {
      await updateUserClubs(uid, selectedClubs);
      toast.success("Asignaciones actualizadas");
      setEditing(null);
    } catch {
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 rounded-lg border bg-slate-50 p-4">
        <p className="text-xs font-mono text-slate-500 mb-2">
          $ Sincronizar usuario desde Firebase Auth Console
        </p>
        <p className="text-[10px] font-mono text-slate-400 mb-3">
          Si creaste un usuario en la consola de Firebase Auth, pega su UID y email para crear su documento en Firestore.
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="UID desde Firebase Auth"
            value={newUid}
            onChange={(e) => setNewUid(e.target.value)}
            className="max-w-xs font-mono text-xs"
          />
          <Input
            placeholder="Email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="max-w-xs font-mono text-xs"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSyncUser}
            disabled={syncing || !newUid || !newEmail}
            className="text-xs font-mono"
          >
            {syncing ? "Sincronizando..." : "Sincronizar"}
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-xs font-mono text-slate-500 uppercase">
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">UID</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Clubes Asignados</th>
                <th className="px-4 py-3">Registro</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const clubIds = Object.keys(user.roles.clubs);
                const userClubs = clubIds.map((id) => clubMap.get(id)).filter(Boolean);

                return (
                  <tr key={user.uid} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-900">{user.email}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-slate-400">
                      {user.uid.slice(0, 12)}...
                    </td>
                    <td className="px-4 py-3">
                      {user.roles.superadmin ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-700">
                          superadmin
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">cliente</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {userClubs.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {userClubs.map((club) => (
                            <span
                              key={club!.id}
                              className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-600"
                            >
                              {club!.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {user.createdAt?.seconds
                        ? new Date(user.createdAt.seconds * 1000).toLocaleDateString("es-CL")
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {editing === user.uid ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => save(user.uid)}
                            disabled={saving}
                            className="text-xs font-mono text-emerald-600 hover:underline disabled:opacity-50"
                          >
                            {saving ? "Guardando..." : "Guardar"}
                          </button>
                          <button
                            onClick={() => setEditing(null)}
                            className="text-xs font-mono text-slate-400 hover:underline"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => openEditor(user)}
                          className="text-xs font-mono text-cyan-600 hover:underline"
                        >
                          Editar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400 font-mono">
                    No hay usuarios registrados en Firestore. Usa el formulario de arriba para sincronizar desde Firebase Auth.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {editing && (
          <div className="border-t bg-slate-50 p-4">
            <p className="text-xs font-mono text-slate-500 mb-3">
              $ Asignar clubes a <span className="text-cyan-600">{users.find((u) => u.uid === editing)?.email}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {clubs.map((club) => {
                const assigned = selectedClubs[club.id];
                return (
                  <button
                    key={club.id}
                    onClick={() => toggleClub(club.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-mono transition-all ${
                      assigned
                        ? "bg-cyan-100 text-cyan-700 border border-cyan-300"
                        : "bg-white text-slate-400 border border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {assigned && <span className="text-emerald-500">&#10003;</span>}
                    {club.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
