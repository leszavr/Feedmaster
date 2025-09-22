import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Clock, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminSupport() {
  const { data: supportData, isLoading } = useQuery({
    queryKey: ['/api/admin/support'],
    select: (data) => data || {
      tickets: [
        {
          id: "1",
          subject: "Не работает СБП",
          sender: "user@example.com",
          priority: "high",
          status: "new",
          date: "14.05",
          assignedTo: null
        },
        {
          id: "2",
          subject: "Обжалование блокировки",
          sender: "spammer@example.com",
          priority: "medium",
          status: "in_progress",
          date: "14.04",
          assignedTo: "support@feedmaster.ru"
        },
        {
          id: "3",
          subject: "Вопрос по тарифам",
          sender: "client@company.ru",
          priority: "low",
          status: "resolved",
          date: "13.05",
          assignedTo: "support@feedmaster.ru"
        },
        {
          id: "4",
          subject: "Проблема с API",
          sender: "developer@startup.com",
          priority: "high",
          status: "new",
          date: "15.05",
          assignedTo: null
        }
      ],
      stats: {
        total: 47,
        new: 8,
        inProgress: 15,
        resolved: 24
      }
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'resolved': return 'bg-gray-100 text-gray-800';
      case 'closed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Неизвестно';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Новый';
      case 'in_progress': return 'В работе';
      case 'resolved': return 'Решён';
      case 'closed': return 'Закрыт';
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

  const tickets = supportData?.tickets || [];
  const stats = supportData?.stats || {
    total: 0,
    new: 0,
    inProgress: 0,
    resolved: 0
  };

  return (
    <>
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Поддержка пользователей</h1>
            <p className="text-sm text-muted-foreground">Система тикетов и обращений</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Support Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Всего тикетов</p>
                  <p className="text-2xl font-bold" data-testid="text-total-tickets">{stats.total || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Новые</p>
                  <p className="text-2xl font-bold text-blue-600" data-testid="text-new-tickets">{stats.new || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">В работе</p>
                  <p className="text-2xl font-bold text-green-600" data-testid="text-progress-tickets">{stats.inProgress || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Решённые</p>
                  <p className="text-2xl font-bold text-gray-600" data-testid="text-resolved-tickets">{stats.resolved || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Tickets Table */}
        <Card>
          <CardHeader>
            <CardTitle>Тикеты поддержки</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Тема</TableHead>
                    <TableHead>Отправитель</TableHead>
                    <TableHead>Приоритет</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Назначен</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket: any) => (
                    <TableRow key={ticket.id} data-testid={`row-ticket-${ticket.id}`}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4 text-muted-foreground" />
                          <span>{ticket.subject}</span>
                        </div>
                      </TableCell>
                      <TableCell>{ticket.sender}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {getPriorityText(ticket.priority)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(ticket.status)}>
                          {getStatusText(ticket.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {ticket.date}
                      </TableCell>
                      <TableCell className="text-sm">
                        {ticket.assignedTo || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-700 border-blue-200 hover:bg-blue-50"
                            data-testid={`button-open-${ticket.id}`}
                          >
                            Открыть
                          </Button>
                          {ticket.status === 'new' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-700 border-green-200 hover:bg-green-50"
                              data-testid={`button-assign-${ticket.id}`}
                            >
                              Назначить
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
