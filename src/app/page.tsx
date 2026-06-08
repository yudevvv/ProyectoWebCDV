export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <span className="text-xl font-bold tracking-tight">TOALESCO</span>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#features" className="hover:text-primary transition-colors">Características</a>
            <a href="#deportes" className="hover:text-primary transition-colors">Deportes</a>
            <a href="#planes" className="hover:text-primary transition-colors">Planes</a>
            <a href="#contacto" className="hover:text-primary transition-colors">Contacto</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-sm font-medium hover:text-primary transition-colors">Iniciar Sesión</a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Tu club,{" "}
              <span className="text-primary">potencia mundial</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              La plataforma digital SaaS que transforma la gestión de tu club deportivo.
              Socios, estadísticas, partidos, tienda y más en un solo lugar.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <a
                href="#planes"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
              >
                Comenzar ahora
              </a>
              <a
                href="#features"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-medium hover:bg-muted transition-colors"
              >
                Ver características
              </a>
            </div>
          </div>
        </section>

        <section id="features" className="border-t py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Todo lo que tu club necesita
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-lg border p-6 transition-colors hover:bg-muted/50"
                >
                  <div className="mb-4 text-3xl">{feature.icon}</div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="deportes" className="border-t py-24 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Deportes soportados</h2>
            <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
              TOALESCO se adapta a las necesidades específicas de cada disciplina
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {["🏀 Básquetbol", "⚽ Fútbol", "🏐 Vóleibol", "🏉 Rugby"].map(
                (sport) => (
                  <div
                    key={sport}
                    className="rounded-lg border bg-background p-8 text-center hover:shadow-md transition-shadow"
                  >
                    <span className="text-lg font-medium">{sport}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        <section id="planes" className="border-t py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Planes</h2>
            <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
              Comienza con lo esencial y escala a medida que creces
            </p>
            <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              {[
                {
                  name: "Básico",
                  price: "Gratis",
                  features: [
                    "Perfil del club",
                    "Plantel hasta 15 jugadores",
                    "Calendario de partidos",
                    "Estadísticas básicas",
                  ],
                },
                {
                  name: "Pro",
                  price: "Desde $29/mes",
                  features: [
                    "Todo lo del plan Básico",
                    "Tienda online",
                    "Socios ilimitados",
                    "MVP del Partido",
                    "Fan Zone",
                  ],
                  popular: true,
                },
                {
                  name: "Enterprise",
                  price: "Personalizado",
                  features: [
                    "Todo lo del plan Pro",
                    "Múltiples clubes",
                    "API dedicada",
                    "Soporte prioritario",
                    "Dominio personalizado",
                  ],
                },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-lg border p-8 text-left ${
                    plan.popular
                      ? "border-primary shadow-lg ring-1 ring-primary"
                      : "bg-background"
                  }`}
                >
                  {plan.popular && (
                    <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground mb-4">
                      Más popular
                    </span>
                  )}
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-2xl font-bold mb-6">{plan.price}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="text-primary">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="font-semibold text-foreground mb-1">TOALESCO</p>
          <p>Plataforma Digital para Clubes Deportivos</p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: "🏟️",
    title: "Perfil del Club",
    description:
      "Personaliza la identidad visual de tu club con colores, logo y banner.",
  },
  {
    icon: "📊",
    title: "Estadísticas",
    description:
      "Estadísticas detalladas de jugadores y equipo con sincronización automática.",
  },
  {
    icon: "⚡",
    title: "Partidos en Vivo",
    description:
      "Calendario, resultados en vivo e historial completo de la temporada.",
  },
  {
    icon: "🏅",
    title: "MVP del Partido",
    description:
      "Votación popular para elegir al jugador más valioso de cada partido.",
  },
  {
    icon: "🎮",
    title: "Fan Zone",
    description:
      "Predicciones, encuestas y ranking de hinchas para aumentar la interacción.",
  },
  {
    icon: "🤝",
    title: "Captación de Socios",
    description:
      "Registro, gestión y fidelización de socios con múltiples planes.",
  },
  {
    icon: "🛒",
    title: "Tienda Online",
    description:
      "Vende merchandising, indumentaria y productos oficiales del club.",
  },
  {
    icon: "📰",
    title: "Noticias",
    description:
      "Publica y gestiona contenido editorial con imágenes destacadas.",
  },
  {
    icon: "🏢",
    title: "Auspiciadores",
    description:
      "Gestiona patrocinadores con categorías y reportes de rendimiento.",
  },
];
