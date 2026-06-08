
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# TOALESCO Project

## Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI**: React 19, Tailwind CSS 4, Shadcn/UI (base-nova style with Base UI)
- **State**: TanStack Query 5
- **Forms**: React Hook Form + Zod
- **Backend**: Firebase (Auth, Firestore, Storage, Functions)
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Dates**: date-fns
- **Toast**: Sonner

## Key Conventions
- Server Components by default; use `"use client"` for interactivity
- Dynamic routes use `params: Promise<{ slug: string }>` + `await params`
- Firebase config in `src/lib/firebase/client.ts`
- Types in `src/types/index.ts`
- `@/` import alias for all src files
- Shadcn components use Base UI (`@base-ui/react`) not Radix

## Scripts
- `npm run dev` — development
- `npm run build` — production build
- `npm run typecheck` — TypeScript check
