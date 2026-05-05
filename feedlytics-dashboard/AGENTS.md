<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Feedlytics dashboard conventions

The full architectural rationale lives in `/Users/akajave/.cursor/plans/feedlytics_dashboard_scalable_architecture_70938fa0.plan.md`. The rules below are the short version agents MUST follow when editing this repo.

### 1. No API calls in `page.tsx`

- Every file under `src/app/**/page.tsx` is a thin shell. It renders one organism and nothing else — no `fetch`, no service call, no `useQuery`.
- Data fetching lives in hooks under `src/features/**/hooks/*`, which wrap TanStack Query and call functions from `src/services/**`.

### 2. Layering (strict direction)

```
page.tsx  ─►  features/<f>/components  ─►  features/<f>/hooks  ─►  services/*  ─►  services/api/client.ts
```

- Hooks are the only place a store and a service meet.
- Feature components never import from `services/*` directly.
- `services/*` files are pure `.ts` — no React, no JSX.

### 3. Tailwind utility classes belong to atoms and layout only

- `src/components/ui/**` and `src/components/layout/**` are the ONLY folders allowed to spell Tailwind utility classes (`bg-brand-500`, `rounded-2xl`, …).
- `src/features/**` and `src/app/**/__components/**` MUST compose atoms and pass semantic variant/size props instead (`variant="brand"`, `size="lg"`). The Horizon reskin lives in the atoms; if a new visual treatment is needed, extend the atom with a new variant, do not inline Tailwind classes in a feature component.
- Exception: layout spacing utilities (`flex`, `grid`, `gap-*`, `items-*`, `w-full`, responsive modifiers) are tolerated in layout shells and auth split panes.

### 4. Server state vs client state

- **TanStack Query** owns everything fetched from the backend. Do not mirror server data into Zustand.
- **Zustand** owns only: the in-memory access token + expiry (`auth.store`), UI flags (`ui.store`), and a non-sensitive user mirror kept in sync from the `useCurrentUser` hook's `onSuccess` (`user.store`).
- Always select with shallow selectors: `useAuthStore(s => s.accessToken)`.

### 5. Auth tokens

- Access token: in memory, Zustand `auth.store`. Never `localStorage`, never `document.cookie`.
- Refresh token: lives in an HttpOnly cookie issued by the Kotlin backend (path `/api/v1/auth`, `SameSite=Lax`). JS never touches it.
- Axios is configured with `withCredentials: true`; the backend handles cookie set/clear on login/refresh/logout.

### 6. Forms

- RHF + Zod. One schema per form in `src/features/<feature>/schemas/*.schema.ts`.
- Backend DTO types are derived via `z.infer<typeof schema>` — the schema is the single source of truth.
- Field primitives (`Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`) are defined once in `src/components/ui/form.tsx`. Features consume them, never redefine them.

### 7. Path alias

- `@/*` resolves to `src/*`. Do not introduce sibling aliases.

### 8. Storybook is the component workshop

- Every file under `src/components/ui/**` and `src/components/layout/**` MUST have a co-located `*.stories.tsx`.
- Feature components and route `__components/*` that hit the backend get stories with MSW-mocked scenarios (happy path, 401, validation error, network error).
