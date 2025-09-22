import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Bot, Play, Square, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminBots() {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    frequency: "all",
    source: "all"
  });

  const { data: botsData, isLoading } = useQuery({
    queryKey: ['/api/admin/bots', filters],
    select: (data) => data || {
      bots: [
        {
          id: "1",
          name: "@tech_news_daily",
          owner: "alex@example.com",
          channel: "-1001234567890",
          status: "active",
          frequency: "42 поста/час",
          sources: 12,
          lastCheck: "14:25"
        },
        {
          id: "2",
          name: "@crypto_updates",
          owner: "maria@example.com",
          channel: "-1001234567891",
          status: "suspended",
          frequency: "15 постов/час",
          sources: 8,
          lastCheck: "13:45"
        },
        {
          id: "3",
          name: "@news_aggregator",
          owner: "dmitry@example.com",
          channel: "-1001234567892",
          status: "error",
          frequency: "0 постов/час",
          sources: 5,
          lastCheck: "12:10"
        }
      ],
      total: 156
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '✅';
      case 'suspended': return '⚠️';
      case 'error': return '❌';
      default: return '⚪';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'suspended': return 'Приостановлен';
      case 'error': return 'Ошибка';
      default: return 'Неизвестно';
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

  const bots = botsData?.bots || [];

  return (
    <>
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Мониторинг ботов</h1>
            <p className="text-sm text-muted-foreground">Всего ботов: {botsData?.total || '0'}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Боты</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по владельцу (email)"
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  data-testid="input-search-bots"
                />
              </div>
              
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger data-testid="select-status-filter">
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.frequency} onValueChange={(value) => setFilters({ ...filters, frequency: value })}>
                <SelectTrigger data-testid="select-frequency-filter">
                  <SelectValue placeholder="Все частоты" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все частоты</SelectItem>
                  <SelectItem value="high">{'>'}50 постов/час</SelectItem>
                  <SelectItem value="normal">Норма</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.source} onValueChange={(value) => setFilters({ ...filters, source: value })}>
                <SelectTrigger data-testid="select-source-filter">
                  <SelectValue placeholder="Все источники" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все источники</SelectItem>
                  <SelectItem value="telegram">Telegram</SelectItem>
                  <SelectItem value="rss">RSS</SelectItem>
                  <SelectItem value="web">Web</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bots Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Имя бота</TableHead>
                    <TableHead>Владелец</TableHead>
                    <TableHead>Канал</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Частота</TableHead>
                    <TableHead>Источники</TableHead>
                    <TableHead>Последняя проверка</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bots.map((bot: any) => (
                    <TableRow key={bot.id} data-testid={`row-bot-${bot.id}`}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Bot className="w-4 h-4 text-muted-foreground" />
                          <span>{bot.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="link"
                          className="p-0 text-primary hover:text-primary/80"
                          data-testid={`link-owner-${bot.id}`}
                        >
                          {bot.owner}
                        </Button>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {bot.channel}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(bot.status)}>
                          {getStatusIcon(bot.status)} {getStatusText(bot.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {bot.frequency}
                      </TableCell>
                      <TableCell>{bot.sources}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {bot.lastCheck}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {bot.status === 'active' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-yellow-700 border-yellow-200 hover:bg-yellow-50"
                              data-testid={`button-stop-${bot.id}`}
                            >
                              <Square className="w-3 h-3 mr-1" />
                              Остановить
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-700 border-blue-200 hover:bg-blue-50"
                              data-testid={`button-start-${bot.id}`}
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Запустить
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-700 border-blue-200 hover:bg-blue-50"
                            data-testid={`button-restart-${bot.id}`}
                          >
                            Перезапустить
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive/20 hover:bg-destructive/5"
                            data-testid={`button-delete-${bot.id}`}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Удалить
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
