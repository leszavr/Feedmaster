
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
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
import { getBots } from "@/lib/data";
import type { Bot } from "@/lib/types";
import { BotsTable } from "@/components/bots/bots-table";
import { BotForm, botFormSchema } from "@/components/bots/bot-form";

export default function BotsPage() {
  const t = useTranslations("Bots");
  const [bots, setBots] = useState<Bot[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<Bot | null>(null);
  const [deletingBot, setDeletingBot] = useState<Bot | null>(null);

  useEffect(() => {
    async function loadBots() {
      const fetchedBots = await getBots();
      setBots(fetchedBots);
    }
    loadBots();
  }, []);

  const handleAddBot = (newBotData: z.infer<typeof botFormSchema>) => {
    const botToAdd: Bot = {
      ...newBotData,
      id: `bot-${bots.length + 1}`,
    };
    setBots((prev) => [...prev, botToAdd]);
    setIsAddDialogOpen(false);
  };

  const handleEditBot = (updatedBotData: z.infer<typeof botFormSchema>) => {
    if (!editingBot) return;
    setBots((prev) =>
      prev.map((b) =>
        b.id === editingBot.id ? { ...b, ...updatedBotData } : b
      )
    );
    setEditingBot(null);
  };

  const handleDeleteBot = () => {
    if (!deletingBot) return;
    setBots((prev) => prev.filter((b) => b.id !== deletingBot.id));
    setDeletingBot(null);
  };

  const isEditDialogOpen = !!editingBot;
  const onEditOpenChange = (open: boolean) => {
    if (!open) setEditingBot(null);
  };

  const isDeleteDialogOpen = !!deletingBot;
  const onDeleteOpenChange = (open: boolean) => {
    if (!open) setDeletingBot(null);
  };
  
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
            <BotForm onFormSubmit={handleAddBot} />
          </DialogContent>
        </Dialog>
      </PageHeader>
      {bots.length > 0 ? (
        <>
          <BotsTable
            bots={bots}
            onEdit={setEditingBot}
            onDelete={setDeletingBot}
          />
          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={onEditOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>{t("editDialog.title")}</DialogTitle>
              </DialogHeader>
              {editingBot && (
                <BotForm
                  onFormSubmit={handleEditBot}
                  defaultValues={editingBot}
                  submitButtonText={t("editDialog.submitButton")}
                />
              )}
            </DialogContent>
          </Dialog>
          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={onDeleteOpenChange}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("deleteDialog.description", { name: deletingBot?.name })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeletingBot(null)}>
                  {t("deleteDialog.cancelButton")}
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteBot}>
                  {t("deleteDialog.confirmButton")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <div className="flex items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">{t("noBots")}</p>
        </div>
      )}
    </div>
  );
}
