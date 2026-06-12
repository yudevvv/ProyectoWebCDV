"use client";

import { useEffect, useState } from "react";
import { getAllUsers, getAllClubs, getUserDocument } from "@/lib/firebase/firestore";
import { updateUserClubs, updateUserRole, createUserDocument } from "@/lib/firebase/admin-fns";
import type { AppUser, Club, UserRole } from "@/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SuperAdminUsuarios() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [selectedClubs, setSelectedClubs] = useState<Record<string, UserRole>>({});
  const [newRole, setNewRole] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newUid, setNewUid] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    getAllUsers().then(setUsers);
    getAllClubs().then(setClubs).finally(() => setLoading(false));
  }, []);

  const clubMap = new Map(clubs.map((c) => [c.id, c]));

  const handleSync = async () => {
    if (!newUid || !newEmail) { toast.error("Ingresa UID y email"); return; }
    setSyncing(true);
    try {
      if (await getUserDocument(newUid)) {
        toast.error("Ese usuario ya existe en Firestore");
        return;
      }
      await createUserDocument(newUid, { email: newEmail, displayName: newEmail.split("@")[0] });
      toast.success("Usuario sincronizado");
      setNewUid("");
      setNewEmail("");
      Promise.all([getAllUsers(), getAllClubs()]).then(([u, c]) => { setUsers(u); setClubs(c); });
    } catch { toast.error("Error al sincronizar"); }
    finally { setSyncing(false); }
  };

  const openEditor = (user: AppUser) => {
    setEditing(user.uid);
    setSelectedClubs({ ...user.roles.clubs });
    setNewRole(user.roles.superadmin);
  };

  const toggleClub = (clubId: string) => {
    setSelectedClubs((prev) => {
      const next = { ...prev };
      if (next[clubId]) delete next[clubId];
      else next[clubId] = "club_admin";
      return next;
    });
  };

  const save = async (uid: string) => {
    setSaving(true);
    try {
      await Promise.all([
        updateUserClubs(uid, selectedClubs),
        updateUserRole(uid, newRole),
      ]);
      setUsers((prev) =>
        prev.map((u) =>
          u.uid === uid
            ? { ...u, roles: { superadmin: newRole, clubs: selectedClubs } }
            : u
        )
      );
      setEditing(null);
      toast.success("Guardado");
    } catch { toast.error("Error al guardar"); }
    finally { setSaving(false); }
  };

  if (loading) return <p className="text-sm text-slate-400 font-mono">Cargando...</p>;

  return (
    <div>
      <div className="mb-6">
        <p className="text-[10px] font-mono text-slate-400 mb-1">$ ./usuarios --list</p>
        <h1 className="text-2xl font-bold text-slate-900">
          <span className="text-cyan-500">&gt;</span> Usuarios ({users.length})
        </h1>
      </div>

      <div className="mb-6 rounded-lg border bg-slate-50 p-4">
        <p className="text-xs font-mono text-slate-500 mb-2">
          $ Sincronizar desde Firebase Auth
        </p>
        <p className="text-[10px] font-mono text-slate-400 mb-3">
          Si creaste un usuario en Firebase Auth Console, pega su UID y email.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Input placeholder="UID" value={newUid} onChange={(e) => setNewUid(e.target.value)} className="max-w-[200px] font-mono text-xs" />
          <Input placeholder="Email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="max-w-[200px] font-mono text-xs" />
          <Button type="button" variant="outline" size="sm" onClick={handleSync} disabled={syncing || !newUid || !newEmail} className="text-xs font-mono">
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
                <th className="px-4 py-3">Clubes</th>
                <th className="px-4 py-3">Registro</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const clubIds = Object.keys(user.roles.clubs);
                const userClubs = clubIds.map((id) => clubMap.get(id)).filter(Boolean);
                const isEditing = editing === user.uid;

                return (
                  <tr key={user.uid} className={`border-b last:border-0 ${isEditing ? "bg-cyan-50" : "hover:bg-slate-50"}`}>
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-900">{user.email}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-slate-400">
                      {user.uid.slice(0, 12)}...
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <button
                          onClick={() => setNewRole(!newRole)}
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-mono font-bold transition-all ${
                            newRole
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {newRole ? "superadmin" : "cliente"}
                        </button>
                      ) : user.roles.superadmin ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-700">
                          superadmin
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">cliente</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {clubs.map((club) => {
                            const assigned = selectedClubs[club.id];
                            return (
                              <button
                                key={club.id}
                                onClick={() => toggleClub(club.id)}
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono transition-all ${
                                  assigned
                                    ? "bg-cyan-100 text-cyan-700 border border-cyan-300"
                                    : "bg-white text-slate-400 border border-slate-200 hover:border-slate-300"
                                }`}
                              >
                                {assigned && <span className="text-emerald-600">&#10003;</span>}
                                {club.name}
                              </button>
                            );
                          })}
                        </div>
                      ) : userClubs.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {userClubs.map((club) => (
                            <span key={club!.id} className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-600">
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
                    <td className="px-4 py-3 whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex gap-1">
                          <button onClick={() => save(user.uid)} disabled={saving} className="text-xs font-mono text-emerald-600 hover:underline disabled:opacity-50">
                            {saving ? "Guardando..." : "Guardar"}
                          </button>
                          <button onClick={() => setEditing(null)} className="text-xs font-mono text-slate-400 hover:underline">
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => openEditor(user)} className="text-xs font-mono text-cyan-600 hover:underline">
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
                    No hay usuarios registrados en Firestore. Usa el formulario de arriba.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
