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
  { name: "Iúval Yáñez", role: "Fundador & Desarrollador Full Stack", img: "/team/iuv.png" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans">
      <style>{`
        @keyframes scan { 0%, 100% { top: -10%; } 50% { top: 110%; } }
        @keyframes glitch { 0%, 100% { transform: translate(0); } 20% { transform: translate(-1px, 1px); } 40% { transform: translate(1px, -1px); } 60% { transform: translate(-1px, -1px); } 80% { transform: translate(1px, 1px); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .scan-line { position: absolute; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, rgba(8,145,178,0.3), transparent); animation: scan 4s ease-in-out infinite; pointer-events: none; }
        .glitch:hover { animation: glitch 0.3s ease-in-out; }
        .cursor-blink::after { content: "|"; animation: blink 1s step-end infinite; color: #0891b2; }
      `}</style>

      {/* Scanning line effect */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-20">
        <div className="scan-line" />
      </div>

      {/* Particle network canvas */}
      <canvas
        id="particles"
        className="fixed inset-0 pointer-events-none z-0 opacity-30"
      />

      {/* ===== NAVBAR ===== */}
      <header className="relative z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold tracking-tight text-slate-900 shrink-0 font-mono">
            TOALESCO
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.href.startsWith("#") ? (
                <a key={link.label} href={link.href} className="px-2.5 py-1 text-xs font-mono text-slate-500 hover:text-cyan-600 transition-colors">
                  [{link.label}]
                </a>
              ) : link.href.startsWith("mailto:") ? (
                <a key={link.label} href={link.href} className="px-2.5 py-1 text-xs font-mono text-slate-500 hover:text-cyan-600 transition-colors">
                  [{link.label}]
                </a>
              ) : (
                <Link key={link.label} href={link.href} className="px-2.5 py-1 text-xs font-mono text-slate-500 hover:text-cyan-600 transition-colors">
                  [{link.label}]
                </Link>
              )
            )}
          </nav>
          <a
            href="mailto:contacto@toalesco.cl?subject=Solicitar%20Demo"
            className="hidden md:inline-flex h-7 items-center gap-1 rounded-md bg-cyan-600 hover:bg-cyan-700 px-3 text-xs font-mono font-medium text-white transition-all"
          >
            EJECUTAR_CONTACTO &gt;
          </a>
          <div className="md:hidden flex flex-col gap-1 p-2">
            <span className="block h-px w-5 bg-slate-400" />
            <span className="block h-px w-5 bg-slate-400" />
            <span className="block h-px w-5 bg-slate-400" />
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/50 via-white to-white" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-xs font-mono text-slate-400 mb-4">$ ./toalesco --init</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] text-slate-900 glitch">
                Transformamos clubes deportivos en{" "}
                <span className="text-cyan-600">organizaciones digitales.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base text-slate-500 leading-relaxed font-mono">
                Gestiona socios, jugadores, estadísticas, pagos, patrocinadores y la experiencia de tus hinchas desde una única plataforma.
              </p>
              <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                <a
                  href="mailto:contacto@toalesco.cl?subject=Solicitar%20Demo"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-cyan-600 hover:bg-cyan-700 px-6 text-sm font-mono font-medium text-white transition-all"
                >
                  Solicitar Demo
                </a>
                <a
                  href="#plataforma"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white hover:border-cyan-400 hover:text-cyan-600 px-6 text-sm font-mono font-medium text-slate-700 transition-all"
                >
                  Ver Plataforma
                </a>
              </div>
              <div className="mt-10">
                <p className="text-xs font-mono text-slate-400 mb-3">$ cat /toalesco/metrics.txt</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {metrics.map((m) => (
                    <div key={m.label} className="border border-slate-200 rounded-md p-3 bg-white/70 backdrop-blur text-center">
                      <p className="text-xl md:text-2xl font-bold text-cyan-600 font-mono">{m.value}</p>
                      <p className="mt-0.5 text-[10px] text-slate-500 font-mono">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== PROBLEMS ===== */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <p className="text-xs font-mono text-slate-400 text-center mb-2">$ ./diagnostico.sh</p>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 max-w-2xl mx-auto">
              La mayoría de los clubes siguen gestionando todo manualmente.
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {problems.map((p) => (
                <div key={p.title} className="border border-slate-200 bg-white rounded-md p-5 hover:border-cyan-200 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-cyan-50 text-cyan-600">
                      <p.icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">{p.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-mono">{p.description}</p>
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
              Todo tu club en una sola plataforma.
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((mod) => (
                <div key={mod.title} className="border border-slate-200 bg-white rounded-md p-5 hover:border-cyan-200 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-cyan-50 text-cyan-600 mb-3">
                    <mod.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">{mod.title}</h3>
                  <ul className="space-y-1">
                    {mod.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-slate-500 font-mono">
                        <Check className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
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
        <section className="relative overflow-hidden py-16">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-emerald-50" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 mb-3">
                <Badge variant="default" className="bg-cyan-600 text-white text-[10px] font-mono">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Próximamente
                </Badge>
              </div>
              <p className="text-xs font-mono text-slate-400 mb-1">$ ./modulo_sueldos --preview</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                Gestión de Sueldos y Contratos
              </h2>
              <p className="mt-2 text-sm text-slate-500 max-w-2xl font-mono">
                Sistema diseñado para clubes que necesitan controlar información financiera de jugadores y cuerpo técnico.
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2 md:grid-cols-4">
                {stellarFeatures.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                    <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-mono">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  En desarrollo
                </Badge>
                <Badge variant="outline" className="border-cyan-300 text-cyan-700 bg-cyan-50 text-[10px] font-mono">
                  Disponible próximamente
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* ===== DEMO ===== */}
        <section className="py-16 bg-slate-900">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs font-mono text-slate-500 mb-2">$ ./demo --start</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Prueba la plataforma</h2>
            <p className="mt-2 text-sm text-slate-400 font-mono">
              La mejor forma de entender TOALESCO es usarla.
            </p>
            <Link
              href="/demo"
              className="inline-flex mt-6 h-10 items-center justify-center rounded-md bg-cyan-600 hover:bg-cyan-500 px-8 text-sm font-mono font-medium text-white transition-all"
            >
              Ingresar a Demo
            </Link>
            <div className="mt-6 inline-flex items-center gap-3 rounded-md bg-slate-800 px-5 py-2.5 text-xs font-mono text-slate-300 border border-slate-700">
              <span><span className="text-slate-500">USUARIO:</span> <span className="text-cyan-400">demo@toalesco.cl</span></span>
              <span className="text-slate-600">|</span>
              <span><span className="text-slate-500">CLAVE:</span> <span className="text-cyan-400">demo123</span></span>
            </div>
          </div>
        </section>

        {/* ===== INSTAGRAM ===== */}
        <section className="relative overflow-hidden py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto text-center">
              <p className="text-xs font-mono text-slate-400 mb-2">$ curl -s https://instagram.com/toalesco</p>
              <div className="border border-slate-200 bg-white rounded-md p-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <svg className="h-5 w-5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  <span className="text-sm font-semibold text-slate-900 font-mono">@toalesco</span>
                </div>
                <p className="text-xs text-slate-500 font-mono mb-4">
                  Seguinos en Instagram para ver novedades, lanzamientos y contenido sobre gestión deportiva.
                </p>
                <a
                  href="https://instagram.com/toalesco"
                  target="_blank"
                  className="inline-flex h-8 items-center justify-center rounded-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 text-xs font-mono font-medium text-white transition-all"
                >
                  Seguir @toalesco
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ===== EQUIPO ===== */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs font-mono text-slate-400 mb-2">$ cat /toalesco/team.json</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Equipo</h2>
            <div className="flex justify-center">
              {team.map((t) => (
                <div key={t.name} className="border border-slate-200 rounded-md p-6 bg-white max-w-xs">
                  <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center mx-auto mb-3 border-2 border-cyan-200">
                    <span className="text-xl font-bold text-cyan-600 font-mono">IY</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">{t.name}</h3>
                  <p className="text-xs font-mono text-slate-500 mt-1">{t.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SERVICES ===== */}
        <section id="servicios" className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs font-mono text-slate-400 mb-2">$ ls /toalesco/services/</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                También desarrollamos soluciones digitales para empresas
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((svc) => (
                <div key={svc.title} className="border border-slate-200 bg-white rounded-md p-5 text-center hover:border-cyan-200 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-cyan-50 text-cyan-600 mx-auto mb-3">
                    <svc.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">{svc.title}</h3>
                  <p className="text-xs font-mono text-slate-500">{svc.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PRICING ===== */}
        <section id="precios" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <p className="text-xs font-mono text-slate-400 text-center mb-2">$ cat /toalesco/pricing.txt</p>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900">Planes</h2>
            <p className="mt-2 text-sm text-muted-foreground text-center font-mono">Selecciona el plan para tu club o contrata un servicio adicional.</p>

            <div className="mt-8">
              <p className="text-xs font-mono text-slate-400 mb-3">[Plataforma]</p>
              <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
                {platformPlans.map((plan) => (
                  <div key={plan.name} className="border border-cyan-200 bg-white rounded-md p-5">
                    <p className="text-sm font-semibold text-slate-900 mb-2">{plan.name}</p>
                    <p className="text-xl font-bold text-slate-900 font-mono">{plan.price}<span className="text-xs text-slate-500 font-normal ml-1">{plan.period}</span></p>
                    <ul className="mt-4 space-y-1.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-slate-600 font-mono">
                          <Check className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="mailto:contacto@toalesco.cl?subject=Quiero%20contratar"
                      className="mt-4 inline-flex h-8 w-full items-center justify-center rounded-md bg-cyan-600 hover:bg-cyan-700 text-xs font-mono font-medium text-white transition-all"
                    >
                      Contratar
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <p className="text-xs font-mono text-slate-400 mb-3">[Servicios]</p>
              <div className="grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
                {servicePlans.map((plan) => (
                  <div key={plan.name} className="border border-slate-200 bg-white rounded-md p-5">
                    <p className="text-sm font-semibold text-slate-900 mb-2">{plan.name}</p>
                    <p className="text-xl font-bold text-slate-900 font-mono">{plan.price}<span className="text-xs text-slate-500 font-normal ml-1">{plan.period}</span></p>
                    <ul className="mt-4 space-y-1.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-slate-600 font-mono">
                          <Check className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="mailto:contacto@toalesco.cl?subject=Cotización"
                      className="mt-4 inline-flex h-8 w-full items-center justify-center rounded-md border border-slate-300 hover:border-cyan-400 hover:text-cyan-600 text-xs font-mono font-medium text-slate-700 transition-all"
                    >
                      Cotizar
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== RESOURCES ===== */}
        <section id="recursos" className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <p className="text-xs font-mono text-slate-400 text-center mb-2">$ cat /toalesco/resources.md</p>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900">
              Centro de Recursos para Clubes
            </h2>
            <div className="mt-8 max-w-2xl mx-auto space-y-3">
              {[
                "Cómo conseguir patrocinadores para tu club",
                "Cómo aumentar la base de socios",
                "Cómo conseguir financiamiento deportivo",
                "Cómo vender merchandising online",
                "Cómo profesionalizar un club deportivo",
              ].map((a) => (
                <div key={a} className="border border-slate-200 bg-white rounded-md px-4 py-3 flex items-center gap-2 text-xs font-mono text-slate-600 hover:border-cyan-200 transition-colors">
                  <ChevronRight className="h-3 w-3 text-cyan-600 shrink-0" />
                  {a}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SUCCESS STORIES ===== */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs font-mono text-slate-400 mb-2">$ ls /toalesco/casos_exito/</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Casos de Éxito</h2>
            <div className="mt-4">
              <Badge variant="secondary" className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-mono">
                <Sparkles className="h-3 w-3 mr-1" />
                Próximamente
              </Badge>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-dashed border-slate-300 bg-slate-50/50 rounded-md p-5">
                  <div className="space-y-2">
                    <div className="h-2 w-16 rounded bg-slate-200" />
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] font-mono text-red-400 shrink-0">[ERROR]</span>
                      <div className="h-3 w-full rounded bg-slate-200" />
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] font-mono text-cyan-400 shrink-0">[SOLVE]</span>
                      <div className="h-3 w-full rounded bg-slate-200" />
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] font-mono text-emerald-400 shrink-0">[OK]</span>
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
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-cyan-800" />
          <div className="container mx-auto px-4 relative text-center">
            <p className="text-xs font-mono text-cyan-200 mb-2">$ ./upgrade --force</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white max-w-2xl mx-auto leading-tight">
              Tu club merece más que hojas de cálculo y grupos de WhatsApp.
            </h2>
            <p className="mt-3 text-sm text-cyan-100 max-w-xl mx-auto font-mono">
              Digitaliza la gestión de tu institución, mejora la experiencia de tus hinchas y crea nuevas fuentes de ingresos.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
              <a
                href="mailto:contacto@toalesco.cl?subject=Solicitar%20Demo"
                className="inline-flex h-10 items-center justify-center rounded-md bg-white hover:bg-slate-100 px-6 text-sm font-mono font-medium text-cyan-700 transition-all"
              >
                Solicitar Demo
              </a>
              <a
                href="mailto:contacto@toalesco.cl?subject=Quiero%20hablar%20con%20TOALESCO"
                className="inline-flex h-10 items-center justify-center rounded-md border border-white/40 hover:bg-white/10 px-6 text-sm font-mono font-medium text-white transition-all"
              >
                Hablar con Nosotros
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-slate-200 py-8 bg-white relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs font-mono text-slate-500">
              &copy; 2026 TOALESCO. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <a href="#plataforma" className="text-[10px] font-mono text-slate-400 hover:text-cyan-600 transition-colors">[Plataforma]</a>
              <a href="#servicios" className="text-[10px] font-mono text-slate-400 hover:text-cyan-600 transition-colors">[Servicios]</a>
              <a href="#precios" className="text-[10px] font-mono text-slate-400 hover:text-cyan-600 transition-colors">[Precios]</a>
              <a href="/demo" className="text-[10px] font-mono text-slate-400 hover:text-cyan-600 transition-colors">[Demo]</a>
              <a href="mailto:contacto@toalesco.cl" className="text-[10px] font-mono text-slate-400 hover:text-cyan-600 transition-colors">[Contacto]</a>
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              SYS_STATUS: <span className="text-emerald-500">OPERANDO 24/7</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
