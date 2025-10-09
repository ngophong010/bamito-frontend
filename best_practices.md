### 📘 Project Best Practices

#### 1. Project Purpose  
This repository contains the Bamito e-commerce frontend built with Next.js (App Router) and Redux Toolkit. It implements a layered architecture separating data access (repositories), domain services, and UI, with strong TypeScript typing, DTOs, and consistent API response contracts. The goal is a scalable, maintainable storefront and admin suite with production-ready patterns.

#### 2. Project Structure
- Root
  - next.config.mjs, tsconfig.json, jsconfig.json: Build configuration, path aliases, TS strictness
  - package.json: Dependencies and scripts
  - .env files: Environment variables (prefer NEXT_PUBLIC_*)
  - public/: Static assets
- src/
  - app/: Next.js App Router entry points (layouts, pages, server/client components)
    - admin/: Admin pages (brands, categories, products, sizes, vouchers, reports, etc.)
    - (auth)/, (main)/: Feature-scoped route groups
  - components/: Reusable UI components
  - layout/: Header, Footer, admin layout components
  - redux-toolkit/: Global state management
    - store.ts: configureStore + redux-persist setup
    - feature slices: productSlice.ts, userSlice.ts, adminSlice.ts, etc.
  - repositories/: Data access layer
    - interfaces/: Repository interfaces (IBaseRepository, ICategoryRepository, ...)
    - errors/RepositoryError.ts: Centralized Axios -> domain error mapping
    - BaseRepository.ts and concrete repos
  - services/: Domain service layer (uses repos, shapes data for UI)
    - apiClient.ts: Axios instance (baseURL, interceptors)
    - feature services: productService.ts, userService.ts, sizeService.ts, ...
  - factories/: Service/Repository factories with central configuration
    - config/: FactoryConfig and API client injection
    - implementations/: ServiceFactory, RepositoryFactory
    - interfaces/: IServiceFactory, IRepositoryFactory
    - index.ts: initializeFactorySystem(), exported factory singletons
  - types/: Domain types and dtos
    - dtos/: Feature DTO contracts (e.g., category.dto.ts, size.dto.ts)
    - common.ts: Shared response contracts (PaginatedApiResponse, ServiceResponse)
  - utils/: Common helpers (formatters, constants, regex, etc.)
  - axios.js: Legacy Axios instance (prefer services/apiClient.ts)

Separation of Concerns
- UI: src/app, src/components, src/layout
- State: src/redux-toolkit
- Domain: src/services + src/types (+ dtos)
- Data access: src/repositories (+ interfaces + errors)
- Wiring/DI: src/factories

Entry points & Setup
- Global Providers: src/Providers.tsx for Redux Provider, ToastContainer, etc.
- Store: src/redux-toolkit/store.ts (redux-persist configured; whitelist ['user', 'cart'])
- API: src/services/apiClient.ts (Axios base, interceptors)

#### 3. Test Strategy
- Frameworks
  - Jest + React Testing Library for components
  - MSW (Mock Service Worker) for API and integration tests of services and thunks
- Structure
  - co-locate tests with source files: Component.tsx + Component.test.tsx
  - services and repositories: ServiceName.test.ts, RepositoryName.test.ts
  - slices: sliceName.test.ts for reducers, selectors, thunks
- Philosophy
  - Unit test: Pure functions, reducers, selectors, DTO transformations, repository error mapping
  - Integration test: Thunks (createAsyncThunk), services with MSW handlers
  - UI test: Components/Pages critical flows (cart, checkout, admin CRUD)
- Mocking
  - Prefer MSW over manual mocking for HTTP to keep tests realistic
  - Use fixtures for API payloads (PaginatedApiResponse, entities)
- Coverage
  - Aim for 80%+ on reducers, services, and critical components
  - Enforce on CI for regression safety

#### 4. Code Style
- TypeScript
  - Strict mode; always type public APIs, thunks, service methods, repository interfaces
  - Prefer explicit DTOs for payloads and filters under src/types/dtos
- Async/await
  - Use try/catch in repositories/services
  - Map Axios errors via handleAxiosError to domain-specific RepositoryError
- Naming conventions
  - Files: featureSlice.ts, FeatureRepository.ts, featureService.ts, IFeatureRepository.ts, feature.dto.ts
  - Actions/Thunks: fetchXxx, createXxx, updateXxx, deleteXxx
  - Selectors: selectFeatureSomething
  - Components: PascalCase; hooks: useCamelCase; variables/functions: camelCase
  - DTOs and Types: PascalCase (CreateXxxDTO, XxxFilterParams)
- Comments/Docs
  - JSDoc for public functions/classes in services and repositories
  - Brief inline comments where intent is not obvious
- Error handling
  - Never throw raw AxiosError from services; always map using handleAxiosError in repositories
  - Services may adapt / unwrap response shapes; keep UI ignorant of transport peculiarities
  - Show user feedback in UI using react-toastify only in UI or thunks (not repositories)
- Redux specifics
  - Use createSlice and createAsyncThunk; never mutate outside Immer context
  - Keep Redux state serializable; avoid storing File/FormData or class instances
  - Normalize lists with PaginatedApiResponse and optionally createEntityAdapter for large lists

#### 5. Common Patterns
- Repository -> Service -> Thunk -> UI
  - Repositories: perform HTTP, map transport errors (src/repositories/*)
  - Services: orchestrate domain logic and shape data for consumers (src/services/*)
  - Thunks: call services, handle UI-facing concerns (loading, toasts, auth expiry)
- Factory pattern
  - ServiceFactory and RepositoryFactory provide singletons and DI via FactoryConfig
  - Access via serviceFactory.createXxxService() within slices/thunks
- DTOs & Contracts
  - src/types/dtos define request/response contracts, filters, bulk operations
  - src/types/common.ts defines PaginatedApiResponse and base response shapes
- API Response Envelope
  - Many endpoints return { data: T } wrapped by Axios; repositories unwrap to return T consistently
  - Keep PaginatedApiResponse<T> stable: { items, totalItems, totalPages, currentPage }
- Error Mapping
  - handleAxiosError -> RepositoryError | NotFoundError | ValidationError | UnauthorizedError | ForbiddenError
  - Enables consistent downstream handling

#### 6. Do's and Don'ts
- ✅ Do
  - Use serviceFactory in slices to get services (decouple components from HTTP)
  - Keep thunks small: call a service, dispatch a success action with normalized payload
  - Update both normalized entities and any legacy state during migration windows
  - Gate 401s: dispatch logOut and show a toast once; avoid duplicate toasts in nested calls
  - Use selectors to read slice state; avoid deeply nested state access in components
  - Reuse DTOs for all requests; never shape raw payload ad hoc in components
  - Leverage MSW for E2E-ish integration tests of thunks and services
- ❌ Don’t
  - Don’t call Axios directly from components or thunks; always go through services
  - Don’t throw raw AxiosError from repositories; map errors centrally
  - Don’t store non-serializable values in Redux state (File, Date, class instances)
  - Don’t couple UI to HTTP response envelopes (e.g., response.data.data); let repositories/services unwrap
  - Don’t hardcode API URLs; read from env with NEXT_PUBLIC_* and configure apiClient

#### 7. Tools & Dependencies
- Next.js (App Router): Routing and SSR/ISR
- React + TypeScript: UI + typings
- Redux Toolkit + redux-persist: Global state and persistence (user, cart)
- Axios: HTTP client; apiClient.ts sets baseURL and interceptors
- MUI: UI components in admin area
- dayjs: Date handling
- react-toastify: User notifications

Setup Notes
- Environment Variables
  - Prefer NEXT_PUBLIC_BACKEND_URL for Next.js client-side requests
  - Unify on src/services/apiClient.ts; avoid mixing with src/axios.js (legacy)
- Store
  - src/redux-toolkit/store.ts configures persist (whitelist: ['user', 'cart'])
  - Add new slices to rootReducer; avoid persisting large/volatile slices
- Factories
  - Default singletons via ServiceFactory.getInstance();
  - If you need runtime-configurable API clients or cache, call initializeFactorySystem() early (e.g., Providers.tsx)

#### 8. Other Notes
- Adding a New Feature (Checklist)
  1) Define DTOs in src/types/dtos
  2) Add domain types in src/types
  3) Create repository + interface in src/repositories (+ errors mapped via handleAxiosError)
  4) Create service using apiClient; ensure it unwraps data consistently
  5) Wire up factory methods if cross-cutting use is expected
  6) Create slice with createSlice, thunks with createAsyncThunk using the service
  7) Update store.ts root reducer and persist config if needed
  8) Add selectors; keep action names consistent (fetchXxxSuccess/Failed)
  9) Add tests (service with MSW, slice reducers, thunks)

- Redux Naming Conventions (Admin example)
  - Thunks: fetchUsers, fetchBrands, fetchCategories, fetchSizes, fetchVouchers, fetchOrders
  - Actions: fetchAllUserSuccess, fetchAllBrandSuccess, ... (migration-compatible)
  - Selectors: selectAdminUsers(state), selectAdminLoading(state, key)

- Pagination Contract
  - Always return { items, totalItems, totalPages, currentPage } from services or adapt in thunks

- Error Expiry Handling
  - For 401: toast.error("Session expired, please login again"); dispatch(logOut())
  - Avoid double toasts by handling at thunk level only

- Consistency & Migration
  - Some legacy APIs/components expect certain shapes (e.g., allUser, allBrand). During refactors, update both the normalized entity and legacy fields to avoid breakage, then migrate UI to selectors.

- Performance
  - For large collections, consider createEntityAdapter + memoized selectors via Reselect
  - Avoid over-persisting; only persist minimal, user-specific state
