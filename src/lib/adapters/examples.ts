/**
 * Примеры использования адаптеров мессенджеров
 * Эти функции демонстрируют как использовать унифицированный API
 * для работы с различными платформами
 */

import { 
  MessengerAdapterFactory, 
  MessengerAdapterManager,
  MessengerPlatform,
  MessengerCredentials,
  UnifiedMessage,
  MessengerError 
} from '@/lib/adapters';
import { Bot } from '@/lib/types';

/**
 * Пример создания и использования отдельного адаптера
 */
export async function createBotAdapter(bot: Bot) {
  try {
    const credentials: MessengerCredentials = {
      token: bot.token,
      platform: bot.platform,
    };

    // Создаем и инициализируем адаптер
    const adapter = await MessengerAdapterFactory.createAndInitialize(credentials);
    
    // Получаем информацию о боте
    const botInfo = await adapter.getBotInfo();
    console.log('Bot info:', botInfo);
    
    // Проверяем права в канале
    const permissions = await adapter.checkBotPermissions(bot.channelId);
    console.log('Bot permissions:', permissions);
    
    return adapter;
  } catch (error) {
    if (error instanceof MessengerError) {
      console.error(`${error.platform} error:`, error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

/**
 * Пример отправки сообщения через адаптер
 */
export async function sendMessageThroughAdapter(
  bot: Bot,
  message: UnifiedMessage
) {
  try {
    const adapter = await createBotAdapter(bot);
    
    const result = await adapter.sendMessage(bot.channelId, message);
    
    if (result.success) {
      console.log('Message sent successfully:', result.messageId);
    } else {
      console.error('Failed to send message:', result.error);
    }
    
    await adapter.dispose();
    return result;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

/**
 * Пример использования менеджера адаптеров для управления несколькими ботами
 */
export class BotService {
  private adapterManager = new MessengerAdapterManager();
  
  /**
   * Добавляет бота в менеджер
   */
  async addBot(bot: Bot): Promise<void> {
    const credentials: MessengerCredentials = {
      token: bot.token,
      platform: bot.platform,
    };
    
    await this.adapterManager.addAdapter(bot.id, credentials);
  }
  
  /**
   * Отправляет сообщение через определенного бота
   */
  async sendMessage(
    botId: string,
    channelId: string,
    message: UnifiedMessage
  ) {
    const adapter = this.adapterManager.getAdapter(botId);
    if (!adapter) {
      throw new Error(`Bot ${botId} not found`);
    }
    
    return await adapter.sendMessage(channelId, message);
  }
  
  /**
   * Отправляет сообщение через всех ботов определенной платформы
   */
  async broadcastToPlatform(
    platform: MessengerPlatform,
    channelId: string,
    message: UnifiedMessage
  ) {
    const adapters = this.adapterManager.getAdaptersByPlatform(platform);
    const results = [];
    
    for (const adapter of adapters) {
      try {
        const result = await adapter.sendMessage(channelId, message);
        results.push({ adapter: adapter.platform, result });
      } catch (error) {
        results.push({ 
          adapter: adapter.platform, 
          result: { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          } 
        });
      }
    }
    
    return results;
  }
  
  /**
   * Отправляет сообщение через всех ботов
   */
  async broadcastToAll(channelId: string, message: UnifiedMessage) {
    const adapters = this.adapterManager.getAllAdapters();
    const results = [];
    
    for (const adapter of adapters) {
      try {
        const result = await adapter.sendMessage(channelId, message);
        results.push({ platform: adapter.platform, result });
      } catch (error) {
        results.push({ 
          platform: adapter.platform, 
          result: { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          } 
        });
      }
    }
    
    return results;
  }
  
  /**
   * Получает статистику активных адаптеров
   */
  getStats() {
    return this.adapterManager.getStats();
  }
  
  /**
   * Освобождает ресурсы
   */
  async dispose() {
    await this.adapterManager.dispose();
  }
}

/**
 * Пример отправки поста через несколько платформ
 */
export async function publishPost(
  bots: Bot[],
  post: {
    title: string;
    content: string;
    link?: string;
  }
) {
  const botService = new BotService();
  
  try {
    // Добавляем всех ботов в менеджер
    for (const bot of bots) {
      await botService.addBot(bot);
    }
    
    // Формируем сообщение
    const message: UnifiedMessage = {
      text: `**${post.title}**\n\n${post.content}${post.link ? `\n\n🔗 [Читать далее](${post.link})` : ''}`,
      format: 'markdown',
    };
    
    // Отправляем через каждого бота
    const results = [];
    for (const bot of bots) {
      try {
        const result = await botService.sendMessage(bot.id, bot.channelId, message);
        results.push({ 
          bot: bot.name, 
          platform: bot.platform, 
          success: result.success,
          messageId: result.messageId,
          error: result.error 
        });
      } catch (error) {
        results.push({ 
          bot: bot.name, 
          platform: bot.platform, 
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
    
    return results;
  } finally {
    await botService.dispose();
  }
}

/**
 * Пример проверки статуса всех ботов
 */
export async function checkBotsStatus(bots: Bot[]) {
  const results = [];
  
  for (const bot of bots) {
    try {
      const adapter = await createBotAdapter(bot);
      const botInfo = await adapter.getBotInfo();
      const permissions = await adapter.checkBotPermissions(bot.channelId);
      
      results.push({
        bot: bot.name,
        platform: bot.platform,
        status: 'active',
        botInfo,
        permissions,
      });
      
      await adapter.dispose();
    } catch (error) {
      results.push({
        bot: bot.name,
        platform: bot.platform,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
  
  return results;
}