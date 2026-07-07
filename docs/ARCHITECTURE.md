# Architecture

## Overview
Amrutam Super App is built as three independently deployable vertical-slice modules — Consultation, Shop, and Health Records — sharing a common foundation layer.

## Folder Structure
- `app/` — composition root: navigation, providers, bootstrap (Sentry/flags/sync init)
- `modules/{consultation,shop,healthRecords}/` — each module owns its full stack: api → hooks → store → components → screens → utils → mocks → tests
- `shared/` — the only cross-module dependency: design system, network layer, offline infra, storage, auth, logging, i18n, feature flags

## Module Isolation Rule
No module imports directly from another module. All cross-cutting concerns (auth, network, storage, theme, toast) live in `shared/` and are consumed the same way by all three modules. This means any single module could be extracted into its own repo/package with minimal refactoring — a deliberate trade-off for team scalability (multiple devs can own a module without stepping on each other).

## Data Flow
`api/*.api.ts` (mock backend simulating delay + failure) → `hooks/*` (TanStack Query wraps the api call, handles caching/retry/offline) → `store/*` (Zustand, only for genuinely client-owned state like cart/wishlist) → `screens/*` (compose hooks + presentational components).

Server state and client state are deliberately kept in separate systems (react-query vs zustand) rather than mixed into one store — this avoids the common anti-pattern of manually syncing "loading/error/data" flags that react-query already manages for free.