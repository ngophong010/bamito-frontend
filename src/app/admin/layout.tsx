import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';
import AdminLayout from "@/layout/adminLayout/AdminLayout"; // Your main UI shell for the admin
import { getUserSession } from '@/lib/auth/session'; // The new server-side helper
import { ROLES } from '@/config/roles'; // Import your role constants
import "./admin.scss";

// Metadata specific to the admin section
export const metadata = {
  title: {
    template: "%s | Admin Dashboard", // e.g., "Manage Products | Admin Dashboard"
    default: "Admin Dashboard",
  },
  description: "Bamitop E-commerce administration panel.",
  // Tell search engines not to index any admin pages
  robots: {
    index: false,
    follow: false,
  },
};

// The layout is now an async Server Component
export default async function ProtectedAdminLayout({ children }: PropsWithChildren) {
  // --- SERVER-SIDE PROTECTION ---
  const session = await getUserSession();

  // If there's no session OR the user is not an admin, redirect to the login page.
  // This happens on the server before any HTML is sent to the client.
  if (!session || session.role !== ROLES.ADMIN) {
    redirect('/login'); // Redirect to your login page
  }
  
  // If the check passes, render the admin layout and the page content.
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}
