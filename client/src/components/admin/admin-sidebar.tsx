import { useLocation } from "wouter";
import { Link } from "wouter";
import { 
  Settings, 
  LayoutDashboard, 
  Users, 
  Bot, 
  Activity, 
  CreditCard, 
  Server, 
  Headphones,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const navigation = [
  { name: "Главная панель", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Пользователи", href: "/admin/users", icon: Users },
  { name: "Боты", href: "/admin/bots", icon: Bot },
  { name: "Аудит действий", href: "/admin/activity", icon: Activity },
  { name: "Биллинг", href: "/admin/billing", icon: CreditCard },
  { name: "Система", href: "/admin/system", icon: Server },
  { name: "Поддержка", href: "/admin/support", icon: Headphones },
  { name: "Настройки", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">FeedMaster</h1>
            <p className="text-sm text-muted-foreground">Админ-панель</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href || (item.href === "/admin/dashboard" && location === "/admin");
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                  data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </a>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Admin User Info */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-sm text-primary-foreground font-medium">А</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Администратор</p>
            <p className="text-xs text-muted-foreground">admin@feedmaster.ru</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
