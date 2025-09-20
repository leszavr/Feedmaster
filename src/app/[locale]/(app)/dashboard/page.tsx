import { PageHeader } from "@/components/page-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { PostsChart } from "@/components/dashboard/posts-chart";
import { RecentActivities } from "@/components/dashboard/recent-activities";
import { getBots, getPosts, getSources } from "@/lib/data";
import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("title")} />
      <StatsCards />
      <div className="grid gap-6 lg:grid-cols-2">
        <PostsChart />
        <RecentActivities />
      </div>
    </div>
  );
}
