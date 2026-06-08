import Link from "next/link";

type ClubNavProps = {
  slug: string;
  clubName?: string;
};

const links = [
  { href: "", label: "Inicio" },
  { href: "/historia", label: "Historia" },
  { href: "/plantel", label: "Plantel" },
  { href: "/partidos", label: "Partidos" },
  { href: "/estadisticas", label: "Estadísticas" },
  { href: "/noticias", label: "Noticias" },
  { href: "/tienda", label: "Tienda" },
  { href: "/fanzone", label: "Fan Zone" },
  { href: "/auspiciadores", label: "Auspiciadores" },
];

export function ClubNav({ slug, clubName }: ClubNavProps) {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex h-14 items-center gap-6 px-4">
        <Link
          href={`/clubes/${slug}`}
          className="font-bold text-sm truncate shrink-0"
        >
          {clubName || slug}
        </Link>
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={`/clubes/${slug}${link.href}`}
              className="px-3 py-1.5 rounded-md hover:bg-muted transition-colors whitespace-nowrap text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
