# Frontend Testing Quick Start Guide

## Step 1: Prepare Your Environment

```bash
# Navigate to frontend directory
cd bamito-frontend-ecommerce

# Install all dependencies
pnpm install

# Start the development server
pnpm run dev
```

The application should now be running at `http://localhost:3000`

---

## Step 2: Open Browser DevTools

Press **F12** (Windows/Linux) or **Cmd+Option+I** (Mac) to open Developer Tools.

Keep DevTools open on the **Console** tab while testing to catch any errors immediately.

---

## Step 3: Run the Basic Testing Flow

### 3.1 Test Home Page
1. Navigate to `http://localhost:3000`
2. **Check:**
   - Page loads without errors
   - Header with logo appears
   - Navigation menu visible
   - Product grid displays
   - Footer shows
   - **Console:** No red errors

### 3.2 Test Responsive Design
1. Press **Ctrl+Shift+M** (Windows) or **Cmd+Shift+M** (Mac) to toggle mobile view
2. Resize to different widths: 375px, 768px, 1440px
3. **Check:**
   - Layout adapts smoothly
   - Menu becomes hamburger on mobile
   - No horizontal scrolling
   - All text readable
   - Touch buttons are large enough

### 3.3 Test Product Browsing
1. Click on a product category (e.g., "Badminton Rackets")
2. **Check:**
   - Product list loads
   - Can scroll through products
   - Images load
   - Price displays correctly

3. Click on a product to view details
4. **Check:**
   - Product name, image, price display
   - Description readable
   - "Add to Cart" button visible
   - Can see product specifications

### 3.4 Test Cart Functionality
1. Click "Add to Cart" button
2. **Check:**
   - No error in console
   - Product added (you should see a notification)
   - Cart count updates (if shown in header)

3. Click cart icon to view cart
4. **Check:**
   - Product appears in cart
   - Quantity shows correctly
   - Price calculation correct
   - Can update quantity
   - Can remove item

### 3.5 Test Search/Filter (if available)
1. Use search box to search for a product
2. **Check:**
   - Search works
   - Results display
   - Results are relevant

3. Try filters (price, category, rating, etc.)
4. **Check:**
   - Filters apply correctly
   - Results update

### 3.6 Test User Authentication (if available)
1. Click "Login" or "Account"
2. Try to login with test credentials
3. **Check:**
   - Form validates (try empty submit)
   - Login succeeds with correct credentials
   - Login fails with wrong credentials (error message)
   - Can logout

4. Try to register new account
5. **Check:**
   - Form validates required fields
   - Password requirements shown
   - Email validation works
   - Account created successfully

### 3.7 Test Admin Functions (if you're an admin user)
1. Navigate to admin dashboard `/admin`
2. **Check:**
   - Dashboard loads with statistics
   - Can view products list
   - Can view orders
   - Can view users
   - Pagination works
   - Can search/filter

---

## Step 4: Check Browser Console

1. Open DevTools (F12)
2. Go to **Console** tab
3. **Look for:**
   - ❌ Red error messages (PROBLEM - fix these)
   - ⚠️ Yellow warnings (Usually okay, but review)
   - ✅ No messages = Good!

**Common errors to fix:**
- `Cannot GET /api/...` - Backend not running
- `Failed to fetch` - Network issue or CORS error
- `Cannot read property of undefined` - Code bug
- `Uncaught SyntaxError` - JavaScript syntax error

---

## Step 5: Check Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Refresh page (Ctrl+R)
4. **Look for:**
   - Red items = Failed requests (❌ problem)
   - Orange items = Slow requests (⚠️ needs optimization)
   - Green items = Successful requests (✅ good)

**Check times:**
- Most requests should complete in < 1 second
- Images might take 1-2 seconds
- API calls should be < 500ms

---

## Step 6: Test Performance

### Lighthouse Audit (Built-in Chrome Tool)
1. Open DevTools (F12)
2. Go to **Lighthouse** tab
3. Select categories:
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - ✅ SEO
4. Click "Analyze page load"
5. **Target scores:**
   - Performance: > 90
   - Accessibility: > 90
   - Best Practices: > 90
   - SEO: > 90

If scores are low, Lighthouse will suggest improvements.

---

## Step 7: Test on Mobile Device (Optional but Recommended)

### Using Chrome Remote Debugging
1. Connect your phone via USB
2. Enable "Developer Mode" on phone
3. In Chrome on PC: `chrome://inspect`
4. Your device appears - click "Inspect"
5. Now you can test on real phone while seeing DevTools

### Or use Chrome Mobile Emulation
1. Press **Ctrl+Shift+M** to enable mobile mode
2. Top bar shows device selector
3. Choose different devices: iPhone, iPad, Galaxy S9, etc.
4. Rotate screen: **Ctrl+Shift+R**

---

## Step 8: Test Forms and Validation

### Login Form (if available)
1. Try submitting empty form
   - ✅ Should show validation error
2. Try invalid email
   - ✅ Should show error
3. Try mismatched passwords (if applicable)
   - ✅ Should show error
4. Submit with valid data
   - ✅ Should succeed

### Checkout Form (if available)
1. Go to checkout
2. Leave required fields empty
   - ✅ Should not allow submit
3. Fill with invalid data:
   - Invalid ZIP code
   - Invalid phone number
4. Fill with valid data
   - ✅ Should submit successfully

---

## Step 9: Test Pagination (if available)

1. Go to any list page (products, orders, etc.)
2. Scroll to pagination controls
3. **Check:**
   - Current page is highlighted
   - Can click next page
   - Page number in URL updates
   - Products change when page changes
   - Previous/Next buttons work

---

## Step 10: Test Edge Cases

### Slow Network
1. DevTools → Network tab
2. Find throttling dropdown (usually says "No throttling")
3. Select "Slow 3G" or "Fast 3G"
4. Navigate to a page
5. **Check:**
   - Loading spinner appears
   - Page eventually loads
   - No crash or timeout

### No Images
1. DevTools → Network → XHR filter
2. Actually, just check in browser console:
3. Hover over image → Right-click → Block image
4. Refresh
5. **Check:**
   - Alt text appears instead
   - Page layout doesn't break
   - Other content loads normally

### Offline Mode
1. DevTools → Network tab
2. Check "Offline" checkbox
3. Try to load API data
4. **Check:**
   - Error message appears (not just spinning)
   - Page shows graceful error
   - User understands what happened

---

## Step 11: Sign-Off Checklist

Before saying "frontend is ready", verify:

```
CRITICAL (Must Pass)
☑ App loads without errors
☑ No red errors in console
☑ Main shopping flow works (browse → cart → checkout)
☑ Forms validate correctly
☑ Mobile is responsive
☑ Images load

IMPORTANT (Should Pass)
☑ All navigation links work
☑ Search/filter works (if applicable)
☑ User authentication works (if applicable)
☑ Admin functions work (if applicable)
☑ Pagination works (if applicable)
☑ Performance is acceptable (< 3 second load)

NICE TO HAVE (If Time Permits)
☑ Error messages are helpful
☑ Loading states visible
☑ Accessibility is good (tab navigation works)
☑ Cross-browser tested (Chrome, Firefox, Safari)
☑ Lighthouse score > 90
```

---

## Step 12: Document Issues Found

If you find bugs, note them with:

1. **What page/feature:** e.g., "Cart page"
2. **What happened:** e.g., "Total price not updating"
3. **What should happen:** e.g., "Total should update when quantity changes"
4. **Steps to reproduce:** e.g., "1. Add item, 2. Change quantity, 3. Check total"
5. **Severity:** Critical / High / Medium / Low
6. **Browser:** Chrome 120 / Firefox 121 / Safari 17.2

Example:
```
Bug: Cart total not updating
Page: /cart
Expected: Total recalculates when quantity changes
Actual: Total stays the same
Severity: Critical
Steps: Add item → Open cart → Change quantity → Total doesn't update
Browser: Chrome 120 on Windows
```

---

## Step 13: Prepare for Production

### Build and Test Production Build Locally
```bash
# Build for production
pnpm run build

# This creates optimized version in .next folder
# If build fails, you have errors to fix

# Run production build
pnpm run start

# Open http://localhost:3000
# Test the production version
```

### Check Build Warnings
```bash
pnpm run build
```

Look at output for:
- ⚠️ Warnings (address these if possible)
- ❌ Errors (must fix these)

---

## Troubleshooting Common Issues

### Issue: "Cannot GET /api/..."
**Solution:** Make sure backend is running on `http://localhost:3001`

### Issue: "CORS error"
**Solution:** Backend needs to allow frontend domain in CORS settings

### Issue: Images not loading
**Solutions:**
- Check image URLs are correct
- Check Cloudinary credentials if using image service
- Check Network tab for 404 errors

### Issue: Page loading very slowly
**Solutions:**
- Check Network tab for slow requests
- Check if backend is responding slowly
- Check DevTools Performance tab for bottlenecks
- Look for missing images or failed API calls

### Issue: Forms not submitting
**Solutions:**
- Check console for JavaScript errors
- Check Network tab for failed API request
- Make sure all required fields are filled
- Check form validation in code

### Issue: Authentication not working
**Solutions:**
- Check if backend auth endpoint is working
- Check localStorage/cookies in DevTools
- Try logout and login again
- Clear browser cache and cookies

---

## Next Steps

1. **Run through testing checklist** (above)
2. **Document any bugs found**
3. **Fix critical issues** (errors, broken features)
4. **Fix important issues** (missing functionality, bad UX)
5. **If time allows, optimize** (performance, accessibility)
6. **Deploy to staging/production**

---

## Tips for Effective Testing

1. **Test like a user** - Don't just test happy path, try to break things
2. **Test on real device** - Emulation is good, but real device is better
3. **Clear cache** - Ctrl+Shift+Delete if styles seem wrong
4. **Test incognito** - Ctrl+Shift+N to test as new user (fresh cookies)
5. **Test on slow network** - DevTools can simulate this
6. **Take screenshots** - Document what works and what doesn't
7. **Test multiple browsers** - Chrome, Firefox, Safari at minimum
8. **Involve others** - Have someone else test, they'll find things you miss
9. **Use checklists** - Don't rely on memory, use the checklist above
10. **Document everything** - Future you will thank you

