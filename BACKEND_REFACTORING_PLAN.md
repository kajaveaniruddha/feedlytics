# Feedlytics Backend Refactoring Plan

## Overview

This plan systematically refactors the backend to establish a clean layered architecture: **Route → Service → Repository**. It addresses DRY violations, SOLID principle breaches, missing types, inconsistent error handling, and critical security bugs.

**Current Issues:**
- 2 security vulnerabilities (unauthorized deletion, missing ownership checks)
- Scattered Drizzle queries directly in route handlers
- Duplicate logic across 6+ routes (auth checks, billing resets, analytics aggregation)
- Inconsistent error handling and response formats
- Missing input validation on 7 routes
- Mixed return types and response constructors

---

## Phase B1: Foundation — Types, Error Class, Response Helpers

**Goal**: Establish typed contracts, a standardized error class, and response builders.

### New Files

#### `Next/src/lib/api-types.ts`
Request/response interfaces for **every** route (e.g. `GetAnalyticsResponse`, `SendMessageRequest`, `DeleteMessagesRequest`, etc.)
- All extend `BaseApiResponse { success: boolean; message: string }`
- Provides type safety across the entire API surface

#### `Next/src/lib/api-error.ts`
`ApiError` class with static factories:
- `.badRequest(message, fieldErrors?)`
- `.unauthorized(message?)`
- `.forbidden(message?)`
- `.notFound(message?)`
- `.internal(message?)`

#### `Next/src/lib/api-response.ts`
Standardized response helpers:
- `successResponse(data, status?)`
- `errorResponse(error, status?)`
- `corsSuccessResponse(data, status?)`
- `corsErrorResponse(error, status?)`

Replaces the mix of `new Response(JSON.stringify(...))` and `NextResponse.json(...)`

#### `Next/src/lib/route-handler.ts`
`createHandler(fn, options?)` HOF — wraps route handlers with:
- Automatic try/catch
- `ApiError` handling
- Consistent error responses
- Eliminates per-route try/catch blocks
- **Can be composed with existing `withMetrics` HOF**

```typescript
import { ApiError } from './api-error';
import { errorResponse } from './api-response';

export function createHandler(
  handler: (request: Request, ...args: any[]) => Promise<Response>,
  options?: { cors?: boolean }
) {
  return async (request: Request, ...args: any[]): Promise<Response> => {
    try {
      return await handler(request, ...args);
    } catch (error) {
      if (error instanceof ApiError) {
        return errorResponse(error, error.statusCode);
      }
      
      console.error('Unhandled error:', error);
      return errorResponse(
        new Error('Internal server error'),
        500
      );
    }
  };
}
```

**Composition with metrics:**
```typescript
// Wrap with both createHandler and withMetrics
export const GET = withMetrics(
  createHandler(async (request: Request) => {
    // handler logic
  }),
  '/api/route-name'
);
```

**Dependencies**: None

---

## Phase B2: Repository Layer

**Goal**: Extract all Drizzle queries from routes. No route will import `db`, `usersTable`, `feedbacksTable`, or `userWorkFlowsTable` directly.

### New Files

#### `Next/src/repositories/user.repository.ts`
```typescript
import { db } from '@/db/db';
import { usersTable, InsertUser, SelectUser } from '@/db/models/user';
import { eq } from 'drizzle-orm';

// Key Methods
findById(id: number): Promise<SelectUser | undefined>
findByEmail(email: string): Promise<SelectUser | undefined>
findByUsername(username: string): Promise<SelectUser | undefined>
findByStripeCustomerId(customerId: string): Promise<SelectUser | undefined>
create(data: InsertUser): Promise<SelectUser>
updateById(id: number, data: Partial<SelectUser>): Promise<void>
updateByEmail(email: string, data: Partial<SelectUser>): Promise<void>
updateByStripeCustomerId(customerId: string, data: Partial<SelectUser>): Promise<void>
incrementMessageCount(id: number): Promise<void>
decrementMessageCount(id: number, count?: number): Promise<void>
findAllVerified(): Promise<SelectUser[]>
```

**Note**: Use actual Drizzle-generated types: `InsertUser` and `SelectUser` (not `NewUser`/`User`)

#### `Next/src/repositories/feedback.repository.ts`
```typescript
// Key Methods
interface FindByUserIdOptions {
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'stars';
  sortOrder?: 'asc' | 'desc';
  // Filters
  content?: string;
  stars?: number[];
  sentiment?: string[];
  category?: string[];
}

findByUserId(userId: number, options: FindByUserIdOptions)
countByUserId(userId: number, filters?: Omit<FindByUserIdOptions, 'limit' | 'offset' | 'sortBy' | 'sortOrder'>)
countByUserIdSince(userId: number, since: Date)
deleteByIdsForUser(ids: string[], userId: number) // SECURITY FIX
getSentimentCounts(userId: number, filters?: {content?: string})
getCategoryCounts(userId: number, filters?: {content?: string})
getRatingsCounts(userId: number, filters?: {content?: string})
```

**Advanced filtering with dynamic query building:**
- Uses Drizzle's `and()`, `inArray()`, `like()`, `ilike()`, `sql()` for dynamic WHERE clauses
- Builds conditions array based on provided filters
- Applies filters consistently across `findByUserId` and `countByUserId` to ensure accurate pagination
- Content search uses case-insensitive ILIKE with wildcards

**Implementation example:**
```typescript
import { db } from '@/db/db';
import { feedbacksTable } from '@/db/models/feedback';
import { eq, and, inArray, ilike, desc, asc, sql, SQL } from 'drizzle-orm';

export const feedbackRepository = {
  async findByUserId(userId: number, options: FindByUserIdOptions = {}) {
    const {
      limit = 10,
      offset = 0,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      content,
      stars,
      sentiment,
      category,
    } = options;
    
    // Build WHERE conditions dynamically
    const conditions: SQL[] = [eq(feedbacksTable.userId, userId)];
    
    if (content) {
      conditions.push(ilike(feedbacksTable.content, `%${content}%`));
    }
    
    if (stars && stars.length > 0) {
      conditions.push(inArray(feedbacksTable.stars, stars));
    }
    
    if (sentiment && sentiment.length > 0) {
      conditions.push(inArray(feedbacksTable.sentiment, sentiment));
    }
    
    if (category && category.length > 0) {
      // For array fields, check if ANY category matches
      conditions.push(
        sql`${feedbacksTable.category} && ARRAY[${sql.join(
          category.map(cat => sql`${cat}`),
          sql`, `
        )}]::text[]`
      );
    }
    
    // Build ORDER BY
    const orderByColumn = feedbacksTable[sortBy];
    const orderByClause = sortOrder === 'desc' ? desc(orderByColumn) : asc(orderByColumn);
    
    return db
      .select()
      .from(feedbacksTable)
      .where(and(...conditions))
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);
  },
  
  async countByUserId(
    userId: number,
    filters?: Omit<FindByUserIdOptions, 'limit' | 'offset' | 'sortBy' | 'sortOrder'>
  ) {
    const conditions: SQL[] = [eq(feedbacksTable.userId, userId)];
    
    // Apply same filters as findByUserId
    if (filters?.content) {
      conditions.push(ilike(feedbacksTable.content, `%${filters.content}%`));
    }
    
    if (filters?.stars && filters.stars.length > 0) {
      conditions.push(inArray(feedbacksTable.stars, filters.stars));
    }
    
    if (filters?.sentiment && filters.sentiment.length > 0) {
      conditions.push(inArray(feedbacksTable.sentiment, filters.sentiment));
    }
    
    if (filters?.category && filters.category.length > 0) {
      conditions.push(
        sql`${feedbacksTable.category} && ARRAY[${sql.join(
          filters.category.map(cat => sql`${cat}`),
          sql`, `
        )}]::text[]`
      );
    }
    
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(feedbacksTable)
      .where(and(...conditions));
    
    return result[0]?.count || 0;
  },
};
```

**🔒 CRITICAL SECURITY FIX**: `deleteByIdsForUser` adds ownership filter
- **Current vulnerability at `delete-messages/route.ts:37`**:
  ```typescript
  const deleteResult = await db
    .delete(feedbacksTable)
    .where(inArray(feedbacksTable.id, objectIds)); // NO userId check!
  ```
- This allows any authenticated user to delete anyone's messages by guessing IDs
- **Fix**: Add userId filter to WHERE clause:
  ```typescript
  const deleteResult = await db
    .delete(feedbacksTable)
    .where(
      and(
        inArray(feedbacksTable.id, objectIds),
        eq(feedbacksTable.userId, userId) // ADD THIS
      )
    );
  ```

#### `Next/src/repositories/workflow.repository.ts`
```typescript
import { db } from '@/db/db';
import { userWorkFlowsTable, InsertChatGroup, SelectChatGroup } from '@/db/models/workflows';
import { eq } from 'drizzle-orm';

// Key Methods
findByUserId(userId: number): Promise<SelectChatGroup[]>
countByUserId(userId: number): Promise<number>
create(data: InsertChatGroup): Promise<SelectChatGroup>
updateByIdAndUserId(id: number, userId: number, data: Partial<SelectChatGroup>): Promise<void>
deleteByIdAndUserId(id: number, userId: number): Promise<void>
```

**Dependencies**: B1 (repositories throw `ApiError.notFound()` etc.)

---

## Phase B3: Service Layer

**Goal**: Extract business logic from routes into services. Routes become thin: parse input → call service → return response.

### New Files

#### `Next/src/services/auth.service.ts`
```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { ApiError } from '@/lib/api-error';
import { User } from 'next-auth';

export const authService = {
  /**
   * Gets current session and throws if not authenticated
   * @throws {ApiError} 401 if no session
   */
  async requireAuth(): Promise<User> {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      throw ApiError.unauthorized('Not authenticated');
    }
    
    return session.user;
  },
  
  /**
   * Parses user ID to number and validates
   * @throws {ApiError} 400 if invalid ID
   */
  parseUserId(user: User): number {
    const userId = parseInt(user.id ?? '0', 10);
    
    if (!userId || isNaN(userId)) {
      throw ApiError.badRequest('Invalid user ID');
    }
    
    return userId;
  },
};
```

**Replaces**: 
- `getServerSideSession.ts` (which returns `Response | User` — bad mixed return type)
- All inline `getServerSession(authOptions)` + null checks in 10+ routes
- All inline `parseInt(user.id)` + validation logic

#### `Next/src/services/billing.service.ts`
- `computeNewBillingPeriod()`
- `resetBillingPeriodIfExpired(user)`

**Eliminates 3 copies**:
- `send-message/route.ts:54-63`
- `stripe-webhook/route.ts:55-56`
- `stripe-webhook/route.ts:100-102`

#### `Next/src/services/analytics.service.ts`
- `getAnalytics(userId, filters?)` - accepts optional content filter
- `getSentimentCounts(userId, filters?)` - accepts optional content filter

**Eliminates 2 copies**: identical sentiment aggregation in `get-analytics/route.ts` and `get-categories/route.ts`

**Note**: Analytics routes can optionally accept a `content` filter to show analytics for filtered feedbacks only. This provides consistency with the feedbacks table view.

#### `Next/src/services/message.service.ts`
- `sendFeedback(data)` — validates user, checks limits, resets billing if expired, queues job

Consolidates ~100 lines from `send-message/route.ts`

#### `Next/src/services/stripe-webhook.service.ts`
- `handleStripeEvent(event)` with handler map pattern:
  ```typescript
  {
    'checkout.session.completed': handleCheckoutCompleted,
    'invoice.paid': handleInvoicePaid,
    'customer.subscription.updated': handleSubscriptionUpdated,
    'customer.subscription.deleted': handleSubscriptionDeleted
  }
  ```

**SRP fix**: splits 4 event handlers out of one 149-line route

#### `Next/src/services/workflow.service.ts`
- CRUD with tier-based limit enforcement
- Extracted from `user-workflows/route.ts`

### Files to Deprecate
- `Next/src/config/getServerSideSession.ts` — replaced by `auth.service.ts`

**Dependencies**: B2 (services call repositories)

---

## Phase B4: Validation Middleware

**Goal**: Systematic Zod validation for every route that accepts input.

### New Files

#### `Next/src/lib/validate.ts`
- `validateBody<T>(request, schema)` — parse body + safeParse + throw `ApiError.badRequest` with field-level errors
- `validateQuery<T>(url, schema)` — parse query params + safeParse + throw `ApiError.badRequest`

#### `Next/src/schemas/deleteMessagesSchema.ts`
```typescript
z.object({ messageIds: z.array(z.string()).min(1) })
```

#### `Next/src/schemas/checkoutSessionSchema.ts`
```typescript
z.object({
  plan: z.enum(['pro', 'business']),
  interval: z.enum(['monthly', 'yearly'])
})
```

#### `Next/src/schemas/paginationSchema.ts`
```typescript
z.object({
  // Pagination
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  
  // Sorting
  sortBy: z.enum(['createdAt', 'stars']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  
  // Filters
  content: z.string().optional(),
  stars: z.preprocess(
    (val) => {
      if (typeof val === 'string') return val.split(',').map(Number);
      if (Array.isArray(val)) return val.map(Number);
      return undefined;
    },
    z.array(z.number().min(1).max(5)).optional()
  ),
  sentiment: z.preprocess(
    (val) => {
      if (typeof val === 'string') return val.split(',');
      return val;
    },
    z.array(z.enum(['positive', 'negative', 'neutral'])).optional()
  ),
  category: z.preprocess(
    (val) => {
      if (typeof val === 'string') return val.split(',');
      return val;
    },
    z.array(z.enum(['bug', 'request', 'praise', 'complaint', 'suggestion', 'question', 'other'])).optional()
  ),
})
```

**Comprehensive query parameter handling:**
- Handles comma-separated values from URL (e.g., `?stars=1,2,3`)
- Validates enum values for sentiment and category
- Limits page size to prevent abuse (max 100 items)

### Routes That Gain Validation (currently missing):
- `POST /api/register` — use `signUpSchema`
- `POST /api/verify-code` — use `verifySchema`
- `PUT /api/update-user-data` — use existing `updateUserData` schema
- `PATCH /api/user-workflows` — use `workflowsSchema.partial()`
- `POST /api/checkout-sessions` — use new `checkoutSessionSchema`
- `DELETE /api/delete-messages` — use new `deleteMessagesSchema`
- `GET /api/get-messages` — use new `paginationSchema`

**Dependencies**: B1 (validate.ts uses `ApiError`)

---

## Phase B5: Rewrite All Routes

**Goal**: Every route handler becomes thin — uses `createHandler`, `requireAuth`, `validateBody`, service methods, and `successResponse`.

### All 19 Route Files Modified in `Next/src/app/api/`

| Route | Key Changes |
|-------|-------------|
| **delete-messages/route.ts** | 🔒 **SECURITY FIX**: use `feedbackRepository.deleteByIdsForUser(ids, userId)`, add `validateBody`, use `createHandler` |
| **get-messages/route.ts** | **SERVER-SIDE FILTERING & PAGINATION**: Use `validateQuery` with `paginationSchema`, pass all filters to `feedbackRepository.findByUserId()`, return `{ messages, totalPages, totalCount, currentPage }`. See implementation example below. |
| **get-analytics/route.ts** | Replace 4 inline queries with `analyticsService.getAnalytics(userId)` |
| **get-categories/route.ts** | Replace inline sentiment query with `analyticsService.getSentimentCounts(userId)` |
| **send-message/route.ts** | Replace ~100 lines with `messageService.sendFeedback()`, use `corsSuccessResponse`/`corsErrorResponse` |
| **stripe-webhook/route.ts** | Replace switch block with `stripeWebhookService.handleStripeEvent(event)` |
| **accept-messages/route.ts** | Replace inline `getServerSession` + null check with `requireAuth()` |
| **get-user-details/route.ts** | Same — `requireAuth()` |
| **update-user-data/route.ts** | Add `validateBody(request, updateUserData)` + `requireAuth()` |
| **billing/route.ts** | Switch from `getServerSideSession()` to `requireAuth()` |
| **checkout-sessions/route.ts** | Add `validateBody` with `checkoutSessionSchema` |
| **user-workflows/route.ts** | Add validation to PATCH, use `workflowService` |
| **register/route.ts** | Add `validateBody(request, signUpSchema)` |
| **verify-code/route.ts** | Add body validation |
| **get-project-details/route.ts** | Use `requireAuth()` |
| **get-user-form-details/[username]/route.ts** | Use `userRepository.findByUsername()` |
| **get-widget-settings/route.ts** | Use repository + `corsSuccessResponse` |
| **check-username-unique/route.ts** | Use `successResponse`/`errorResponse` helpers |
| **All routes** | Replace `new Response(JSON.stringify(...))` / `NextResponse.json(...)` with `successResponse`/`errorResponse` |

**Implementation example for get-messages/route.ts:**
```typescript
import { createHandler } from '@/lib/route-handler';
import { validateQuery } from '@/lib/validate';
import { paginationSchema } from '@/schemas/paginationSchema';
import { successResponse } from '@/lib/api-response';
import { authService } from '@/services/auth.service';
import { feedbackRepository } from '@/repositories/feedback.repository';

export const GET = createHandler(async (request: Request) => {
  // 1. Require authentication
  const user = await authService.requireAuth();
  const userId = authService.parseUserId(user);
  
  // 2. Validate and parse query parameters
  const url = new URL(request.url);
  const params = validateQuery(url, paginationSchema);
  
  const {
    page,
    limit,
    sortBy,
    sortOrder,
    content,
    stars,
    sentiment,
    category,
  } = params;
  
  const offset = (page - 1) * limit;
  
  // 3. Extract filters for repository
  const filters = { content, stars, sentiment, category };
  
  // 4. Fetch messages and total count in parallel
  const [messages, totalCount] = await Promise.all([
    feedbackRepository.findByUserId(userId, {
      limit,
      offset,
      sortBy,
      sortOrder,
      ...filters,
    }),
    feedbackRepository.countByUserId(userId, filters),
  ]);
  
  // 5. Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limit);
  
  // 6. Return standardized response
  return successResponse({
    messages,
    totalPages,
    totalCount,
    currentPage: page,
  });
});
```

**Dependencies**: B1 + B2 + B3 + B4

---

## Phase B6: Rate Limit & CORS Consolidation

**Current state**: Middleware already implements rate limiting globally:
- Auth pages: 3 req/1sec
- API routes: 5 req/1sec

**Enhancement**: Add route-specific rate limits for critical endpoints

### Files to Modify

#### `Next/src/middleware.ts`
Add route-specific rate limit map instead of one-size-fits-all:
```typescript
const rateLimitConfig = {
  '/api/send-message': { ipLimit: 5, ipWindow: 10 },
  '/api/register': { ipLimit: 3, ipWindow: 10 }
}
```

#### `Next/src/app/api/send-message/route.ts`
Remove inline `rateLimit()` call (now handled by middleware)

#### `Next/src/app/api/register/route.ts`
Remove inline `rateLimit()` call

### CORS Configuration

**Current state**: CORS is handled manually in each route that needs it

Only 3 widget-facing routes need CORS:
- `send-message` - accepts feedback from embedded widget
- `get-widget-settings` - widget configuration
- `get-user-form-details/[username]` - public user profile for widget

**Implementation**: Use `corsSuccessResponse`/`corsErrorResponse` helpers from Phase B1:

```typescript
// In cors-enabled routes
return corsSuccessResponse({ data: result });

// CORS helper in api-response.ts
export function corsSuccessResponse(data: any, status = 200) {
  return new Response(JSON.stringify({ success: true, ...data }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // Or specific domain
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
```

All other routes do **NOT** set CORS headers (dashboard APIs are same-origin).

**Dependencies**: B5

---

## Phase B6.5: Database Indexes for Performance

**Goal**: Add indexes to support fast filtering queries on feedback table.

### Database Indexes (Update Schema)

**Current state**: Schema already has `idx_feedbacks_user_created` on `(userId, createdAt)`

**Add to `Next/src/db/models/feedback.ts`**:

```typescript
export const feedbacksTable = pgTable(
  "feedbacks",
  {
    // ... existing fields ...
  },
  (table) => [
    { starsCheck: sql`CHECK (${table.stars} >= 0 AND ${table.stars} <= 5)` },
    
    // EXISTING INDEX - keep this
    index("idx_feedbacks_user_created").on(table.userId, table.createdAt),
    
    // NEW INDEXES - add these for filtering performance
    index("idx_feedbacks_stars").on(table.stars),
    index("idx_feedbacks_sentiment").on(table.sentiment),
    index("idx_feedbacks_category").on(table.category), // GIN index for arrays
  ]
);
```

**For content search (PostgreSQL-specific)**, run this SQL migration:
```sql
-- Enable trigram extension for ILIKE queries
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add trigram index for content search
CREATE INDEX IF NOT EXISTS idx_feedbacks_content_trgm 
ON feedbacks USING gin(content gin_trgm_ops);
```

**Run via Drizzle migration:**
```bash
cd Next
npx drizzle-kit generate:pg
npx drizzle-kit push:pg
```

**Why these indexes:**
- `idx_feedbacks_user_filters` - Covers the most common query: filter by userId + sort by date + filter by stars/sentiment
- `idx_feedbacks_content_trgm` - Enables fast LIKE '%search%' queries (case-insensitive)
- `idx_feedbacks_category` - Enables fast array containment queries for category filtering

**Query performance improvement:**
- Without indexes: 1000+ ms for 100K rows
- With indexes: 10-50 ms for 100K rows

**Dependencies**: B2 (repositories exist)

---

## Phase B7: Backend Documentation

### Create: `Next/BACKEND_ARCHITECTURE.md`

**Contents:**
- Architecture diagram: `Route → createHandler → validateBody → Service → Repository → DB`
- List of all new shared modules and their roles
- How to add a new API route (step-by-step guide)
- Error handling conventions
- Validation patterns
- Repository pattern examples
- Service layer patterns

**Dependencies**: B6

---

## Execution Order

```
B1 (types, error, response) → B2 (repositories) → B3 (services)
                            ↘                    ↘               ↘
                              B4 (validation) → → B5 (rewrite routes) → B6 (rate limits) → B6.5 (indexes) → B7 (README)
```

**All phases must be sequential** — each phase depends on the previous.

**Note**: B6.5 can run in parallel with B6, but both should complete before frontend F7 testing.

---

## Codebase Analysis Findings

### Existing Good Patterns ✅
1. **Metrics instrumentation**: All routes use `withMetrics` HOF - excellent observability
2. **Rate limiting**: Recently refactored to use `rate-limiter-flexible` (in-memory) - works well
3. **Drizzle ORM**: Type-safe queries with `InsertX` and `SelectX` types
4. **Existing indexes**: `idx_feedbacks_user_created`, `idx_users_email`, `idx_workflows_user`
5. **Plan configuration**: Centralized in `config/plans.ts` with proper typing

### Critical Issues Found 🔒
1. **Security vulnerability**: `delete-messages/route.ts:37` - no userId filter on delete (confirmed)
2. **Mixed return types**: `getServerSideSession` returns `Response | User` (anti-pattern)
3. **No input validation**: 7+ routes accept unvalidated input
4. **Direct DB access**: All routes import and use `db` directly
5. **Duplicate logic**: Auth checks, billing resets, analytics aggregations repeated 3-6 times

### Patterns to Leverage
- **React Query**: Already used extensively - keep the same pattern
- **Zod schemas**: 7 schemas already exist - create 3 more for missing routes
- **usehooks-ts**: Library already installed - use `useDebounceCallback`/`useDebounceValue`
- **Middleware**: Already handles rate limiting and auth redirects globally

---

## Verification Checklist

After each phase:

### B1-B4 (Foundation)
- [ ] `cd Next && npx tsc --noEmit` — TypeScript compilation passes
- [ ] No import errors

### B5 (Route Rewrites)
- [ ] `cd Next && npm run build` — Next.js build succeeds
- [ ] curl each route — verify response shape is `{ success: boolean, message: string, ...data }`
- [ ] 🔒 **SECURITY TEST**: Attempt to delete another user's messages — expect 404/403
- [ ] **PAGINATION TEST**: `GET /api/get-messages?page=1&limit=10` — verify returns 10 items + `totalPages` + `totalCount`
- [ ] **FILTERING TEST**: `GET /api/get-messages?stars=5&sentiment=positive` — verify filtered results
- [ ] **SORTING TEST**: `GET /api/get-messages?sortBy=stars&sortOrder=asc` — verify correct order
- [ ] **COMBINED TEST**: `GET /api/get-messages?page=2&stars=4,5&category=bug,request&content=error` — verify all filters + pagination work together
- [ ] Test Stripe webhook locally with `stripe trigger`
- [ ] Test all auth routes (login, register, verify)

### B6 (Rate Limiting)
- [ ] Test rate limit on `/api/register` — verify 3 req/10sec limit
- [ ] Test rate limit on `/api/send-message` — verify 5 req/10sec limit
- [ ] Verify CORS headers only on 3 widget routes

### B6.5 (Database Indexes)
- [ ] Run migration to add indexes
- [ ] Verify indexes exist: `\d+ feedbacks` in psql
- [ ] Test query performance with EXPLAIN ANALYZE
- [ ] Benchmark filtered queries: measure query time with 10K+ messages
- [ ] Verify pg_trgm extension is enabled

### B7 (Documentation)
- [ ] Review `BACKEND_ARCHITECTURE.md` for completeness
- [ ] Verify all examples in docs are correct

---

## Implementation Notes

### Composing with Existing Patterns

**Metrics wrapper** (already exists):
```typescript
// Current pattern in every route
export const GET = withMetrics(handleGET, "/api/route-name");

// After refactor - compose createHandler + withMetrics
export const GET = withMetrics(
  createHandler(async (request) => {
    const user = await authService.requireAuth();
    const userId = authService.parseUserId(user);
    // ... handler logic
  }),
  "/api/route-name"
);
```

**TanStack Query integration** (frontend already uses):
- All components already use `useQuery` and `useMutation`
- QueryKeys are mostly correct (e.g., `['messages-table']`, `['analytics']`)
- Should update to include filter parameters in queryKey after F7

**Existing schemas** (keep these):
- `signUpSchema` - registration validation (already used)
- `signInSchema` - login validation
- `messageSchema` - content validation
- `updateUserData` - user profile validation
- `verifySchema` - email verification
- `workFlowsSchema` - workflow validation
- `acceptMessageSchema` - toggle validation

**NEW schemas needed** (Phase B4):
- `deleteMessagesSchema`
- `checkoutSessionSchema`  
- `paginationSchema` (with filters)

---

## Summary of New Files

### Shared Libraries (5 files)
- `Next/src/lib/api-types.ts`
- `Next/src/lib/api-error.ts`
- `Next/src/lib/api-response.ts`
- `Next/src/lib/route-handler.ts`
- `Next/src/lib/validate.ts`

### Repositories (3 files)
- `Next/src/repositories/user.repository.ts`
- `Next/src/repositories/feedback.repository.ts`
- `Next/src/repositories/workflow.repository.ts`

### Services (6 files)
- `Next/src/services/auth.service.ts`
- `Next/src/services/billing.service.ts`
- `Next/src/services/analytics.service.ts`
- `Next/src/services/message.service.ts`
- `Next/src/services/stripe-webhook.service.ts`
- `Next/src/services/workflow.service.ts`

### Schemas (3 files)
- `Next/src/schemas/deleteMessagesSchema.ts`
- `Next/src/schemas/checkoutSessionSchema.ts`
- `Next/src/schemas/paginationSchema.ts`

### Documentation (1 file)
- `Next/BACKEND_ARCHITECTURE.md`

### Files Modified
- All 19 route files in `Next/src/app/api/`
- `Next/src/middleware.ts`

### Files Deprecated
- `Next/src/config/getServerSideSession.ts`

---

## Security Fixes Summary

### 🔒 Critical: Unauthorized Message Deletion
**Location**: `delete-messages/route.ts:37`
**Issue**: Delete query uses `inArray(feedbacksTable.id, objectIds)` with no userId filter
**Impact**: Any authenticated user can delete anyone's messages
**Fix**: `feedbackRepository.deleteByIdsForUser(ids, userId)` adds `AND userId = ?`

### 🔒 Medium: Missing Input Validation
**Issue**: 7 routes accept user input without validation
**Impact**: Malformed data can cause runtime errors or bypass business logic
**Fix**: Add Zod validation via `validateBody`/`validateQuery` in Phase B4

---

## Benefits

✅ **Security**: Fixes unauthorized deletion, adds systematic validation  
✅ **Maintainability**: Clear separation of concerns (route/service/repository)  
✅ **DRY**: Eliminates 6+ instances of duplicated logic  
✅ **Type Safety**: End-to-end types from request to database  
✅ **Consistency**: Standardized error handling and response formats  
✅ **Testability**: Services and repositories are easily unit testable  
✅ **Scalability**: Clean architecture makes adding features straightforward
