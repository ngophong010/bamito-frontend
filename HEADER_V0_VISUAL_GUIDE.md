# Header V0 Implementation - Visual Guide

## 🎨 Header Layout Breakdown

### Desktop View (960px and up)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  [A]AMITO    [SẢN PHẨM] [SALE OFF] [TIN TỨC] [LIÊN HỀ]  [🔍] [🛒] [👤]  │
│  └────────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘

Components from left to right:
1. Logo: [A] badge + "AMITO" text
2. Navigation: 4 links (uppercase, spaced 1rem apart)
3. Search bar: Icon + input, gray background
4. Cart icon: With red badge showing count
5. User account icon: Triggers dropdown menu
```

### Tablet View (600px - 960px)
```
┌────────────────────────────────────────────────────────────┐
│  [≡] [A]AMITO    [🔍 Search] [🛒] [👤]                   │
└────────────────────────────────────────────────────────────┘

Changes:
- Hamburger menu (≡) appears
- Navigation links hidden
- Search bar visible
- All icons visible
```

### Mobile View (below 600px)
```
┌──────────────────────────┐
│  [≡]  [A]AMITO      [🛒] │
└──────────────────────────┘

Left drawer menu (on hamburger click):
┌──────────────────────────┐
│  Menu          [✕]       │
├──────────────────────────┤
│  • SẢN PHẨM              │
│  • SALE OFF              │
│  • TIN TỨC               │
│  • LIÊN HỀ               │
└──────────────────────────┘

Changes:
- Hamburger menu opens left drawer
- Search bar hidden
- Account button hidden (moved to dropdown)
- Cart icon visible
```

---

## 🔄 Component Flow

```
Header.tsx
├─ StyledAppBar (sticky, white background)
│  ├─ Container (max-width: 1200px)
│  │  └─ Toolbar (flex layout, responsive)
│  │     ├─ Mobile Menu Button (visible on xs/sm only)
│  │     │  └─ MenuIcon
│  │     │
│  │     ├─ LogoBox (flex, gap: 0.5rem)
│  │     │  ├─ LogoBadge ([A])
│  │     │  └─ "AMITO" text
│  │     │
│  │     ├─ Desktop Navigation (hidden on xs/sm)
│  │     │  ├─ NavLink → /products (SẢN PHẨM)
│  │     │  ├─ NavLink → /sale (SALE OFF - red)
│  │     │  ├─ NavLink → /feed (TIN TỨC)
│  │     │  └─ NavLink → /contact (LIÊN HỀ)
│  │     │
│  │     └─ Actions Box (flex, gap: 1rem/2rem)
│  │        ├─ Search (hidden on xs, shown on sm+)
│  │        │  ├─ SearchIconWrapper
│  │        │  │  └─ SearchIcon
│  │        │  └─ StyledInputBase (placeholder: "Tìm kiếm...")
│  │        │
│  │        ├─ Cart IconButton
│  │        │  └─ Badge (count: 0, color: primary)
│  │        │     └─ ShoppingCartIcon
│  │        │
│  │        └─ Account IconButton (hidden on xs)
│  │           └─ PersonIcon
│  │
│  └─ User Menu (dropdown)
│     ├─ MenuItem → /user/profile (Hồ Sơ Cá Nhân)
│     ├─ MenuItem → /user/orders (Đơn Hàng Của Tôi)
│     ├─ MenuItem → /user/favourite (Yêu Thích)
│     └─ MenuItem → /(auth)/logout (Đăng Xuất)
│
└─ Mobile Drawer (left, width: 280px)
   ├─ Header (title: "Menu", close button)
   └─ mobileMenu
      ├─ ListItem → /products (SẢN PHẨM)
      ├─ ListItem → /sale (SALE OFF)
      ├─ ListItem → /feed (TIN TỨC)
      └─ ListItem → /contact (LIÊN HỀ)
```

---

## 🎯 Styling Details

### Colors
```typescript
primary:     #D14B70      // Crimson red - hover effects
text.primary: #0D0D0E      // Dark black - main text
text.secondary: #75767F    // Gray - secondary text
secondary.main: #F5F5F7    // Light gray - backgrounds
divider: #E5E5E8          // Light border color
sale (red): #DC2626       // For SALE OFF link
```

### Spacing
```typescript
Header height: 56px (mobile), 64px (desktop)
Toolbar gap: 0.5rem (logo), 4rem (nav), 2rem (actions)
Container: maxWidth="lg" (1200px)
Padding: 1rem (sm), 2rem (lg)
```

### Typography
```typescript
Logo: 
  - Font: Inter, sans-serif
  - Size: 1.25rem
  - Weight: 900 (black)
  - Letter-spacing: -0.02em

Navigation:
  - Font: Inter, sans-serif
  - Size: 0.875rem (14px)
  - Weight: 600 (semibold)
  - Transform: UPPERCASE
  - Letter-spacing: 0.05em

Search input:
  - Font: Inter, sans-serif
  - Size: 0.875rem
  - Weight: 400
  - Placeholder: "Tìm kiếm..."
```

### Shadows
```typescript
AppBar: 0 1px 3px rgba(0,0,0,0.1)      // Subtle
Buttons: 0 4px 12px rgba(0,0,0,0.15)   // On hover
```

### Borders
```typescript
AppBar: 1px solid #E5E5E8
Search: rounded (border-radius: 4px)
```

---

## 🔗 Navigation Structure

```
Home (/)
├─ Products (/products)
├─ Sale (/sale)
├─ Feed (/feed)
├─ Contact (/contact)
├─ User Account (dropdown)
│  ├─ Profile (/user/profile)
│  ├─ Orders (/user/orders)
│  ├─ Favorites (/user/favourite)
│  └─ Logout (/(auth)/logout)
├─ Cart (/user/cart)
└─ Search (interactive)
```

---

## 🎬 Interactions

### Desktop
1. **Logo Click**: Navigate to home
2. **Nav Link Hover**: Text changes to primary color
3. **Search**: Type to search (implementation pending)
4. **Cart Icon Click**: Navigate to cart page
5. **Account Icon Click**: Show dropdown menu
6. **Menu Item Click**: Navigate and close menu

### Tablet
1. **Hamburger Menu Click**: Open left drawer
2. **Menu Item Click**: Navigate and close drawer
3. **Same as desktop for icons**

### Mobile
1. **Hamburger Menu Click**: Open left drawer
2. **Menu Item Click**: Navigate and close drawer
3. **Cart Icon Click**: Navigate to cart page
4. **Account Icon**: Hidden (use cart or search)

---

## 🎨 Styling Code Structure

### MUI Styled Components

#### Search Bar
```typescript
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.secondary.main, 0.8),
  maxWidth: "200px",
  // ... more styles
}));
```

#### Navigation Link
```typescript
const NavLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: "none",
  fontSize: "0.875rem",
  fontWeight: 600,
  textTransform: "uppercase",
  "&:hover": { color: theme.palette.primary.main },
  "&.sale": { color: "#DC2626" },
}));
```

#### Logo Box
```typescript
const LogoBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  fontSize: "1.25rem",
  fontWeight: 900,
  letterSpacing: "-0.02em",
}));
```

---

## 📱 Responsive Breakpoints

### xs (0-600px) - Mobile
- ✅ Hamburger menu button visible
- ❌ Desktop navigation hidden
- ❌ Search bar hidden
- ❌ Account button hidden
- ✅ Cart icon visible
- ✅ Left drawer menu

### sm (600-960px) - Tablet
- ✅ Hamburger menu button visible
- ❌ Desktop navigation hidden
- ✅ Search bar visible
- ❌ Account button hidden
- ✅ Cart icon visible
- ✅ Left drawer menu

### md (960px+) - Desktop
- ❌ Hamburger menu button hidden
- ✅ Desktop navigation visible
- ✅ Search bar visible
- ✅ Account button visible
- ✅ Cart icon visible
- ❌ Left drawer menu

---

## 🔧 State Management

### State Variables
```typescript
const [mobileOpen, setMobileOpen] = useState(false);
// Controls left drawer menu visibility

const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);
// Controls user dropdown menu position

const userOpen = Boolean(userAnchor);
// Derived state for menu open/closed
```

### Event Handlers
```typescript
handleUserClick(event)          // Opens account dropdown
handleUserClose()               // Closes account dropdown
handleNavigate(path)            // Navigate + close menus
setMobileOpen(true)             // Open left drawer
setMobileOpen(false)            // Close left drawer
```

---

## 🌈 Color Palette Applied

```
Primary Elements (Crimson #D14B70):
├─ Logo badge background
├─ Cart badge background
├─ Link hover color
├─ Focus ring color
└─ Active menu item

Text Elements (#0D0D0E):
├─ Logo text
├─ Navigation links
├─ Menu items
└─ Input text

Secondary Elements (#F5F5F7):
├─ Search bar background
├─ Button hover background
└─ Drawer background

Border Elements (#E5E5E8):
├─ AppBar bottom border
├─ Input field borders
└─ Menu separators

Accent Elements (#DC2626):
└─ SALE OFF link color
```

---

## 🚀 Performance Considerations

### Optimizations
- ✅ Minimal re-renders (useState only when needed)
- ✅ Styled components (CSS-in-JS, efficient)
- ✅ Icon lazy loading (MUI handles this)
- ✅ Menu lazy rendering (only renders when open)
- ✅ Responsive images not used (only text/icons)

### Bundle Size Impact
- ✅ Removed: Search, Navigation, CartButton, UserSection components
- ✅ Added: MUI styled components (~50KB gzipped, already in project)
- ✅ Net change: Slightly smaller bundle

---

## ♿ Accessibility Features

### ARIA Labels
```typescript
aria-label="open drawer"      // Hamburger menu
aria-label="cart"             // Cart button
aria-label="account"          // Account button
aria-label="search"           // Search input
```

### Keyboard Navigation
- ✅ Tab through buttons and links
- ✅ Enter/Space to activate buttons
- ✅ Escape to close menus/drawers
- ✅ Arrow keys in menus

### Screen Reader Support
- ✅ Semantic HTML (Link, Button, Menu)
- ✅ Icon buttons have aria-labels
- ✅ Menu items are accessible
- ✅ Form inputs labeled

---

## 🐛 Common Issues & Solutions

### Issue: Header overlaps content
**Solution**: Add padding-top to body or main
```tsx
<main style={{ paddingTop: '64px' }}>
```

### Issue: Icons not showing
**Solution**: Ensure @mui/icons-material is installed
```bash
pnpm add @mui/icons-material
```

### Issue: Mobile menu doesn't close
**Solution**: Check handleNavigate sets mobileOpen to false

### Issue: Colors not applying
**Solution**: Check theme.ts is imported in Providers.tsx

### Issue: Search bar too narrow on mobile
**Solution**: It's intentionally hidden, add search to drawer if needed

---

## 📊 Component Props

### Header Props
```typescript
interface HeaderProps {
  categories?: Category[];  // Optional, not used yet
}
```

### IconButton Props
```typescript
<IconButton
  size="small"           // Smaller icons
  color="inherit"        // Inherit theme color
  aria-label="..."       // Accessibility
  onClick={handleClick}  // Click handler
/>
```

### Menu Props
```typescript
<Menu
  anchorEl={userAnchor}  // Position anchor
  open={userOpen}        // Show/hide
  onClose={closeHandler} // Close handler
  anchorOrigin={{...}}   // Position relative to anchor
/>
```

### Drawer Props
```typescript
<Drawer
  anchor="left"          // Slide from left
  open={mobileOpen}      // Show/hide
  onClose={closeHandler} // Close handler
/>
```

---

## 🎓 Learning Resources

### MUI Components Used
- [AppBar](https://mui.com/material-ui/api/app-bar/)
- [Toolbar](https://mui.com/material-ui/api/toolbar/)
- [IconButton](https://mui.com/material-ui/api/icon-button/)
- [Menu](https://mui.com/material-ui/api/menu/)
- [Drawer](https://mui.com/material-ui/api/drawer/)
- [Badge](https://mui.com/material-ui/api/badge/)
- [InputBase](https://mui.com/material-ui/api/input-base/)

### Styling
- [styled() API](https://mui.com/system/styled/)
- [sx prop](https://mui.com/system/the-sx-prop/)
- [useTheme hook](https://mui.com/system/styles/advanced/#accessing-the-theme-in-a-component)

---

## ✨ What's Next?

The header is complete! Next components to implement:

1. **HeroBanner** - Large image with CTA buttons
2. **TrustBadges** - 4 feature badges
3. **BentoCategories** - Masonry grid of categories
4. **FeaturedProducts** - Product grid with cards
5. **NewsletterSection** - Email signup form

See `IMPLEMENTATION_ORDER.md` for the full roadmap.

