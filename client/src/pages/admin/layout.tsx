import { ReactNode } from "react";
import AdminSidebar from "@/components/admin/admin-sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // TODO: Add authentication check for 'owner' role
  // For development, this check can be temporarily disabled
  
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
