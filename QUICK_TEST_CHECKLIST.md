# Quick Frontend Testing Checklist

## 🚀 Before Running Tests

```bash
# Ensure dependencies are installed
pnpm install

# Start development server
pnpm run dev
# App available at: http://localhost:3000
```

---

## 📱 Device Testing

### Desktop (1440px)
- [ ] Header and navigation display correctly
- [ ] Product grid shows 3-4 columns
- [ ] All buttons are clickable
- [ ] No horizontal scrolling

### Tablet (768px)
- [ ] Layout adjusts properly
- [ ] Product grid shows 2 columns
- [ ] Navigation is accessible
- [ ] Images scale correctly

### Mobile (375px)
- [ ] Menu collapses to hamburger
- [ ] No horizontal scrolling
- [ ] Touch targets are large (44x44px minimum)
- [ ] Text is readable without zooming

---

## 🎨 UI/Visual Testing

### Colors & Styling
- [ ] Brand colors consistent throughout
- [ ] Buttons have consistent styling
- [ ] Active states are visible (nav items, buttons)
- [ ] Loading spinners appear when needed
- [ ] Error messages are red and clear

### Typography
- [ ] Font sizes have good hierarchy
- [ ] Text is readable (not too small)
- [ ] Line spacing is comfortable
- [ ] Good contrast between text and background

### Images
- [ ] All images load without broken links
- [ ] Images are properly sized
- [ ] No distortion or stretching
- [ ] Alt text present for accessibility

---

## 🔧 Functionality Testing

### Navigation
- [ ] Click header logo → Home page
- [ ] Click nav links → Correct pages load
- [ ] Browser back/forward work
- [ ] 404 page shows for invalid routes

### Authentication (if login exists)
- [ ] Register new account works
- [ ] Login with correct credentials succeeds
- [ ] Login with wrong credentials shows error
- [ ] Logout clears user session
- [ ] Protected pages redirect to login

### Shopping Flow
- [ ] Browse products page loads
- [ ] Click product → Details page shows
- [ ] Add to cart → Item appears
- [ ] View cart → All items listed
- [ ] Update quantity → Total recalculates
- [ ] Remove item → Item disappears
- [ ] Cart persists on refresh

### Forms
- [ ] Required fields are enforced
- [ ] Email validation works
- [ ] Phone number validation works
- [ ] Password strength requirements shown
- [ ] Error messages appear for invalid input
- [ ] Success messages appear after submit

### Admin (if applicable)
- [ ] Dashboard loads with data
- [ ] Can create new items
- [ ] Can view/edit existing items
- [ ] Can delete items
- [ ] List pagination works
- [ ] Search filters work

---

## ⚡ Performance

### Page Speed
- [ ] Landing page loads in < 3 seconds
- [ ] Product pages load in < 2 seconds
- [ ] Navigation between pages is smooth
- [ ] Images load as you scroll (lazy loading)

### Network
- [ ] Open DevTools → Network tab
- [ ] No red (failed) requests
- [ ] API calls complete in < 1 second
- [ ] Images load quickly

### Check Console
- [ ] No red error messages
- [ ] No yellow warning messages (or acceptable ones)
- [ ] No failed fetch calls

---

## ♿ Accessibility

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Focus states are visible (blue outline)
- [ ] Logical tab order (left-to-right, top-to-bottom)
- [ ] Can submit forms with keyboard

### Screen Reader (Optional)
- [ ] Use browser screen reader
- [ ] Form labels are read correctly
- [ ] Image alt text is read
- [ ] Button purposes are clear

### Color Contrast
- [ ] Text is readable (not too faint)
- [ ] Links are distinguishable from normal text
- [ ] Install WAVE extension for detailed report

---

## 🐛 Common Issues to Check

### Layout Issues
- [ ] Text overflow on small screens
- [ ] Images not loading
- [ ] Content hidden under header/footer
- [ ] Buttons not clickable

### Functionality Issues
- [ ] Forms not submitting
- [ ] Data not saving
- [ ] Page not loading
- [ ] API errors

### Performance Issues
- [ ] Page loading slowly
- [ ] Images taking too long
- [ ] UI freezing when clicking
- [ ] High memory usage

---

## 📋 Detailed Testing Commands

```bash
# Development Testing
pnpm run dev              # Start dev server on http://localhost:3000

# Linting
pnpm run lint            # Check for code issues

# Production Build Testing
pnpm run build           # Build for production
pnpm run start           # Run production build locally

# Unit Tests (if configured)
pnpm test               # Run tests
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Get test coverage report
```

---

## 🔍 Browser DevTools Checklist

### Console Tab (F12 → Console)
- [ ] No red error messages
- [ ] No critical warnings
- [ ] All expected logs appear

### Network Tab (F12 → Network)
- [ ] All requests succeed (status 200-299)
- [ ] No 404, 500, or timeout errors
- [ ] Images and CSS load
- [ ] API responses are valid

### Elements/Inspector Tab (F12 → Elements)
- [ ] Inspect product card → Check structure
- [ ] Inspect button → Check styling
- [ ] No duplicate IDs
- [ ] Semantic HTML used

### Application Tab (F12 → Application)
- [ ] Local storage has expected data
- [ ] Session storage is clean
- [ ] Cookies are set correctly
- [ ] Service workers registered (if used)

### Performance Tab (F12 → Performance)
- [ ] Click Record → Perform action → Click Stop
- [ ] Check FCP (First Contentful Paint) < 2s
- [ ] Check LCP (Largest Contentful Paint) < 2.5s
- [ ] Check CLS (Cumulative Layout Shift) < 0.1

---

## 📸 Screenshots to Take

Take these for documentation:
1. Home page (desktop & mobile)
2. Product page (desktop & mobile)
3. Cart page (desktop & mobile)
4. Checkout page (desktop & mobile)
5. Admin dashboard (if applicable)
6. Error states
7. Loading states
8. Mobile menu

---

## ✅ Sign-Off Checklist

Before declaring "done":
- [ ] All critical paths work
- [ ] No errors in console
- [ ] Mobile is responsive
- [ ] Forms validate correctly
- [ ] API calls succeed
- [ ] User can complete main task
- [ ] No broken links
- [ ] No missing images

---

## 🚨 Critical Issues (Must Fix)

- [ ] App won't load
- [ ] Console has red errors
- [ ] Forms don't submit
- [ ] Payment doesn't work
- [ ] Can't login/logout
- [ ] Data not saving
- [ ] Mobile is broken

---

## ⚠️ Important Notes

1. **Test with Real Data**: Use actual product/user data when possible
2. **Clear Cache**: Ctrl+Shift+Delete in Chrome if styles look wrong
3. **Test Incognito**: Open private window to test as new user
4. **Test Slow Network**: DevTools → Network → Throttling (set to "Slow 3G")
5. **Test Without Internet**: Simulate offline to see error handling

---

## 📞 Getting Help

If something doesn't work:
1. Check browser console (F12) for errors
2. Check DevTools Network tab for failed requests
3. Check Redux DevTools for state issues (if installed)
4. Read error messages carefully
5. Test in a different browser
6. Clear cache and retry

