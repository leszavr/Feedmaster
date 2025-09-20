
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

import { getUsers } from "@/lib/data";
import type { User } from "@/lib/types";
import { UsersTable } from "@/components/users/users-table";
import { UserForm, userFormSchema } from "@/components/users/user-form";

export default function UsersPage() {
  const t = useTranslations("Users");
  const [users, setUsers] = useState<User[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUsers() {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    }
    loadUsers();
  }, []);

  const handleAddUser = (newUserData: z.infer<typeof userFormSchema>) => {
    const userToAdd: User = {
      ...newUserData,
      id: `user-${users.length + 1}`,
      avatar: `https://picsum.photos/seed/avatar-${users.length + 1}/40/40`,
    };
    setUsers((prev) => [...prev, userToAdd]);
    setIsAddDialogOpen(false);
  };

  const handleEditUser = (updatedUserData: z.infer<typeof userFormSchema>) => {
    if (!editingUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id ? { ...u, ...updatedUserData } : u
      )
    );
    setEditingUser(null);
  };

  const handleDeleteUser = () => {
    if (!deletingUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
    setDeletingUser(null);
  };

  const isEditDialogOpen = !!editingUser;
  const onEditOpenChange = (open: boolean) => {
    if (!open) setEditingUser(null);
  };



  const isDeleteDialogOpen = !!deletingUser;
  const onDeleteOpenChange = (open: boolean) => {
    if (!open) setDeletingUser(null);
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
            <UserForm onFormSubmit={handleAddUser} />
          </DialogContent>
        </Dialog>
      </PageHeader>
      {users.length > 0 ? (
        <>
          <UsersTable
            users={users}
            onEdit={setEditingUser}
            onDelete={setDeletingUser}
          />
          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={onEditOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>{t("editDialog.title")}</DialogTitle>
              </DialogHeader>
              {editingUser && (
                <UserForm
                  onFormSubmit={handleEditUser}
                  defaultValues={editingUser}
                  submitButtonText={t("editDialog.submitButton")}
                  isEditing
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
                  {t("deleteDialog.description", { name: deletingUser?.name })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeletingUser(null)}>
                  {t("deleteDialog.cancelButton")}
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteUser}>
                  {t("deleteDialog.confirmButton")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <div className="flex items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">{t("noUsers")}</p>
        </div>
      )}
    </div>
  );
}
