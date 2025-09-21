
"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { z } from "zod";
import { useEffect } from "react";

import { LoginForm, loginSchema } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Waves } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  const t = useTranslations("LoginPage");
  const router = useRouter();
  const { user } = useAuth();

  // If user is already logged in (which they will be with mocks), redirect
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);


  const handleLogin = (values: z.infer<typeof loginSchema>) => {
    // Mock login is handled by AuthProvider, just redirect.
    router.push("/dashboard");
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
          <CardDescription>{"Authentication is currently mocked. Click below to continue."}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm onFormSubmit={handleLogin} />
        </CardContent>
      </Card>
    </div>
  );
}
