
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { getSources } from "@/lib/data";
import { SourcesTable } from "@/components/sources/sources-table";
import { AddSourceForm } from "@/components/sources/add-source-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Source } from "@/lib/types";

export default function SourcesPage() {
  const t = useTranslations("Sources");
  const [sources, setSources] = useState<Source[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Note: In a real app, this would be a server-side fetch.
  // We're using a client-side effect to simulate data loading for now.
  useState(() => {
    async function loadSources() {
      const fetchedSources = await getSources();
      setSources(fetchedSources);
    }
    loadSources();
  });

  const handleSourceAdded = (newSourceData: Omit<Source, "id" | "lastRun" | "status">) => {
    const sourceToAdd: Source = {
      ...newSourceData,
      id: `source-${sources.length + 1}`,
      status: 'active',
      lastRun: new Date(),
    }
    console.log("New source added (mock):", sourceToAdd);
    setSources(prev => [...prev, sourceToAdd]);
    setIsDialogOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("title")}>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle />
              {t("addButton")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>{t("addDialog.title")}</DialogTitle>
            </DialogHeader>
            <AddSourceForm onFormSubmit={handleSourceAdded} />
          </DialogContent>
        </Dialog>
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
