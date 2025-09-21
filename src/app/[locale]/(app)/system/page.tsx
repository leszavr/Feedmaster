
import { PageHeader } from "@/components/page-header";
import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Server,
  GitBranch,
  Timer,
  FileText,
  Download,
  RefreshCw,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

async function getSystemData() {
  // Mock data for the system page
  return {
    serviceStatus: "active" as "active" | "error",
    appVersion: "1.2.3",
    lastSourceCheck: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    postsFound: 1240,
    postsPublished: 890,
    logs: [
      {
        level: "INFO",
        timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
        message: "Source 'Habr' checked. Found 3 new posts.",
      },
      {
        level: "INFO",
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        message: "Published post 'Вышел Next.js 15!' to channel '@daily_news_feed'.",
      },
      {
        level: "WARN",
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        message: "Source 'Pavel Durov' returned a 404 error. Skipping.",
      },
      {
        level: "ERROR",
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        message: "Failed to connect to Telegram Bot API. Connection timed out.",
      },
    ],
  };
}

export default async function SystemPage() {
  const t = await getTranslations("System");
  const data = await getSystemData();

  const getBadgeClass = (level: string): string => {
    switch (level) {
      case "ERROR":
        return "bg-destructive text-destructive-foreground";
      case "WARN":
        return "bg-yellow-500 text-black";
      case "INFO":
        return "bg-blue-500 text-white";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("title")} description={t("description")}>
        <Button>
          <RefreshCw className="mr-2" />
          {t("checkForUpdatesButton")}
        </Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("stats.serviceStatus.title")}
            </CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge
                className={cn(
                  data.serviceStatus === "active"
                    ? "bg-green-500"
                    : "bg-destructive"
                )}
              >
                {t(`stats.serviceStatus.${data.serviceStatus}`)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("stats.serviceStatus.description")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("stats.appVersion.title")}
            </CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.appVersion}</div>
            <p className="text-xs text-muted-foreground">
              {t("stats.appVersion.description")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("stats.lastCheck.title")}
            </CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(data.lastSourceCheck).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("stats.lastCheck.description")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("stats.postsProcessed.title")}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.postsPublished} / {data.postsFound}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("stats.postsProcessed.description")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("logs.title")}</CardTitle>
          <CardDescription>{t("logs.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  {t("logs.table.level")}
                </TableHead>
                <TableHead className="w-[180px]">
                  {t("logs.table.timestamp")}
                </TableHead>
                <TableHead>{t("logs.table.message")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.logs.map((log, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Badge
                      className={cn(
                        "w-16 justify-center",
                        getBadgeClass(log.level)
                      )}
                    >
                      {log.level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(log.timestamp), "dd.MM.yy HH:mm:ss")}
                  </TableCell>
                  <TableCell>{log.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button variant="outline">
            <Download className="mr-2" />
            {t("logs.exportButton")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
