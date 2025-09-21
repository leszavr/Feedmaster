
"use client";

import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { PrivateRoute } from "@/components/auth/private-route";
import { usePathname } from "next/navigation";


export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Don't render the main app layout for the onboarding page
  if (pathname.includes("/onboarding")) {
    return (
      <PrivateRoute>
        <main>{children}</main>
      </PrivateRoute>
    );
  }

  return (
    <PrivateRoute>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1">
          <Header />
          <main className="p-4 md:p-6">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </PrivateRoute>
  );
}
