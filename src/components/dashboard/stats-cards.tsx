import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck, Percent, Rss, Bot } from "lucide-react";

export function StatsCards() {
  const stats = [
    {
      title: "Posts Moderated",
      value: "1,250",
      icon: ShieldCheck,
      change: "+15.2% from last month",
    },
    {
      title: "Approval Rate",
      value: "89.5%",
      icon: Percent,
      change: "+2.1% from last month",
    },
    {
      title: "Active Sources",
      value: "12",
      icon: Rss,
      change: "+2 since last week",
    },
    {
      title: "Active Bots",
      value: "3",
      icon: Bot,
      change: "No change",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
