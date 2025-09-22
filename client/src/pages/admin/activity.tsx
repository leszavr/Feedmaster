import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Download, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function AdminActivity() {
  const [filters, setFilters] = useState({
    type: "all",
    user: "",
    date: "",
    level: "all"
  });

  const { data: activityData, isLoading } = useQuery({
    queryKey: ['/api/admin/activity', filters],
    select: (data) => data || {
      events: [
        {
          id: "1",
          time: "14:30",
          type: "ADMIN",
          level: "ERROR",
          message: "user@spammer.com заблокирован (причина: спам)",
          data: { userId: "123", reason: "spam", adminId: "admin1" }
        },
        {
          id: "2",
          time: "14:25",
          type: "BOT",
          level: "WARN",
          message: "@news_spam_bot опубликовал 47 постов за 1 час",
          data: { botId: "bot123", postsCount: 47, timeframe: "1hour" }
        },
        {
          id: "3",
          time: "14:20",
          type: "PAYMENT",
          level: "INFO",
          message: "Подписка продлена (ID: pay_123, сумма: ₽1 900)",
          data: { paymentId: "pay_123", amount: 1900, currency: "RUB" }
        },
        {
          id: "4",
          time: "14:15",
          type: "USER",
          level: "INFO",
          message: "alex@example.com сменил тариф на Pro",
          data: { userId: "user456", newPlan: "pro", previousPlan: "free" }
        },
        {
          id: "5",
          time: "14:10",
          type: "SYSTEM",
          level: "INFO",
          message: "self-hosted instance (IP: 85.12.34.56) проверил лицензию",
          data: { ip: "85.12.34.56", licenseKey: "LIC-XXXX-XXXX", status: "valid" }
        }
      ]
    }
  });

  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'bot': return 'bg-blue-100 text-blue-800';
      case 'payment': return 'bg-green-100 text-green-800';
      case 'user': return 'bg-purple-100 text-purple-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'ERROR': return 'bg-red-500';
      case 'WARN': return 'bg-yellow-500';
      case 'INFO': return 'bg-blue-500';
      default: return 'bg-gray-500';
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

  const events = activityData?.events || [];

  return (
    <>
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Аудит действий</h1>
            <p className="text-sm text-muted-foreground">История всех значимых событий</p>
          </div>
          <Button variant="secondary" data-testid="button-export-activity">
            <Download className="w-4 h-4 mr-2" />
            Экспорт в CSV
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Лента событий</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                <SelectTrigger data-testid="select-type-filter">
                  <SelectValue placeholder="Все типы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все типы</SelectItem>
                  <SelectItem value="user.suspended">user.suspended</SelectItem>
                  <SelectItem value="bot.created">bot.created</SelectItem>
                  <SelectItem value="payment.failed">payment.failed</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по пользователю"
                  className="pl-10"
                  value={filters.user}
                  onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                  data-testid="input-search-user"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-10"
                  value={filters.date}
                  onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                  data-testid="input-date-filter"
                />
              </div>

              <Select value={filters.level} onValueChange={(value) => setFilters({ ...filters, level: value })}>
                <SelectTrigger data-testid="select-level-filter">
                  <SelectValue placeholder="Все уровни" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все уровни</SelectItem>
                  <SelectItem value="info">INFO</SelectItem>
                  <SelectItem value="warn">WARN</SelectItem>
                  <SelectItem value="error">ERROR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Activity Timeline */}
            <div className="space-y-4">
              {events.map((event: any, index: number) => (
                <div key={event.id} className="flex items-start space-x-4 pb-4 border-b border-border last:border-b-0" data-testid={`event-${event.id}`}>
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 ${getLevelColor(event.level)} rounded-full`}></div>
                    {index < events.length - 1 && (
                      <div className="w-px h-full bg-border mt-2 min-h-[2rem]"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium" data-testid={`text-time-${event.id}`}>
                        {event.time}
                      </span>
                      <Badge className={getTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground mb-2" data-testid={`text-message-${event.id}`}>
                      {event.message}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 h-auto text-xs"
                        onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                        data-testid={`button-show-json-${event.id}`}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        {expandedEvent === event.id ? 'Скрыть JSON' : 'Показать JSON'}
                      </Button>
                    </div>
                    {expandedEvent === event.id && (
                      <div className="mt-2 p-3 bg-muted rounded-md">
                        <pre className="text-xs text-muted-foreground whitespace-pre-wrap" data-testid={`json-data-${event.id}`}>
                          {JSON.stringify(event.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
