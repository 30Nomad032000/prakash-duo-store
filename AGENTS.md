# AGENTS.md

This document provides essential information for agentic coding assistants working in this repository.

## Project Overview

This is a Next.js 14 e-commerce application for "Bangles by Prakash Duo", a bangle store. The project uses:
- Next.js 14 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- ESLint with Next.js recommended rules

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Generate products data from assets
node scripts/generate-products.js
```

## Testing

This project does not currently have a test framework configured. When adding tests:
1. Choose Jest, Vitest, or React Testing Library based on team preferences
2. Add appropriate configuration files
3. Update this section with test commands

## Code Style Guidelines

### Imports
- Use ES6 imports for TypeScript/TSX files: `import { X } from "module"`
- Use CommonJS require for Node.js scripts (like generate-products.js): `const fs = require('fs')`
- Place React imports first: `import React from "react"`
- Third-party imports next, then local imports
- Use path alias `@/` for src imports: `import { Component } from "@/components/Component"`

### File Structure
- Use Next.js App Router structure: `src/app/` for pages and layouts
- Components in `src/components/` (create if needed)
- Utilities in `src/lib/` or `src/utils/` (create if needed)
- Type definitions in `src/types/` (create if needed)

### TypeScript
- Strict mode is enabled (`strict: true` in tsconfig.json)
- Always type function parameters and return values
- Use `interface` for object shapes, `type` for unions/primitives
- Prefer explicit types over `any`
- Use generic types when appropriate
- Avoid type assertions unless necessary

### Components
- Use functional components with React hooks
- Export default for pages: `export default function Page() {}`
- Use named exports for reusable components: `export const Component = () => {}`
- Props should be typed with interfaces
- Use TypeScript's `Readonly` for props interfaces when appropriate

### Naming Conventions
- Components: PascalCase (`ProductCard`, `Header`)
- Functions: camelCase (`getProducts`, `handleSubmit`)
- Variables: camelCase (`productData`, `isLoading`)
- Constants: UPPER_SNAKE_CASE (`ASSETS_DIR`, `OUTPUT_FILE`)
- Files: PascalCase for components, kebab-case for utilities

### Styling
- Use Tailwind CSS utility classes
- Prefer composition over custom CSS
- For custom styles, use CSS modules or global CSS in `globals.css`
- Use CSS variables for theme values (`--background`, `--foreground`)
- Follow mobile-first responsive design with Tailwind breakpoints

### Error Handling
- Use try-catch blocks for async operations
- Provide meaningful error messages
- Log errors appropriately (avoid logging sensitive data)
- Consider error boundaries for React components

### Formatting
- Indentation: 2 spaces
- Single quotes for strings in code, double quotes for JSX attributes
- Trailing commas in multiline arrays/objects
- Max line length: follow project conventions (typically 80-100 chars)
- No trailing whitespace
- One empty line between functions/logical sections

### File Exports
- Default export for pages and main components
- Named exports for utilities, types, and reusable helpers
- Group exports at the end of files when using multiple exports

### Image Handling
- Use Next.js `Image` component for optimization
- Specify `width` and `height` when known
- Use `priority` for above-the-fold images
- Place images in `public/` directory
- Use local fonts via `next/font/local` for performance

### Comments and Documentation
- Keep code self-documenting with clear names
- Add comments only for complex logic or business rules
- Use JSDoc for complex functions
- Document prop interfaces when not immediately clear

### ESLint Rules
The project uses `next/core-web-vitals` and `next/typescript` configs. Key rules to follow:
- No unused variables
- No console.log in production code
- Use proper React hooks dependency arrays
- Avoid `any` types
- Ensure all imports are used

### Next.js Specifics
- Use App Router conventions (Pages in `src/app/` as folders with `page.tsx`)
- Use `layout.tsx` for shared layouts
- Use `metadata` exports for SEO
- Server Components by default, Client Components with `"use client"` directive
- Use dynamic routes with square brackets: `[id]/page.tsx`

## Path Aliases

Use the configured path alias for cleaner imports:
- `@/` maps to `src/`
- Example: `import { Button } from "@/components/Button"` instead of `import { Button } from "../../../components/Button"`

## Adding New Features

1. Create components in appropriate directories
2. Follow existing patterns for similar features
3. Add proper TypeScript types
4. Use Tailwind for styling
5. Run `npm run lint` before committing
6. Test responsive design
7. Ensure accessibility (semantic HTML, aria attributes)
