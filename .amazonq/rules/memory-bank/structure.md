# Project Structure & Architecture

## Directory Organization

### Root Level
```
├── .amazonq/           # Amazon Q AI assistant rules and memory bank
├── .github/           # GitHub Actions workflows for CI/CD
├── public/            # Static assets (images, icons, logos)
├── src/               # Main source code directory
├── .env.example       # Environment variables template
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
└── next.config.mjs    # Next.js configuration
```

### Source Code Structure (`src/`)

#### Application Layer (`app/`)
- **Next.js App Router**: Modern routing with layouts and nested routes
- **Route Groups**: 
  - `(auth)/` - Authentication pages (login, register)
  - `(main)/` - Public pages (home, products, about)
  - `admin/` - Admin dashboard and management
  - `user/` - User account and profile pages
- **API Routes**: Server-side API endpoints in `api/`
- **Global Styles**: SCSS styling and layout configuration

#### Component Architecture (`components/`)
- **Admin Components**: Dashboard widgets, data grids, charts
- **UI Components**: Reusable interface elements (buttons, modals, forms)
- **Feature Components**: Specialized functionality (cart, search, ratings)
- **Layout Components**: Page structure elements (headers, footers, sidebars)

#### State Management (`redux-toolkit/`)
- **Store Configuration**: Central Redux store setup
- **Feature Slices**: Domain-specific state management
  - `authSlice.ts` - User authentication state
  - `cartSlice.ts` - Shopping cart management
  - `productSlice.ts` - Product data and filtering
  - `adminSlice.ts` - Admin dashboard state
- **API Integration**: RTK Query for data fetching
- **Typed Hooks**: Custom hooks for type-safe Redux usage

#### Data Layer (`repositories/` & `services/`)
- **Repository Pattern**: Data access abstraction layer
- **Service Layer**: Business logic and API communication
- **Error Handling**: Centralized error management
- **API Client**: Axios configuration and interceptors

#### Type System (`types/`)
- **DTOs**: Data Transfer Objects for API communication
- **Domain Types**: Business entity type definitions
- **Common Types**: Shared interfaces and utility types
- **Index Exports**: Centralized type exports

#### Utilities (`utils/`)
- **Formatters**: Data formatting functions
- **Constants**: Application-wide constants
- **Validators**: Input validation utilities
- **Common Utils**: Shared helper functions

## Architectural Patterns

### Feature-Sliced Design
- **Domain Separation**: Clear boundaries between business domains
- **Layer Separation**: Presentation, business logic, and data layers
- **Dependency Direction**: Higher layers depend on lower layers

### Repository Pattern
- **Data Abstraction**: Abstract data access from business logic
- **Interface Contracts**: Consistent API for data operations
- **Implementation Flexibility**: Easy to swap data sources

### Factory Pattern
- **Service Creation**: Centralized service instantiation
- **Dependency Injection**: Loose coupling between components
- **Configuration Management**: Environment-specific implementations

### Component Composition
- **Reusable Components**: Modular UI building blocks
- **Props Interface**: Type-safe component communication
- **Layout Composition**: Flexible page structure assembly

## Core Relationships

### Data Flow
1. **UI Components** → Dispatch Redux actions
2. **Redux Slices** → Call service layer methods
3. **Services** → Use repositories for data access
4. **Repositories** → Make API calls via axios client
5. **API Responses** → Flow back through the chain

### Authentication Flow
1. **Login Component** → Dispatches auth action
2. **Auth Slice** → Calls auth service
3. **Auth Service** → Validates credentials via API
4. **JWT Token** → Stored in Redux and localStorage
5. **Protected Routes** → Check auth state via middleware

### Admin Dashboard
1. **Admin Layout** → Wraps admin pages
2. **Admin Components** → Display data and controls
3. **Admin Slices** → Manage admin-specific state
4. **Admin Services** → Handle CRUD operations
5. **Role-based Access** → Enforced via route protection

### Shopping Cart
1. **Product Pages** → Add items to cart
2. **Cart Slice** → Manages cart state
3. **Cart Service** → Persists cart data
4. **Checkout Flow** → Processes orders
5. **Payment Integration** → PayPal payment handling

## Module Dependencies

### Core Dependencies
- **Next.js**: Application framework and routing
- **React**: UI component library
- **Redux Toolkit**: State management
- **TypeScript**: Type safety and development experience

### UI & Styling
- **SCSS/Sass**: Styling and theming
- **Material-UI**: Component library and icons
- **React Toastify**: Notification system

### Data & API
- **Axios**: HTTP client for API communication
- **Redux Persist**: State persistence
- **React Hook Form**: Form handling and validation

### Development Tools
- **ESLint**: Code quality and consistency
- **TypeScript**: Static type checking
- **Next.js Dev Tools**: Development and debugging