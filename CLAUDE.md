# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a dog breeding website built with **Payload CMS 3.31** and **Next.js 15** (App Router). It's based on the Payload Website Template with custom collections for managing dogs, puppies, breeds, and litters.

## Common Commands

```bash
# Development
pnpm dev                    # Start development server (localhost:3000)
pnpm build                  # Build for production
pnpm start                  # Start production server

# Linting
pnpm lint                   # Run ESLint
pnpm lint:fix               # Fix lint issues

# Payload CMS
pnpm payload generate:types # Regenerate TypeScript types from collections
pnpm payload generate:importmap
pnpm payload migrate:create # Create a new migration
pnpm payload migrate        # Run pending migrations

# Full rebuild
pnpm reinstall              # Remove node_modules and reinstall
```

## Architecture

### Directory Structure

```
src/
├── app/
│   ├── (frontend)/         # Public website routes
│   │   ├── [slug]/         # Dynamic pages
│   │   ├── dogs/           # Dogs listing/detail
│   │   ├── puppies/        # Puppies listing/detail
│   │   ├── posts/          # Blog posts
│   │   └── search/         # Search functionality
│   └── (payload)/          # Payload admin routes (/admin)
├── collections/            # Payload collection definitions
│   ├── Breeds.ts           # Dog breeds
│   ├── Dogs.ts             # Adult dogs
│   ├── Puppies.ts          # Available puppies
│   ├── Litters.ts          # Litter records
│   ├── Pages/              # CMS pages (layout builder)
│   ├── Posts/              # Blog posts
│   ├── Media.ts            # Image/file uploads
│   └── Users/              # Admin users
├── blocks/                 # Layout builder blocks (ArchiveBlock, Banner, CTA, etc.)
├── heros/                  # Hero section variants (HighImpact, MediumImpact, DogHero, etc.)
├── components/             # React components
│   ├── ui/                 # shadcn/ui primitives
│   └── ...                 # Feature components (PuppyCard, DogsArchive, etc.)
├── fields/                 # Reusable Payload field configurations
├── hooks/                  # Payload hooks (formatSlug, populatePublishedAt, etc.)
├── plugins/                # Payload plugin configuration
└── utilities/              # Helper functions
```

### Key Patterns

- **Path alias**: `@/*` maps to `./src/*`
- **Payload config**: `@payload-config` maps to `./src/payload.config.ts`
- **shadcn/ui**: Components in `@/components/ui`, utils in `@/utilities/ui`
- **CSS**: Tailwind CSS with globals in `src/app/(frontend)/globals.css`

### Database

- **Production**: Vercel Postgres (Neon)
- **Development**: Local Postgres or Docker (`docker-compose up`)
- Auto-migration with `push: true` in dev mode
- Production requires explicit migrations

### Storage

- **Vercel Blob Storage** for media uploads
- Configured in `payload.config.ts`

### Environment Variables

Required in `.env`:
- `POSTGRES_URL` - Database connection string
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token
- `PAYLOAD_SECRET` - JWT signing secret
- `CRON_SECRET` - For scheduled jobs
- `PREVIEW_SECRET` - For draft previews

## Payload Collections

Custom collections beyond the template:
- **Breeds**: Dog breed information with characteristics
- **Dogs**: Adult breeding dogs with relationships to breeds
- **Puppies**: Available puppies with parent relationships
- **Litters**: Groups puppies by litter

## TypeScript

- Strict mode enabled with `noUncheckedIndexedAccess`
- Payload types auto-generated in `src/payload-types.ts`
- Run `pnpm payload generate:types` after collection changes

## ESLint Rules

- Unused vars with `_` prefix are allowed
- `@typescript-eslint/no-explicit-any` is a warning (not error)
