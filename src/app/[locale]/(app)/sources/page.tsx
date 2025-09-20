
"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SourcesPage() {
  const t = useTranslations("Sources");
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("title")}>
        <Button>
          <PlusCircle />
          {t("addButton")}
        </Button>
      </PageHeader>
      <div className="flex items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">{t("noSources")}</p>
      </div>
    </div>
  );
}
