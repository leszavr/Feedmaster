import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Settings, Mail, Key, Globe, FileText, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function AdminSettings() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState("");
  const [apiKeys, setApiKeys] = useState([]);

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['/api/admin/settings'],
    select: (data) => data || {
      maintenance: false,
      emailTemplates: {
        welcome: "Добро пожаловать в FeedMaster!",
        suspension: "Ваш аккаунт был приостановлен.",
        payment: "Спасибо за оплату подписки."
      },
      apiKeys: [
        {
          id: "1",
          name: "Admin API Key",
          key: "fm_admin_xxxxxxxxxxxxxxxxxx",
          created: "2024-05-14",
          lastUsed: "2024-05-15"
        },
        {
          id: "2",
          name: "Monitoring Key",
          key: "fm_mon_yyyyyyyyyyyyyyyyyy",
          created: "2024-05-10",
          lastUsed: "2024-05-15"
        }
      ],
      integrations: {
        telegramBot: "@feedmaster_admin_bot",
        sentry: "https://sentry.io/feedmaster",
        logRocket: "enabled"
      }
    }
  });

  const handleSaveSettings = () => {
    // TODO: Implement settings save
    console.log('Saving settings...');
  };

  const generateApiKey = () => {
    // TODO: Implement API key generation
    console.log('Generating new API key...');
  };

  const rotateApiKey = (keyId: string) => {
    // TODO: Implement API key rotation
    console.log('Rotating API key:', keyId);
  };

  const deleteApiKey = (keyId: string) => {
    // TODO: Implement API key deletion
    console.log('Deleting API key:', keyId);
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const settings = settingsData || {};

  return (
    <>
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Настройки платформы</h1>
            <p className="text-sm text-muted-foreground">Глобальные параметры и интеграции</p>
          </div>
          <Button onClick={handleSaveSettings} data-testid="button-save-settings">
            <Save className="w-4 h-4 mr-2" />
            Сохранить
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general" data-testid="tab-general">Общие</TabsTrigger>
            <TabsTrigger value="emails" data-testid="tab-emails">Email шаблоны</TabsTrigger>
            <TabsTrigger value="api" data-testid="tab-api">API ключи</TabsTrigger>
            <TabsTrigger value="integrations" data-testid="tab-integrations">Интеграции</TabsTrigger>
            <TabsTrigger value="legal" data-testid="tab-legal">Юридические</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Общие настройки</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Режим обслуживания</Label>
                    <p className="text-sm text-muted-foreground">
                      Включить режим обслуживания для всех пользователей
                    </p>
                  </div>
                  <Switch
                    checked={maintenanceMode}
                    onCheckedChange={setMaintenanceMode}
                    data-testid="switch-maintenance-mode"
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Название платформы</Label>
                    <Input
                      id="platform-name"
                      defaultValue="FeedMaster"
                      data-testid="input-platform-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email администратора</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      defaultValue="admin@feedmaster.ru"
                      data-testid="input-admin-email"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Templates */}
          <TabsContent value="emails">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>Шаблоны email уведомлений</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="welcome-template">Шаблон приветствия</Label>
                  <Textarea
                    id="welcome-template"
                    defaultValue={settings?.emailTemplates?.welcome || ""}
                    rows={4}
                    data-testid="textarea-welcome-template"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="suspension-template">Шаблон приостановки</Label>
                  <Textarea
                    id="suspension-template"
                    defaultValue={settings?.emailTemplates?.suspension || ""}
                    rows={4}
                    data-testid="textarea-suspension-template"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-template">Шаблон оплаты</Label>
                  <Textarea
                    id="payment-template"
                    defaultValue={settings?.emailTemplates?.payment || ""}
                    rows={4}
                    data-testid="textarea-payment-template"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys */}
          <TabsContent value="api">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Key className="w-5 h-5" />
                  <span>API ключи для админа</span>
                </CardTitle>
                <Button onClick={generateApiKey} data-testid="button-generate-api-key">
                  Создать новый ключ
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(settings?.apiKeys || []).map((apiKey: any) => (
                    <div
                      key={apiKey.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                      data-testid={`api-key-${apiKey.id}`}
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{apiKey.name}</p>
                        <p className="text-sm font-mono text-muted-foreground">{apiKey.key}</p>
                        <p className="text-xs text-muted-foreground">
                          Создан: {apiKey.created} | Последнее использование: {apiKey.lastUsed}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => rotateApiKey(apiKey.id)}
                          data-testid={`button-rotate-${apiKey.id}`}
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Обновить
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive/20 hover:bg-destructive/5"
                          onClick={() => deleteApiKey(apiKey.id)}
                          data-testid={`button-delete-${apiKey.id}`}
                        >
                          Удалить
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>Интеграции</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="telegram-bot">Telegram-бот для уведомлений</Label>
                  <Input
                    id="telegram-bot"
                    defaultValue={settings?.integrations?.telegramBot || ""}
                    placeholder="@bot_username"
                    data-testid="input-telegram-bot"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sentry-url">Sentry DSN</Label>
                  <Input
                    id="sentry-url"
                    defaultValue={settings?.integrations?.sentry || ""}
                    placeholder="https://xxx@sentry.io/xxx"
                    data-testid="input-sentry-dsn"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">LogRocket</Label>
                    <p className="text-sm text-muted-foreground">
                      Включить запись сессий пользователей
                    </p>
                  </div>
                  <Switch
                    defaultChecked={settings?.integrations?.logRocket === "enabled"}
                    data-testid="switch-logrocket"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Legal Documents */}
          <TabsContent value="legal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Юридические документы</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="terms-of-service">Правила использования</Label>
                  <Textarea
                    id="terms-of-service"
                    placeholder="Введите текст правил использования..."
                    rows={6}
                    data-testid="textarea-terms-of-service"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="privacy-policy">Политика конфиденциальности</Label>
                  <Textarea
                    id="privacy-policy"
                    placeholder="Введите текст политики конфиденциальности..."
                    rows={6}
                    data-testid="textarea-privacy-policy"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
