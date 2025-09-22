"use client";

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

export default function AdminUsersPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    plan: "all",
    status: "all"
  });

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['/api/admin/users', filters],
    queryFn: async () => {
      // Mock data for now - will be replaced with actual API
      return {
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
          },
          {
            id: "4",
            name: "Екатерина В.",
            email: "kate@corp.com",
            role: "user",
            plan: "enterprise",
            status: "active",
            lastLogin: "15.05.2025, 14:45",
            bots: { current: 15, limit: 50 },
            complaints: 0,
            avatar: "Е"
          },
          {
            id: "5",
            name: "Антон Л.",
            email: "anton@startup.io",
            role: "user",
            plan: "pro",
            status: "active",
            lastLogin: "15.05.2025, 12:20",
            bots: { current: 2, limit: 3 },
            complaints: 1,
            avatar: "А"
          }
        ],
        total: 12483
      };
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
      case 'banned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Админ';
      case 'moderator': return 'Модератор';
      default: return 'Пользователь';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'suspended': return 'Заблокирован';
      case 'banned': return 'Забанен';
      default: return 'Неизвестно';
    }
  };

  const getPlanText = (plan: string) => {
    switch (plan) {
      case 'free': return 'Free';
      case 'pro': return 'Pro';
      case 'team': return 'Team';
      case 'enterprise': return 'Enterprise';
      default: return plan;
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const users = usersData?.users || [];
  const total = usersData?.total || 0;

  const filteredUsers = users.filter((user: any) => {
    if (filters.search && !user.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !user.email.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.role !== 'all' && user.role !== filters.role) return false;
    if (filters.plan !== 'all' && user.plan !== filters.plan) return false;
    if (filters.status !== 'all' && user.status !== filters.status) return false;
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Управление пользователями</h1>
            <p className="text-sm text-muted-foreground">
              Всего пользователей: {total.toLocaleString('ru-RU')}
            </p>
          </div>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Экспорт CSV
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по имени или email"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
              <Select value={filters.role} onValueChange={(value) => setFilters({ ...filters, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все роли</SelectItem>
                  <SelectItem value="admin">Администратор</SelectItem>
                  <SelectItem value="moderator">Модератор</SelectItem>
                  <SelectItem value="user">Пользователь</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.plan} onValueChange={(value) => setFilters({ ...filters, plan: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Тариф" />
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
                <SelectTrigger>
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="active">Активен</SelectItem>
                  <SelectItem value="suspended">Заблокирован</SelectItem>
                  <SelectItem value="banned">Забанен</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Пользователи ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead>Тариф</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Боты</TableHead>
                    <TableHead>Жалобы</TableHead>
                    <TableHead>Последний вход</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {getRoleText(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getPlanText(user.plan)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {getStatusText(user.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            {user.bots.current} / {user.bots.limit}
                          </div>
                          <Progress 
                            value={(user.bots.current / user.bots.limit) * 100} 
                            className="h-1"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={user.complaints > 5 ? 'text-red-600 font-medium' : ''}>
                          {user.complaints}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        {user.lastLogin}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                              Подробности
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Изменить тариф
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Отправить сообщение
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              {user.status === 'suspended' ? 'Разблокировать' : 'Заблокировать'}
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
    </div>
  );
}