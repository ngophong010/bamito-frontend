# Development Guidelines & Standards

## Code Quality Standards

### File Extensions & Language Usage
- **TypeScript (.ts/.tsx)**: Use for all new components, services, and utilities
- **JavaScript (.js/.jsx)**: Legacy components and pages (gradually migrate to TypeScript)
- **SCSS (.scss)**: All styling files with CSS variables and mixins
- **Mixed Codebase**: Project supports both JS and TS files during transition

### Naming Conventions
- **Components**: PascalCase (e.g., `ProductCard`, `UserProfile`)
- **Files**: Match component names exactly (`ProductCard.js`, `UserProfile.tsx`)
- **Variables**: camelCase (e.g., `currentProduct`, `userInfo`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `LIMIT`, `API_ENDPOINTS`)
- **CSS Classes**: kebab-case (e.g., `product-item`, `cart-container`)
- **Redux Actions**: camelCase with descriptive names (e.g., `fetchAllProductSuccess`)
- **ID Fields**: Clear distinction between UUID and integer IDs
  - `orderId` (string UUID for public use)
  - `id` (number for internal database operations)
  - `adminOrderId` (number for admin-specific operations)

### Import Organization
```javascript
// 1. React and Next.js imports
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

// 2. Third-party libraries
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// 3. Internal services and utilities
import { handleGetAllCategoryService } from "../../services/productService";
import { handleChangePage } from "../../redux-toolkit/paginationSlice";

// 4. Styles (always last)
import "./Component.scss";
```

### Error Handling Patterns
```javascript
// Standard error handling with session management
try {
  let res = await serviceCall();
  if (res && res.errCode === 0) {
    // Success handling
  }
} catch (error) {
  console.log(error);
  if (error?.response?.data?.errCode === -4) {
    toast.error("Phiên bản đăng nhập hết hạn");
    dispatch(logOut());
  } else {
    toast.error(error?.response?.data?.message);
  }
}
```

## Architectural Patterns

### Redux Toolkit Implementation
- **Slice Structure**: Feature-based slices with clear naming
- **Async Thunks**: Use `createAsyncThunk` for API calls
- **State Normalization**: Maintain both legacy and normalized state structures
- **Type Safety**: Full TypeScript interfaces for state and actions

```typescript
// Redux slice pattern
export const fetchUsers = createAsyncThunk<
  void,
  PaginationParams,
  { rejectValue: string }
>(
  "admin/fetchUsers",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const response = await userService.getUsers({ page, limit });
      dispatch(fetchAllUserSuccess(payload));
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
```

### Factory Pattern Usage
- **Repository Factory**: Centralized repository creation with singleton pattern
- **Service Factory**: Dependency injection for service layer
- **Configuration Management**: Environment-specific configurations

```typescript
// Factory implementation pattern
export class RepositoryFactory implements IRepositoryFactory {
    private static instance: RepositoryFactory;
    
    public static getInstance(): RepositoryFactory {
        if (!RepositoryFactory.instance) {
            RepositoryFactory.instance = new RepositoryFactory();
        }
        return RepositoryFactory.instance;
    }
    
    createUserRepository(): UserRepository {
        return new UserRepository(this.configManager.getConfig().apiClient);
    }
}
```

### Component Patterns

#### Client-Side Components
```javascript
"use client"; // Always at the top for client components
import React, { useEffect, useState } from "react";

const ComponentName = () => {
  // State declarations
  const [localState, setLocalState] = useState(initialValue);
  
  // Redux hooks
  const dispatch = useDispatch();
  const stateValue = useSelector((state) => state.slice.value);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  return (
    <div className="component-container">
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

#### UUID Route Handling
```typescript
// Next.js dynamic route with UUID validation
interface PageProps {
  params: { id: string }; // UUID from route parameter
}

const OrderDetailPage = ({ params }: PageProps) => {
  const { id: orderId } = params;
  
  // Validate UUID format
  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderId);
  
  if (!isValidUUID) {
    notFound(); // Next.js 404 page
  }
  
  // Use UUID in service calls
  const order = await orderService.getOrderDetails(orderId);
  
  return <OrderDetailClient order={order} />;
};
```

#### DTO Type Definitions
```typescript
// Production-ready DTO interfaces with UUID support
export interface CreateFeedbackDTO {
  productId: string; // UUID for public APIs
  rating: 1 | 2 | 3 | 4 | 5;
  title?: string;
  content?: string;
  images?: MediaAssetDTO[];
  orderId?: string; // UUID to verify user purchased
}

// Internal DTO for admin operations (uses integer IDs)
export interface AdminCreateFeedbackDTO {
  productId: number; // Integer ID for internal operations
  rating: 1 | 2 | 3 | 4 | 5;
  orderId?: number; // Integer ID for admin verification
}

// Generic pagination pattern
export interface PaginationParams {
  page?: number; // 1-based
  limit?: number; // per-page size
  pagination?: boolean; // allow disabling pagination explicitly
}
```

## State Management Patterns

### Redux State Structure
- **Normalized Entities**: Separate entities from UI state
- **Legacy Compatibility**: Maintain backward compatibility during refactoring
- **Loading States**: Granular loading indicators per operation
- **Error Handling**: Centralized error state management

```typescript
interface AdminState {
  entities: {
    users: PaginatedApiResponse<any>;
    products: PaginatedApiResponse<any>;
  };
  ui: {
    loading: Record<string, boolean>;
    errors: Record<string, string | null>;
  };
  // Legacy fields for backward compatibility
  allUser: any;
  allProduct: any;
}
```

### Debouncing Pattern
```javascript
// Custom debounce hook usage
import { useDebounce } from "@/utils/commonUtils";

const [currentProduct, setCurrentProduct] = useState({});
let currentProductDebounce = useDebounce(currentProduct, 500);

useEffect(() => {
  if (Object.keys(currentProduct).length !== 0) {
    updateProductCart(currentProduct);
  }
}, [currentProductDebounce]);
```

## API Integration Standards

### Service Layer Pattern
- **Consistent Error Handling**: Standardized error responses
- **Type Safety**: Full TypeScript interfaces for requests/responses
- **Authentication**: Automatic token handling and refresh
- **Pagination**: Consistent pagination parameters across services
- **UUID Handling**: Dual ID system for public/admin endpoints
  ```typescript
  // Public service methods use UUIDs
  async getOrderDetails(orderId: string): Promise<OrderDetails> {
    return this.apiClient.get(`/orders/${orderId}`);
  }
  
  // Admin service methods use integer IDs
  async getAdminOrderDetails(id: number): Promise<OrderDetails> {
    return this.apiClient.get(`/admin/orders/${id}`);
  }
  ```

### Currency Formatting
```javascript
// Standard currency formatter
const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

// Usage in JSX
{currencyFormatter.format(product.price)}
<span style={{ textDecoration: "underline", marginLeft: 2 }}>đ</span>
```

## UI/UX Patterns

### Material-UI Integration
- **Consistent Theming**: Use CSS variables for primary colors
- **Icon Usage**: FontAwesome and Material-UI icons
- **Form Components**: TextField with consistent styling
- **Radio Groups**: Standardized payment method selection

### Responsive Design
- **Mobile-First**: Design for mobile, enhance for desktop
- **CSS Grid/Flexbox**: Modern layout techniques
- **Image Optimization**: Next.js Image component with proper sizing

### Loading States
```javascript
// Loading state management
const [isLoading, setIsLoading] = useState(false);

// In async operations
setIsLoading(true);
try {
  await apiCall();
} finally {
  setIsLoading(false);
}
```

## Security & Authentication

### Production Security Standards
- **UUID Implementation**: Use non-sequential UUIDs for all public-facing IDs
  - `orderId`, `productId`, `userId` as UUID in URLs and client-facing APIs
  - Continue using integer `id` for internal database joins and admin URLs
  - Example: `/user/orders/550e8400-e29b-41d4-a716-446655440000` (public)
  - Example: `/admin/orders/105` (admin-only with integer ID)
- **Multi-Layer Security**: Never rely on obscurity alone
  - Layer 1: Backend userId validation (ultimate safety net)
  - Layer 2: UUID obfuscation for public URLs
  - Layer 3: Authentication and authorization checks
- **Rate Limiting**: Implement client-side request throttling
- **CSRF Protection**: Use Next.js built-in CSRF protection
- **XSS Prevention**: Sanitize all user inputs and use CSP headers

### Route Protection
- **Middleware**: Next.js middleware for route protection
- **Component Guards**: `ProtectUser.js` and `ProtectAdmin.js`
- **Session Management**: Automatic logout on token expiration
- **Error Code Handling**: Standardized error code -4 for expired sessions

### Data Validation
- **Input Validation**: Client-side validation with error states
- **Type Safety**: TypeScript interfaces for all data structures
- **Sanitization**: Proper data sanitization before API calls
- **UUID Validation**: Validate UUID format in route parameters

## Production-Ready Features

### Performance Optimization
- **Code Splitting**: Route-based and component-based splitting
- **Image Optimization**: Next.js Image with WebP support
- **Bundle Analysis**: Regular bundle size monitoring
- **Caching Strategy**: Browser caching and CDN integration
- **Lazy Loading**: Implement for non-critical components

### Monitoring & Analytics
- **Error Tracking**: Implement Sentry or similar error tracking
- **Performance Monitoring**: Core Web Vitals tracking
- **User Analytics**: Google Analytics 4 integration
- **A/B Testing**: Feature flag implementation
- **Real User Monitoring**: Track actual user experience

### SEO & Accessibility
- **Meta Tags**: Dynamic meta tags for all pages
- **Structured Data**: JSON-LD for rich snippets
- **Sitemap**: Auto-generated XML sitemap
- **Robots.txt**: Proper search engine directives
- **ARIA Labels**: Comprehensive accessibility support
- **Keyboard Navigation**: Full keyboard accessibility

### Internationalization (i18n)
- **Multi-language Support**: Vietnamese and English
- **Currency Localization**: VND and USD support
- **Date/Time Formatting**: Locale-specific formatting
- **RTL Support**: Right-to-left language support

### Progressive Web App (PWA)
- **Service Worker**: Offline functionality
- **App Manifest**: Installable web app
- **Push Notifications**: Order updates and promotions
- **Background Sync**: Offline order processing

### Testing Strategy
- **Unit Tests**: Jest and React Testing Library
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Playwright or Cypress
- **Visual Regression**: Screenshot comparison testing
- **Performance Tests**: Lighthouse CI integration

### DevOps & Deployment
- **CI/CD Pipeline**: GitHub Actions workflow
- **Environment Management**: Dev, staging, production
- **Feature Flags**: Gradual feature rollout
- **Blue-Green Deployment**: Zero-downtime deployments
- **Health Checks**: Application health monitoring

### Data Management
- **State Persistence**: Redux Persist with encryption
- **Cache Management**: React Query for server state
- **Offline Support**: Local storage fallbacks
- **Data Synchronization**: Conflict resolution strategies

### Security Hardening
- **Content Security Policy**: Strict CSP headers
- **HTTPS Enforcement**: Force HTTPS redirects
- **Secure Headers**: HSTS, X-Frame-Options, etc.
- **Input Sanitization**: XSS prevention
- **SQL Injection Prevention**: Parameterized queries
- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control

### Scalability Considerations
- **Horizontal Scaling**: Load balancer ready
- **Database Optimization**: Query optimization
- **CDN Integration**: Static asset delivery
- **Microservices Ready**: Service-oriented architecture
- **API Versioning**: Backward compatibility

### Business Continuity
- **Error Boundaries**: Graceful error handling
- **Fallback UI**: Offline mode interfaces
- **Data Backup**: Regular backup strategies
- **Disaster Recovery**: Recovery procedures
- **Monitoring Alerts**: Proactive issue detectionyer Security**: Never rely on obscurity alone
  - Layer 1: Backend userId validation (ultimate safety net)
  - Layer 2: UUID obfuscation for public URLs
  - Layer 3: Authentication and authorization checks

### Route Protection
- **Middleware**: Next.js middleware for route protection
- **Component Guards**: `ProtectUser.js` and `ProtectAdmin.js`
- **Session Management**: Automatic logout on token expiration
- **Error Code Handling**: Standardized error code -4 for expired sessions

### Data Validation
- **Input Validation**: Client-side validation with error states
- **Type Safety**: TypeScript interfaces for all data structures
- **Sanitization**: Proper data sanitization before API calls
- **UUID Validation**: Validate UUID format in route parameters

## Legacy Performance Patterns

### Code Splitting
- **Dynamic Imports**: Lazy loading for heavy components
- **Route-based Splitting**: Automatic with Next.js App Router
- **Component Optimization**: Memoization where appropriate

### State Updates
- **Immutable Updates**: Proper Redux state updates
- **Batch Updates**: Group related state changes
- **Selective Re-renders**: Optimize useSelector usage

## Testing & Quality Assurance

### Code Review Standards
- **Type Safety**: All new code must use TypeScript
- **Error Handling**: Comprehensive error handling required
- **Performance**: Consider performance implications
- **Accessibility**: Ensure proper ARIA labels and semantic HTML

### Documentation
- **JSDoc Comments**: Document complex functions and interfaces
- **README Updates**: Keep documentation current
- **Type Definitions**: Comprehensive DTO definitions