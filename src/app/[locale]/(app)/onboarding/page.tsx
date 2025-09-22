
"use client";

import { useState } from "react";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { Bot, Rss, Send, CheckCircle2, Sparkles, ArrowRight, Users, Zap } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BotForm, botFormSchema } from "@/components/bots/bot-form";
import { AddSourceForm, addSourceFormSchema } from "@/components/sources/add-source-form";
import { useAuth } from "@/contexts/auth-context";

export default function OnboardingPage() {
  const t = useTranslations("Onboarding");
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth(); // Assuming useAuth provides user info

  const steps = [
    { id: "welcome", icon: Sparkles, color: "bg-gradient-to-r from-purple-500 to-pink-500" },
    { id: "add-bot", icon: Bot, color: "bg-gradient-to-r from-blue-500 to-indigo-500" },
    { id: "add-source", icon: Rss, color: "bg-gradient-to-r from-green-500 to-emerald-500" },
    { id: "finish", icon: Send, color: "bg-gradient-to-r from-orange-500 to-red-500" },
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-25 to-indigo-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 -left-32 w-64 h-64 bg-blue-100 rounded-full opacity-30 blur-2xl"></div>
        <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-indigo-100 rounded-full opacity-25 blur-xl"></div>
      </div>

      <div className="flex min-h-screen flex-col items-center justify-center p-4 relative z-10">
        {/* Step Navigation */}
        <div className="w-full max-w-4xl mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                  ${index <= currentStep 
                    ? `${step.color} border-transparent text-white shadow-lg` 
                    : 'bg-white border-gray-200 text-gray-400'
                  }
                `}>
                  <step.icon className="w-5 h-5" />
                  {index < currentStep && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-16 h-1 mx-2 rounded-full transition-all duration-300
                    ${index < currentStep ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            {steps.map((step, index) => (
              <div key={step.id} className="text-center">
                <p className={`text-sm font-medium transition-colors duration-300 ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {t(`steps.${step.id}.title`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-md shadow-2xl border border-white/20">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-between items-center mb-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                {t("step", { current: currentStep + 1, total: steps.length })}
              </Badge>
              <Progress value={progress} className="flex-1 mx-4" />
              <Badge variant="outline" className="border-purple-200">
                {Math.round(progress)}%
              </Badge>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className={`
                p-3 rounded-full ${steps[currentStep].color} shadow-lg
              `}>
                <CurrentIcon className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {t(`steps.${steps[currentStep].id}.title`)}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="min-h-[400px]">
          {steps[currentStep].id === 'welcome' && (
            <div className="text-center space-y-6 py-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {t("steps.welcome.header")}
                </h2>
                <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed">
                  {t("steps.welcome.description")}
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto my-8">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Bot className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Create Bots</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Rss className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Add Sources</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Zap className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Automate</p>
                </div>
              </div>
              
              <Button 
                onClick={handleNext} 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
              >
                {t("steps.welcome.cta")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {steps[currentStep].id === 'add-bot' && (
             <div className="space-y-4">
                <div className="text-center mb-6">
                  <p className="text-gray-600 text-lg">{t("steps.add-bot.description")}</p>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 justify-center text-blue-700">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">Tip: Message @BotFather on Telegram to create your bot</span>
                    </div>
                  </div>
                </div>
                <BotForm onFormSubmit={handleBotSubmit} submitButtonText={t("nextButton")} />
            </div>
          )}
          
          {steps[currentStep].id === 'add-source' && (
            <div className="space-y-4">
                <div className="text-center mb-6">
                  <p className="text-gray-600 text-lg">{t("steps.add-source.description")}</p>
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 justify-center text-green-700">
                      <Rss className="w-4 h-4" />
                      <span className="text-sm font-medium">RSS feeds and public Telegram channels work great!</span>
                    </div>
                  </div>
                </div>
                <AddSourceForm bots={mockBots} onFormSubmit={handleSourceSubmit} submitButtonText={t("nextButton")} />
            </div>
          )}

          {steps[currentStep].id === 'finish' && (
            <div className="text-center space-y-6 py-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {t("steps.finish.header")}
                </h2>
                <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed">
                  {t("steps.finish.description")}
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center justify-center gap-2 text-green-700 mb-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-semibold">What's next?</span>
                </div>
                <p className="text-green-600 text-sm">
                  Check your dashboard to monitor your content streams and moderate posts!
                </p>
              </div>
              
              <Button 
                onClick={handleFinish}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
              >
                {t("steps.finish.cta")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
