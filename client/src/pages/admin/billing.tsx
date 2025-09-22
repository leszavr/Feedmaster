import { useQuery } from "@tanstack/react-query";
import { CreditCard, TrendingUp, DollarSign, Users, Download, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/admin/stats-card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function AdminBilling() {
  const { data: billingData, isLoading } = useQuery({
    queryKey: ['/api/admin/billing'],
    select: (data) => data || {
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
        }
      ]
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
    <>
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Биллинг и финансы</h1>
            <p className="text-sm text-muted-foreground">Управление доходами, подписками, чеками</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" data-testid="button-generate-invoice">
              Сгенерировать счёт
            </Button>
            <Button data-testid="button-refresh-billing">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Обновить
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="MRR (месячный доход)"
            value={`₽${stats.mrr?.toLocaleString('ru-RU') || '0'}`}
            icon={TrendingUp}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
            testId="card-mrr"
          />
          
          <StatsCard
            title="ARR (годовой доход)"
            value={`₽${stats.arr?.toLocaleString('ru-RU') || '0'}`}
            icon={DollarSign}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
            testId="card-arr"
          />
          
          <StatsCard
            title="LTV (ценность клиента)"
            value={`₽${stats.ltv?.toLocaleString('ru-RU') || '0'}`}
            icon={Users}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
            testId="card-ltv"
          />
          
          <StatsCard
            title="Churn Rate"
            value={<span className="text-green-600">{stats.churnRate || '0'}%</span>}
            icon={CreditCard}
            iconBgColor="bg-emerald-100"
            iconColor="text-emerald-600"
            testId="card-churn-rate"
          />
        </div>

        {/* Revenue Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Country */}
          <Card>
            <CardHeader>
              <CardTitle>Доход по странам</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByCountry}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
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
              <div className="h-64">
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
            <Button variant="secondary" size="sm" data-testid="button-export-subscriptions">
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
                    <TableRow key={subscription.id} data-testid={`row-subscription-${subscription.id}`}>
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
                            data-testid={`button-extend-${subscription.id}`}
                          >
                            Продлить
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-yellow-700 border-yellow-200 hover:bg-yellow-50"
                            data-testid={`button-refund-${subscription.id}`}
                          >
                            Вернуть
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive/20 hover:bg-destructive/5"
                            data-testid={`button-cancel-${subscription.id}`}
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
    </>
  );
}
