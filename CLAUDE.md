# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TestimonialStack is a Next.js SaaS application for indie makers to collect, showcase, and embed testimonials, milestone badges, and social proof widgets. Features Supabase auth, Lemon Squeezy payments, and a freemium subscription model (Free/Starter/Pro tiers).

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run lint     # ESLint with Next.js core-web-vitals + TypeScript rules
```

No test framework is currently configured.

## Tech Stack

- **Framework:** Next.js 16 with App Router, React 19, TypeScript (strict mode)
- **Styling:** Tailwind CSS 4, shadcn/ui components (Radix primitives)
- **Backend:** Supabase (PostgreSQL + Auth), Lemon Squeezy payments
- **Forms:** React Hook Form + Zod validation

## Architecture

### Route Groups
- `(auth)/` - Public auth pages (login, signup, password reset, verify)
- `(dashboard)/` - Protected routes with auth check in layout.tsx
- `collect/[slug]/` - Public testimonial collection forms
- `wall/[slug]/` - Public "Wall of Love" displays

### Supabase Clients
- `lib/supabase/client.ts` - Browser client for client components
- `lib/supabase/server.ts` - Server client with cookie-based sessions
- `lib/supabase/middleware.ts` - Session refresh in Next.js middleware

### Database Schema (6 tables with RLS)
- **profiles** - User accounts with subscription info, extends auth.users
- **collection_pages** - Customizable testimonial intake forms (public by slug)
- **testimonials** - Individual testimonials with approval workflow
- **widgets** - Embeddable displays (grid/carousel/spotlight/wall/badge layouts)
- **milestones** - Achievement badges (revenue, users, launches)
- **integrations** - Third-party OAuth tokens

Auto-triggers handle profile creation on signup and counter updates.

### Subscription Limits
```
Free:    3 testimonials, 1 widget, 1 collection page
Starter: 25 testimonials, 3 widgets, 3 pages, 3 milestones
Pro:     Unlimited all, integrations, imports
```

## Key Conventions

- Server Components by default; use `"use client"` directive when needed
- Path alias: `@/*` maps to `./src/*`
- Database types in `src/types/database.ts` (generated from Supabase)
- Use `cn()` from `lib/utils.ts` for conditional Tailwind classes
- UI components in `components/ui/` follow shadcn patterns
