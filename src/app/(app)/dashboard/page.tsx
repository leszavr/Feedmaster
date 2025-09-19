import { PageHeader } from "@/components/page-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { PostsChart } from "@/components/dashboard/posts-chart";
import { RecentActivities } from "@/components/dashboard/recent-activities";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" />
      <StatsCards />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <PostsChart />
        </div>
        <div className="lg:col-span-2">
          <RecentActivities />
        </div>
      </div>
    </div>
  );
}
