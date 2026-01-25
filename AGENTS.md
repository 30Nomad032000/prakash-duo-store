# AGENTS.md

## Commands
```bash
npm run dev        # Start dev server
npm run build      # Generate data & build
npm run lint       # Run ESLint
npm run generate-data  # Generate product data
```
No test framework configured yet.

## Architecture
Next.js 14 (App Router) e-commerce app for "Bangles by Prakash Duo"
- `src/app/` - Pages and layouts (App Router)
- `src/components/` - React components
- `src/lib/` - Utilities
- `src/data/` - Generated data files

## Code Style
- TypeScript strict mode; avoid `any`
- Use `@/` path alias for imports (maps to `src/`)
- Tailwind CSS for styling; mobile-first responsive
- PascalCase components, camelCase functions, UPPER_SNAKE_CASE constants
- Server Components default; add `"use client"` for client components
- 2-space indent, trailing commas, single quotes (double in JSX)
