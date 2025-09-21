
import { PageHeader } from "@/components/page-header";
import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function IntegrationsPage() {
  const t = await getTranslations("Integrations");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("title")} description={t("description")} />

      <Card>
        <CardHeader>
          <CardTitle>{t("webhooks.title")}</CardTitle>
          <CardDescription>{t("webhooks.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">{t("webhooks.placeholder")}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled>{t("webhooks.addButton")}</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("services.title")}</CardTitle>
          <CardDescription>{t("services.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">{t("services.placeholder")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
