# Feedlytics Frontend Refactoring Plan

## Overview

This plan systematically refactors the frontend to establish a centralized API layer with shared hooks and components. It addresses scattered API calls, code duplication, inconsistent patterns, and missing type safety.

**Current Issues:**
- Scattered `axios.get/post` calls in 17+ components
- Mixed HTTP clients (axios + fetch)
- Duplicate logic: username checking, error toasts, loading buttons
- 466-line metadata form component
- No shared API layer or type safety
- Missing pagination implementation

---

## Phase F1: Typed API Service Layer

**Goal**: Centralize ALL API calls. No component should write `axios.get("/api/...")` directly.

### New Files

#### `Next/src/lib/api-client.ts`
Configured axios instance with:
- Error interceptor (extracts `error.response.data.message`)
- Consistent error handling across all API calls
- TypeScript error typing

```typescript
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types';

export const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    // Extract message from API error response
    const message = 
      error.response?.data?.message || 
      error.message || 
      'An unexpected error occurred';
    
    // Return a standardized error
    return Promise.reject(new Error(message));
  }
);
```

**Note**: Current codebase uses axios directly without an interceptor. This centralizes error handling so components don't need to extract `error.response.data.message` manually.

#### `Next/src/lib/api.ts`
Single `api` object with typed methods for every endpoint:

```typescript
import { apiClient } from './api-client';
import type {
  GetAnalyticsResponse,
  GetMessagesResponse,
  SendMessageRequest,
  DeleteMessagesRequest,
  // ... all types from api-types.ts
} from './api-types';

export const api = {
  // Analytics
  getAnalytics: () =>
    apiClient.get<GetAnalyticsResponse>('/get-analytics'),
  
  getSentimentCounts: () =>
    apiClient.get<GetSentimentCountsResponse>('/get-categories'),
  
  // Messages
  getMessages: (params: {
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'stars';
    sortOrder?: 'asc' | 'desc';
    content?: string;
    stars?: number[];
    sentiment?: string[];
    category?: string[];
  }) =>
    apiClient.get<GetMessagesResponse>('/get-messages', {
      params: {
        ...params,
        // Convert arrays to comma-separated strings for URL
        stars: params.stars?.join(','),
        sentiment: params.sentiment?.join(','),
        category: params.category?.join(','),
      }
    }),
  
  sendMessage: (data: SendMessageRequest) =>
    apiClient.post<SendMessageResponse>('/send-message', data),
  
  deleteMessages: (messageIds: string[]) =>
    apiClient.delete<DeleteMessagesResponse>('/delete-messages', {
      data: { messageIds }
    }),
  
  // User
  getUserDetails: () =>
    apiClient.get<GetUserDetailsResponse>('/get-user-details'),
  
  updateUserData: (data: UpdateUserDataRequest) =>
    apiClient.put<UpdateUserDataResponse>('/update-user-data', data),
  
  checkUsernameUnique: (username: string) =>
    apiClient.get<CheckUsernameResponse>('/check-username-unique', {
      params: { username }
    }),
  
  // Workflows
  getWorkflows: () =>
    apiClient.get<GetWorkflowsResponse>('/user-workflows'),
  
  createWorkflow: (data: CreateWorkflowRequest) =>
    apiClient.post<CreateWorkflowResponse>('/user-workflows', data),
  
  updateWorkflow: (data: UpdateWorkflowRequest) =>
    apiClient.patch<UpdateWorkflowResponse>('/user-workflows', data),
  
  deleteWorkflow: (id: string) =>
    apiClient.delete<DeleteWorkflowResponse>('/user-workflows', {
      data: { id }
    }),
  
  // Billing
  getBilling: () =>
    apiClient.get<GetBillingResponse>('/billing'),
  
  createCheckoutSession: (data: CreateCheckoutSessionRequest) =>
    apiClient.post<CreateCheckoutSessionResponse>('/checkout-sessions', data),
  
  // Accept Messages
  getAcceptMessagesStatus: () =>
    apiClient.get<GetAcceptMessagesResponse>('/accept-messages'),
  
  updateAcceptMessagesStatus: (isAcceptingMessages: boolean) =>
    apiClient.put<UpdateAcceptMessagesResponse>('/accept-messages', {
      isAcceptingMessages
    }),
  
  // Project
  getProjectDetails: () =>
    apiClient.get<GetProjectDetailsResponse>('/get-project-details'),
  
  // Public/Widget
  getUserFormDetails: (username: string) =>
    apiClient.get<GetUserFormDetailsResponse>(
      `/get-user-form-details/${username}`
    ),
  
  getWidgetSettings: () =>
    apiClient.get<GetWidgetSettingsResponse>('/get-widget-settings'),
};
```

### What This Replaces
- Scattered `axios.get`/`axios.post` calls in **17+ components**
- `form-metadata.tsx:155` using `fetch()` instead of axios (mixed HTTP clients)
- Inconsistent error handling across components

**Dependencies**: B1 (shares `api-types.ts` from backend)

---

## Phase F2: Shared Custom Hooks

**Goal**: Extract and centralize duplicate hook logic.

### New Files

#### `Next/src/hooks/use-check-username.ts`
Extracts identical debounced username checking logic:

```typescript
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';

interface UseCheckUsernameOptions {
  currentUsername?: string;
}

export function useCheckUsername(
  username: string,
  options?: UseCheckUsernameOptions
) {
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState('');
  
  const debouncedUsername = useDebounce(username, 300);
  
  useEffect(() => {
    const checkUsername = async () => {
      if (!debouncedUsername) {
        setUsernameMessage('');
        return;
      }
      
      // Skip check if it's the same as current username (edit mode)
      if (options?.currentUsername === debouncedUsername) {
        setUsernameMessage('');
        return;
      }
      
      setIsCheckingUsername(true);
      try {
        const response = await api.checkUsernameUnique(debouncedUsername);
        setUsernameMessage(
          response.data.message || 'Username is available'
        );
      } catch (error) {
        setUsernameMessage('Username is already taken');
      } finally {
        setIsCheckingUsername(false);
      }
    };
    
    checkUsername();
  }, [debouncedUsername, options?.currentUsername]);
  
  return { isCheckingUsername, usernameMessage };
}
```

**Deduplication**: Extracts identical logic from:
- `form-signup.tsx:47-67` (create mode)
- `form-metadata.tsx:115-136` (edit mode with current username)

#### `Next/src/hooks/use-api-error-toast.ts`
Extracts identical error toast pattern:

```typescript
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export function useApiErrorToast(
  isError: boolean,
  error: Error | null,
  options?: {
    title?: string;
    description?: string;
  }
) {
  const { toast } = useToast();
  
  useEffect(() => {
    if (isError && error) {
      toast({
        title: options?.title || 'Error',
        description: error.message || options?.description || 'Something went wrong',
        variant: 'destructive',
      });
    }
  }, [isError, error, options?.title, options?.description, toast]);
}
```

**Deduplication**: Replaces identical pattern in:
- `analytics/page.tsx:50-57` — error toast for analytics query
- `workflows/page.tsx:40-47` — error toast for workflows query  
- `table-box.tsx:41-49` — error toast for messages query
- `form-metadata.tsx:64-68` — error toast for user details query

**Current pattern** (repeated 4+ times):
```typescript
useEffect(() => {
  if (isError) {
    toast({
      title: "Error",
      description: (error as Error)?.message || "Failed to fetch",
    });
  }
}, [isError, error, toast]);
```

**After refactor**:
```typescript
useApiErrorToast(isError, error);
```

### Files to Modify

| File | Current Lines | Change |
|------|--------------|--------|
| `analytics/page.tsx` | 50-57 | Replace error toast useEffect with `useApiErrorToast(isError, error)` |
| `workflows/page.tsx` | 40-47 | Replace error toast useEffect with `useApiErrorToast(isError, error)` |
| `table-box.tsx` | 41-49 | Replace error toast useEffect with `useApiErrorToast(isError, error)` |
| `form-metadata.tsx` | 64-68 | Replace error toast useEffect with `useApiErrorToast(isError, error)` |
| `form-metadata.tsx` | 87-136 (username check) | Extract to `useCheckUsername({ currentUsername })` hook |

**Dependencies**: F1 (hooks use `api.*` methods)

---

## Phase F3: Reusable UI Components

**Goal**: Extract duplicate UI patterns into shared components.

### New Files

#### `Next/src/components/custom/submit-button.tsx`
Extracts `Button + Loader2` loading state pattern:

```typescript
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  className?: string;
}

export function SubmitButton({
  isLoading,
  loadingText = 'Loading...',
  children,
  disabled,
  variant = 'default',
  className,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isLoading || disabled}
      variant={variant}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
```

**Deduplication**: Replaces `Button + Loader2` in:
- `form-signup.tsx`
- `form-signin.tsx`
- `form-metadata.tsx`
- `settings/page.tsx`
- `delete-task-button.tsx`
- `delete-webhook-button.tsx`

#### `Next/src/components/custom/chart-card.tsx`
Extracts identical `Card + CardHeader + Skeleton` loading wrapper:

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ChartCardProps {
  title: string;
  isLoading: boolean;
  children: React.ReactNode;
}

export function ChartCard({ title, isLoading, children }: ChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
```

**Deduplication**: Wraps all 4 chart components:
- `sentiment-pie-chart.tsx`
- `category-bar-chart.tsx`
- `total-messages-pie-chart.tsx`
- `ratings-bar-chart.tsx`

### Files to Modify
- All 6 forms: Replace `Button + Loader2` with `<SubmitButton>`
- All 4 chart components: Wrap in `<ChartCard>`

**Dependencies**: None (pure UI)

---

## Phase F4: Migrate All Components to API Service

**Goal**: Replace every inline `axios.get/post/put/delete` with typed `api.*` methods.

### Components to Migrate (17 total)

| Component | Current Calls | New Calls |
|-----------|--------------|-----------|
| `analytics/page.tsx` | `axios.get("/api/get-analytics")` | `api.getAnalytics()` |
| `analytics/page.tsx` | `axios.get("/api/get-categories")` | `api.getSentimentCounts()` |
| `workflows/page.tsx` | `axios.get("/api/user-workflows")` | `api.getWorkflows()` |
| `table-box.tsx` | `axios.get("/api/get-messages")` | `api.getMessages({ page, ...filters })` |
| `form-metadata.tsx` | `axios.get("/api/get-user-details")` | `api.getUserDetails()` |
| `form-metadata.tsx` | `fetch("/api/update-user-data")` | `api.updateUserData(data)` |
| `use-accept-messages.tsx` | `axios.get("/api/accept-messages")` | `api.getAcceptMessagesStatus()` |
| `use-accept-messages.tsx` | `axios.put("/api/accept-messages")` | `api.updateAcceptMessagesStatus()` |
| `MessageProvider.tsx` | `axios.get("/api/get-project-details")` | `api.getProjectDetails()` |
| `settings/page.tsx` | `axios.get("/api/billing")` | `api.getBilling()` |
| `settings/page.tsx` | `axios.post("/api/billing")` | `api.getBilling()` (portal) |
| `settings/page.tsx` | `axios.post("/api/checkout-sessions")` | `api.createCheckoutSession()` |
| `total-messages-pie-chart.tsx` | `axios.get("/api/billing")` | `api.getBilling()` |
| `workflow-form.tsx` | `axios.post("/api/user-workflows")` | `api.createWorkflow()` |
| `workflow-form.tsx` | `axios.patch("/api/user-workflows")` | `api.updateWorkflow()` |
| `delete-webhook-button.tsx` | `axios.delete("/api/user-workflows")` | `api.deleteWorkflow()` |
| `delete-task-button.tsx` | `axios.delete("/api/delete-messages")` | `api.deleteMessages()` |
| `form-signup.tsx` | `axios.get("/api/check-username-unique")` | `api.checkUsernameUnique()` (via hook) |
| `form-signup.tsx` | `axios.post("/api/register")` | `api.register()` |
| `client-page.tsx` (sender) | `axios.get("/api/get-user-form-details/...")` | `api.getUserFormDetails()` |
| `client-page.tsx` (sender) | `axios.post("/api/send-message")` | `api.sendMessage()` |

### Migration Pattern

**Before:**
```typescript
const { data } = await axios.get("/api/get-analytics");
```

**After:**
```typescript
const { data } = await api.getAnalytics();
```

After this phase, **no component imports `axios` directly** — only `api-client.ts` does.

**Dependencies**: F1 + F2 + B5 (response shapes may change, especially pagination)

---

## Phase F5: Split form-metadata.tsx

**Goal**: Break down 466-line component into manageable sub-modules.

### Current State
`form-metadata.tsx`: 466 lines containing:
- Form setup and validation
- Data fetching and mutations
- Username checking logic
- Two tab panels (appearance, content)
- Preview component
- Reset logic

### New Structure

#### `Next/src/app/(app)/(receiver)/metadata/hooks/use-metadata-form.ts`
Extract form logic:
```typescript
export function useMetadataForm() {
  // Form setup
  // Data fetching (useQuery)
  // Mutation (useMutation)
  // Reset logic
  // isSameAsInitialValues helper
  
  return {
    form,
    isLoading,
    isSaving,
    onSubmit,
    resetForm,
    hasChanges,
  };
}
```

#### `Next/src/app/(app)/(receiver)/metadata/components/appearance-tab.tsx`
Extract appearance fields:
```typescript
export function AppearanceTab({ form }: { form: UseFormReturn }) {
  return (
    <>
      {/* bg_color field */}
      {/* text_color field */}
      {/* avatar_url field */}
      {/* collect_name checkbox */}
      {/* collect_email checkbox */}
    </>
  );
}
```

#### `Next/src/app/(app)/(receiver)/metadata/components/content-tab.tsx`
Extract content fields:
```typescript
export function ContentTab({ form }: { form: UseFormReturn }) {
  const { isCheckingUsername, usernameMessage } = useCheckUsername(
    form.watch('username'),
    { currentUsername: initialValues?.username }
  );
  
  return (
    <>
      {/* name field */}
      {/* username field (uses useCheckUsername) */}
      {/* introduction field */}
      {/* questions field */}
    </>
  );
}
```

### Modified: `form-metadata.tsx`
Becomes ~60 lines:
```typescript
import { useMetadataForm } from './hooks/use-metadata-form';
import { AppearanceTab } from './components/appearance-tab';
import { ContentTab } from './components/content-tab';

export default function FormMetadata() {
  const { form, isLoading, isSaving, onSubmit, resetForm, hasChanges } =
    useMetadataForm();
  
  return (
    <Form>
      <Tabs>
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content">
          <ContentTab form={form} />
        </TabsContent>
        
        <TabsContent value="appearance">
          <AppearanceTab form={form} />
        </TabsContent>
      </Tabs>
      
      <SubmitButton isLoading={isSaving}>Save Changes</SubmitButton>
      <Button onClick={resetForm} disabled={!hasChanges}>Reset</Button>
    </Form>
  );
}
```

**Current state**: `form-metadata.tsx` is 466 lines with:
- Lines 1-30: Imports and setup
- Lines 31-90: Form initialization and React Query
- Lines 87-136: Username checking logic (duplicate of signup form)
- Lines 101-140: Debounced color state
- Lines 141-220: Mutation logic
- Lines 221-466: JSX (tabs, fields, preview)

**Dependencies**: F2 (uses `useCheckUsername`), F4 (uses `api.*`)

---

## Phase F6: Move Color Utilities

**Goal**: Extract utility functions into shared library.

### New File: `Next/src/lib/color-utils.ts`

```typescript
export function lightenColor(color: string, amount: number): string {
  // Current implementation from feedback-preview.tsx:11-20
}

export function blendColor(
  color1: string,
  color2: string,
  ratio: number
): string {
  // Current implementation from feedback-preview.tsx:22-31
}
```

### Modified: `feedback-preview.tsx`
Remove function definitions (lines 11-31), import from `@/lib/color-utils`

**Dependencies**: None

---

## Phase F7: Server-Side Filtering & Pagination in Feedbacks Table

**Goal**: Frontend syncs all filters with backend, implementing full server-side filtering and pagination.

### Modified: `Next/src/components/custom/table-box.tsx`

**Complete rewrite** - move from client-side to server-side filtering:

**Changes:**
- Add state for all filters: `page`, `content`, `stars`, `sentiment`, `category`
- Add debounced content search (300ms delay)
- Sync filters with query parameters using `useSearchParams` or custom hook
- Update `queryKey` to include all filters for proper cache invalidation
- Reset to page 1 when any filter changes
- Remove TanStack Table's `getFilteredRowModel()` - backend handles filtering now
- Keep TanStack Table for UI (sorting, column visibility, row selection) only

```typescript
import { useDebounceValue } from 'usehooks-ts'; // Already installed

export function MessageTable() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    content: '',
    stars: [] as number[],
    sentiment: [] as string[],
    category: [] as string[],
  });
  
  // Debounce content search using existing library
  const [debouncedContent] = useDebounceValue(filters.content, 300);
  
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      'messages',
      page,
      debouncedContent,
      filters.stars,
      filters.sentiment,
      filters.category,
    ],
    queryFn: async () => {
      const response = await api.getMessages({
        page,
        limit: 10,
        content: debouncedContent,
        stars: filters.stars,
        sentiment: filters.sentiment,
        category: filters.category,
      });
      return response.data;
    },
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedContent, filters.stars, filters.sentiment, filters.category]);
  
  const messages = data?.messages || [];
  const totalPages = data?.totalPages || 1;
  const totalCount = data?.totalCount || 0;
  
  return (
    <Card>
      <DataTableToolbar
        filters={filters}
        onFiltersChange={setFilters}
        isLoading={isLoading}
      />
      
      <DataTable
        columns={columns}
        data={messages}
        // Remove getFilteredRowModel - backend handles this
        disableClientSideFiltering={true}
      />
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Showing {messages.length} of {totalCount} messages
        </span>
        
        <Pagination>
          <PaginationPrevious
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
          />
          
          <PaginationContent>
            {/* Show max 5 page numbers with ellipsis for large ranges */}
            {getPaginationRange(page, totalPages).map((pageNum, idx) =>
              pageNum === '...' ? (
                <PaginationEllipsis key={`ellipsis-${idx}`} />
              ) : (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => setPage(pageNum as number)}
                    isActive={page === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
          </PaginationContent>
          
          <PaginationNext
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isLoading}
          />
        </Pagination>
      </div>
    </Card>
  );
}

// Helper for smart pagination display
function getPaginationRange(current: number, total: number) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  
  if (current <= 3) return [1, 2, 3, 4, '...', total];
  if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
  
  return [1, '...', current - 1, current, current + 1, '...', total];
}
```

### Modified: `Next/src/components/custom/data-table-toolbar.tsx`

**Changes:**
- Replace TanStack Table column filters with controlled filter state
- Update inputs to call `onFiltersChange` instead of `table.getColumn().setFilterValue()`
- Keep the same UI, just change the data flow

```typescript
interface DataTableToolbarProps {
  filters: {
    content: string;
    stars: number[];
    sentiment: string[];
    category: string[];
  };
  onFiltersChange: (filters: DataTableToolbarProps['filters']) => void;
  isLoading?: boolean;
}

export function DataTableToolbar({
  filters,
  onFiltersChange,
  isLoading,
}: DataTableToolbarProps) {
  const hasFilters = 
    filters.content ||
    filters.stars.length > 0 ||
    filters.sentiment.length > 0 ||
    filters.category.length > 0;
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-wrap flex-1 items-center space-x-2 gap-y-2">
        <Input
          placeholder="Search content..."
          value={filters.content}
          onChange={(e) =>
            onFiltersChange({ ...filters, content: e.target.value })
          }
          disabled={isLoading}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        
        <FacetedFilter
          title="Ratings"
          options={ratings}
          selectedValues={filters.stars.map(String)}
          onSelectionChange={(values) =>
            onFiltersChange({
              ...filters,
              stars: values.map(Number),
            })
          }
          disabled={isLoading}
        />
        
        <FacetedFilter
          title="Sentiments"
          options={sentiments}
          selectedValues={filters.sentiment}
          onSelectionChange={(values) =>
            onFiltersChange({ ...filters, sentiment: values })
          }
          disabled={isLoading}
        />
        
        <FacetedFilter
          title="Categories"
          options={categories}
          selectedValues={filters.category}
          onSelectionChange={(values) =>
            onFiltersChange({ ...filters, category: values })
          }
          disabled={isLoading}
        />
        
        {hasFilters && (
          <Button
            variant="ghost"
            onClick={() =>
              onFiltersChange({
                content: '',
                stars: [],
                sentiment: [],
                category: [],
              })
            }
            disabled={isLoading}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
```

### Modified: `Next/src/components/ui/data-table.tsx`

**Changes:**
- Remove `getFilteredRowModel()` from table config
- Keep `getPaginationRowModel()` for client-side page display (within the 10 items)
- Keep `getSortedRowModel()` for client-side column sorting (within the 10 items)
- TanStack Table now only handles UI interactions, not data filtering

```typescript
export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data: initialData,
  disableClientSideFiltering = false,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = useState<TData[]>(initialData);
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    // Remove getFilteredRowModel - backend handles filtering
    ...(disableClientSideFiltering ? {} : { getFilteredRowModel: getFilteredRowModel() }),
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    state: { sorting, rowSelection },
    // Remove pagination from TanStack - backend handles it
  });

  return (
    <div className="rounded-md border w-full mx-auto">
      <Table>
        {/* ... table rendering unchanged ... */}
      </Table>
      
      <div className="flex items-center gap-2">
        <DeleteTasksButton table={table} setData={setData} />
        <span className="text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getRowModel().rows.length} row(s) selected on this page
        </span>
      </div>
    </div>
  );
}
```

### Debounce Hook (Already Available)

**Use existing `useDebounceCallback` from `usehooks-ts` library**:

```typescript
import { useDebounceCallback } from 'usehooks-ts';

// In your component
const [searchTerm, setSearchTerm] = useState('');
const debouncedSetSearch = useDebounceCallback(setSearchTerm, 300);

// Or use the simpler useDebounceValue
import { useDebounceValue } from 'usehooks-ts';
const [debouncedValue] = useDebounceValue(searchTerm, 300);
```

**Already in use**: See `form-metadata.tsx:90` — already uses `useDebounceCallback` for username checking.

**No new file needed** — the library is already installed and in use.

### Optional: URL State Sync

For shareable/bookmarkable filtered views, add URL sync:

```typescript
// In table-box.tsx
import { useSearchParams } from 'next/navigation';

export function MessageTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Initialize from URL
  const [filters, setFilters] = useState({
    content: searchParams.get('content') || '',
    stars: searchParams.get('stars')?.split(',').map(Number) || [],
    sentiment: searchParams.get('sentiment')?.split(',') || [],
    category: searchParams.get('category')?.split(',') || [],
  });
  
  // Sync to URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.content) params.set('content', filters.content);
    if (filters.stars.length) params.set('stars', filters.stars.join(','));
    if (filters.sentiment.length) params.set('sentiment', filters.sentiment.join(','));
    if (filters.category.length) params.set('category', filters.category.join(','));
    if (page > 1) params.set('page', page.toString());
    
    router.replace(`/feedbacks?${params.toString()}`, { scroll: false });
  }, [filters, page]);
  
  // ...
}
```

**Dependencies**: B5 (backend filtering must be live)

---

## Phase F7.1: Update GetMessagesResponse Type

### Modified: `Next/src/lib/api-types.ts`

```typescript
export interface GetMessagesResponse extends BaseApiResponse {
  messages: Message[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
}
```

---

## Phase F8: Frontend Documentation

### Create: `Next/FRONTEND_ARCHITECTURE.md`

**Contents:**
- API service layer architecture and usage guide
- How to add a new API call (step-by-step)
  1. Add types to `api-types.ts`
  2. Add method to `api.ts`
  3. Use in component via `useQuery`/`useMutation`
- Custom hooks documentation
  - `useCheckUsername`
  - `useApiErrorToast`
  - `useDebounce`
- Shared component library
  - `SubmitButton`
  - `ChartCard`
- Form patterns and conventions
- State management patterns
- Error handling best practices

**Dependencies**: F7

---

## Execution Order & Dependencies

```
F1 (api service) → F2 (hooks) → F4 (migrate components)
                                      ↓
F3 (UI components) → → → → → → → → → F4
                                      ↓
F6 (color utils) → → → → → → → → → → F4 → F5 (split metadata) → F7 (pagination) → F8 (README)
                                                                         ↑
                                         B5 (backend pagination) → → → →
```

**Can run in parallel**: F1, F3, F6 (independent changes)  
**Must be sequential**: F1 → F2 → F4 → F5 → F7  
**Cross-dependency**: F7 requires B5 to be complete

---

## Verification Checklist

### F1-F3 (Foundation)
- [ ] `cd Next && npx tsc --noEmit` — TypeScript compilation passes
- [ ] No import errors
- [ ] All API methods have correct return types

### F4 (Component Migration)
- [ ] Navigate every page in browser
- [ ] Analytics page loads data correctly
- [ ] Workflows page CRUD operations work
- [ ] Feedbacks table displays messages
- [ ] Metadata form loads and saves
- [ ] Settings page billing/checkout works
- [ ] Sender page submits feedback
- [ ] No component imports `axios` directly
- [ ] Error toasts appear correctly

### F5 (Metadata Split)
- [ ] Metadata page renders correctly
- [ ] Content tab shows all fields
- [ ] Appearance tab shows all fields
- [ ] Username checking works
- [ ] Form validation works
- [ ] Save button works
- [ ] Reset button works
- [ ] Preview updates in real-time

### F7 (Server-Side Filtering & Pagination)
- [ ] Feedbacks table shows pagination controls
- [ ] Page navigation works (1, 2, 3, next, prev)
- [ ] Pagination displays correctly for large page counts (ellipsis)
- [ ] Previous/Next buttons enable/disable correctly
- [ ] Total count displays correctly
- [ ] **Content filter** - type in search box, verify debounce (300ms), verify results update
- [ ] **Stars filter** - select multiple ratings, verify filtered results
- [ ] **Sentiment filter** - select sentiments, verify filtered results
- [ ] **Category filter** - select categories, verify filtered results
- [ ] **Combined filters** - apply multiple filters, verify all work together
- [ ] **Reset button** - clear all filters, verify table resets
- [ ] **Page resets on filter change** - apply filter on page 3, verify returns to page 1
- [ ] **Loading states** - filters disabled during loading
- [ ] **URL state (optional)** - filters reflected in URL, shareable links work
- [ ] **Row selection** - verify works with server-side pagination
- [ ] **Delete messages** - verify deletes only selected items on current page

### F8 (Documentation)
- [ ] Review `FRONTEND_ARCHITECTURE.md` for completeness
- [ ] All examples compile and work

---

## Summary of New Files

### API Layer (2 files)
- `Next/src/lib/api-client.ts`
- `Next/src/lib/api.ts`

### Custom Hooks (2 files)
- `Next/src/hooks/use-check-username.ts`
- `Next/src/hooks/use-api-error-toast.ts`

**Note**: `useDebounce` hook already exists via `usehooks-ts` library (`useDebounceCallback`). No need to create a new one - use the existing one from the library.

### UI Components (2 files)
- `Next/src/components/custom/submit-button.tsx`
- `Next/src/components/custom/chart-card.tsx`

### Utilities (1 file)
- `Next/src/lib/color-utils.ts`

### Metadata Sub-modules (3 files)
- `Next/src/app/(app)/(receiver)/metadata/hooks/use-metadata-form.ts`
- `Next/src/app/(app)/(receiver)/metadata/components/appearance-tab.tsx`
- `Next/src/app/(app)/(receiver)/metadata/components/content-tab.tsx`

### Documentation (1 file)
- `Next/FRONTEND_ARCHITECTURE.md`

### Files Modified
- All 17 components that make API calls
- 4 chart components (wrapped in ChartCard)
- 6 forms (using SubmitButton)
- `form-metadata.tsx` (split into sub-modules)
- `table-box.tsx` (pagination)
- `feedback-preview.tsx` (color utils import)

---

## Benefits

✅ **Type Safety**: End-to-end types from API calls to components  
✅ **Maintainability**: Centralized API layer, easy to update  
✅ **DRY**: Eliminates username checking and error toast duplication  
✅ **Consistency**: All API calls follow the same pattern  
✅ **Developer Experience**: Autocomplete for all API methods  
✅ **Error Handling**: Consistent error extraction and display  
✅ **Testability**: API layer is easily mockable  
✅ **Code Organization**: Large components split into manageable pieces  
✅ **Performance**: Server-side filtering and pagination - handles millions of messages  
✅ **Scalability**: Filtered queries with database indexes instead of client-side processing  
✅ **UX**: Filters work across entire dataset, not just loaded page  
✅ **Shareability**: Optional URL state sync for bookmarkable filtered views
