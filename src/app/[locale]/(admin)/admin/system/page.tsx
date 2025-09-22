"use client";

// @ts-ignore
import { useQuery } from "@tanstack/react-query";
import { Server, Cpu, HardDrive, MemoryStick, Activity, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import StatsCard from "@/components/admin/stats-card";

export default function AdminSystemPage() {
  const { data: systemData, isLoading } = useQuery({
    queryKey: ['/api/admin/system'],
    queryFn: async () => {
      // Mock data for now - will be replaced with actual API
      return {
        performance: {
          cpu: 42,
          ram: { used: 3.2, total: 8 },
          disk: 78,
          uptime: 99.98
        },
        instances: [
          {
            id: "1",
            host: "server.corp.ru",
            version: "v1.4.2",
            status: "active",
            lastCheckin: "14.05.2025 14:20",
            license: "LIC-XXXX-XXXX"
          },
          {
            id: "2",
            host: "85.12.34.56",
            version: "v1.3.1",
            status: "inactive",
            lastCheckin: "14.05.2025 10:10",
            license: "LIC-YYYY-YYYY"
          },
          {
            id: "3",
            host: "backup.company.com",
            version: "v1.4.2",
            status: "active",
            lastCheckin: "14.05.2025 14:18",
            license: "LIC-ZZZZ-ZZZZ"
          }
        ]
      };
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '✅';
      case 'inactive': return '⚠️';
      case 'warning': return '⚠️';
      default: return '⚪';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'inactive': return 'Неактивен';
      case 'warning': return 'Предупреждение';
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

  const performance = systemData?.performance || {
    cpu: 0,
    ram: { used: 0, total: 0 },
    disk: 0,
    uptime: 0
  };
  const instances = systemData?.instances || [];

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Система и мониторинг</h1>
            <p className="text-sm text-muted-foreground">Контроль производительности и self-hosted инсталляций</p>
          </div>
          <Button onClick={() => window.location.reload()}>
            <Activity className="w-4 h-4 mr-2" />
            Обновить статус
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="CPU"
            value={`${performance.cpu}%`}
            subtitle="Нагрузка на процессор"
            icon={Cpu}
            iconBgColor={performance.cpu > 80 ? "bg-red-100" : performance.cpu > 60 ? "bg-yellow-100" : "bg-green-100"}
            iconColor={performance.cpu > 80 ? "text-red-600" : performance.cpu > 60 ? "text-yellow-600" : "text-green-600"}
            testId="stat-cpu"
          />
          <StatsCard
            title="RAM"
            value={`${performance.ram.used}/${performance.ram.total} GB`}
            subtitle="Использование памяти"
            icon={MemoryStick}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
            testId="stat-ram"
          />
          <StatsCard
            title="Диск"
            value={`${performance.disk}%`}
            subtitle="Использование диска"
            icon={HardDrive}
            iconBgColor={performance.disk > 90 ? "bg-red-100" : performance.disk > 75 ? "bg-yellow-100" : "bg-green-100"}
            iconColor={performance.disk > 90 ? "text-red-600" : performance.disk > 75 ? "text-yellow-600" : "text-green-600"}
            testId="stat-disk"
          />
          <StatsCard
            title="Uptime"
            value={`${performance.uptime}%`}
            subtitle="Время работы системы"
            icon={CheckCircle}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
            testId="stat-uptime"
          />
        </div>

        {/* Performance Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cpu className="w-5 h-5" />
                <span>CPU Usage</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Использование</span>
                  <span>{performance.cpu}%</span>
                </div>
                <Progress value={performance.cpu} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {performance.cpu > 80 ? "Высокая нагрузка" : performance.cpu > 60 ? "Средняя нагрузка" : "Нормальная нагрузка"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MemoryStick className="w-5 h-5" />
                <span>Memory Usage</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Использование</span>
                  <span>{performance.ram.used} GB / {performance.ram.total} GB</span>
                </div>
                <Progress value={(performance.ram.used / performance.ram.total) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {((performance.ram.used / performance.ram.total) * 100).toFixed(1)}% от общего объема
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HardDrive className="w-5 h-5" />
                <span>Disk Usage</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Использование</span>
                  <span>{performance.disk}%</span>
                </div>
                <Progress value={performance.disk} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {performance.disk > 90 ? "Критично мало места" : performance.disk > 75 ? "Мало места" : "Достаточно места"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Self-hosted Instances */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="w-5 h-5" />
              <span>Self-hosted инсталляции</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Хост</TableHead>
                    <TableHead>Версия</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Последняя связь</TableHead>
                    <TableHead>Лицензия</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instances.map((instance: any) => (
                    <TableRow key={instance.id}>
                      <TableCell className="font-medium">
                        {instance.host}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {instance.version}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{getStatusIcon(instance.status)}</span>
                          <Badge className={getStatusColor(instance.status)}>
                            {getStatusText(instance.status)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {instance.lastCheckin}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {instance.license}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            Диагностика
                          </Button>
                          <Button variant="outline" size="sm">
                            Логи
                          </Button>
                          {instance.status === 'inactive' && (
                            <Button variant="outline" size="sm" className="text-red-600">
                              Отозвать лицензию
                            </Button>
                          )}
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