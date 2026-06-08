
# ⚡ TOALESCO

> **Plataforma Digital SaaS para Clubes Deportivos | Multi-Tenant | Next.js 16 + Firebase**

[![Framework](https://img.shields.io/badge/Next.js-16.0-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Language](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Style](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![UI](https://img.shields.io/badge/Shadcn_UI-000000?style=for-the-badge&logo=shadcnui)](https://ui.shadcn.com)
[![Backend](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com)
[![Deploy](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker)](https://docker.com)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](LICENSE)

---

<p align="center">
  <strong>🚀 Transforma tu club deportivo en una potencia digital.</strong><br>
  <em>Gestión inteligente · Estadísticas en tiempo real · Captación de socios · Ventas online · Interacción con hinchas</em>
</p>

<p align="center">
  <a href="#-stack-tecnológico">Stack</a> •
  <a href="#-arquitectura">Arquitectura</a> •
  <a href="#-módulos-backend">Backend</a> •
  <a href="#-frontend">Frontend</a> •
  <a href="#-panel-administrativo">Admin</a> •
  <a href="#-roadmap">Roadmap</a> •
  <a href="#-instalación">Instalación</a>
</p>

---

## 📋 Tabla de Contenidos

- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura Multi-Club](#-arquitectura-multi-club)
- [Módulos Backend](#-módulos-backend)
- [Frontend](#-frontend)
- [Panel Administrativo](#-panel-administrativo)
- [MVP Comercial](#-mvp-comercial)
- [Propuesta de Valor](#-propuesta-de-valor)
- [Roadmap](#-roadmap)
- [Instalación](#-instalación)
- [Despliegue](#-despliegue)
- [Estructura del Proyecto](#-estructura-del-proyecto)

---

## 🎯 Descripción

**TOALESCO** es una plataforma **SaaS multi-tenant** especializada en la digitalización de **clubes deportivos**. No es una página web tradicional: es un **ecosistema digital completo** que permite a las organizaciones deportivas administrar su presencia en línea, gestionar operaciones, captar socios, vender merchandising, mostrar estadísticas en vivo y generar interacción con sus hinchas.

### Deportes Soportados

| Deporte       | Estado            |
|---------------|-------------------|
| 🏀 Básquetbol | ✅ Live           |
| ⚽ Fútbol      | 🔄 En desarrollo  |
| 🏐 Vóleibol   | 🔄 En desarrollo  |
| 🏉 Rugby      | 🔄 En desarrollo  |
| 🎯 Academias  | 🔄 En desarrollo  |

---

## 🧠 Stack Tecnológico

### Frontend

| Tecnología       | Versión | Propósito                                   |
|------------------|---------|---------------------------------------------|
| Next.js          | 16      | Framework React con SSR, App Router, RSC    |
| React            | 19      | UI declarativa basada en componentes        |
| TypeScript       | 5       | Tipado estático estricto                    |
| Tailwind CSS     | 4       | Utility-first CSS con diseño atómico        |
| Shadcn/UI        | latest  | Componentes accesibles (base-nova / Base UI)|
| TanStack Query   | 5       | Servidor de estado asíncrono y caching      |
| Zod              | 3       | Validación de esquemas en runtime           |
| React Hook Form  | 7       | Formularios performantes con validación     |
| Lucide React     | latest  | Iconos SVG modernos                         |
| Framer Motion    | 11      | Animaciones declarativas                    |
| date-fns         | 4       | Manipulación de fechas                      |
| Recharts         | 2       | Gráficos y visualización de datos           |
| Sonner           | latest  | Toast notifications                         |

### Backend (Firebase)

| Servicio              | Propósito                                      |
|-----------------------|------------------------------------------------|
| Firebase Auth         | Autenticación email, Google, roles RBAC       |
| Cloud Firestore       | Base de datos NoSQL multi-tenant              |
| Firebase Storage      | Imágenes, videos, documentos                  |
| Cloud Functions       | Lógica serverless, webhooks, schedulers       |
| Cloud Scheduler       | Tareas cron (MVP, estadísticas)               |

### Infraestructura

| Entorno     | Stack                                    |
|-------------|------------------------------------------|
| Desarrollo  | Vercel + Firebase Emulators              |
| Producción  | Hetzner Cloud + Docker + PostgreSQL (futuro) + Redis (futuro) |

---

## 🏗️ Arquitectura Multi-Club

Cada club opera como un **tenant independiente**. Los datos están aislados mediante `clubId` en todas las colecciones.

### Routing

```
toalesco.cl/clubes/valdivia-basquet
toalesco.cl/clubes/cdp-osorno
toalesco.cl/clubes/puerto-montt-basket
```

### Dominios Personalizados

```
valdiviabasquet.cl  → DNS → Vercel
cdposorno.cl        → DNS → Vercel
```

### Modelo de Datos (Firestore)

```
clubs/                    ← Tenants
├── club_history/         ← Historia del club
├── timeline_events/      ← Línea de tiempo
├── achievements/         ← Logros
├── players/              ← Jugadores
├── player_stats/         ← Estadísticas por jugador
├── matches/              ← Partidos
├── mvp_votes/            ← Votaciones MVP
├── polls/                ← Encuestas
├── predictions/          ← Predicciones
├── members/              ← Socios
├── news/                 ← Noticias
├── products/             ← Productos (tienda)
├── sponsors/             ← Auspiciadores
└── team_stats/           ← Estadísticas de equipo
```

### Roles de Usuario

| Rol            | Alcance          | Permisos                  |
|----------------|------------------|---------------------------|
| 🛡️ Super Admin | Todos los clubes | CRUD completo global      |
| 🔧 Club Admin  | Un club          | CRUD completo del club    |
| ✏️ Editor      | Un club          | Gestión de contenido      |
| 👁️ Viewer      | Un club          | Solo lectura              |

---

## ⚙️ Módulos Backend

### 1. 🏟️ Club

Colección `clubs` — Configuración del tenant con identidad visual.

```typescript
interface Club {
  id: string;
  name: string;
  slug: string;
  logo: string;
  banner: string;
  description: string;
  city: string;
  region: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  website: string;
  foundationDate: Timestamp;
  colors: { primary: string; secondary: string };
  customDomain?: string;
}
```

### 2. 📜 Historia del Club

Colecciones: `club_history`, `timeline_events`, `achievements`

Línea de tiempo interactiva con eventos históricos y logros del club.

### 3. 🏃 Jugadores

Colección `players` — Gestión del plantel con perfiles individuales.

| Deporte    | Posiciones                                                    |
|------------|---------------------------------------------------------------|
| Básquetbol | Base, Escolta, Alero, Ala-Pívot, Pívot                       |
| Fútbol     | Arquero, Defensa, Mediocampo, Delantero, Extremo             |
| Vóleibol   | Armador, Punta, Opuesto, Central, Líbero                     |
| Rugby      | Hooker, Pilar, Segunda línea, Tercera línea, Medio, Apertura, Centro, Fullback |

### 4. 📊 Estadísticas de Jugadores

Colección `player_stats` — Estadísticas detalladas por temporada.

```typescript
interface PlayerStats {
  playerId: string;
  season: string;
  gamesPlayed: number;
  minutes: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointsMade: number;
  threePointsAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  turnovers: number;
  fouls: number;
  efficiencyRating: number;
  trueShootingPercentage: number;
}
```

### 5. ⚡ Partidos

Colección `matches` — Calendario con estados dinámicos.

```
Estados: upcoming → live → finished (5 min MVP vote) / cancelled
```

### 6. 🏅 MVP del Partido

Colección `mvp_votes` — Votación popular durante el partido + 5 minutos post.

**Reglas:** Un voto por dispositivo (fingerprint). Opcional login Google.

**Scheduler:** `closeMvpVoting()` — Firebase Cloud Scheduler cada 1 minuto.

### 7. 🎮 Fan Zone

Colecciones: `polls`, `predictions`

| Acierto          | Puntos |
|------------------|--------|
| Marcador exacto  | 10     |
| Ganador + dif.   | 5      |
| Solo ganador     | 3      |

### 8. 🤝 Socios

Colección `members` — Registro con estados y exportación CSV.

```
Estados: pending → approved / rejected → inactive
```

### 9. 📰 Noticias

Colección `news` — CMS integrado con categorización por tags.

### 10. 🛒 Tienda

Colección `products` — E-commerce con stock y múltiples imágenes.

### 11. 🏢 Auspiciadores

Colección `sponsors` — Categorías Gold/Silver/Bronze con estadísticas.

### 12. 🧬 Motor de Estadísticas Automáticas

**Stats Sync Engine** — Sincronización desde Flashscore, LatinBasket, sitios oficiales.

```
Fuente Externa → Crawler → Parser (Zod) → Firestore → Frontend (TanStack Query)
```

Frecuencia: cada 12 horas + post-partido + manual.

---

## 🎨 Frontend

### Páginas Públicas

| Ruta                             | Sección          |
|----------------------------------|------------------|
| `/`                              | Landing TOALESCO |
| `/clubes/[slug]`                 | Home del club    |
| `/clubes/[slug]/historia`        | Historia         |
| `/clubes/[slug]/plantel`         | Plantel          |
| `/clubes/[slug]/partidos`        | Partidos         |
| `/clubes/[slug]/estadisticas`    | Estadísticas     |
| `/clubes/[slug]/noticias`        | Noticias         |
| `/clubes/[slug]/tienda`          | Tienda           |
| `/clubes/[slug]/fanzone`         | Fan Zone         |
| `/clubes/[slug]/auspiciadores`   | Auspiciadores    |

### Panel Administrativo

| Ruta                                     | Gestión          |
|------------------------------------------|------------------|
| `/admin/[clubId]`                        | Dashboard KPIs   |
| `/admin/[clubId]/jugadores`              | Jugadores        |
| `/admin/[clubId]/partidos`               | Partidos         |
| `/admin/[clubId]/estadisticas`           | Estadísticas     |
| `/admin/[clubId]/socios`                 | Socios           |
| `/admin/[clubId]/noticias`               | Noticias         |
| `/admin/[clubId]/tienda`                 | Tienda           |
| `/admin/[clubId]/auspiciadores`          | Auspiciadores    |
| `/admin/[clubId]/historia`               | Historia         |

---

## 📦 MVP Comercial

| Módulo                    | Estado |
|---------------------------|:------:|
| 🏟️ Club + Branding       |   ✅   |
| 📜 Historia + Timeline   |   ✅   |
| 🏃 Plantel + Perfiles     |   ✅   |
| 📊 Estadísticas básicas   |   ✅   |
| ⚡ Partidos + Calendario  |   ✅   |
| 🤝 Socios + Membresías    |   ✅   |
| 📰 Noticias + Blog        |   ✅   |
| 🛒 Tienda + Productos     |   ✅   |
| 🏢 Auspiciadores          |   ✅   |
| 🏅 MVP del Partido        |   ✅   |
| 🎮 Fan Zone + Predicciones|   ✅   |
| 👨‍💻 Panel Administrativo  |   ✅   |
| 📱 Responsive Mobile      |   ✅   |
| 🔒 Firebase Auth + RBAC  |   ✅   |
| ⚡ Stats Sync Engine      |   ✅   |
| 🔍 SEO optimizado         |   ✅   |
| 💬 WhatsApp integración   |   ✅   |

---

## 💎 Propuesta de Valor

TOALESCO **no construye páginas web**. Entrega una **plataforma digital integral** que permite:

```
✅ Conseguir más socios
✅ Aumentar la interacción de los hinchas
✅ Mejorar la relación con auspiciadores
✅ Centralizar la información del club
✅ Profesionalizar la presencia digital
✅ Generar nuevas oportunidades de ingresos
✅ Modernizar la gestión deportiva
✅ Automatizar estadísticas y resultados
```

---

## 🗺️ Roadmap

### v1.0 — Fundación 🏗️ (Q2 2025)
Club, Historia, Jugadores, Partidos, Noticias, Socios, Tienda, Auspiciadores, Panel Admin, Responsive, SEO

### v1.1 — Interacción 🎮 (Q3 2025)
MVP del Partido, Fan Zone, Predicciones, Encuestas, Ranking de hinchas, Badges

### v1.2 — Inteligencia ⚡ (Q4 2025)
Stats Sync Engine, Dashboard avanzado, Reportes auspiciadores, Alertas automáticas

### v2.0 — Escala 🚀 (Q1 2026)
App móvil (React Native), Notificaciones push, Membresías premium, Multi-deporte completo, PostgreSQL + Redis, Hetzner + Docker, Pasarela de pagos, API pública

---

## 🚀 Instalación

### Requisitos

- Node.js 20+
- npm 10+

### Clonar e Instalar

```bash
git clone https://github.com/tu-usuario/toalesco.git
cd toalesco
cp .env.example .env.local  # Configurar Firebase
npm install
```

### Iniciar Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm run typecheck
```

---

## 🚢 Despliegue

### Frontend (Vercel)

```bash
npm run build
vercel --prod
```

### Backend (Firebase)

```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

### Producción (Hetzner + Docker)

```bash
docker build -t toalesco:latest .
docker compose -f docker-compose.prod.yml up -d
```

---

## 📁 Estructura del Proyecto

```
toalesco/
├── src/
│   ├── app/
│   │   ├── (public)/              ← Rutas públicas
│   │   │   ├── page.tsx           ← Landing TOALESCO
│   │   │   └── clubes/[slug]/     ← Páginas de cada club
│   │   ├── (auth)/                ← Login, registro
│   │   └── admin/[clubId]/        ← Panel administrativo
│   ├── components/
│   │   ├── ui/                    ← Shadcn componentes
│   │   ├── shared/                ← Componentes compartidos
│   │   └── admin/                 ← Componentes del panel
│   ├── lib/
│   │   ├── firebase/client.ts     ← Firebase config
│   │   └── utils.ts               ← cn() helper
│   ├── providers/
│   │   └── QueryProvider.tsx       ← TanStack Query
│   ├── hooks/                     ← Custom hooks
│   └── types/index.ts             ← TypeScript types
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── README.md
```

---

## 🛠️ Scripts

```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm run start        # Iniciar servidor producción
npm run lint         # ESLint
npm run typecheck    # TypeScript check
```

---

## 📄 Licencia

**Propietaria** — Todos los derechos reservados. TOALESCO es un producto SaaS. El código fuente es propiedad intelectual del equipo de desarrollo.

---

<p align="center">
  <strong>⚡ TOALESCO — Tu club, potencia mundial.</strong><br>
  <em>Plataforma Digital SaaS para Clubes Deportivos</em>
</p>
