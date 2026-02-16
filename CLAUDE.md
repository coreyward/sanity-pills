# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Development Commands

- **Build**: `pnpm build` (with prebuild typecheck)
- **Lint**: `pnpm lint` (with `pnpm lint:fix` for auto-fixes)
- **Typecheck**: `pnpm typecheck`
- **Test**: `pnpm test` (run once) or `pnpm test:watch` (watch mode)
- **Size check**: `pnpm size` (bundle size limits: 10KB ESM, 15KB CJS)

## Architecture Overview

This is a TypeScript utility library that provides helpers for Sanity.io Studio
schemas. The codebase follows a modular architecture with clear separation
between field definitions, validators, and utilities.

### Core Structure

- **`src/index.js`**: Main entry point exporting all public APIs
- **`src/fields/`**: Field factory functions (`image.ts`, `slug.js`, `block.js`)
- **`src/lib/`**: Core utilities and validators

### Key Architectural Patterns

1. **Field Factories**: Functions like `createImageField()`, `createSlugField()`
   that return Sanity field definitions with built-in validation
2. **Validation Builders**: Modular validators that can be composed (e.g.,
   `buildImageValidator`, `createBlockValidator`)
3. **Helper Functions**: The `fields()` helper converts object-based field
   definitions to Sanity's array format

### TypeScript Configuration

- Uses strict TypeScript with `noUncheckedIndexedAccess` enabled
- ESLint configured with strict type checking and import rules
- Mixed JS/TS codebase (migrating to TypeScript)

### Testing

- Vitest for testing framework
- Tests located alongside source files (`*.test.js`)
- Coverage reporting with v8 provider

### Build System

- tsup for building ESM/CJS dual packages
- Outputs to `dist/` directory
- TypeScript declarations generated automatically

## Current Migration Status

The project is migrating from JavaScript to TypeScript (see recent commits).
When working with existing `.js` files, consider converting to `.ts` if making
significant changes, following the established patterns in newer files like
`src/fields/image.ts`.

## Code Style Guidelines

### General Principles

- Avoid Indirection: Write code for humans, not for machines.
- Early Returns: Prefer early returns over nested conditionals.
- Functions: Prefer arrow functions over function declarations.
- Respect linting rules—they are typically indicating poor quality code.
- Don't disable linting rules globally. Disable them locally if needed, but only
  if they are _incorrect_ or not applicable to the specific code.
- Comments: Focus on why something is done, especially for complex logic, rather
  than what is done. Only add high-value comments when needed for clarity. Do
  not edit comments that are separate from the code you are changing. NEVER use
  comments to convey information to the user or to describe changes to the code.

### TypeScript Conventions

- Never use `any`. Always use proper types. Narrow types are preferred. If
  necessary, use `unknown`.
- Types: Use `type` over `interface`. Add types for all parameters and return
  values.
- Fix type issues by simplifying, not adding: When TypeScript complains, try to
  solve it by narrowing types, improving return types, or passing values
  directly to functions. Avoid casting or loosening types, or otherwise
  subverting the type system. Avoid introducing new types just to satisfy
  existing type errors.
- Imports:
  - Use inline type imports: `import { type User } from "./types"`
