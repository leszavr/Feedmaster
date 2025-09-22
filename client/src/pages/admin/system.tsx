import { useQuery } from "@tanstack/react-query";
import { Server, Cpu, HardDrive, MemoryStick, Activity, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import StatsCard from "@/components/admin/stats-card";

export default function AdminSystem() {
  const { data: systemData, isLoading } = useQuery({
    queryKey: ['/api/admin/system'],
    select: (data) => data || {
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
    <>
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Системный мониторинг</h1>
            <p className="text-sm text-muted-foreground">Только для self-hosted версий</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Загрузка CPU"
            value={`${performance.cpu || 0}%`}
            icon={Cpu}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
            testId="card-cpu-usage"
          />
          
          <StatsCard
            title="Использование RAM"
            value={`${performance.ram?.used || 0} / ${performance.ram?.total || 0} GB`}
            icon={MemoryStick}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
            testId="card-ram-usage"
          />
          
          <StatsCard
            title="Дисковое пространство"
            value={`${performance.disk || 0}%`}
            icon={HardDrive}
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-600"
            testId="card-disk-usage"
          />
          
          <StatsCard
            title="Uptime"
            value={`${performance.uptime || 0}%`}
            icon={Activity}
            iconBgColor="bg-emerald-100"
            iconColor="text-emerald-600"
            testId="card-uptime"
          />
        </div>

        {/* Performance Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Загрузка CPU</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Текущая загрузка</span>
                  <span className="font-medium">{performance.cpu || 0}%</span>
                </div>
                <Progress value={performance.cpu || 0} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Память</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Использовано</span>
                  <span className="font-medium">
                    {performance.ram?.used || 0} / {performance.ram?.total || 0} GB
                  </span>
                </div>
                <Progress 
                  value={((performance.ram?.used || 0) / (performance.ram?.total || 1)) * 100} 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Диск</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Использовано</span>
                  <span className="font-medium">{performance.disk || 0}%</span>
                </div>
                <Progress value={performance.disk || 0} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instances Table */}
        <Card>
          <CardHeader>
            <CardTitle>Список инсталляций</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Хост</TableHead>
                    <TableHead>Версия</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Последний чекин</TableHead>
                    <TableHead>Лицензия</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instances.map((instance: any) => (
                    <TableRow key={instance.id} data-testid={`row-instance-${instance.id}`}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Server className="w-4 h-4 text-muted-foreground" />
                          <span>{instance.host}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {instance.version}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(instance.status)}>
                          {getStatusIcon(instance.status)} {getStatusText(instance.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {instance.lastCheckin}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {instance.license}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {instance.status === 'active' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive border-destructive/20 hover:bg-destructive/5"
                              data-testid={`button-revoke-${instance.id}`}
                            >
                              Отозвать
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-700 border-blue-200 hover:bg-blue-50"
                              data-testid={`button-notify-${instance.id}`}
                            >
                              Уведомить
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
    </>
  );
}
