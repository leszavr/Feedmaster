
"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { z } from "zod";

import { LoginForm, loginSchema } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Waves } from "lucide-react";

export default function LoginPage() {
  const t = useTranslations("LoginPage");
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (values: z.infer<typeof loginSchema>) => {
    // In a real app, you'd authenticate the user here.
    // For now, we'll simulate a successful login.
    console.log("Login attempt:", values);

    // Simulate API call
    setTimeout(() => {
      if (values.email === "admin@example.com" && values.password === "password") {
        toast({
          title: t("loginSuccess"),
        });
        router.push("/dashboard");
      } else {
        toast({
          title: t("loginError"),
          variant: "destructive",
        });
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 p-2">
          <div className="bg-primary p-2 rounded-lg">
            <Waves className="w-8 h-8 text-primary-foreground" />
          </div>
          <span className="text-3xl font-semibold">FeedMaster</span>
        </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm onFormSubmit={handleLogin} />
        </CardContent>
      </Card>
    </div>
  );
}
