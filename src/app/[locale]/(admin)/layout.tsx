"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Users, Settings, DollarSign, BarChart3, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const adminNavigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    name: "Пользователи",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Биллинг",
    href: "/admin/billing",
    icon: DollarSign,
  },
  {
    name: "Система",
    href: "/admin/system",
    icon: BarChart3,
  },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border">
          <div className="p-6">
            <h2 className="text-xl font-bold text-foreground">Admin Panel</h2>
            <p className="text-sm text-muted-foreground">FeedMaster</p>
          </div>
          
          <nav className="px-4 space-y-2">
            {adminNavigation.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </QueryClientProvider>
  );
}