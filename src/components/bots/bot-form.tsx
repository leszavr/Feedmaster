
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Bot, Loader2, Save, CheckCircle2, AlertCircle, Eye, EyeOff, MessageSquare, Zap } from "lucide-react";
import { MessengerPlatform } from "@/lib/adapters";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PasswordInput } from "@/components/password-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export const botFormSchema = z.object({
  name: z.string()
    .min(2, "Имя должно содержать минимум 2 символа.")
    .max(50, "Имя не должно превышать 50 символов.")
    .regex(/^[a-zA-Zа-яА-Я0-9\s_-]+$/, "Имя может содержать только буквы, цифры, пробелы, дефисы и подчеркивания."),
  platform: z.enum([MessengerPlatform.TELEGRAM, MessengerPlatform.MAX]),
  token: z.string().min(10, "Токен обязателен для заполнения."),
  channelId: z.string().min(4, "ID канала должен содержать минимум 4 символа."),
  status: z.enum(["active", "inactive", "error", "stopped"]),
}).refine((data) => {
  // Валидация токена в зависимости от платформы
  if (data.platform === MessengerPlatform.TELEGRAM) {
    const telegramTokenRegex = /^\d+:[a-zA-Z0-9_-]+$/;
    if (!telegramTokenRegex.test(data.token)) {
      return false;
    }
  } else if (data.platform === MessengerPlatform.MAX) {
    // MAX токен должен быть длиннее 20 символов и содержать только допустимые символы
    if (data.token.length < 20 || !/^[a-zA-Z0-9._-]+$/.test(data.token)) {
      return false;
    }
  }
  return true;
}, {
  message: "Неверный формат токена для выбранной платформы.",
  path: ["token"],
}).refine((data) => {
  // Валидация ID канала в зависимости от платформы
  if (data.platform === MessengerPlatform.TELEGRAM) {
    const telegramChannelRegex = /^@[a-zA-Z][a-zA-Z0-9_]{4,31}$|^-\d+$/;
    if (!telegramChannelRegex.test(data.channelId)) {
      return false;
    }
  } else if (data.platform === MessengerPlatform.MAX) {
    // MAX канал обычно числовой ID
    const maxChannelRegex = /^\d+$/;
    if (!maxChannelRegex.test(data.channelId)) {
      return false;
    }
  }
  return true;
}, {
  message: "Неверный формат ID канала для выбранной платформы.",
  path: ["channelId"],
});

type BotFormProps = {
  onFormSubmit: (data: z.infer<typeof botFormSchema>) => Promise<void> | void;
  defaultValues?: Partial<z.infer<typeof botFormSchema>>;
  submitButtonText?: string;
  isEdit?: boolean;
  autoSave?: boolean;
};

export function BotForm({
  onFormSubmit,
  defaultValues,
  submitButtonText,
  isEdit = false,
  autoSave = true,
}: BotFormProps) {
  const t = useTranslations("Bots.addDialog");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  
  const form = useForm<z.infer<typeof botFormSchema>>({
    resolver: zodResolver(botFormSchema),
    mode: "onChange", // Валидация при изменении
    defaultValues: defaultValues || {
      name: "",
      platform: MessengerPlatform.TELEGRAM,
      token: "",
      channelId: "",
      status: "active",
    },
  });

  const formData = form.watch();
  
  // Auto-save draft
  useEffect(() => {
    if (!autoSave) return;
    
    const timeoutId = setTimeout(() => {
      const draftKey = isEdit ? `bot-edit-draft-${defaultValues?.name}` : 'bot-create-draft';
      const hasData = formData.name || formData.token || formData.channelId;
      
      if (hasData) {
        localStorage.setItem(draftKey, JSON.stringify(formData));
        setIsDraftSaved(true);
        setTimeout(() => setIsDraftSaved(false), 2000);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [formData, autoSave, isEdit, defaultValues?.name]);

  // Load draft on mount
  useEffect(() => {
    if (!autoSave || isEdit) return;
    
    const draftKey = 'bot-create-draft';
    const savedDraft = localStorage.getItem(draftKey);
    
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        form.reset(draft);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, [autoSave, isEdit, form]);

  const handleSubmit = async (data: z.infer<typeof botFormSchema>) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await onFormSubmit(data);
      setSubmitSuccess(true);
      
      // Clear draft on successful submit
      if (autoSave && !isEdit) {
        localStorage.removeItem('bot-create-draft');
      }
      
      // Reset form if not editing
      if (!isEdit) {
        form.reset();
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Произошла ошибка при сохранении бота');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateToken = async (token: string) => {
    if (!token || token.length < 10) return;
    
    setIsValidating(true);
    // Здесь можно добавить реальную валидацию токена через Telegram API
    // Пока что просто имитируем задержку
    setTimeout(() => {
      setIsValidating(false);
    }, 500);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Success/Error Alerts */}
        {submitSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Бот успешно {isEdit ? 'обновлен' : 'создан'}!
            </AlertDescription>
          </Alert>
        )}
        
        {submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {/* Auto-save indicator */}
        {isDraftSaved && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Save className="h-4 w-4" />
            Черновик сохранен
          </div>
        )}

        {/* Bot Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                {t("nameLabel")}
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder={t("namePlaceholder")} 
                  {...field}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </FormControl>
              <FormDescription>
                Дружелюбное имя для вашего бота (например: "Новостной бот")
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Platform Selection Field */}
        <FormField
          control={form.control}
          name="platform"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Платформа мессенджера
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-2 gap-4 pt-2"
                >
                  <div className="flex items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                    <RadioGroupItem value={MessengerPlatform.TELEGRAM} id="telegram" />
                    <label 
                      htmlFor="telegram" 
                      className="flex flex-1 cursor-pointer items-center gap-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Telegram</div>
                        <div className="text-sm text-muted-foreground">
                          Классический мессенджер
                        </div>
                      </div>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                    <RadioGroupItem value={MessengerPlatform.MAX} id="max" />
                    <label 
                      htmlFor="max" 
                      className="flex flex-1 cursor-pointer items-center gap-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                        <Zap className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">MAX</div>
                        <div className="text-sm text-muted-foreground">
                          Новый российский мессенджер
                        </div>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                Выберите платформу для создания бота. Токен и формат канала зависят от выбранной платформы.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bot Token Field */}
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                {isValidating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                {t("tokenLabel")}
              </FormLabel>
              <FormControl>
                <PasswordInput 
                  placeholder={
                    form.watch('platform') === MessengerPlatform.MAX 
                      ? "Токен MAX бота (например: max_bot_abc123def456)"
                      : t("tokenPlaceholder")
                  }
                  {...field}
                  onBlur={(e) => {
                    field.onBlur();
                    validateToken(e.target.value);
                  }}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </FormControl>
              <FormDescription>
                {form.watch('platform') === MessengerPlatform.MAX ? (
                  <>
                    Получите токен у <a href="https://max.ru/MasterBot" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">@MasterBot</a> в MAX
                  </>
                ) : (
                  <>
                    Получите токен у <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@BotFather</a> в Telegram
                  </>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Channel ID Field */}
        <FormField
          control={form.control}
          name="channelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("channelIdLabel")}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={
                    form.watch('platform') === MessengerPlatform.MAX 
                      ? "ID канала MAX (например: 123456789)"
                      : t("channelIdPlaceholder")
                  }
                  {...field}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </FormControl>
              <FormDescription>
                {form.watch('platform') === MessengerPlatform.MAX ? (
                  <>
                    ID канала в MAX (числовой ID, например: 123456789)
                  </>
                ) : (
                  <>
                    ID канала Telegram (например: @mychannel или -1001234567890)
                  </>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status Field */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{t("statusLabel")}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap gap-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="active" />
                    </FormControl>
                    <FormLabel className="font-normal flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {t("statusActive")}
                      </Badge>
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="inactive" />
                    </FormControl>
                    <FormLabel className="font-normal flex items-center gap-2">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                        {t("statusInactive")}
                      </Badge>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            type="submit" 
            disabled={isSubmitting || !form.formState.isValid}
            className="min-w-[120px] transition-all duration-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? 'Обновление...' : 'Создание...'}
              </>
            ) : (
              <>
                <Bot className="mr-2 h-4 w-4" />
                {submitButtonText || (isEdit ? 'Обновить бота' : 'Создать бота')}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
