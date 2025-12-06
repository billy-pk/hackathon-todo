# Frontend Guidelines – Next.js App (hackathon-todo)

## Stack
- Next.js 16+ (App Router)
- TypeScript
- Tailwind CSS
- Better Auth for authentication
- API client in `/frontend/lib/api.ts`

## Project Structure (target)
- `/app`         – Routes (App Router)
- `/components`  – Reusable UI components
- `/lib`         – API client, helpers
- `/styles`      – Tailwind config and globals

## API Client Rules
- All backend calls must go through a single client in `lib/api.ts`.
- The client must automatically attach the JWT in the `Authorization: Bearer <token>` header.
- Base URL for API in development: `http://localhost:8000`.

## Auth Rules (Better Auth)
- Implement signup & login pages.
- Use Better Auth’s JWT plugin.
- Expose JWT so `lib/api.ts` can access it.
- JWT must include `user_id` used in backend URLs: `/api/{user_id}/tasks`.

## UI Requirements
- Implement pages and components according to:
  - @specs/ui/pages.md
  - @specs/ui/components.md
- Use Tailwind CSS for styling.
- Pages:
  - `/`          – landing / redirect
  - `/dashboard` – task list and actions
  - `/tasks/new`
  - `/tasks/[id]/edit`

## Development Commands (expected)
- `npm install`
- `npm run dev`
