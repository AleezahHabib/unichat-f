# UniChat Frontend

Modern Next.js 15 (App Router) web client for **UniChat** — unified team chat with bidirectional Slack & Discord synchronization and grounded Gemini AI intelligence.

---

## Stack

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript (strict)
- **Styling:** Tailwind CSS v4 (Skyline design tokens)
- **Icons & Typography:** lucide-react, Bricolage Grotesque, Geist Sans & Mono
- **API Typing:** openapi-typescript generated from OpenAPI 3.1 contract

---

## Getting Started

### 1. Prerequisites
- Node.js 20+
- npm / pnpm / yarn

### 2. Environment Setup
Copy the example environment file:
`ash
cp .env.example .env.local
`

Set your backend API and WebSocket URLs in .env.local:
`env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXT_PUBLIC_REPO_URL=https://github.com/<your-username>/unichat-frontend
`

### 3. Install & Run
`ash
npm install
npm run dev
`
Visit http://localhost:3000 to view the application.

---

## API Contract & Type Generation

> **IMPORTANT:**
> The source of truth for the API contract lives in the backend repository (unichat-backend/specs/api/openapi.yaml).
> A snapshot is stored locally at specs/api/openapi.yaml to generate TypeScript types without requiring a live backend.
>
> **Whenever the backend API changes:**
> 1. Copy the updated openapi.yaml from unichat-backend/specs/api/openapi.yaml to specs/api/openapi.yaml.
> 2. Run the type generator:
>    `ash
>    npm run types
>    `
> 3. Verify that src/types/api.ts compiles cleanly with 
pm run build.

---

## Build & Test

`ash
# Build production bundle
npm run build

# Start production server
npm run start

# Run Playwright E2E tests
npm run test:e2e
`
