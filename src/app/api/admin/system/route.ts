import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for admin system monitoring
  const data = {
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

  return NextResponse.json(data);
}