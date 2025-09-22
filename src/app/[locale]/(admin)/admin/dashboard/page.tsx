"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Users, Crown, TrendingUp, Percent, Bot, AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "@/components/admin/stats-card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#ef4444', '#f97316', '#eab308', '#6b7280'];

export default function AdminDashboardPage() {
  const router = useRouter();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/admin/dashboard'],
    queryFn: async () => {
      const response = await fetch('/api/admin/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    totalUsers: 0,
    activeSubscriptions: { pro: 0, team: 0 },
    mrr: 0,
    churnRate: 0,
    botTraffic: 0,
    criticalIncidents: 0
  };
  const charts = dashboardData?.charts || {
    registrations: [],
    mrrGrowth: [],
    violations: []
  };
  const alerts = dashboardData?.alerts || [];

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Панель администратора</h1>
            <p className="text-sm text-muted-foreground">Управление платформой FeedMaster</p>
          </div>
          <Button onClick={() => window.location.reload()}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Обновить
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <StatsCard
            title="Всего пользователей"
            value={stats.totalUsers.toLocaleString('ru-RU')}
            subtitle="Зарегистрированные аккаунты"
            icon={Users}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
            onClick={() => router.push('/admin/users')}
            testId="stat-total-users"
          />
          <StatsCard
            title="Pro подписки"
            value={stats.activeSubscriptions.pro.toLocaleString('ru-RU')}
            subtitle="Активные Pro аккаунты"
            icon={Crown}
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-600"
            onClick={() => router.push('/admin/billing')}
            testId="stat-pro-subscriptions"
          />
          <StatsCard
            title="Team подписки"
            value={stats.activeSubscriptions.team.toLocaleString('ru-RU')}
            subtitle="Активные Team аккаунты"
            icon={Users}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
            onClick={() => router.push('/admin/billing')}
            testId="stat-team-subscriptions"
          />
          <StatsCard
            title="MRR"
            value={`₽${stats.mrr.toLocaleString('ru-RU')}`}
            subtitle="Месячный регулярный доход"
            icon={TrendingUp}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
            onClick={() => router.push('/admin/billing')}
            testId="stat-mrr"
          />
          <StatsCard
            title="Churn Rate"
            value={`${stats.churnRate}%`}
            subtitle="Отток пользователей"
            icon={Percent}
            iconBgColor="bg-orange-100"
            iconColor="text-orange-600"
            testId="stat-churn-rate"
          />
          <StatsCard
            title="Критичные инциденты"
            value={stats.criticalIncidents}
            subtitle="Требуют немедленного внимания"
            icon={AlertTriangle}
            iconBgColor="bg-red-100"
            iconColor="text-red-600"
            onClick={() => router.push('/admin/system')}
            testId="stat-critical-incidents"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Registration Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Регистрации по дням</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.registrations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="free" stackId="a" fill="#e5e7eb" name="Free" />
                    <Bar dataKey="pro" stackId="a" fill="#3b82f6" name="Pro" />
                    <Bar dataKey="team" stackId="a" fill="#8b5cf6" name="Team" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* MRR Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Рост MRR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts.mrrGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₽${value.toLocaleString('ru-RU')}`, 'MRR']} />
                    <Line type="monotone" dataKey="mrr" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts and Violations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Последние уведомления</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert: any) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.type === 'critical'
                        ? 'bg-red-50 border-red-500'
                        : alert.type === 'warning'
                        ? 'bg-yellow-50 border-yellow-500'
                        : 'bg-green-50 border-green-500'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-gray-700">{alert.message}</p>
                      <span className="text-xs text-gray-500">{alert.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Violations Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Нарушения по типам</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.violations}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {charts.violations.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}