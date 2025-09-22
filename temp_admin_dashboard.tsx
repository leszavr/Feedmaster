import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Users, Crown, TrendingUp, Percent, Bot, AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "@/components/admin/stats-card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#ef4444', '#f97316', '#eab308', '#6b7280'];

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/admin/dashboard'],
    select: (data) => data || {
      stats: {
        totalUsers: 12483,
        activeSubscriptions: { pro: 2301, team: 429 },
        mrr: 1857400,
        churnRate: 3.2,
        botTraffic: 14.7,
        criticalIncidents: 2
      },
      charts: {
        registrations: [
          { date: '1 мая', free: 62, pro: 25, team: 5 },
          { date: '2 мая', free: 59, pro: 30, team: 8 },
          { date: '3 мая', free: 80, pro: 28, team: 6 },
          { date: '4 мая', free: 81, pro: 32, team: 9 },
          { date: '5 мая', free: 56, pro: 29, team: 7 },
          { date: '6 мая', free: 55, pro: 35, team: 10 },
          { date: '7 мая', free: 40, pro: 33, team: 8 }
        ],
        mrrGrowth: [
          { month: 'Апрель', mrr: 1500000 },
          { month: 'Май', mrr: 1730000 },
          { month: 'Июнь', mrr: 1857400 }
        ],
        violations: [
          { name: 'Спам', value: 45 },
          { name: 'Мошенничество', value: 30 },
          { name: 'Авторские права', value: 15 },
          { name: 'Другое', value: 10 }
        ]
      },
      alerts: [
        {
          id: 1,
          type: 'critical',
          message: '3 новых жалобы на бот @fake_news_bot (Tinkoff, Москва)',
          time: '14:30'
        },
        {
          id: 2,
          type: 'warning',
          message: 'Подписка истекает: 5 пользователей (Pro) в течение 7 дней',
          time: '14:25'
        },
        {
          id: 3,
          type: 'success',
          message: 'Новый enterprise-клиент: corp@company.ru (подписка: ₽120 000/год)',
          time: '14:20'
        }
      ]
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
    <>
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Главная панель</h1>
            <p className="text-sm text-muted-foreground">Обзор ключевых метрик платформы</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Последнее обновление: <span>14:30</span>
            </div>
            <Button data-testid="button-refresh">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Обновить
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <StatsCard
            title="Всего пользователей"
            value={stats.totalUsers?.toLocaleString('ru-RU') || '0'}
            icon={Users}
            onClick={() => setLocation('/admin/users')}
            testId="card-total-users"
          />
          
          <StatsCard
            title="Активные подписки"
            value={
              <div>
                <p className="text-lg font-bold">Pro: {stats.activeSubscriptions?.pro?.toLocaleString('ru-RU') || '0'}</p>
                <p className="text-sm text-muted-foreground">Team: {stats.activeSubscriptions?.team?.toLocaleString('ru-RU') || '0'}</p>
              </div>
            }
            icon={Crown}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
            onClick={() => setLocation('/admin/billing')}
            testId="card-active-subscriptions"
          />
          
          <StatsCard
            title="MRR"
            value={`₽${stats.mrr?.toLocaleString('ru-RU') || '0'}`}
            icon={TrendingUp}
            iconBgColor="bg-emerald-100"
            iconColor="text-emerald-600"
            testId="card-mrr"
          />
          
          <StatsCard
            title="Churn Rate"
            value={<span className="text-green-600">{stats.churnRate || '0'}%</span>}
            icon={Percent}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
            testId="card-churn-rate"
          />
          
          <StatsCard
            title="Трафик ботов"
            value={<span className="text-green-600">+{stats.botTraffic || '0'}%</span>}
            subtitle="за неделю"
            icon={Bot}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
            testId="card-bot-traffic"
          />
          
          <StatsCard
            title="Критические инциденты"
            value={<span className="text-destructive">{stats.criticalIncidents || '0'}</span>}
            icon={AlertTriangle}
            iconBgColor="bg-destructive/10"
            iconColor="text-destructive"
            onClick={() => setLocation('/admin/activity?type=incident')}
            testId="card-critical-incidents"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* User Registrations Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Регистрации по дням</CardTitle>
              <Button variant="secondary" size="sm" data-testid="button-export-registrations">
                Экспорт CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts.registrations || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="free" stroke="#75c7c7" name="Free" />
                    <Line type="monotone" dataKey="pro" stroke="#36a2eb" name="Pro" />
                    <Line type="monotone" dataKey="team" stroke="#ff6384" name="Team" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* MRR Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>MRR рост</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.mrrGrowth || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₽${value.toLocaleString('ru-RU')}`, 'MRR']} />
                    <Bar dataKey="mrr" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-green-600 mt-2">+18% к прошлому месяцу</p>
            </CardContent>
          </Card>

          {/* Violations Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Типы нарушений</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.violations || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {(charts.violations || []).map((entry: any, index: number) => (
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

        {/* Recent Activity/Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Срочные уведомления</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert: any) => (
                <div
                  key={alert.id}
                  className={`flex items-start space-x-3 p-4 border rounded-lg ${
                    alert.type === 'critical' 
                      ? 'bg-destructive/5 border-destructive/20'
                      : alert.type === 'warning'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-green-50 border-green-200'
                  }`}
                  data-testid={`alert-${alert.type}-${alert.id}`}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === 'critical' 
                      ? 'bg-destructive'
                      : alert.type === 'warning'
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                  <Button variant="link" size="sm" data-testid={`button-alert-details-${alert.id}`}>
                    Подробнее
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
