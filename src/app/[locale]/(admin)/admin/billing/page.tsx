"use client";

import { useQuery } from "@tanstack/react-query";
import { CreditCard, TrendingUp, DollarSign, Users, Download, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/admin/stats-card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function AdminBillingPage() {
  const { data: billingData, isLoading } = useQuery({
    queryKey: ['/api/admin/billing'],
    queryFn: async () => {
      // Mock data for now - will be replaced with actual API
      return {
        stats: {
          mrr: 1857400,
          arr: 22288800,
          ltv: 45600,
          churnRate: 3.2
        },
        revenueByCountry: [
          { country: 'RU', revenue: 1400000 },
          { country: 'KZ', revenue: 300000 },
          { country: 'BY', revenue: 157400 }
        ],
        subscriptions: [
          {
            id: "1",
            user: "alex@example.com",
            plan: "Pro",
            status: "active",
            paymentDate: "14.05.2025",
            amount: 1900,
            method: "СБП"
          },
          {
            id: "2",
            user: "maria@example.com",
            plan: "Team",
            status: "active",
            paymentDate: "13.05.2025",
            amount: 4900,
            method: "Карта"
          },
          {
            id: "3",
            user: "dmitry@corp.com",
            plan: "Enterprise",
            status: "pending",
            paymentDate: "15.05.2025",
            amount: 12000,
            method: "Банковский перевод"
          },
          {
            id: "4",
            user: "kate@startup.io",
            plan: "Pro",
            status: "active",
            paymentDate: "12.05.2025",
            amount: 1900,
            method: "ЮMoney"
          },
          {
            id: "5",
            user: "anton@company.ru",
            plan: "Team",
            status: "failed",
            paymentDate: "10.05.2025",
            amount: 4900,
            method: "Карта"
          }
        ]
      };
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активна';
      case 'pending': return 'Ожидает';
      case 'failed': return 'Неуспешно';
      case 'cancelled': return 'Отменена';
      default: return 'Неизвестно';
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = billingData?.stats || {
    mrr: 0,
    arr: 0,
    ltv: 0,
    churnRate: 0
  };
  const revenueByCountry = billingData?.revenueByCountry || [];
  const subscriptions = billingData?.subscriptions || [];

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Биллинг и финансы</h1>
            <p className="text-sm text-muted-foreground">Управление доходами, подписками, чеками</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              Сгенерировать счёт
            </Button>
            <Button>
              <RefreshCcw className="w-4 h-4 mr-2" />
              Обновить
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="MRR"
            value={`₽${stats.mrr.toLocaleString('ru-RU')}`}
            subtitle="Месячный регулярный доход"
            icon={TrendingUp}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
            testId="stat-mrr"
          />
          <StatsCard
            title="ARR"
            value={`₽${stats.arr.toLocaleString('ru-RU')}`}
            subtitle="Годовой регулярный доход"
            icon={DollarSign}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
            testId="stat-arr"
          />
          <StatsCard
            title="LTV"
            value={`₽${stats.ltv.toLocaleString('ru-RU')}`}
            subtitle="Пожизненная ценность клиента"
            icon={Users}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
            testId="stat-ltv"
          />
          <StatsCard
            title="Churn Rate"
            value={`${stats.churnRate}%`}
            subtitle="Отток клиентов"
            icon={CreditCard}
            iconBgColor="bg-orange-100"
            iconColor="text-orange-600"
            testId="stat-churn"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Country */}
          <Card>
            <CardHeader>
              <CardTitle>Доходы по странам</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByCountry}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis tickFormatter={(value) => `₽${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value) => [`₽${value.toLocaleString('ru-RU')}`, 'Доход']} />
                    <Bar dataKey="revenue" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Распределение доходов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueByCountry}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                      label={({ country, value }) => `${country}: ₽${value.toLocaleString('ru-RU')}`}
                    >
                      {revenueByCountry.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₽${value.toLocaleString('ru-RU')}`, 'Доход']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscriptions Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Подписки</CardTitle>
            <Button variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Экспорт CSV
            </Button>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Тариф</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата оплаты</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Способ</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((subscription: any) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">
                        {subscription.user}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {subscription.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(subscription.status)}>
                          {getStatusText(subscription.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {subscription.paymentDate}
                      </TableCell>
                      <TableCell className="font-medium">
                        ₽{subscription.amount.toLocaleString('ru-RU')}
                      </TableCell>
                      <TableCell className="text-sm">
                        {subscription.method}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-700 border-blue-200 hover:bg-blue-50"
                          >
                            Продлить
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-yellow-700 border-yellow-200 hover:bg-yellow-50"
                          >
                            Вернуть
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive/20 hover:bg-destructive/5"
                          >
                            Отменить
                          </Button>
                        </div>
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