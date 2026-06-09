import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Check, Building2, Users, Calendar, ShoppingBag, Trophy, BarChart3, DollarSign, Zap, Smartphone, Globe, Shield, Server, Code, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Plataforma", href: "#plataforma" },
  { label: "Servicios", href: "#servicios" },
  { label: "Precios", href: "#precios" },
  { label: "Demo", href: "/demo" },
  { label: "Contacto", href: "mailto:contacto@toalesco.cl" },
];

const metrics = [
  { value: "+5000", label: "Hinchas potenciales conectados" },
  { value: "+100", label: "Módulos desarrollados" },
  { value: "24/7", label: "Acceso desde cualquier lugar" },
  { value: "100%", label: "Personalizable" },
];

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

const stellarFeatures = [
  "Registro de contratos", "Historial salarial", "Fechas de renovación", "Bonificaciones",
  "Incentivos por rendimiento", "Alertas de vencimiento", "Control de pagos", "Exportación de reportes",
];

const services = [
  { icon: Code, title: "Desarrollo Web", description: "Sitios corporativos, landing pages y plataformas personalizadas" },
  { icon: Server, title: "Software a Medida", description: "Sistemas adaptados a procesos específicos" },
  { icon: Zap, title: "Automatizaciones", description: "Automatización de tareas repetitivas y procesos internos" },
  { icon: Smartphone, title: "Integraciones", description: "APIs, ERP, CRM, WhatsApp y herramientas empresariales" },
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

const servicePlans = [
  { name: "Desarrollo Web", price: "Desde $199.000", period: "", features: ["Landing pages", "Sitios corporativos", "Plataformas web"] },
  { name: "Software a Medida", price: "Cotización", period: "personalizada", features: ["Sistemas adaptados", "Procesos específicos", "Escalable"] },
  { name: "Automatizaciones", price: "Desde $299.000", period: "", features: ["Tareas repetitivas", "Procesos internos", "Workflows"] },
];

const team = [
  { name: "Ignacio Colún", role: "Fundador", initials: "IC" },
  { name: "Felipe Aguayo", role: "Desarrollador", initials: "FA" },
  { name: "Alejandro Peña", role: "Desarrollador", initials: "AP" },
];

const articles = [
  "Cómo conseguir patrocinadores para tu club",
  "Cómo aumentar la base de socios",
  "Cómo conseguir financiamiento deportivo",
  "Cómo vender merchandising online",
  "Cómo profesionalizar un club deportivo",
];

function TerminalWindow({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`border-2 border-slate-200 rounded-md overflow-hidden bg-white ${className}`}>
      <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 border-b-2 border-slate-200">
        <span className="w-3 h-3 rounded-full bg-red-400" />
        <span className="w-3 h-3 rounded-full bg-amber-400" />
        <span className="w-3 h-3 rounded-full bg-emerald-400" />
        <span className="text-[10px] font-mono text-slate-400 ml-2 truncate">{title}</span>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans">
      <style>{`
        @keyframes scan { 0%, 100% { top: -10%; } 50% { top: 110%; } }
        @keyframes flicker { 0%, 100% { opacity: 1; } 92% { opacity: 1; } 93% { opacity: 0.8; } 94% { opacity: 1; } 96% { opacity: 0.9; } 97% { opacity: 1; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes pulse-border { 0%, 100% { border-color: rgb(8 145 178 / 0.3); } 50% { border-color: rgb(8 145 178 / 0.6); } }
        .scan-line { position: absolute; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(8,145,178,0.25), transparent); animation: scan 3s ease-in-out infinite; pointer-events: none; }
        .crt { animation: flicker 0.15s infinite; }
        .cursor-blink::after { content: "█"; animation: blink 0.8s step-end infinite; color: #0891b2; font-size: 0.8em; margin-left: 2px; }
        .terminal-box { border: 2px solid #0891b2; border-radius: 0.375rem; background: white; }
        .terminal-box:focus-within { animation: pulse-border 2s ease-in-out infinite; }
        .glitch-hover:hover { filter: drop-shadow(0 0 4px rgba(8,145,178,0.5)); }
      `}</style>

      <div className="fixed inset-0 pointer-events-none z-[100] opacity-10">
        <div className="scan-line" />
      </div>

      {/* ===== NAVBAR ===== */}
      <header className="relative z-50 border-b-2 border-slate-200 bg-white">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-emerald-700" />
            <Link href="/" className="text-base font-bold tracking-tight text-slate-900 font-mono">
              TOALESCO
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) =>
              link.href.startsWith("#") ? (
                <a key={link.label} href={link.href} className="px-3 py-1.5 text-xs font-mono font-medium text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 rounded transition-all">
                  [{link.label}]
                </a>
              ) : link.href.startsWith("mailto:") ? (
                <a key={link.label} href={link.href} className="px-3 py-1.5 text-xs font-mono font-medium text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 rounded transition-all">
                  [{link.label}]
                </a>
              ) : (
                <Link key={link.label} href={link.href} className="px-3 py-1.5 text-xs font-mono font-medium text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 rounded transition-all">
                  [{link.label}]
                </Link>
              )
            )}
            <a
              href="mailto:contacto@toalesco.cl?subject=Solicitar%20Demo"
              className="ml-2 inline-flex h-7 items-center gap-1 rounded bg-cyan-600 hover:bg-cyan-700 px-3 text-[11px] font-mono font-bold text-white transition-all"
            >
              EJECUTAR_CONTACTO &gt;
            </a>
          </nav>
          <div className="md:hidden flex flex-col gap-1 p-1">
            <span className="block h-0.5 w-5 bg-slate-400 rounded" />
            <span className="block h-0.5 w-5 bg-slate-400 rounded" />
            <span className="block h-0.5 w-5 bg-slate-400 rounded" />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-50 via-white to-white" />
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-cyan-400/10 blur-[120px]" />
          <div className="container mx-auto px-4 relative">
            <div className="max-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white border-2 border-emerald-200 rounded px-3 py-1 mb-5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider">Sistema Operando 24/7</span>
              </div>
              <p className="text-xs font-mono text-slate-400 mb-3">$ ./toalesco --deploy</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-slate-900 glitch-hover">
                Transformamos clubes deportivos en{" "}
                <span className="text-cyan-600 underline decoration-cyan-300 underline-offset-8 decoration-2">organizaciones digitales.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base text-slate-500 leading-relaxed font-mono">
                Gestiona socios, jugadores, estadísticas, pagos, patrocinadores y la experiencia de tus hinchas desde una única plataforma.
              </p>
              <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                <a
                  href="mailto:contacto@toalesco.cl?subject=Solicitar%20Demo"
                  className="inline-flex h-11 items-center justify-center rounded bg-cyan-600 hover:bg-cyan-700 hover:shadow-lg hover:shadow-cyan-600/25 px-7 text-sm font-mono font-bold text-white transition-all border-b-2 border-cyan-800"
                >
                  Solicitar Demo
                </a>
                <a
                  href="#plataforma"
                  className="inline-flex h-11 items-center justify-center rounded border-2 border-slate-300 bg-white hover:border-cyan-400 hover:text-cyan-600 hover:shadow-md px-7 text-sm font-mono font-medium text-slate-700 transition-all"
                >
                  Ver Plataforma
                </a>
              </div>
              <div className="mt-10">
                <TerminalWindow title="toalesco/metrics.txt">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {metrics.map((m) => (
                      <div key={m.label} className="border border-slate-200 rounded p-3 text-center bg-white">
                        <p className="text-xl md:text-2xl font-bold text-cyan-600 font-mono">{m.value}</p>
                        <p className="mt-0.5 text-[10px] text-slate-500 font-mono uppercase tracking-wider">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </TerminalWindow>
              </div>
            </div>
          </div>
        </section>

        {/* ===== PROBLEMS ===== */}
        <section className="py-16 bg-slate-50 border-t-2 border-b-2 border-slate-200">
          <div className="container mx-auto px-4">
            <p className="text-xs font-mono text-slate-400 text-center mb-2">$ ./diagnostico.sh --scan</p>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 max-w-2xl mx-auto">
              <span className="text-red-500">&gt;</span> La mayoría de los clubes siguen gestionando todo manualmente.
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto">
              {problems.map((p, idx) => (
                <div key={p.title} className="border-2 border-slate-200 bg-white rounded p-5 hover:border-red-300 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-mono font-bold text-red-400 shrink-0">[ERROR_{idx + 1}]</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-red-50 text-red-500 shrink-0">
                      <p.icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 font-mono ml-[4.5rem]">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== MÓDULOS ===== */}
        <section id="plataforma" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <p className="text-xs font-mono text-slate-400 text-center mb-2">$ ls /toalesco/modules/</p>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900">
              <span className="text-cyan-600">&gt;</span> Todo tu club en una sola plataforma.
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {modules.map((mod) => (
                <div key={mod.title} className="border-2 border-slate-200 bg-white rounded p-5 hover:border-cyan-300 hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded bg-cyan-50 text-cyan-600">
                      <mod.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{mod.title}</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {mod.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-slate-500 font-mono">
                        <span className="text-emerald-500 font-bold shrink-0">$</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SUELDOS Y CONTRATOS ===== */}
        <section className="relative overflow-hidden py-16 border-t-2 border-b-2 border-slate-200">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-emerald-50" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-amber-50 border-2 border-amber-200 rounded px-3 py-1 mb-3">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-amber-700 uppercase">Próximamente</span>
              </div>
              <p className="text-xs font-mono text-slate-400 mb-1">$ ./modulo_sueldos --preview</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                <span className="text-cyan-600">&gt;</span> Gestión de Sueldos y Contratos
              </h2>
              <p className="mt-2 text-sm text-slate-500 max-w-2xl font-mono">
                Sistema diseñado para clubes que necesitan controlar información financiera de jugadores y cuerpo técnico.
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2 md:grid-cols-4">
                {stellarFeatures.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-slate-600 font-mono bg-white/80 rounded px-3 py-2 border border-slate-200">
                    <span className="text-emerald-500 font-bold shrink-0">+</span>
                    {f}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono bg-amber-50 text-amber-700 border-2 border-amber-200 rounded px-2 py-1 font-bold">
                  ⚠ EN DESARROLLO
                </span>
                <span className="text-[10px] font-mono bg-cyan-50 text-cyan-700 border-2 border-cyan-200 rounded px-2 py-1 font-bold">
                  ▸ DISPONIBLE PRÓXIMAMENTE
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== DEMO ===== */}
        <section className="py-16 bg-slate-900 border-t-2 border-b-2 border-slate-700">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs font-mono text-slate-500 mb-2">$ ./demo --start</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              <span className="text-emerald-400">&gt;</span> Prueba la plataforma
            </h2>
            <p className="mt-2 text-sm text-slate-400 font-mono">
              La mejor forma de entender TOALESCO es usarla.
            </p>
            <Link
              href="/demo"
              className="inline-flex mt-6 h-11 items-center justify-center rounded bg-emerald-600 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/25 px-8 text-sm font-mono font-bold text-white transition-all border-b-2 border-emerald-800"
            >
              Ingresar a Demo <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <div className="mt-6 inline-flex items-center gap-4 rounded bg-slate-800 px-5 py-3 text-xs font-mono text-slate-300 border-2 border-slate-700">
              <span className="flex items-center gap-2">
                <span className="text-slate-500 font-bold">USUARIO:</span>
                <span className="text-cyan-400 font-bold bg-slate-900/50 px-2 py-0.5 rounded">demo@toalesco.cl</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-2">
                <span className="text-slate-500 font-bold">CLAVE:</span>
                <span className="text-cyan-400 font-bold bg-slate-900/50 px-2 py-0.5 rounded">demo123</span>
              </span>
            </div>
          </div>
        </section>

        {/* ===== INSTAGRAM ===== */}
        <section className="py-16 bg-white border-b-2 border-slate-200">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto">
              <p className="text-xs font-mono text-slate-400 text-center mb-3">$ curl -s https://instagram.com/toalesco 2&gt;&amp;1</p>
              <div className="border-2 border-slate-200 bg-white rounded p-6 text-center hover:border-purple-300 transition-all">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <svg className="h-6 w-6 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  <span className="text-lg font-bold text-slate-900 font-mono">@toalesco</span>
                </div>
                <p className="text-xs font-mono text-slate-500 mb-4">
                  Seguinos en Instagram para ver novedades, lanzamientos y contenido sobre gestión deportiva.
                </p>
                <a
                  href="https://instagram.com/toalesco"
                  target="_blank"
                  className="inline-flex h-9 items-center justify-center rounded bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-5 text-xs font-mono font-bold text-white transition-all border-b-2 border-purple-800"
                >
                  Seguir @toalesco ▸
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ===== EQUIPO ===== */}
        <section className="py-16 bg-slate-50 border-b-2 border-slate-200">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs font-mono text-slate-400 mb-2">$ cat /toalesco/team.json | jq</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              <span className="text-cyan-600">&gt;</span> Equipo
            </h2>
            <p className="mt-2 text-xs font-mono text-slate-500">Detrás de TOALESCO hay un equipo comprometido con el deporte.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              {team.map((t) => (
                <div key={t.name} className="border-2 border-slate-200 rounded p-5 bg-white w-44 hover:border-cyan-300 hover:shadow-md transition-all">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center mx-auto mb-3 border-2 border-cyan-300">
                    <span className="text-lg font-bold text-cyan-700 font-mono">{t.initials}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{t.name}</h3>
                  <p className="text-[10px] font-mono font-medium text-cyan-600 mt-1 uppercase tracking-wider">{t.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SERVICES ===== */}
        <section id="servicios" className="py-16 bg-white border-b-2 border-slate-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs font-mono text-slate-400 mb-2">$ ls /toalesco/services/</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                <span className="text-cyan-600">&gt;</span> También desarrollamos soluciones digitales para empresas
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
              {services.map((svc) => (
                <div key={svc.title} className="border-2 border-slate-200 bg-white rounded p-5 text-center hover:border-cyan-300 hover:shadow-md transition-all">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-cyan-50 text-cyan-600 mx-auto mb-3">
                    <svc.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{svc.title}</h3>
                  <p className="text-xs font-mono text-slate-500">{svc.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PRICING ===== */}
        <section id="precios" className="py-16 bg-slate-50 border-b-2 border-slate-200">
          <div className="container mx-auto px-4">
            <p className="text-xs font-mono text-slate-400 text-center mb-2">$ cat /toalesco/pricing.txt</p>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900">
              <span className="text-cyan-600">&gt;</span> Planes
            </h2>

            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4 max-w-2xl mx-auto">
                <span className="text-xs font-mono font-bold text-cyan-600 bg-cyan-50 border-2 border-cyan-200 rounded px-2 py-0.5">PLATAFORMA</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2 max-w-2xl mx-auto">
                {platformPlans.map((plan, idx) => (
                  <div key={plan.name} className={`border-2 rounded p-5 bg-white transition-all hover:shadow-lg ${idx === 1 ? "border-cyan-400 shadow-md" : "border-slate-200 hover:border-cyan-300"}`}>
                    {idx === 1 && <span className="text-[10px] font-mono font-bold text-cyan-600 bg-cyan-50 border border-cyan-200 rounded px-2 py-0.5 mb-2 inline-block">RECOMENDADO</span>}
                    <p className="text-sm font-bold text-slate-900 mb-1">{plan.name}</p>
                    <p className="text-2xl font-bold text-slate-900 font-mono">{plan.price}<span className="text-xs text-slate-500 font-normal ml-1">{plan.period}</span></p>
                    <ul className="mt-4 space-y-1.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-slate-600 font-mono">
                          <span className="text-emerald-500 font-bold shrink-0">+</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="mailto:contacto@toalesco.cl?subject=Quiero%20contratar%20${plan.name.replace(/\s/g, '%20')}"
                      className="mt-4 inline-flex h-9 w-full items-center justify-center rounded bg-cyan-600 hover:bg-cyan-700 border-b-2 border-cyan-800 text-xs font-mono font-bold text-white transition-all"
                    >
                      Contratar ▸
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4 max-w-3xl mx-auto">
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 border-2 border-slate-200 rounded px-2 py-0.5">SERVICIOS</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
                {servicePlans.map((plan) => (
                  <div key={plan.name} className="border-2 border-slate-200 bg-white rounded p-5 hover:border-slate-300 hover:shadow-md transition-all">
                    <p className="text-sm font-bold text-slate-900 mb-1">{plan.name}</p>
                    <p className="text-xl font-bold text-slate-900 font-mono">{plan.price}<span className="text-xs text-slate-500 font-normal ml-1">{plan.period}</span></p>
                    <ul className="mt-4 space-y-1.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-slate-600 font-mono">
                          <span className="text-emerald-500 font-bold shrink-0">+</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="mailto:contacto@toalesco.cl?subject=Cotización%20${plan.name.replace(/\s/g, '%20')}"
                      className="mt-4 inline-flex h-9 w-full items-center justify-center rounded border-2 border-slate-300 hover:border-cyan-400 hover:text-cyan-600 hover:bg-cyan-50 text-xs font-mono font-medium text-slate-700 transition-all"
                    >
                      Cotizar ▸
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== RESOURCES ===== */}
        <section id="recursos" className="py-16 bg-white border-b-2 border-slate-200">
          <div className="container mx-auto px-4">
            <p className="text-xs font-mono text-slate-400 text-center mb-2">$ cat /toalesco/resources.md</p>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900">
              <span className="text-cyan-600">&gt;</span> Centro de Recursos para Clubes
            </h2>
            <div className="mt-8 max-w-2xl mx-auto space-y-2">
              {articles.map((a) => (
                <div key={a} className="border-2 border-slate-200 bg-white rounded px-4 py-3 flex items-center gap-2 text-xs font-mono text-slate-600 hover:border-cyan-300 hover:bg-cyan-50/30 transition-all cursor-default">
                  <span className="text-cyan-600 font-bold shrink-0">▸</span>
                  {a}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SUCCESS STORIES ===== */}
        <section className="py-16 bg-slate-50 border-b-2 border-slate-200">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs font-mono text-slate-400 mb-2">$ ls /toalesco/casos_exito/</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              <span className="text-cyan-600">&gt;</span> Casos de Éxito
            </h2>
            <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 border-2 border-amber-200 rounded px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-amber-700 uppercase">Próximamente</span>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-2 border-dashed border-slate-300 bg-slate-50 rounded p-5">
                  <div className="space-y-3">
                    <div className="h-2.5 w-20 rounded bg-slate-200" />
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] font-mono font-bold text-red-400 shrink-0">[ERROR]</span>
                      <div className="h-3 w-full rounded bg-slate-200" />
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 shrink-0">[SOLVE]</span>
                      <div className="h-3 w-full rounded bg-slate-200" />
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 shrink-0">[OK]</span>
                      <div className="h-3 w-full rounded bg-slate-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-700 to-cyan-900" />
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "30px 30px" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="container mx-auto px-4 relative text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded px-3 py-1 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-wider">SISTEMA RECOMIENDA</span>
            </div>
            <p className="text-xs font-mono text-cyan-200 mb-2">$ ./upgrade --force --all</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white max-w-2xl mx-auto leading-tight">
              Tu club merece más que hojas de cálculo y grupos de WhatsApp.
            </h2>
            <p className="mt-3 text-sm text-cyan-100 max-w-xl mx-auto font-mono">
              Digitaliza la gestión de tu institución, mejora la experiencia de tus hinchas y crea nuevas fuentes de ingresos.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
              <a
                href="mailto:contacto@toalesco.cl?subject=Solicitar%20Demo"
                className="inline-flex h-11 items-center justify-center rounded bg-white hover:bg-slate-100 hover:shadow-xl px-7 text-sm font-mono font-bold text-cyan-800 transition-all border-b-2 border-slate-300"
              >
                Solicitar Demo
              </a>
              <a
                href="mailto:contacto@toalesco.cl?subject=Quiero%20hablar%20con%20TOALESCO"
                className="inline-flex h-11 items-center justify-center rounded border-2 border-white/40 hover:bg-white/10 hover:border-white/60 px-7 text-sm font-mono font-medium text-white transition-all"
              >
                Hablar con Nosotros
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t-2 border-slate-200 py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-700" />
              <p className="text-xs font-mono text-slate-500">&copy; 2026 TOALESCO</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <a href="#plataforma" className="text-[10px] font-mono font-medium text-slate-400 hover:text-cyan-600 transition-colors">[Plataforma]</a>
              <a href="#servicios" className="text-[10px] font-mono font-medium text-slate-400 hover:text-cyan-600 transition-colors">[Servicios]</a>
              <a href="#precios" className="text-[10px] font-mono font-medium text-slate-400 hover:text-cyan-600 transition-colors">[Precios]</a>
              <a href="/demo" className="text-[10px] font-mono font-medium text-slate-400 hover:text-cyan-600 transition-colors">[Demo]</a>
              <a href="mailto:contacto@toalesco.cl" className="text-[10px] font-mono font-medium text-slate-400 hover:text-cyan-600 transition-colors">[Contacto]</a>
            </div>
            <p className="text-[10px] font-mono font-bold text-slate-400">
              <span className="text-emerald-500">●</span> SYS_STATUS: <span className="text-emerald-500">OPERANDO 24/7</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
