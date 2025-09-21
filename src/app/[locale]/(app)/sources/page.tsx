
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { getSources, getBots } from "@/lib/data";
import { SourcesTable } from "@/components/sources/sources-table";
import { AddSourceForm } from "@/components/sources/add-source-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Source, Bot } from "@/lib/types";
import { z } from "zod";
import { addSourceFormSchema } from "@/components/sources/add-source-form";

export default function SourcesPage() {
  const t = useTranslations("Sources");
  const tDialog = useTranslations("Sources.addDialog");

  const [sources, setSources] = useState<Source[]>([]);
  const [bots, setBots] = useState<Bot[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<Source | null>(null);
  const [deletingSource, setDeletingSource] = useState<Source | null>(null);

  useEffect(() => {
    async function loadData() {
      const [fetchedSources, fetchedBots] = await Promise.all([
        getSources(),
        getBots(),
      ]);
      setSources(fetchedSources);
      setBots(fetchedBots);
    }
    loadData();
  }, []);

  const handleAddSource = (newSourceData: z.infer<typeof addSourceFormSchema>) => {
    const sourceToAdd: Source = {
      ...newSourceData,
      id: `source-${sources.length + 1}`,
      status: "active",
      lastRun: new Date(),
      keywords: newSourceData.keywords || "",
      blacklist: newSourceData.blacklist || "",
    };
    setSources((prev) => [...prev, sourceToAdd]);
    setIsAddDialogOpen(false);
  };

  const handleEditSource = (
    updatedSourceData: z.infer<typeof addSourceFormSchema>
  ) => {
    if (!editingSource) return;
    setSources((prev) =>
      prev.map((s) =>
        s.id === editingSource.id ? { ...s, ...updatedSourceData } : s
      )
    );
    setEditingSource(null);
  };

  const handleDeleteSource = () => {
    if (!deletingSource) return;
    setSources((prev) => prev.filter((s) => s.id !== deletingSource.id));
    setDeletingSource(null);
  };

  const isEditDialogOpen = !!editingSource;
  const onEditOpenChange = (open: boolean) => {
    if (!open) {
      setEditingSource(null);
    }
  }

  const isDeleteDialogOpen = !!deletingSource;
  const onDeleteOpenChange = (open: boolean) => {
    if (!open) {
      setDeletingSource(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("title")}>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
            <AddSourceForm onFormSubmit={handleAddSource} bots={bots} />
          </DialogContent>
        </Dialog>
      </PageHeader>
      {sources.length > 0 ? (
        <>
          <SourcesTable
            sources={sources}
            bots={bots}
            onEdit={setEditingSource}
            onDelete={setDeletingSource}
          />
          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={onEditOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>{t("editDialog.title")}</DialogTitle>
              </DialogHeader>
              {editingSource && (
                <AddSourceForm
                  onFormSubmit={handleEditSource}
                  defaultValues={editingSource}
                  submitButtonText={t("editDialog.submitButton")}
                  bots={bots}
                />
              )}
            </DialogContent>
          </Dialog>
          {/* Delete Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={onDeleteOpenChange}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("deleteDialog.description", { name: deletingSource?.name })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeletingSource(null)}>
                  {t("deleteDialog.cancelButton")}
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteSource}>
                  {t("deleteDialog.confirmButton")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <div className="flex items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">{t("noSources")}</p>
        </div>
      )}
    </div>
  );
}
