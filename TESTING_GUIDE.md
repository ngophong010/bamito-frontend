# Frontend Testing & Verification Guide

## Overview
This guide covers comprehensive testing strategies for verifying that your e-commerce frontend UI is user-friendly and all functionality works correctly.

---

## 1. Manual Testing (Essential First Step)

### 1.1 Setup Local Development Environment

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# The app will be available at http://localhost:3000
```

### 1.2 Browser Setup for Testing
- **Chrome DevTools** - Press `F12` or `Right-click > Inspect`
- **Responsive Design Mode** - `Ctrl+Shift+M` (Chrome) or `Cmd+Shift+M` (Mac)
- Test on multiple screen sizes:
  - Mobile: 375px, 425px (iPhone SE, 12, 14)
  - Tablet: 768px (iPad)
  - Desktop: 1024px, 1440px, 1920px

---

## 2. UI/UX Testing Checklist

### 2.1 Visual & Layout Testing

#### Landing Page / Home
- [ ] Header appears correctly with logo and navigation
- [ ] Hero section displays properly on all screen sizes
- [ ] Product cards are aligned and responsive
- [ ] Images load without broken links
- [ ] Text is readable (good font size and contrast)
- [ ] Footer displays with all links

#### Product Pages
- [ ] Product details page loads product image correctly
- [ ] Product name, price, and description display properly
- [ ] "Add to Cart" button is visible and clickable
- [ ] Favorite/Like button works and updates state
- [ ] Product rating/reviews section displays correctly
- [ ] Related products carousel works (if implemented)

#### Cart & Checkout
- [ ] Cart page shows all items with correct prices
- [ ] Quantity can be updated
- [ ] Remove item button works
- [ ] Cart total is calculated correctly
- [ ] Proceed to checkout button is prominent
- [ ] Checkout form fields are properly labeled
- [ ] Form validation messages appear for invalid inputs

#### User Account
- [ ] Login page has proper form validation
- [ ] Register page validates passwords and email
- [ ] Profile page displays user information correctly
- [ ] Order history shows all past orders
- [ ] Favorites/Wishlist page displays saved products
- [ ] Logout button removes user session

#### Admin Pages
- [ ] Admin dashboard loads statistics
- [ ] Admin tables (products, orders, users) display correctly
- [ ] Pagination works for list pages
- [ ] Create/Edit forms are user-friendly
- [ ] Search and filter features work

### 2.2 Responsive Design Testing

**Mobile (375px - 425px)**
- [ ] Menu collapses into hamburger menu
- [ ] No horizontal scrolling
- [ ] Touch targets are at least 44x44px (accessibility)
- [ ] Images scale properly
- [ ] Forms are easy to fill on mobile

**Tablet (768px)**
- [ ] Layout adjusts properly between mobile and desktop
- [ ] Navigation is accessible
- [ ] Product cards display in 2 columns

**Desktop (1024px+)**
- [ ] Full navigation menu displays
- [ ] Product grid shows 3-4 columns
- [ ] Sidebar (if any) displays properly
- [ ] All content is visible without scrolling horizontally

### 2.3 Typography & Readability
- [ ] Font sizes are appropriate for hierarchy
- [ ] Line height provides good readability
- [ ] Color contrast ratio meets WCAG AA standards (4.5:1 for text)
- [ ] No text is too cramped or oversized

### 2.4 Color & Visual Consistency
- [ ] Brand colors are consistent throughout
- [ ] Buttons have consistent styling
- [ ] Links are visually distinct
- [ ] Active states are clear (highlighted nav items, selected buttons)
- [ ] Loading states are visible (spinners, skeleton screens)
- [ ] Error states are obvious (red text, error icons)

---

## 3. Functionality Testing Checklist

### 3.1 Navigation & Routing
```
Test Cases:
✓ Click header logo → Home page loads
✓ Click navigation links → Correct pages load
✓ Back/Forward browser buttons → Navigation works
✓ Direct URL access → Page loads correctly
✓ Invalid routes → 404 page displays
```

### 3.2 Authentication & Authorization

```
Test Cases:
✓ Register new user → Account created successfully
✓ Login with valid credentials → Session starts
✓ Login with invalid credentials → Error message displayed
✓ Password reset → Works and allows new password
✓ Logout → User session cleared
✓ Access protected routes without login → Redirect to login
✓ Admin routes only accessible to admins → Regular users redirected
```

### 3.3 Product Browsing

```
Test Cases:
✓ Category page loads → All products in category display
✓ Search functionality → Returns correct products
✓ Sort options (price, rating, newest) → Results sorted correctly
✓ Pagination → Can navigate through pages
✓ Product details page → All info displays (images, price, desc, reviews)
✓ Filter by brand/price → Results filtered correctly
✓ Favorite/Like button → Updates without page reload
```

### 3.4 Cart Management

```
Test Cases:
✓ Add to cart → Item appears in cart
✓ Add same item twice → Quantity increases or new item added correctly
✓ Update quantity → Cart total updates
✓ Remove item → Item disappears from cart
✓ Clear cart → All items removed
✓ Close and reopen → Cart persists (Redux state/localStorage)
✓ View cart from any page → Current state is maintained
```

### 3.5 Checkout Process

```
Test Cases:
✓ Enter shipping address → Saved correctly
✓ Select payment method → Selected properly
✓ Apply coupon/voucher → Discount applied
✓ Review order → All details correct
✓ Complete purchase → Order created successfully
✓ Order confirmation → Displays order number and details
✓ Order history → New order appears in user's order list
```

### 3.6 User Profile

```
Test Cases:
✓ View profile → All user data displays
✓ Edit profile → Changes saved
✓ Change password → New password works
✓ View order history → All orders listed with status
✓ View order details → Can see full order information
✓ View saved addresses → All addresses display
✓ Add new address → New address saves
✓ Delete address → Address removed
```

### 3.7 Forms & Validation

```
Test Cases:
✓ Required fields → Cannot submit without them
✓ Email validation → Invalid emails rejected
✓ Phone number validation → Correct format enforced
✓ Password strength → Requirements shown and enforced
✓ Confirmation messages → Show after successful submission
✓ Error messages → Clear and helpful
```

### 3.8 Admin Functionality

```
Test Cases:
✓ View dashboard → Stats load correctly
✓ Product management → Can create, read, update, delete
✓ Order management → Can view and update order status
✓ User management → Can view and manage users
✓ Category management → Can manage categories
✓ Export data → CSV/Excel export works
✓ Search/Filter → Admin lists can be filtered
```

### 3.9 Performance

```
Test Cases:
✓ Page load time → < 3 seconds (first meaningful paint)
✓ Image optimization → Images load quickly (use DevTools Network tab)
✓ Lazy loading → Images load as user scrolls
✓ API calls → Requests complete in reasonable time
✓ No memory leaks → Check Performance tab for memory growth
```

### 3.10 Browser & Device Testing

```
Test Environments:
✓ Chrome (latest)
✓ Firefox (latest)
✓ Safari (latest)
✓ Edge (latest)
✓ iOS Safari (mobile)
✓ Android Chrome (mobile)
```

---

## 4. Automated Testing Setup

### 4.1 Install Testing Libraries

```bash
pnpm add -D @testing-library/react @testing-library/jest-dom jest @types/jest
pnpm add -D jest-environment-jsdom
```

### 4.2 Create Jest Configuration

Create `jest.config.js`:
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

### 4.3 Create Jest Setup File

Create `jest.setup.js`:
```javascript
import '@testing-library/jest-dom'
```

### 4.4 Add Test Script

Update `package.json`:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 4.5 Sample Unit Test

Create `src/components/Button.test.tsx`:
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await userEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalled()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByText('Click me')).toBeDisabled()
  })
})
```

---

## 5. Visual Regression Testing (Optional)

### 5.1 Using Percy.io or Similar Service

```bash
# Install Percy CLI
pnpm add -D @percy/cli @percy/playwright

# Add to package.json
{
  "scripts": {
    "percy:snapshot": "percy snapshot http://localhost:3000"
  }
}
```

---

## 6. Performance Testing Tools

### 6.1 Lighthouse Audit (Built into Chrome)
1. Open DevTools → Lighthouse tab
2. Click "Generate report"
3. Check scores for:
   - Performance (target: > 90)
   - Accessibility (target: > 90)
   - Best Practices (target: > 90)
   - SEO (target: > 90)

### 6.2 Chrome DevTools Performance Tab
1. Open DevTools → Performance tab
2. Click record button
3. Perform user actions
4. Analyze metrics (FCP, LCP, CLS)

### 6.3 Network Tab
1. Open DevTools → Network tab
2. Filter by type (XHR, CSS, Images)
3. Check response times
4. Look for failed requests (red)

---

## 7. Accessibility Testing

### 7.1 Manual Accessibility Checks

```
Test Cases:
✓ Tab through navigation → Logical order, visible focus states
✓ Keyboard only → All functions accessible without mouse
✓ Screen reader test → Content read aloud makes sense
✓ Color contrast → Text readable (use WAVE tool)
✓ Images have alt text → Describe what images show
✓ Form labels → Each input has associated label
```

### 7.2 Browser Tools for Accessibility

- **WAVE** (Web Accessibility Evaluation Tool) - Chrome extension
- **Axe DevTools** - Chrome extension
- **Lighthouse Accessibility** - Built-in Chrome DevTools

---

## 8. Testing Commands

```bash
# Start development server
pnpm run dev

# Build and test production build
pnpm run build
pnpm run start

# Run linting
pnpm run lint

# Run unit tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode (auto-rerun on file changes)
pnpm test:watch
```

---

## 9. Checklist for Production Deployment

### Pre-Launch Verification
- [ ] All pages load without errors
- [ ] Forms submit correctly
- [ ] API calls succeed with real backend
- [ ] Payment integration (PayPal) works
- [ ] Images load from CDN (Cloudinary)
- [ ] Responsive design tested on real devices
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
- [ ] No console errors or warnings
- [ ] Loading states visible
- [ ] Error states handled gracefully
- [ ] Authentication/authorization working
- [ ] Admin functionality verified
- [ ] Search and filters work
- [ ] Pagination works
- [ ] Cart/checkout process complete

### Performance
- [ ] Lighthouse score > 90 (all categories)
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

### Security
- [ ] HTTPS enabled
- [ ] No sensitive data in localStorage
- [ ] CORS properly configured
- [ ] API keys not exposed in frontend code

---

## 10. Bug Reporting Template

When you find issues, document them like this:

```markdown
### Bug: [Title]

**URL/Page:** [Where it occurs]

**Steps to Reproduce:**
1. First step
2. Second step
3. Third step

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happens]

**Screenshots/Videos:**
[Attach if possible]

**Browser & Device:**
- Browser: Chrome v120
- Device: MacBook Pro 14"
- OS: macOS 14.1

**Severity:** [Critical/High/Medium/Low]
```

---

## 11. Testing Priority

### Must Test (Before Launch)
1. Core user journeys (browse → cart → checkout → confirm)
2. Authentication (login/register/logout)
3. Mobile responsiveness
4. Critical functionality (payment, forms)
5. No JavaScript errors in console

### Should Test
1. All page navigation
2. All form validations
3. Error handling
4. All admin features
5. Cross-browser compatibility

### Nice to Have
1. Performance optimization
2. Visual regression testing
3. Automated test coverage
4. Accessibility compliance
5. SEO metadata

---

## 12. Quick Test Session Script

Run this checklist every time before deployment:

```bash
# 1. Clear cache and start fresh
rm -rf .next node_modules/.cache

# 2. Start dev server
pnpm run dev

# 3. Open browser to http://localhost:3000

# 4. Test main flows:
# - Browse products
# - Add to cart
# - Checkout
# - View account

# 5. Check console for errors (F12)

# 6. Test on mobile (Ctrl+Shift+M)

# 7. Run build to catch issues
pnpm run build

# 8. Test production build
pnpm run start
```

---

## Questions During Testing?

If you encounter issues:
1. Check browser console (F12) for error messages
2. Check Network tab for failed API calls
3. Check Redux DevTools for state issues
4. Review backend logs for server-side errors
5. Use `console.log()` for debugging

