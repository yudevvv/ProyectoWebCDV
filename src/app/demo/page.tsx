import { ArrowRight, User, Monitor, Smartphone, Globe, ShoppingBag, ClipboardCheck } from "lucide-react";
import Link from "next/link";

const features = [
  { icon: Monitor, title: "Dashboard", desc: "Próximos partidos, resultados y estadísticas del equipo" },
  { icon: User, title: "Jugadores", desc: "Perfiles con estadísticas y rendimiento" },
  { icon: Globe, title: "Portal Hinchas", desc: "Noticias, calendario, MVP y más" },
  { icon: Smartphone, title: "MVP del Partido", desc: "Sistema de votación completamente funcional" },
  { icon: ShoppingBag, title: "Tienda", desc: "Productos y merchandising del club" },
  { icon: ClipboardCheck, title: "Panel Admin", desc: "Gestión de socios, noticias y configuraciones" },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="font-bold text-lg text-cyan-600 dark:text-cyan-400">
            TOALESCO
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-mono text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              [Volver]
            </Link>
            <Link
              href="/login?email=demo@toalesco.cl&password=demo123"
              className="text-xs font-mono font-bold px-4 py-2 rounded text-white bg-cyan-600 hover:bg-cyan-700 border-b-2 border-cyan-800 transition-all"
            >
              Iniciar Sesion
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-[10px] font-mono text-slate-400 mb-2" aria-hidden="true">$ ./demo --info</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
            <span className="text-emerald-500">&gt;</span> Probar la Plataforma
          </h1>
          <p className="text-sm font-mono text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Ingresa con las credenciales de demo y explora todos los modulos.
          </p>
        </div>

        <div className="max-w-md mx-auto mb-14 rounded border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 overflow-hidden">
          <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-2">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
            <span className="ml-2 text-[10px] font-mono text-slate-400 dark:text-slate-500">credenciales.sh</span>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-[10px] font-mono text-slate-400" aria-hidden="true">$ ./auth --credentials</p>
            <div className="flex items-center gap-3 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3">
              <User className="h-5 w-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <div>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Usuario</p>
                <p className="font-mono font-bold text-sm text-slate-900 dark:text-white">demo@toalesco.cl</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3">
              <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Contrasena</p>
                <p className="font-mono font-bold text-sm text-slate-900 dark:text-white">demo123</p>
              </div>
            </div>
            <Link href="/login?email=demo@toalesco.cl&password=demo123" className="block">
              <div className="mt-2 flex h-10 w-full items-center justify-center rounded bg-cyan-600 hover:bg-cyan-700 border-b-2 border-cyan-800 text-xs font-mono font-bold text-white transition-all cursor-pointer">
                Iniciar Sesion <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </Link>
          </div>
        </div>

        <div className="text-center mb-14">
          <p className="text-[10px] font-mono text-slate-400 mb-4" aria-hidden="true">$ ./modulos --list</p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            <span className="text-cyan-500">&gt;</span> Lo que puedes explorar
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {features.map((item) => (
              <div key={item.title} className="rounded border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 hover:border-cyan-200 dark:hover:border-cyan-800 transition-colors">
                <item.icon className="h-6 w-6 text-cyan-600 dark:text-cyan-400 mb-3" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center border-t border-slate-200 dark:border-slate-800 pt-8">
          <p className="text-[10px] font-mono text-slate-400">
            $ ./contacto --email&nbsp;
            <a href="mailto:toalesco@tutamail.com" className="text-cyan-600 dark:text-cyan-400 hover:underline">
              toalesco@tutamail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
