import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Download, User, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import UserDetailModal from "@/components/admin/user-detail-modal";

export default function AdminUsers() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    plan: "all",
    status: "all"
  });

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['/api/admin/users', filters],
    select: (data) => data || {
      users: [
        {
          id: "1",
          name: "Алексей К.",
          email: "alex@example.com",
          role: "admin",
          plan: "pro",
          status: "suspended",
          lastLogin: "14.05.2025, 13:20",
          bots: { current: 3, limit: 3 },
          complaints: 12,
          avatar: "А"
        },
        {
          id: "2",
          name: "Мария С.",
          email: "maria@example.com",
          role: "user",
          plan: "free",
          status: "active",
          lastLogin: "15.05.2025, 09:15",
          bots: { current: 1, limit: 1 },
          complaints: 0,
          avatar: "М"
        },
        {
          id: "3",
          name: "Дмитрий Р.",
          email: "dmitry@example.com",
          role: "moderator",
          plan: "team",
          status: "active",
          lastLogin: "15.05.2025, 11:30",
          bots: { current: 5, limit: 10 },
          complaints: 2,
          avatar: "Д"
        }
      ],
      total: 12483
    }
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'moderator': return 'bg-gray-100 text-gray-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'suspended': return '⚠️';
      case 'blocked': return '❌';
      default: return '✅';
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const users = usersData?.users || [];

  return (
    <>
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Управление пользователями</h1>
            <p className="text-sm text-muted-foreground">Всего пользователей: {usersData?.total?.toLocaleString('ru-RU') || '0'}</p>
          </div>
          <Button variant="secondary" data-testid="button-export-users">
            <Download className="w-4 h-4 mr-2" />
            Экспорт CSV
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Пользователи</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по email, имени, ID"
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  data-testid="input-search-users"
                />
              </div>
              
              <Select value={filters.role} onValueChange={(value) => setFilters({ ...filters, role: value })}>
                <SelectTrigger data-testid="select-role-filter">
                  <SelectValue placeholder="Все роли" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все роли</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.plan} onValueChange={(value) => setFilters({ ...filters, plan: value })}>
                <SelectTrigger data-testid="select-plan-filter">
                  <SelectValue placeholder="Все тарифы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все тарифы</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger data-testid="select-status-filter">
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Имя</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead>Тариф</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Последний вход</TableHead>
                    <TableHead>Боты</TableHead>
                    <TableHead>Жалобы</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: any) => (
                    <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role === 'admin' ? 'Администратор' : 
                           user.role === 'moderator' ? 'Модератор' : 'Пользователь'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-medium capitalize">{user.plan}</span>
                          <p className="text-xs text-muted-foreground">до 2025-12-31</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {getStatusIcon(user.status)} {
                            user.status === 'active' ? 'Активен' :
                            user.status === 'suspended' ? 'Приостановлен' : 'Заблокирован'
                          }
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.lastLogin}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{user.bots.current}/{user.bots.limit}</span>
                          <div className="w-12">
                            <Progress 
                              value={(user.bots.current / user.bots.limit) * 100} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="link"
                          className="p-0 text-destructive hover:text-destructive/80"
                          data-testid={`button-complaints-${user.id}`}
                        >
                          {user.complaints}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" data-testid={`button-actions-${user.id}`}>
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => setSelectedUser(user)}
                              data-testid={`button-details-${user.id}`}
                            >
                              Подробнее
                            </DropdownMenuItem>
                            <DropdownMenuItem data-testid={`button-suspend-${user.id}`}>
                              Приостановить
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              data-testid={`button-block-${user.id}`}
                            >
                              Заблокировать
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
}
