/**
 * Сервис для интеграции адаптеров мессенджеров в приложение
 * Предоставляет высокоуровневые методы для работы с ботами
 */

import { 
  MessengerAdapterFactory,
  MessengerAdapterManager,
  MessengerAdapter,
  MessengerPlatform,
  MessengerCredentials,
  UnifiedMessage,
  SendMessageResponse,
  BotInfo,
  MessengerError
} from '@/lib/adapters';
import { Bot } from '@/lib/types';

export class AppMessengerService {
  private static instance: AppMessengerService;
  private adapterManager = new MessengerAdapterManager();
  private adaptersCache = new Map<string, MessengerAdapter>();

  static getInstance(): AppMessengerService {
    if (!AppMessengerService.instance) {
      AppMessengerService.instance = new AppMessengerService();
    }
    return AppMessengerService.instance;
  }

  /**
   * Тестирует подключение к боту
   */
  async testBotConnection(bot: Bot): Promise<{
    success: boolean;
    botInfo?: BotInfo;
    permissions?: any;
    error?: string;
  }> {
    try {
      const credentials: MessengerCredentials = {
        token: bot.token,
        platform: bot.platform,
      };

      const adapter = await MessengerAdapterFactory.createAndInitialize(credentials);
      
      // Получаем информацию о боте
      const botInfo = await adapter.getBotInfo();
      
      // Проверяем права доступа к каналу
      const permissions = await adapter.checkBotPermissions(bot.channelId);
      
      await adapter.dispose();
      
      return {
        success: true,
        botInfo,
        permissions,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Инициализирует бота в менеджере
   */
  async initializeBot(bot: Bot): Promise<void> {
    const credentials: MessengerCredentials = {
      token: bot.token,
      platform: bot.platform,
    };

    await this.adapterManager.addAdapter(bot.id, credentials);
    
    // Кэшируем адаптер для быстрого доступа
    const adapter = this.adapterManager.getAdapter(bot.id);
    if (adapter) {
      this.adaptersCache.set(bot.id, adapter);
    }
  }

  /**
   * Удаляет бота из менеджера
   */
  async removeBot(botId: string): Promise<void> {
    await this.adapterManager.removeAdapter(botId);
    this.adaptersCache.delete(botId);
  }

  /**
   * Отправляет сообщение через определенного бота
   */
  async sendMessage(
    botId: string,
    channelId: string,
    message: UnifiedMessage
  ): Promise<SendMessageResponse> {
    const adapter = this.adaptersCache.get(botId) || this.adapterManager.getAdapter(botId);
    
    if (!adapter) {
      throw new Error(`Bot ${botId} not initialized`);
    }

    return await adapter.sendMessage(channelId, message);
  }

  /**
   * Отправляет сообщение через несколько ботов
   */
  async sendMessageToMultipleBots(
    botIds: string[],
    channelId: string,
    message: UnifiedMessage
  ): Promise<Array<{ botId: string; result: SendMessageResponse }>> {
    const results = [];

    for (const botId of botIds) {
      try {
        const result = await this.sendMessage(botId, channelId, message);
        results.push({ botId, result });
      } catch (error) {
        results.push({
          botId,
          result: {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });
      }
    }

    return results;
  }

  /**
   * Отправляет сообщение на все платформы одного бота
   */
  async sendToCrossPlatform(
    botConfigs: Array<{ bot: Bot; channelId?: string }>,
    message: UnifiedMessage
  ): Promise<Array<{ botId: string; platform: MessengerPlatform; result: SendMessageResponse }>> {
    const results = [];

    for (const config of botConfigs) {
      const channelId = config.channelId || config.bot.channelId;
      
      try {
        // Инициализируем бота если еще не инициализирован
        if (!this.adaptersCache.has(config.bot.id)) {
          await this.initializeBot(config.bot);
        }

        const result = await this.sendMessage(config.bot.id, channelId, message);
        results.push({
          botId: config.bot.id,
          platform: config.bot.platform,
          result,
        });
      } catch (error) {
        results.push({
          botId: config.bot.id,
          platform: config.bot.platform,
          result: {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });
      }
    }

    return results;
  }

  /**
   * Публикует пост через выбранных ботов
   */
  async publishPost(
    bots: Bot[],
    post: {
      title: string;
      content: string;
      link?: string;
      summary?: string;
    },
    options?: {
      format?: 'markdown' | 'html';
      includeLink?: boolean;
      includeSummary?: boolean;
    }
  ) {
    const opts = {
      format: 'markdown' as const,
      includeLink: true,
      includeSummary: false,
      ...options,
    };

    // Формируем сообщение в зависимости от опций
    let messageText = `**${post.title}**\n\n`;
    
    if (opts.includeSummary && post.summary) {
      messageText += `${post.summary}\n\n`;
    } else {
      messageText += `${post.content}\n\n`;
    }
    
    if (opts.includeLink && post.link) {
      messageText += `🔗 [Читать далее](${post.link})`;
    }

    const message: UnifiedMessage = {
      text: messageText,
      format: opts.format,
    };

    // Инициализируем всех ботов
    for (const bot of bots) {
      if (!this.adaptersCache.has(bot.id)) {
        await this.initializeBot(bot);
      }
    }

    // Отправляем сообщения
    const botConfigs = bots.map(bot => ({ bot }));
    return await this.sendToCrossPlatform(botConfigs, message);
  }

  /**
   * Получает статус всех активных ботов
   */
  async getBotsStatus(): Promise<Array<{
    botId: string;
    platform: MessengerPlatform;
    status: 'active' | 'error';
    botInfo?: BotInfo;
    error?: string;
  }>> {
    const results = [];
    const allAdapters = this.adapterManager.getAllAdapters();

    for (const [botId, adapter] of this.adaptersCache.entries()) {
      try {
        const botInfo = await adapter.getBotInfo();
        results.push({
          botId,
          platform: adapter.platform,
          status: 'active' as const,
          botInfo,
        });
      } catch (error) {
        results.push({
          botId,
          platform: adapter.platform,
          status: 'error' as const,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  /**
   * Получает статистику адаптеров
   */
  getStats() {
    return {
      ...this.adapterManager.getStats(),
      cached: this.adaptersCache.size,
    };
  }

  /**
   * Настраивает webhook для бота
   */
  async setupWebhook(
    botId: string,
    webhookUrl: string,
    options?: { maxConnections?: number; allowedUpdates?: string[] }
  ): Promise<boolean> {
    const adapter = this.adaptersCache.get(botId) || this.adapterManager.getAdapter(botId);
    
    if (!adapter) {
      throw new Error(`Bot ${botId} not initialized`);
    }

    return await adapter.setWebhook(webhookUrl, options);
  }

  /**
   * Удаляет webhook для бота
   */
  async deleteWebhook(botId: string): Promise<boolean> {
    const adapter = this.adaptersCache.get(botId) || this.adapterManager.getAdapter(botId);
    
    if (!adapter) {
      throw new Error(`Bot ${botId} not initialized`);
    }

    return await adapter.deleteWebhook();
  }

  /**
   * Получает информацию о webhook
   */
  async getWebhookInfo(botId: string) {
    const adapter = this.adaptersCache.get(botId) || this.adapterManager.getAdapter(botId);
    
    if (!adapter) {
      throw new Error(`Bot ${botId} not initialized`);
    }

    return await adapter.getWebhookInfo();
  }

  /**
   * Освобождает все ресурсы
   */
  async dispose(): Promise<void> {
    await this.adapterManager.dispose();
    this.adaptersCache.clear();
  }
}