import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for admin billing
  const data = {
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
      },
      {
        id: "4",
        user: "kate@startup.io",
        plan: "Pro",
        status: "active",
        paymentDate: "12.05.2025",
        amount: 1900,
        method: "ЮMoney"
      },
      {
        id: "5",
        user: "anton@company.ru",
        plan: "Team",
        status: "failed",
        paymentDate: "10.05.2025",
        amount: 4900,
        method: "Карта"
      }
    ]
  };

  return NextResponse.json(data);
}