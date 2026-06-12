"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClub } from "@/hooks/useFirestore";


type AdminNavProps = {
  clubId: string;
};

const adminLinks = [
  { href: "", label: "Dashboard" },
  { href: "/jugadores", label: "Jugadores" },
  { href: "/partidos", label: "Partidos" },
  { href: "/estadisticas", label: "Estadísticas" },
  { href: "/socios", label: "Socios" },
  { href: "/noticias", label: "Noticias" },
  { href: "/tienda", label: "Tienda" },
  { href: "/auspiciadores", label: "Auspiciadores" },
  { href: "/historia", label: "Historia" },
  { href: "/configuracion", label: "Configuración" },
];

export function AdminNav({ clubId }: AdminNavProps) {
  const { data: club } = useClub(clubId);
  const pathname = usePathname();
  const primary = club?.colors?.primary ?? "#0891b2";

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto flex h-14 items-center gap-3 px-4" style={{ borderBottom: `2px solid ${primary}18` }}>
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
        <span className="font-semibold text-sm mr-4">{club?.name ?? "Club"}</span>

        <div className="flex items-center gap-0.5 overflow-x-auto">
          {adminLinks.map((link) => {
            const fullHref = `/admin/${clubId}${link.href}`;
            const isActive = pathname === fullHref;
            return (
              <Link
                key={link.href}
                href={fullHref}
                className="px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap"
                style={{
                  color: isActive ? primary : "var(--muted-foreground)",
                  backgroundColor: isActive ? `${primary}0d` : "transparent",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
