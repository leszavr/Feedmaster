
"use client";

import { useState } from "react";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { Bot, Rss, Send, CheckCircle2 } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BotForm, botFormSchema } from "@/components/bots/bot-form";
import { AddSourceForm, addSourceFormSchema } from "@/components/sources/add-source-form";
import { useAuth } from "@/contexts/auth-context";

const steps = [
  { id: "welcome", title: "Welcome!", icon: CheckCircle2 },
  { id: "add-bot", title: "Add your first Bot", icon: Bot },
  { id: "add-source", title: "Add a Content Source", icon: Rss },
  { id: "finish", title: "You're all set!", icon: Send },
];

export default function OnboardingPage() {
  const t = useTranslations("Onboarding");
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth(); // Assuming useAuth provides user info

  // Mock bots for the source form dropdown
  const mockBots = [{ id: 'temp-bot', name: 'My First Bot', token: '', channelId: '', status: 'active' as const }];

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  
  const handleFinish = () => {
    // In a real app, you would set the user's onboarding_complete flag to true in the database.
    console.log("Onboarding complete for user:", user?.email);
    router.push('/dashboard');
  }

  const handleBotSubmit = (data: z.infer<typeof botFormSchema>) => {
    console.log("Bot data:", data);
    handleNext();
  };

  const handleSourceSubmit = (data: z.infer<typeof addSourceFormSchema>) => {
    console.log("Source data:", data);
    handleNext();
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <CurrentIcon className="w-6 h-6 text-primary" />
              <CardTitle>{t(`steps.${steps[currentStep].id}.title`)}</CardTitle>
            </div>
            <span className="text-sm text-muted-foreground">{t("step", { current: currentStep + 1, total: steps.length })}</span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent className="min-h-[350px]">
          {steps[currentStep].id === 'welcome' && (
            <div className="text-center space-y-4 py-8">
              <h2 className="text-2xl font-bold">{t("steps.welcome.header")}</h2>
              <p className="text-muted-foreground max-w-md mx-auto">{t("steps.welcome.description")}</p>
              <Button onClick={handleNext}>{t("steps.welcome.cta")}</Button>
            </div>
          )}

          {steps[currentStep].id === 'add-bot' && (
             <div>
                <p className="text-sm text-muted-foreground mb-4">{t("steps.add-bot.description")}</p>
                <BotForm onFormSubmit={handleBotSubmit} submitButtonText={t("nextButton")} />
            </div>
          )}
          
          {steps[currentStep].id === 'add-source' && (
            <div>
                <p className="text-sm text-muted-foreground mb-4">{t("steps.add-source.description")}</p>
                <AddSourceForm bots={mockBots} onFormSubmit={handleSourceSubmit} submitButtonText={t("nextButton")} />
            </div>
          )}

          {steps[currentStep].id === 'finish' && (
            <div className="text-center space-y-4 py-8">
              <h2 className="text-2xl font-bold">{t("steps.finish.header")}</h2>
              <p className="text-muted-foreground max-w-md mx-auto">{t("steps.finish.description")}</p>
              <Button onClick={handleFinish}>{t("steps.finish.cta")}</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
