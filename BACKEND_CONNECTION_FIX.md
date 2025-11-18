# Backend Connection Fix

## Issue
The frontend is trying to connect to the backend API at `http://localhost:8181/api/v1` but getting a RepositoryError.

## Quick Fix Applied
1. **Removed API calls from server-side rendering** to prevent build/render errors
2. **Simplified layouts** to work without backend data
3. **Added error handling** to prevent crashes

## To Fix Backend Connection

### 1. Start Your Backend Server
```bash
cd bamito-backend-js
npm start
# or
npm run dev
```

### 2. Verify Backend is Running
Open browser and check: `http://localhost:8181/api/v1/categories`

### 3. Check Backend Port
In your backend `.env` file, verify:
```
PORT=8181
```

### 4. Test API Endpoint
```bash
curl http://localhost:8181/api/v1/categories
```

## Restore Full Functionality

Once backend is running, you can restore the API calls:

### 1. Update Main Layout
```typescript
// In src/app/(main)/layout.tsx
export default async function MainLayout({ children }: MainLayoutProps) {
  let categories: Category[] = [];
  
  try {
    const response = await categoryService.getCategories({
      limit: 100,
      page: 1,
    });
    categories = response.items || [];
  } catch (error) {
    console.warn("Categories unavailable:", error);
    categories = [];
  }

  return (
    <UserLayout categories={categories}>
      {children}
    </UserLayout>
  );
}
```

### 2. Update Homepage
```typescript
// In src/app/page.tsx - restore the full data fetching logic
```

## Common Backend Issues

1. **Port already in use**: Change PORT in backend .env
2. **Database not connected**: Check DATABASE_URL in backend .env
3. **CORS issues**: Verify CLIENT_ORIGIN in backend .env
4. **Missing dependencies**: Run `npm install` in backend folder

## Current Status
✅ Frontend loads without errors
✅ Header and footer display
❌ Categories not loaded from backend
❌ Products not loaded from backend

## Next Steps
1. Start backend server
2. Test API endpoints
3. Restore API calls in frontend
4. Test full functionality