import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { getSources } from "@/lib/data";
import { SourcesTable } from "@/components/sources/sources-table";

export default async function SourcesPage() {
  const t = await getTranslations("Sources");
  const sources = await getSources();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("title")}>
        <Button>
          <PlusCircle />
          {t("addButton")}
        </Button>
      </PageHeader>
      {sources.length > 0 ? (
        <SourcesTable sources={sources} />
      ) : (
        <div className="flex items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">{t("noSources")}</p>
        </div>
      )}
    </div>
  );
}
