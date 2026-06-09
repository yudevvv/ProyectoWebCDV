"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClub } from "@/hooks/useFirestore";
import Image from "next/image";

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

  const primary = club?.colors.primary ?? "#0891b2";

  return (
    <nav className="border-b bg-white sticky top-0 z-50" style={{ borderColor: `${primary}20` }}>
      <div className="container mx-auto flex h-16 items-center gap-3 px-4">
        {club?.logo ? (
          <Image
            src={club.logo}
            alt={club.name}
            width={36}
            height={36}
            className="rounded-full object-cover shrink-0"
          />
        ) : (
          <div
            className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: primary }}
          >
            {club?.name?.charAt(0) ?? "?"}
          </div>
        )}
        <div className="flex flex-col leading-tight mr-2 shrink-0">
          <span className="font-bold text-sm">{club?.name ?? "Club"}</span>
          <span className="text-xs text-muted-foreground">Panel de Administración</span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto ml-4">
          {adminLinks.map((link) => {
            const fullHref = `/admin/${clubId}${link.href}`;
            const isActive = pathname === fullHref;
            return (
              <Link
                key={link.href}
                href={fullHref}
                className="px-3 py-1.5 rounded-md transition-colors whitespace-nowrap text-sm font-medium"
                style={{
                  backgroundColor: isActive ? `${primary}12` : "transparent",
                  color: isActive ? primary : "var(--muted-foreground)",
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
