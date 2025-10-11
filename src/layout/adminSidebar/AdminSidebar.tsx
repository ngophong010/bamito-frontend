"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt, faBoxesPacking, faFileInvoiceDollar, faUsers,
  faTags, faChartLine, faEnvelopeOpenText, faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import "./adminSidebar.scss";

// 1. Define the structure of menu items with TypeScript
interface SubMenuItem {
  id: string;
  value: string;
  path: string;
}

interface MenuItem {
  id: string;
  value: string;
  icon: any; // Type for FontAwesome icon
  path?: string; // Optional for parent items
  children?: SubMenuItem[];
}

// 2. Update the MENU with clean, RESTful routes
const MENU: MenuItem[] = [
  { id: "dashboard", value: "Tổng quan", icon: faTachometerAlt, path: "/admin/dashboard" },
  {
    id: "products", value: "Quản lý Sản phẩm", icon: faBoxesPacking,
    children: [
      { id: "products-list", value: "Sản phẩm", path: "/admin/products" },
      { id: "categories", value: "Danh mục", path: "/admin/categories" },
      { id: "brands", value: "Thương hiệu", path: "/admin/brands" },
      { id: "sizes", value: "Kích thước", path: "/admin/sizes" },
    ],
  },
  {
    id: "orders", value: "Quản lý Đơn hàng", icon: faFileInvoiceDollar,
    children: [
      { id: "orders-pending", value: "Đợi xác nhận", path: "/admin/orders?status=1" },
      { id: "orders-shipping", value: "Đang giao", path: "/admin/orders?status=2" },
      { id: "orders-completed", value: "Hoàn tất", path: "/admin/orders?status=3" },
      { id: "orders-cancelled", value: "Đã hủy", path: "/admin/orders?status=0" },
    ],
  },
  { id: "users", value: "Quản lý Người dùng", icon: faUsers, path: "/admin/users" },
  { id: "vouchers", value: "Quản lý Voucher", icon: faTags, path: "/admin/vouchers" },
  {
    id: "reports", value: "Báo cáo", icon: faChartLine,
    children: [
        { id: "reports-revenue", value: "Doanh thu", path: "/admin/reports/revenue" },
        { id: "reports-subscribers", value: "Email Marketing", path: "/admin/reports/subscribers" },
    ]
  },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  // 3. Derive the active state directly from the URL pathname
  const activeParent = useMemo(() => {
    const activeItem = MENU.find(item => 
      (item.path && pathname.startsWith(item.path)) || 
      item.children?.some(child => pathname.startsWith(child.path.split('?')[0]))
    );
    return activeItem?.id || null;
  }, [pathname]);

  // 4. Use local state only for UI toggles (which sub-menus are open)
  const [openMenus, setOpenMenus] = useState<string[]>(activeParent ? [activeParent] : []);

  const toggleMenu = (id: string) => {
    setOpenMenus(prev => 
      prev.includes(id) ? prev.filter(menuId => menuId !== id) : [...prev, id]
    );
  };

  return (
    <nav className="admin-sidebar-container">
      <div className="menu">
        {MENU.map((item) => {
          const isParentActive = activeParent === item.id;
          const isMenuOpen = openMenus.includes(item.id);

          if (item.children) {
            // Render a button for parent menu items
            return (
              <div key={item.id} className={`menu-group ${isParentActive ? 'active-group' : ''}`}>
                <button
                  className={`menu-item-container`}
                  onClick={() => toggleMenu(item.id)}
                >
                  <div className="menu-item">
                    <FontAwesomeIcon icon={item.icon} className="icon" />
                    <h3 className="text">{item.value}</h3>
                    <FontAwesomeIcon icon={faChevronDown} className={`chevron ${isMenuOpen ? 'open' : ''}`} />
                  </div>
                </button>
                {isMenuOpen && (
                  <div className="sub-menu">
                    {item.children.map((subItem) => (
                      <Link
                        key={subItem.id}
                        href={subItem.path}
                        className={`sub-menu-item-container ${pathname === subItem.path.split('?')[0] ? "selected" : ""}`}
                      >
                        <h3 className="text">{subItem.value}</h3>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          } else {
            // Render a Link for direct menu items
            return (
              <Link
                key={item.id}
                href={item.path!}
                className={`menu-item-container ${isParentActive ? "selected" : ""}`}
              >
                <div className="menu-item">
                  <FontAwesomeIcon icon={item.icon} className="icon" />
                  <h3 className="text">{item.value}</h3>
                </div>
              </Link>
            );
          }
        })}
      </div>
    </nav>
  );
};

export default AdminSidebar;
