# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Japanese travel planning web application (旅行プランナー) built with Next.js 15, React 18, and TypeScript. The app helps users create and collaborate on travel plans.

## Key Technologies

- **Framework**: Next.js 15.2.4 with App Router
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Styling**: Tailwind CSS with tailwindcss-animate
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Font**: Noto Sans JP (Japanese support)

## Commands

```bash
# Development
npm run dev       # Start development server

# Build & Production
npm run build     # Build for production
npm run start     # Start production server

# Code Quality
npm run lint      # Run Next.js linting
```

## Project Structure

The application uses Next.js App Router with the following key routes:

- `/` - Home page with hero section and quick actions
- `/create/step[1-4]` - Multi-step travel plan creation flow
- `/plans` - List of created travel plans (しおり一覧)
- `/plan/[id]` - Individual plan view
- `/plan/[id]/qr` - QR code view for sharing plans
- `/join` - Join existing plan via QR code
- `/settings` - User settings

## Architecture Patterns

### Component Organization
- **UI Components**: Located in `/components/ui/` - Radix-based primitives styled with Tailwind
- **Layout**: Main layout wrapper in `/components/layout.tsx` provides responsive navigation (desktop header + mobile bottom nav)
- **Theme**: Uses CSS-in-JS with Tailwind utility classes

### Path Aliases
- `@/*` maps to the project root for clean imports

### Key Design Decisions
1. **Mobile-First**: Responsive design with dedicated mobile navigation
2. **Japanese Localization**: All UI text is in Japanese with Noto Sans JP font
3. **Shared State**: Plans support collaborative editing with QR code sharing
4. **Progressive Enhancement**: Client components marked with "use client" for interactivity

## Important Notes

- This project is synced with v0.dev deployments
- Changes made on v0.dev are automatically pushed to this repository
- The app is deployed on Vercel