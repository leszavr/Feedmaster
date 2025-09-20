import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

const activities = [
  {
    user: "Alexey",
    action: "approved",
    post: "Introducing the Next-Gen AI Assistant...",
    time: "5m ago",
  },
  {
    user: "System",
    action: "fetched",
    post: "from TechCrunch RSS",
    time: "10m ago",
  },
  {
    user: "Alexey",
    action: "rejected",
    post: "10 Reasons Why Java Is Still...",
    time: "1h ago",
  },
  {
    user: "Admin",
    action: "added_source",
    post: "Hacker News",
    time: "3h ago",
  },
  {
    user: "Admin",
    action: "paused_bot",
    post: "Marketing Bot",
    time: "yesterday",
  },
];

export function RecentActivities() {
  const t = useTranslations("Dashboard.activity");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center gap-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`https://picsum.photos/seed/${activity.user}/40/40`} alt="Avatar" data-ai-hint="person portrait" />
                <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="text-sm font-medium leading-none">
                  <span className="font-semibold">{activity.user}</span>{" "}
                  <Badge
                    variant={
                      activity.action === "approved"
                        ? "default"
                        : activity.action === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                    className="ml-1"
                  >
                    {t(`actions.${activity.action}`)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{activity.post}</p>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
