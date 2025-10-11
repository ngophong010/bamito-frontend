# BAMITO E-commerce Frontend - Project Structure

## Overview
This is a Next.js 14 TypeScript e-commerce frontend for badminton equipment, featuring modern architecture with Redux Toolkit, factory patterns, and production-ready security with UUID implementation.

## Root Structure
```
bamito-frontend-ecommerce/
├── .amazonq/                    # AI assistant rules and memory bank
├── .github/workflows/           # CI/CD pipeline configuration
├── public/images/              # Static assets (logos, icons, product images)
├── src/                        # Main source code
├── .env.example               # Environment variables template
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── next.config.mjs            # Next.js configuration
```

## Source Code Architecture (`src/`)

### Application Layer (`app/`)
**Next.js 14 App Router with route groups:**
- `(auth)/` - Authentication pages (login, register, forgot-password)
- `(main)/` - Public pages (home, products, categories)
- `admin/` - Admin dashboard (products, orders, users, reports)
- `user/` - User account pages (profile, orders, cart, favorites)
- `api/v1/` - Server-side API routes

### Component Architecture (`components/`)
**Modular UI components organized by feature:**
- `Admin/` - Dashboard widgets, forms, data grids
- `Banner/` - Homepage carousel and promotional banners
- `Breadcrumb/` - Navigation breadcrumbs with category mapping
- `Chart/` - Data visualization for admin reports
- `GridData/` - Reusable data table with pagination
- `Loading/` - Loading spinners and skeleton screens
- `Pagination/` - Pagination controls
- `ProductFilterSidebar/` - Product filtering interface
- `Search/` - Global search functionality
- `TippyCart/` - Shopping cart dropdown
- `UserMenu/` - User account dropdown menu

### State Management (`redux-toolkit/`)
**Feature-based Redux slices:**
- `authSlice.ts` - User authentication and session
- `cartSlice.ts` - Shopping cart management
- `productSlice.ts` - Product catalog and filtering
- `adminSlice.ts` - Admin dashboard data
- `orderSlice.ts` - Order management
- `store.ts` - Redux store configuration
- `hooks.ts` - Typed Redux hooks

### Data Layer Architecture

#### Repositories (`repositories/`)
**Repository pattern for data access:**
- `BaseRepository.ts` - Common CRUD operations
- `ProductRepository.ts` - Product data access
- `UserRepository.ts` - User management
- `OrderRepository.ts` - Order operations
- `CartRepository.ts` - Shopping cart persistence
- `interfaces/` - Repository contracts

#### Services (`services/`)
**Business logic and API communication:**
- `apiClient.ts` - Axios configuration with interceptors
- `productService.ts` - Product business logic
- `authService.ts` - Authentication services
- `orderService.ts` - Order processing
- `cartService.ts` - Cart operations
- `paymentService.ts` - Payment integration (PayPal, VNPay)

#### Factory Pattern (`factories/`)
**Dependency injection and service creation:**
- `RepositoryFactory.ts` - Repository instantiation
- `ServiceFactory.ts` - Service layer creation
- `FactoryConfig.ts` - Configuration management
- `interfaces/` - Factory contracts

### Type System (`types/`)
**Comprehensive TypeScript definitions:**
- `dtos/` - Data Transfer Objects for API communication
  - `_base.dto.ts` - Common DTOs (pagination, sorting, media)
  - `product.dto.ts` - Product-related DTOs
  - `order.dto.ts` - Order and payment DTOs
  - `user.dto.ts` - User and authentication DTOs
- Domain types (`product.ts`, `order.ts`, `user.ts`)
- `common.ts` - Shared interfaces and utilities

### Layout System (`layout/`)
**Page structure components:**
- `Header/` - Main navigation with search and cart
- `Footer/` - Site footer with links and policies
- `adminHeader/` - Admin dashboard header
- `adminSidebar/` - Admin navigation sidebar
- `userLayout/` - User account page wrapper

### Utilities (`utils/`)
**Helper functions and constants:**
- `commonUtils.js` - Shared utility functions
- `formatters.js` - Currency and date formatting
- `constants.js` - Application constants
- `regex.ts` - Validation patterns
- `menu.js` - Navigation menu configuration

## Key Features & Functionality

### Authentication & Security
- JWT-based authentication with refresh tokens
- Route protection middleware
- UUID implementation for public-facing IDs
- Multi-layer security (backend validation + UUID obfuscation)
- Session management with automatic logout

### E-commerce Core
- Product catalog with advanced filtering
- Shopping cart with persistent state
- Order management and tracking
- Payment integration (PayPal, VNPay, COD)
- User profiles and delivery addresses
- Product reviews and ratings
- Favorites/wishlist system

### Admin Dashboard
- Product management (CRUD operations)
- Order processing and status updates
- User management and roles
- Sales reports and analytics
- Inventory tracking
- Voucher/discount management

### Performance & SEO
- Server-side rendering (SSR)
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Dynamic meta tags and structured data
- Sitemap and robots.txt generation

### Development Features
- TypeScript for type safety
- SCSS with CSS variables
- Redux Persist for state persistence
- Error boundaries and fallback UI
- Comprehensive error handling
- Debounced search and form inputs

## API Integration Patterns

### Dual ID System
```typescript
// Public endpoints use UUIDs
GET /api/orders/550e8400-e29b-41d4-a716-446655440000

// Admin endpoints use integer IDs
GET /api/admin/orders/105
```

### Service Layer Pattern
```typescript
class ProductService {
  // Public method with UUID
  async getProductDetails(productId: string): Promise<ProductDetails>
  
  // Admin method with integer ID
  async updateProduct(id: number, data: FormData): Promise<ProductDetails>
}
```

### Repository Pattern
```typescript
interface IProductRepository {
  getAll(params?: PaginationParams): Promise<PaginatedApiResponse<Product>>
  getById(id: string): Promise<Product>
  create(data: CreateProductDTO): Promise<Product>
}
```

## Configuration Files

### Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API base URL
- `NEXT_PUBLIC_SITE_URL` - Frontend public URL
- `NEXT_PUBLIC_GTM_ID` - Google Tag Manager ID

### Build Configuration
- `next.config.mjs` - Next.js framework settings
- `tsconfig.json` - TypeScript compiler options
- `package.json` - Dependencies and scripts

## Development Workflow

### Available Scripts
```bash
npm run dev        # Development server
npm run build      # Production build
npm start          # Production server
npm run lint       # Code quality checks
```

### Code Organization Principles
1. **Feature-based structure** - Group related files together
2. **Separation of concerns** - Clear boundaries between layers
3. **Type safety** - Comprehensive TypeScript coverage
4. **Reusability** - Modular components and utilities
5. **Scalability** - Factory patterns and dependency injection

This structure supports a production-ready e-commerce application with enterprise-grade architecture, security, and maintainability.