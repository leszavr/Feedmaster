
"use client";

import { useTranslations } from "next-intl";
import { z } from "zod";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProfileForm, profileFormSchema } from "@/components/settings/profile-form";
import { PasswordForm, passwordFormSchema } from "@/components/settings/password-form";
import { useToast } from "@/hooks/use-toast";
import { mockUser } from "@/lib/data";

export default function SettingsPage() {
  const t = useTranslations("Settings");
  const { toast } = useToast();

  const handleProfileUpdate = (data: z.infer<typeof profileFormSchema>) => {
    console.log("Profile updated:", data);
    toast({
      title: t("profile.toast.success.title"),
      description: t("profile.toast.success.description"),
    });
  };

  const handlePasswordUpdate = (data: z.infer<typeof passwordFormSchema>) => {
    console.log("Password updated for user.");
    toast({
        title: t("password.toast.success.title"),
        description: t("password.toast.success.description"),
      });
  };


  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("title")} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.title")}</CardTitle>
            <CardDescription>{t("profile.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm
              defaultValues={{ name: mockUser.name, email: mockUser.email }}
              onFormSubmit={handleProfileUpdate}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("password.title")}</CardTitle>
            <CardDescription>{t("password.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordForm onFormSubmit={handlePasswordUpdate} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
