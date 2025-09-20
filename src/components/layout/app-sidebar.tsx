"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  LayoutDashboard,
  Rss,
  ShieldCheck,
  Settings,
  Waves,
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
import { mockUser } from "@/lib/data";

export function AppSidebar() {
  const pathname = usePathname();
  const t = useTranslations('Sidebar');

  const menuItems = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: t('dashboard'),
    },
    {
      href: "/moderation",
      icon: ShieldCheck,
      label: t('moderation'),
    },
    {
      href: "/sources",
      icon: Rss,
      label: t('sources'),
    },
    {
      href: "/bots",
      icon: Bot,
      label: t('bots'),
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <div className="bg-primary p-2 rounded-lg">
            <Waves className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold">TeleMonBot</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname.endsWith(item.href)}
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
                src={mockUser.avatar}
                alt={mockUser.name}
                data-ai-hint="person portrait"
              />
              <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="font-medium truncate">{mockUser.name}</p>
              <p className="text-sm text-muted-foreground truncate">
                {mockUser.email}
              </p>
            </div>
            <Link href="/settings" passHref legacyBehavior>
                <SidebarMenuButton
                  variant="ghost"
                  className="ml-auto"
                  tooltip={t('settings')}
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
