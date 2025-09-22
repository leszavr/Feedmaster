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
