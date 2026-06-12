"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClub } from "@/hooks/useFirestore";
import { useDemoMode } from "@/lib/demo-mode";
import { useState } from "react";
import { Menu, X } from "lucide-react";

type AdminNavProps = {
  clubId: string;
};

const adminLinks = [
  { href: "", label: "Dashboard" },
  { href: "/jugadores", label: "Jugadores" },
  { href: "/partidos", label: "Partidos" },
  { href: "/estadisticas", label: "Estadisticas" },
  { href: "/socios", label: "Socios" },
  { href: "/noticias", label: "Noticias" },
  { href: "/tienda", label: "Tienda" },
  { href: "/auspiciadores", label: "Auspiciadores" },
  { href: "/historia", label: "Historia" },
  { href: "/configuracion", label: "Config" },
];

export function AdminNav({ clubId }: AdminNavProps) {
  const { data: club } = useClub(clubId);
  const { isDemo } = useDemoMode(clubId);
  const pathname = usePathname();
  const primary = club?.colors?.primary ?? "#0891b2";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {isDemo && (
        <div className="bg-amber-50 dark:bg-amber-950 border-b border-amber-200 dark:border-amber-800 px-4 py-1.5 text-center text-xs font-mono text-amber-700 dark:text-amber-300">
          $ MODO DEMO — Solo lectura
        </div>
      )}
      <nav className="border-b border-border bg-background sticky top-0 z-40">
        <div className="mx-auto flex h-14 items-center gap-3 px-4" style={{ borderBottom: `2px solid ${primary}18` }}>
          {club?.logo ? (
            <img
              src={club.logo}
              alt={club.name}
              className="w-7 h-7 rounded-full object-cover shrink-0"
            />
          ) : (
            <div
              className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-xs"
              style={{ backgroundColor: primary }}
            >
              {club?.name?.charAt(0) ?? "?"}
            </div>
          )}
          <span className="font-semibold text-sm text-foreground mr-auto sm:mr-4 truncate">{club?.name ?? "Club"}</span>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label={menuOpen ? "Cerrar menu" : "Abrir menu"}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="hidden sm:flex items-center gap-0.5 overflow-x-auto">
            {adminLinks.map((link) => {
              const fullHref = `/admin/${clubId}${link.href}`;
              const isActive = pathname === fullHref;
              return (
                <Link
                  key={link.href}
                  href={fullHref}
                  className="px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap"
                  style={{
                    color: isActive ? primary : undefined,
                    backgroundColor: isActive ? `${primary}18` : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = `${primary}0a`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {menuOpen && (
          <div className="sm:hidden border-t border-border bg-background px-4 py-3 space-y-1 shadow-lg">
            {adminLinks.map((link) => {
              const fullHref = `/admin/${clubId}${link.href}`;
              const isActive = pathname === fullHref;
              return (
                <Link
                  key={link.href}
                  href={fullHref}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium rounded-md transition-colors"
                  style={{
                    color: isActive ? primary : undefined,
                    backgroundColor: isActive ? `${primary}15` : undefined,
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </>
  );
}
