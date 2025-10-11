import {
  User, Star, ClipboardList, MessageSquare, Shield, LogOut
} from 'lucide-react'; // Using a modern icon library like lucide-react

// Define the shape of a menu item
export interface MenuItem {
  to?: string; // Path to navigate to
  icon: React.ElementType;
  text: string;
  action?: 'LOGOUT'; // A special identifier for the logout action
  requiredRole?: string; // e.g., 'R1' for Admin-only links
}

// Define the menu structure
export const USER_MENU: MenuItem[] = [
  { to: "/user/profile", icon: User, text: "Thông tin tài khoản" },
  { to: "/user/favourite", icon: Star, text: "Sản phẩm yêu thích" },
  { to: "/user/orders", icon: ClipboardList, text: "Lịch sử đơn hàng" },
  { to: "/user/feedback", icon: MessageSquare, text: "Đánh giá sản phẩm" },
  { to: "/admin/dashboard", icon: Shield, text: "Trang quản trị", requiredRole: "R1" },
  { icon: LogOut, text: "Đăng xuất", action: "LOGOUT" },
];
