"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/providers/ThemeProvider";
import { Moon, Sun, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Servicios", href: "#servicios" },
  { label: "Clubes", href: "#clubes" },
  { label: "Equipo", href: "#equipo" },
  { label: "Demo", href: "/demo" },
  { label: "Contacto", href: "mailto:toalesco@tutamail.com" },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b-2 border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors"
      role="banner"
    >
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="text-base font-bold tracking-tight text-slate-900 dark:text-white font-mono shrink-0" aria-label="TOALESCO inicio">
          TOALESCO
        </Link>

        <nav className="hidden md:flex items-center gap-0.5" aria-label="Navegación principal">
          {navLinks.map((link) =>
            link.href.startsWith("#") ? (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 text-xs font-mono font-medium text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 rounded transition-all"
              >
                [{link.label}]
              </a>
            ) : link.href.startsWith("mailto:") ? (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 text-xs font-mono font-medium text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 rounded transition-all"
              >
                [{link.label}]
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 text-xs font-mono font-medium text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 rounded transition-all"
              >
                [{link.label}]
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={toggle}
            className="flex h-8 w-8 items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
            title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
          >
            {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-500" />}
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4 text-slate-600 dark:text-slate-300" /> : <Menu className="h-4 w-4 text-slate-600 dark:text-slate-300" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="md:hidden border-t-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 space-y-1"
          aria-label="Menú móvil"
        >
          {navLinks.map((link) =>
            link.href.startsWith("#") ? (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm font-mono font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 rounded transition-all"
              >
                [{link.label}]
              </a>
            ) : link.href.startsWith("mailto:") ? (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm font-mono font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 rounded transition-all"
              >
                [{link.label}]
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm font-mono font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 rounded transition-all"
              >
                [{link.label}]
              </Link>
            )
          )}
        </nav>
      )}
    </header>
  );
}
