import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck, Percent, Rss, Bot } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getBots, getPosts, getSources } from "@/lib/data";

export async function StatsCards() {
  const t = await getTranslations("Dashboard.stats");
  const posts = await getPosts();
  const sources = await getSources();
  const bots = await getBots();

  const moderatedCount = posts.filter(
    (p) => p.status === "approved" || p.status === "rejected"
  ).length;
  const approvedCount = posts.filter((p) => p.status === "approved").length;
  const approvalRate =
    moderatedCount > 0 ? (approvedCount / moderatedCount) * 100 : 0;
  const activeSourcesCount = sources.filter(
    (s) => s.status === "active"
  ).length;
  const activeBotsCount = bots.filter((b) => b.status === "active").length;

  const stats = [
    {
      title: t("moderated"),
      value: moderatedCount.toLocaleString(),
      icon: ShieldCheck,
      change: t("moderated_change"),
    },
    {
      title: t("approval_rate"),
      value: `${approvalRate.toFixed(1)}%`,
      icon: Percent,
      change: t("approval_rate_change"),
    },
    {
      title: t("active_sources"),
      value: activeSourcesCount.toLocaleString(),
      icon: Rss,
      change: t("active_sources_change"),
    },
    {
      title: t("active_bots"),
      value: activeBotsCount.toLocaleString(),
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
