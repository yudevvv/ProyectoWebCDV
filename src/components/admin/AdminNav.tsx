import Link from "next/link";

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
];

export function AdminNav({ clubId }: AdminNavProps) {
  return (
    <nav className="border-b bg-muted/30">
      <div className="container mx-auto flex h-14 items-center gap-1 px-4 overflow-x-auto text-sm font-medium">
        <span className="font-bold text-base mr-4 shrink-0">Panel</span>
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={`/admin/${clubId}${link.href}`}
            className="px-3 py-1.5 rounded-md hover:bg-muted transition-colors whitespace-nowrap text-muted-foreground hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
