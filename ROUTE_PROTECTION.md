# Route Protection Strategy

## Problem
The old approach used a `ProtectUser` component that:
- Doesn't exist in the codebase
- Causes client-side redirects (bad UX)
- Requires wrapping every protected page

## Solution: Next.js Middleware

### Benefits
1. **Server-side protection**: Redirects happen before page loads
2. **Centralized logic**: One place to manage all route protection
3. **Better UX**: No flash of protected content
4. **Type-safe**: Proper TypeScript support

### Implementation

#### Middleware (`src/middleware.ts`)
```typescript
// Protect user routes
if (request.nextUrl.pathname.startsWith('/user')) {
  if (!sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// Protect admin routes
if (request.nextUrl.pathname.startsWith('/admin')) {
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

#### User Layout (`src/app/user/layout.tsx`)
```typescript
export default async function LayoutUser({ children }: LayoutUserProps) {
  // Server-side data fetching
  const categories = await categoryService.getAllCategoriesList();

  return (
    <UserLayout categories={categories}>
      {children}
    </UserLayout>
  );
}
```

### Protected Routes
- `/user/*` - Requires authentication
- `/admin/*` - Requires authentication
- `/login`, `/register` - Redirects to home if already logged in

### Redirect Flow
1. User tries to access `/user/profile`
2. Middleware checks for `access_token` cookie
3. If no token: Redirect to `/login?redirect=/user/profile`
4. After login: Redirect back to `/user/profile`

### Migration from ProtectUser

#### Before (❌ Bad)
```typescript
import ProtectUser from "@components/ProtectUser";

export default function Page() {
  return (
    <ProtectUser>
      <YourContent />
    </ProtectUser>
  );
}
```

#### After (✅ Good)
```typescript
// No wrapper needed - middleware handles protection
export default function Page() {
  return <YourContent />;
}
```

### Additional Security Layers

1. **Middleware**: First line of defense (route-level)
2. **API Routes**: Verify tokens in API handlers
3. **Server Components**: Check session in `getUserSession()`
4. **Client Components**: Redux state for UI logic only

### Testing Protection

```bash
# Test protected route without login
curl http://localhost:3000/user/profile
# Should redirect to /login?redirect=/user/profile

# Test with valid token
curl -H "Cookie: access_token=valid_token" http://localhost:3000/user/profile
# Should return page content
```

## Best Practices

1. **Never rely on client-side protection alone**
2. **Always validate tokens on the server**
3. **Use middleware for route-level protection**
4. **Use API middleware for endpoint protection**
5. **Keep sensitive logic server-side**
