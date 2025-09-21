
"use client";

import { usePathname, Link } from "@/navigation";
import {
  Bot,
  LayoutDashboard,
  Rss,
  ShieldCheck,
  Settings,
  Waves,
  Users,
  CreditCard,
  Puzzle,
  Server,
} from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";

export function AppSidebar() {
  const pathname = usePathname();
  const t = useTranslations("Sidebar");
  const { user } = useAuth();

  const menuItems = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: t("dashboard"),
    },
    {
      href: "/moderation",
      icon: ShieldCheck,
      label: t("moderation"),
    },
    {
      href: "/sources",
      icon: Rss,
      label: t("sources"),
    },
    {
      href: "/bots",
      icon: Bot,
      label: t("bots"),
    },
    {
      href: "/users",
      icon: Users,
      label: t("users"),
    },
    {
      href: "/integrations",
      icon: Puzzle,
      label: t("integrations"),
    },
  ];

  const secondaryMenuItems = [
    {
        href: "/subscription",
        icon: CreditCard,
        label: t("subscription"),
    },
    {
        href: "/system",
        icon: Server,
        label: t("system"),
    }
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <div className="bg-primary p-2 rounded-lg">
            <Waves className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold">FeedMaster</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} className="w-full">
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
         <SidebarSeparator />
         <SidebarGroup>
            <SidebarMenu>
                {secondaryMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <Link href={item.href} className="w-full">
                    <SidebarMenuButton
                        isActive={pathname.startsWith(item.href)}
                        tooltip={item.label}
                    >
                        <item.icon />
                        <span>{item.label}</span>
                    </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarGroup>
          <div className="flex items-center gap-3 p-2">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={user?.photoURL || ''}
                alt={user?.displayName || 'User'}
                data-ai-hint="person portrait"
              />
              <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="font-medium truncate">{user?.displayName || 'User'}</p>
              <p className="text-sm text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
            <Link href="/settings">
              <SidebarMenuButton
                variant="ghost"
                className="ml-auto"
                tooltip={t("settings")}
              >
                <Settings />
              </SidebarMenuButton>
            </Link>
          </div>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
