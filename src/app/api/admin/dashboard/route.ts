import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for admin dashboard
  const data = {
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
  };

  return NextResponse.json(data);
}