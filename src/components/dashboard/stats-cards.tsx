import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck, Percent, Rss, Bot } from "lucide-react";
import { useTranslations } from "next-intl";

export function StatsCards() {
  const t = useTranslations("Dashboard.stats");
  const stats = [
    {
      title: t("moderated"),
      value: "1,250",
      icon: ShieldCheck,
      change: t("moderated_change"),
    },
    {
      title: t("approval_rate"),
      value: "89.5%",
      icon: Percent,
      change: t("approval_rate_change"),
    },
    {
      title: t("active_sources"),
      value: "12",
      icon: Rss,
      change: t("active_sources_change"),
    },
    {
      title: t("active_bots"),
      value: "3",
      icon: Bot,
      change: t("active_bots_change"),
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