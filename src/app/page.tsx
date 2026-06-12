import { Building2, Users, ShoppingBag, Trophy, BarChart3, DollarSign, Globe, Shield, Server, Code, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";

const problems = [
  { icon: Building2, title: "Gestión desordenada", description: "Socios, jugadores y pagos distribuidos entre Excel, WhatsApp y documentos." },
  { icon: Users, title: "Poco compromiso", description: "Los hinchas no tienen un lugar centralizado para seguir al club." },
  { icon: DollarSign, title: "Menos ingresos", description: "Se desaprovechan oportunidades de patrocinio, merchandising y membresías." },
  { icon: BarChart3, title: "Falta de datos", description: "No existen estadísticas ni métricas para tomar decisiones." },
];

const modules = [
  { icon: Users, title: "Gestión de Socios", features: ["Registro digital", "Control de pagos", "Historial completo", "Membresías"] },
  { icon: Globe, title: "Portal de Hinchas", features: ["Noticias", "Calendario", "Resultados", "Tabla de posiciones"] },
  { icon: Trophy, title: "Participación", features: ["MVP del partido", "Encuestas", "Predicciones", "Fan Zone"] },
  { icon: Shield, title: "Patrocinadores", features: ["Espacios publicitarios", "Estadísticas de visibilidad", "Gestión de auspiciadores"] },
  { icon: ShoppingBag, title: "Tienda Online", features: ["Venta de productos", "Control de stock", "Promociones"] },
  { icon: BarChart3, title: "Estadísticas Deportivas", features: ["Jugadores", "Equipos", "Temporadas", "Historial"] },
];

const allServices = [
  { icon: Globe, title: "Landing Pages", description: "Sitios web profesionales para tu negocio o emprendimiento. Diseño moderno, responsive y optimizado.", tag: "NUEVO" },
  { icon: Trophy, title: "Plataforma Clubes", description: "Sistema completo de gestión para clubes deportivos: socios, estadísticas, tienda y más.", tag: "PRINCIPAL", highlight: true },
  { icon: Users, title: "RRHH", description: "Gestión de personal, contratos, asistencias, vacaciones y remuneraciones.", tag: "NUEVO" },
  { icon: ShoppingBag, title: "Puntos de Venta", description: "Sistema de ventas con control de inventario, boletas electrónicas y reportes.", tag: "NUEVO" },
  { icon: Server, title: "Soporte TI", description: "Apoyo en terreno, mantención de equipos, redes y asistencia técnica.", tag: "NUEVO" },
  { icon: Code, title: "Sistema de Jugadores", description: "Gestión de fichajes, contratos, rendimiento y scouting.", tag: "PRÓXIMAMENTE", coming: true },
];

const platformPlans = [
  {
    name: "Plataforma Club Starter",
    price: "$49.900",
    period: "/mes",
    features: ["Socios", "Patrocinadores", "Noticias", "Calendario", "MVP", "Panel básico"],
  },
  {
    name: "Plataforma Club Pro",
    price: "$99.900",
    period: "/mes",
    features: ["Todo Starter +", "Estadísticas avanzadas", "Tienda Online", "Reportes", "Fan Zone", "Múltiples administradores"],
  },
];

const team = [
  { name: "Ignacio Colún", role: "Fundador & CEO", initials: "IC" },
  { name: "Fernando Carrasco", role: "Co-Fundador & CTO", initials: "FC" },
  { name: "Felipe Aguayo", role: "Desarrollador", initials: "FA" },
  { name: "Alejandro Peña", role: "Desarrollador", initials: "AP" },
];

function TerminalWindow({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`border-2 border-slate-200 dark:border-slate-700 rounded-md overflow-hidden bg-white dark:bg-slate-900 shadow-sm dark:shadow-none ${className}`}>
      <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-200 dark:bg-slate-800 border-b-2 border-slate-200 dark:border-slate-700">
        <span className="w-3 h-3 rounded-full bg-red-400" />
        <span className="w-3 h-3 rounded-full bg-amber-400" />
        <span className="w-3 h-3 rounded-full bg-emerald-400" />
        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-500 ml-2 truncate">{title}</span>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      <style>{`
        @keyframes scan { 0%, 100% { top: -10%; } 50% { top: 110%; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes pulse-border { 0%, 100% { border-color: rgb(8 145 178 / 0.3); } 50% { border-color: rgb(8 145 178 / 0.6); } }
        .scan-line { position: absolute; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(8,145,178,0.25), transparent); animation: scan 3s ease-in-out infinite; pointer-events: none; }
      `}</style>

      <div className="fixed inset-0 pointer-events-none z-[100] opacity-10 dark:opacity-[0.05]">
        <div className="scan-line" />
      </div>

      <Navbar />

      <main className="flex-1">
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-100 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950" />
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-cyan-400/10 dark:bg-cyan-500/5 blur-[120px]" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border-2 border-emerald-200 dark:border-emerald-800 rounded px-3 py-1 mb-5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Sistema Operando 24/7</span>
              </div>
              <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mb-3" aria-hidden="true">$ ./toalesco --init</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-slate-900 dark:text-white">
                <span className="text-cyan-600 dark:text-cyan-400">TOALESCO</span>
                <br />
                <span className="text-3xl sm:text-4xl md:text-5xl">Soluciones Digitales</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base text-slate-500 dark:text-slate-400 leading-relaxed font-mono">
                Transformamos negocios e instituciones con tecnología moderna. Desarrollamos plataformas, sistemas y herramientas digitales adaptadas a cada necesidad.
              </p>
              <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                <a
                  href="#servicios"
                  className="inline-flex h-11 items-center justify-center rounded bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-600/25 dark:hover:shadow-cyan-500/20 px-7 text-sm font-mono font-bold text-white dark:text-slate-900 transition-all border-b-2 border-cyan-800 dark:border-cyan-600"
                >
                  Ver Servicios
                </a>
                <a
                  href="#clubes"
                  className="inline-flex h-11 items-center justify-center rounded border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 hover:border-cyan-400 dark:hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:shadow-md px-7 text-sm font-mono font-medium text-slate-700 dark:text-slate-300 transition-all"
                >
                  Plataforma Clubes
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SERVICIOS ===== */}
        <section id="servicios" className="py-16 bg-slate-100 dark:bg-slate-900 border-t-2 border-b-2 border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4">
            <p className="text-xs font-mono text-slate-400 dark:text-slate-500 text-center mb-2" aria-hidden="true">$ ls /toalesco/servicios/</p>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 dark:text-white">
              <span className="text-cyan-600 dark:text-cyan-400">&gt;</span> Nuestros Servicios
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 text-center font-mono max-w-xl mx-auto">
              Soluciones digitales diseñadas para impulsar tu negocio o institución.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {allServices.map((svc) => (
                <div key={svc.title} className={`border-2 rounded p-5 bg-white dark:bg-slate-800 transition-all shadow-sm hover:shadow-md ${svc.highlight ? "border-cyan-400 dark:border-cyan-500 ring-1 ring-cyan-200 dark:ring-cyan-800" : "border-slate-300 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-600"}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
                      <svc.icon className="h-5 w-5" />
                    </div>
                    {svc.tag && (
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-wider rounded px-2 py-0.5 border ${svc.coming ? "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800" : svc.highlight ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" : "bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800"}`}>
                        {svc.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{svc.title}</h3>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-4">{svc.description}</p>
                  {svc.coming ? (
                    <span className="inline-flex h-8 items-center text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      PRÓXIMAMENTE
                    </span>
                  ) : (
                    <a
                      href={`mailto:toalesco@tutamail.com?subject=Cotización%20${svc.title.replace(/\s/g, '%20')}`}
                      className="inline-flex h-8 items-center justify-center rounded bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 border-b-2 border-cyan-800 dark:border-cyan-600 px-4 text-[10px] font-mono font-bold text-white dark:text-slate-900 transition-all"
                    >
                      Cotizar ▸
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PLATAFORMA CLUBES (COMPACTO + DINÁMICO) ===== */}
        <section id="clubes">
          {/* Cabecera */}
          <div className="py-12 bg-white dark:bg-slate-950 border-b-2 border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4 text-center">
              <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mb-2" aria-hidden="true">$ cat /toalesco/clubes/README.md</p>
              <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950 border-2 border-emerald-200 dark:border-emerald-800 rounded px-3 py-1 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Producto Principal</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                <span className="text-cyan-600 dark:text-cyan-400">&gt;</span> Plataforma para Clubes Deportivos
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-mono max-w-2xl mx-auto">
                Sistema completo de gestión deportiva. Administra socios, jugadores, estadísticas, pagos, patrocinadores y la experiencia de tus hinchas desde una única plataforma.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
                <a href="#clubes-modulos" className="inline-flex h-9 items-center justify-center rounded bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 px-5 text-xs font-mono font-bold text-white dark:text-slate-900 transition-all border-b-2 border-cyan-800 dark:border-cyan-600">
                  Ver Módulos
                </a>
                <a href="#clubes-precios" className="inline-flex h-9 items-center justify-center rounded border-2 border-slate-300 dark:border-slate-600 hover:border-cyan-400 dark:hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 px-5 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 transition-all">
                  Ver Planes
                </a>
                <Link href="/demo" className="inline-flex h-9 items-center justify-center rounded bg-emerald-600 hover:bg-emerald-500 px-5 text-xs font-mono font-bold text-white transition-all border-b-2 border-emerald-800">
                  Probar Demo <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Problemas + Módulos en grid compacto */}
          <div id="clubes-modulos" className="py-10 bg-slate-100 dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
                <div className="lg:col-span-2">
                  <TerminalWindow title="diagnostico.sh">
                    <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mb-3">$ ./diagnostico.sh --scan</p>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                      <span className="text-red-500 dark:text-red-400">&gt;</span> Problemas comunes
                    </h3>
                    <div className="space-y-2">
                      {problems.map((p, idx) => (
                        <div key={p.title} className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded p-2.5">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[9px] font-mono font-bold text-red-400 shrink-0">[E{idx + 1}]</span>
                            <h4 className="text-[11px] font-bold text-slate-900 dark:text-white">{p.title}</h4>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{p.description}</p>
                        </div>
                      ))}
                    </div>
                  </TerminalWindow>
                </div>
                <div className="lg:col-span-3">
                  <TerminalWindow title="modulos.txt">
                    <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mb-3">$ ls /toalesco/clubes/modulos/</p>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                      <span className="text-cyan-600 dark:text-cyan-400">&gt;</span> Módulos incluidos
                    </h3>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {modules.map((mod) => (
                        <div key={mod.title} className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded p-2.5 hover:border-cyan-300 dark:hover:border-cyan-600 transition-all">
                          <div className="flex items-center gap-1.5 mb-1">
                            <div className="flex h-6 w-6 items-center justify-center rounded bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
                              <mod.icon className="h-3.5 w-3.5" />
                            </div>
                            <h4 className="text-[11px] font-bold text-slate-900 dark:text-white">{mod.title}</h4>
                          </div>
                          <ul className="space-y-0.5">
                            {mod.features.map((f) => (
                              <li key={f} className="flex items-start gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                                <span className="text-emerald-500 dark:text-emerald-400 font-bold shrink-0">$</span>
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </TerminalWindow>
                </div>
              </div>

              {/* Sueldos como card inline */}
              <div className="mt-6 max-w-6xl mx-auto">
                <div className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 rounded p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-950 border-2 border-amber-200 dark:border-amber-800 rounded px-2 py-0.5 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[9px] font-mono font-bold text-amber-700 dark:text-amber-400 uppercase">Próximamente</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Gestión de Sueldos y Contratos</p>
                    <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">Control financiero de jugadores y cuerpo técnico: contratos, bonificaciones, incentivos y alertas.</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <span className="text-[9px] font-mono bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded px-1.5 py-0.5 font-bold">⚠ EN DESARROLLO</span>
                    <span className="text-[9px] font-mono bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800 rounded px-1.5 py-0.5 font-bold">▸ PRÓXIMAMENTE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing + Demo lado a lado */}
          <div id="clubes-precios" className="py-10 bg-white dark:bg-slate-950 border-b-2 border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4">
              <p className="text-xs font-mono text-slate-400 dark:text-slate-500 text-center mb-2" aria-hidden="true">$ cat /toalesco/clubes/pricing.txt</p>
              <h3 className="text-lg md:text-xl font-bold text-center text-slate-900 dark:text-white mb-6">
                <span className="text-cyan-600 dark:text-cyan-400">&gt;</span> Planes
              </h3>
              <div className="grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="grid gap-4 sm:grid-cols-2">
                  {platformPlans.map((plan, idx) => (
                    <div key={plan.name} className={`border-2 rounded p-4 bg-white dark:bg-slate-800 transition-all hover:shadow-lg ${idx === 1 ? "border-cyan-400 dark:border-cyan-500 shadow-md dark:shadow-cyan-900/20" : "border-slate-300 dark:border-slate-700 shadow-sm hover:border-cyan-300 dark:hover:border-cyan-600"}`}>
                      {idx === 1 && <span className="text-[9px] font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 rounded px-1.5 py-0.5 mb-1.5 inline-block">RECOMENDADO</span>}
                      <p className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">{plan.name}</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white font-mono">{plan.price}<span className="text-[10px] text-slate-500 font-normal ml-1">{plan.period}</span></p>
                      <ul className="mt-2.5 space-y-1">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-1.5 text-[10px] text-slate-600 dark:text-slate-300 font-mono">
                            <span className="text-emerald-500 dark:text-emerald-400 font-bold shrink-0">+</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <a href={`mailto:toalesco@tutamail.com?subject=Quiero%20contratar%20${plan.name.replace(/\s/g, '%20')}`} className="mt-3 inline-flex h-8 w-full items-center justify-center rounded bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 border-b-2 border-cyan-800 dark:border-cyan-600 text-[10px] font-mono font-bold text-white dark:text-slate-900 transition-all">
                        Contratar ▸
                      </a>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900 dark:bg-black rounded border-2 border-slate-700 dark:border-slate-800 p-5 flex flex-col items-center justify-center text-center">
                  <p className="text-[10px] font-mono text-slate-500 mb-2" aria-hidden="true">$ ./demo --start</p>
                  <h4 className="text-base font-bold text-white">
                     <span className="text-emerald-400">&gt;</span> Prueba la plataforma
                   </h4>
                   <p className="mt-1 text-xs text-slate-400 font-mono max-w-xs">
                     Ingresa con credenciales de demo y explora todos los módulos.
                  </p>
                   <Link href="/login?email=demo@toalesco.cl&password=demo123" className="inline-flex mt-4 h-9 items-center justify-center rounded bg-emerald-600 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/25 px-6 text-xs font-mono font-bold text-white transition-all border-b-2 border-emerald-800">
                     Ingresar a Demo <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                   </Link>
                  <div className="mt-3 inline-flex flex-wrap items-center justify-center gap-1.5 rounded bg-slate-800 dark:bg-slate-900 px-3 py-2 text-[10px] font-mono text-slate-300 border border-slate-700 dark:border-slate-800">
                    <span><span className="text-slate-500 font-bold">USUARIO:</span> <span className="text-cyan-400 font-bold">demo@toalesco.cl</span></span>
                    <span className="text-slate-600 hidden xs:inline">|</span>
                    <span><span className="text-slate-500 font-bold">CLAVE:</span> <span className="text-cyan-400 font-bold">demo123</span></span>
                  </div>
                  <div className="mt-3 text-[10px] font-mono text-slate-500">
                    ¿Preguntas?{" "}
                    <a href="mailto:toalesco@tutamail.com" className="text-cyan-400 hover:text-cyan-300 underline">toalesco@tutamail.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== EQUIPO ===== */}
        <section className="py-16 bg-white dark:bg-slate-950 border-b-2 border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mb-2" aria-hidden="true">$ cat /toalesco/team.json | jq</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              <span className="text-cyan-600 dark:text-cyan-400">&gt;</span> Equipo
            </h2>
            <p className="mt-2 text-xs font-mono text-slate-500 dark:text-slate-400">Detrás de TOALESCO hay un equipo comprometido con la tecnología.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              {team.map((t) => (
                <div key={t.name} className="border-2 border-slate-300 dark:border-slate-700 rounded p-5 bg-white dark:bg-slate-800 w-44 hover:border-cyan-300 dark:hover:border-cyan-600 shadow-sm hover:shadow-md transition-all">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-800 dark:to-cyan-700 flex items-center justify-center mx-auto mb-3 border-2 border-cyan-300 dark:border-cyan-600">
                    <span className="text-lg font-bold text-cyan-700 dark:text-cyan-300 font-mono">{t.initials}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</h3>
                  <p className="text-[10px] font-mono font-medium text-cyan-600 dark:text-cyan-400 mt-1 uppercase tracking-wider">{t.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ===== CONTACTO / REDES (ANTES DEL FOOTER) ===== */}
      <section className="py-14 bg-slate-100 dark:bg-slate-900 border-t-2 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center">
            <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mb-2" aria-hidden="true">$ cat /toalesco/contacto</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6">
              <span className="text-cyan-600 dark:text-cyan-400">&gt;</span> Contacto
            </h2>
            <div className="space-y-4">
              <div className="border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded p-4 shadow-sm">
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-2">Escríbenos directamente:</p>
                <a
                  href="mailto:toalesco@tutamail.com"
                  className="text-sm font-mono font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 underline transition-all"
                >
                  toalesco@tutamail.com
                </a>
              </div>
              <div className="border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded p-4 shadow-sm">
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-3">Seguinos en redes:</p>
                <div className="flex items-center justify-center gap-3">
                  <a
                    href="https://instagram.com/toalesco"
                    target="_blank"
                    className="inline-flex h-10 items-center justify-center rounded bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 dark:from-purple-500 dark:to-pink-500 px-5 text-xs font-mono font-bold text-white transition-all border-b-2 border-purple-800 dark:border-purple-700"
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">&copy; 2026 TOALESCO. Todos los derechos reservados.</p>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <a href="#servicios" className="text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">[Servicios]</a>
              <a href="#clubes" className="text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">[Clubes]</a>
              <Link href="/demo" className="text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">[Demo]</Link>
              <a href="mailto:toalesco@tutamail.com" className="text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">[Contacto]</a>
            </div>
            <p className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">
              <span className="text-emerald-500">●</span> SYS_STATUS: <span className="text-emerald-500">OPERANDO 24/7</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
