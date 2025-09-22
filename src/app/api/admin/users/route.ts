import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for admin users
  const data = {
    users: [
      {
        id: "1",
        name: "Алексей К.",
        email: "alex@example.com",
        role: "admin",
        plan: "pro",
        status: "suspended",
        lastLogin: "14.05.2025, 13:20",
        bots: { current: 3, limit: 3 },
        complaints: 12,
        avatar: "А"
      },
      {
        id: "2",
        name: "Мария С.",
        email: "maria@example.com",
        role: "user",
        plan: "free",
        status: "active",
        lastLogin: "15.05.2025, 09:15",
        bots: { current: 1, limit: 1 },
        complaints: 0,
        avatar: "М"
      },
      {
        id: "3",
        name: "Дмитрий Р.",
        email: "dmitry@example.com",
        role: "moderator",
        plan: "team",
        status: "active",
        lastLogin: "15.05.2025, 11:30",
        bots: { current: 5, limit: 10 },
        complaints: 2,
        avatar: "Д"
      },
      {
        id: "4",
        name: "Екатерина В.",
        email: "kate@corp.com",
        role: "user",
        plan: "enterprise",
        status: "active",
        lastLogin: "15.05.2025, 14:45",
        bots: { current: 15, limit: 50 },
        complaints: 0,
        avatar: "Е"
      },
      {
        id: "5",
        name: "Антон Л.",
        email: "anton@startup.io",
        role: "user",
        plan: "pro",
        status: "active",
        lastLogin: "15.05.2025, 12:20",
        bots: { current: 2, limit: 3 },
        complaints: 1,
        avatar: "А"
      }
    ],
    total: 12483
  };

  return NextResponse.json(data);
}