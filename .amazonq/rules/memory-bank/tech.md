# Technology Stack & Development Setup

## Programming Languages & Versions

### Primary Languages
- **TypeScript 5.5.4**: Main development language for type safety
- **JavaScript (ES6+)**: Legacy components and utilities
- **SCSS/Sass**: Styling and CSS preprocessing
- **JSON**: Configuration and data files

### Runtime Environment
- **Node.js**: v18+ recommended for development
- **React 18**: Latest React features and concurrent rendering
- **Next.js 14.2.5**: App Router with server-side rendering

## Core Framework & Libraries

### Frontend Framework
- **Next.js 14.2.5**: Full-stack React framework
  - App Router for modern routing
  - Server-side rendering (SSR)
  - Static site generation (SSG)
  - API routes for backend functionality
  - Built-in optimization and performance features

### State Management
- **Redux Toolkit 1.9.5**: Modern Redux with simplified API
- **React Redux 8.1.2**: React bindings for Redux
- **Redux Persist 6.0.0**: State persistence across sessions

### UI & Styling
- **Material-UI 5.16.5**: Component library and design system
- **@mui/icons-material**: Material Design icons
- **@mui/x-charts 6.18.3**: Data visualization components
- **Sass 1.68.0**: CSS preprocessing with variables and mixins
- **Styled Components 6.1.0**: CSS-in-JS styling solution

### Form Handling & Validation
- **React Hook Form 7.47.0**: Performant form library
- **@hookform/error-message 2.0.1**: Error message handling
- **AJV 8.12.0**: JSON schema validation

## Development Tools & Build System

### Build & Development
- **Next.js CLI**: Built-in development server and build tools
- **TypeScript Compiler**: Type checking and compilation
- **Webpack**: Module bundling (via Next.js)
- **SWC**: Fast TypeScript/JavaScript compiler

### Code Quality
- **ESLint**: Code linting and style enforcement
- **TypeScript**: Static type checking
- **Prettier**: Code formatting (implied by Next.js setup)

### Package Management
- **npm**: Primary package manager
- **package-lock.json**: Dependency version locking

## API & Data Management

### HTTP Client
- **Axios 1.6.1**: Promise-based HTTP client
- **Custom API Client**: Centralized API configuration
- **Interceptors**: Request/response middleware

### Data Processing
- **Lodash 4.17.21**: Utility functions for data manipulation
- **Day.js 1.11.10**: Date manipulation and formatting
- **Crypto-js 4.2.0**: Cryptographic functions
- **JWT Decode 4.0.0**: JSON Web Token handling

## UI Components & Interactions

### Component Libraries
- **@tippyjs/react 4.2.6**: Tooltip and popover components
- **React Slick 0.29.0**: Carousel and slider components
- **React Paginate 8.2.0**: Pagination controls
- **React Spinners 0.13.8**: Loading indicators

### Notifications & Feedback
- **React Toastify 9.0.8**: Toast notifications
- **React OTP Input 3.1.1**: OTP input components

### Payment Integration
- **@paypal/react-paypal-js 8.5.0**: PayPal payment processing

## Development Commands

### Primary Scripts
```bash
npm run dev        # Start development server (localhost:3000)
npm run build      # Build production application
npm start          # Start production server
npm run lint       # Run ESLint code quality checks
```

### Development Workflow
1. **Development**: `npm run dev` for hot-reload development
2. **Type Checking**: Automatic via TypeScript compiler
3. **Linting**: `npm run lint` for code quality
4. **Building**: `npm run build` for production optimization
5. **Deployment**: `npm start` for production server

## Environment Configuration

### Required Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API base URL
- `NEXT_PUBLIC_SITE_URL`: Frontend public URL
- `NEXT_PUBLIC_GTM_ID`: Google Tag Manager ID (optional)

### Configuration Files
- **tsconfig.json**: TypeScript compiler configuration
- **next.config.mjs**: Next.js framework configuration
- **jsconfig.json**: JavaScript project configuration
- **.env.local**: Local environment variables
- **.env.example**: Environment variables template

## Deployment & Production

### Build Output
- **Static Assets**: Optimized images, CSS, and JavaScript
- **Server Bundle**: Node.js server for SSR
- **Client Bundle**: Browser JavaScript for hydration

### Optimization Features
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js built-in image optimization
- **Bundle Analysis**: Built-in bundle analyzer
- **Performance Monitoring**: Web Vitals tracking

### Deployment Platforms
- **Vercel**: Recommended platform (Next.js creators)
- **Node.js Servers**: Any Node.js hosting environment
- **Static Hosting**: For static export builds

## Development Dependencies

### Type Definitions
- **@types/node 24.3.0**: Node.js type definitions
- **@types/react-slick 0.23.13**: React Slick type definitions

### Additional Tools
- **Normalize.css 8.0.1**: CSS reset for cross-browser consistency
- **UUID 9.0.1**: Unique identifier generation
- **Slugify 1.6.6**: URL-friendly string conversion
- **XLSX 0.18.5**: Excel file processing