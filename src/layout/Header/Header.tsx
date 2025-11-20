"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  InputBase,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { HeaderProps } from "./types";

// Styled Components
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.secondary.main, 0.8),
  "&:hover": {
    backgroundColor: alpha(theme.palette.secondary.main, 1),
  },
  marginLeft: 0,
  width: "100%",
  maxWidth: "200px",
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    fontSize: "0.875rem",
    "&::placeholder": {
      color: theme.palette.text.secondary,
      opacity: 1,
    },
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  color: theme.palette.text.primary,
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  borderBottom: `1px solid ${theme.palette.divider}`,
  position: "sticky",
  top: 0,
  zIndex: 1000,
}));

const NavLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: "none",
  fontSize: "0.875rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  padding: "0.5rem 0",
  position: "relative",
  transition: "color 0.3s ease",
  "&:hover": {
    color: theme.palette.primary.main,
  },
  "&.sale": {
    color: "#DC2626",
    "&:hover": {
      color: "#B91C1C",
    },
  },
}));

const LogoBox = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  color: theme.palette.text.primary,
  fontWeight: 900,
  fontSize: "1.25rem",
  letterSpacing: "-0.02em",
  textDecoration: "none",
  cursor: "pointer",
  flexShrink: 0,
}));

const LogoBadge = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  borderRadius: "0.375rem",
  backgroundColor: theme.palette.primary.main,
  color: "#FFFFFF",
  fontWeight: 900,
  fontSize: "0.875rem",
}));

const Header: React.FC<HeaderProps> = ({ categories = [] }) => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);

  const userOpen = Boolean(userAnchor);

  const handleUserClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserAnchor(event.currentTarget);
  };

  const handleUserClose = () => {
    setUserAnchor(null);
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    setMobileOpen(false);
    handleUserClose();
  };

  const drawerWidth = 280;

  const mobileMenu = (
    <Box
      sx={{
        width: drawerWidth,
        p: 2,
      }}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigate("/products")}>
            <ListItemText
              primary="SẢN PHẨM"
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigate("/sale")}>
            <ListItemText
              primary="SALE OFF"
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigate("/feed")}>
            <ListItemText
              primary="TIN TỨC"
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigate("/contact")}>
            <ListItemText
              primary="LIÊN HỆ"
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <StyledAppBar>
        <Container maxWidth="lg">
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: { xs: 1, sm: 2 },
              py: 1,
              minHeight: { xs: "56px", sm: "64px" },
              gap: 2,
            }}
          >
            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <LogoBox href="/">
              <LogoBadge>A</LogoBadge>
              <span>AMITO</span>
            </LogoBox>

            {/* Desktop Navigation */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 4,
                ml: 4,
                flex: 1,
              }}
            >
              <NavLink href="/products">SẢN PHẨM</NavLink>
              <NavLink href="/sale" className="sale">
                SALE OFF
              </NavLink>
              <NavLink href="/feed">TIN TỨC</NavLink>
              <NavLink href="/contact">LIÊN HỆ</NavLink>
            </Box>

            {/* Search & Actions */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 2 },
                ml: "auto",
              }}
            >
              {/* Search Bar - Hidden on mobile */}
              <Search sx={{ display: { xs: "none", sm: "flex" } }}>
                <SearchIconWrapper>
                  <SearchIcon fontSize="small" />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Tìm kiếm..."
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>

              {/* Cart Button */}
              <IconButton
                size="small"
                color="inherit"
                aria-label="cart"
                sx={{
                  position: "relative",
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
                onClick={() => handleNavigate("/user/cart")}
              >
                <Badge badgeContent={0} color="primary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              {/* User Button - Hidden on mobile */}
              <IconButton
                size="small"
                color="inherit"
                aria-label="account"
                sx={{
                  display: { xs: "none", sm: "flex" },
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
                onClick={handleUserClick}
              >
                <PersonIcon />
              </IconButton>

              {/* User Menu */}
              <Menu
                anchorEl={userAnchor}
                open={userOpen}
                onClose={handleUserClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={() => handleNavigate("/user/profile")}>
                  Hồ Sơ Cá Nhân
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/user/orders")}>
                  Đơn Hàng Của Tôi
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/user/favourite")}>
                  Yêu Thích
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/(auth)/logout")}>
                  Đăng Xuất
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "#FFFFFF",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Menu
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        {mobileMenu}
      </Drawer>
    </>
  );
};

export default Header;
