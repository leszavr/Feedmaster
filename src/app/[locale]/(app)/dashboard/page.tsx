import { PageHeader } from "@/components/page-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { PostsChart } from "@/components/dashboard/posts-chart";
import { RecentActivities } from "@/components/dashboard/recent-activities";
import { getPosts } from "@/lib/data";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const t = await getTranslations("Dashboard");
  const posts = await getPosts();

  // Prepare data for the chart
  const chartData = Array.from({ length: 7 })
    .map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const date = d.toISOString().split("T")[0];
      const dayPosts = posts.filter(
        (p) => new Date(p.fetchedAt).toISOString().split("T")[0] === date
      );
      const approved = dayPosts.filter((p) => p.status === "approved").length;
      const rejected = dayPosts.filter((p) => p.status === "rejected").length;
      return { date, approved, rejected };
    })
    .reverse();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("title")} />
      <StatsCards />
      <div className="grid gap-6 lg:grid-cols-2">
        <PostsChart data={chartData} />
        <RecentActivities />
      </div>
    </div>
  );
}
