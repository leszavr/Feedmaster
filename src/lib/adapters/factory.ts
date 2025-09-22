import { MessengerAdapter } from './base-adapter';
import { TelegramAdapter } from './telegram-adapter';
import { MaxAdapter } from './max-adapter';
import { MessengerPlatform, MessengerCredentials, MessengerError } from './types';

/**
 * Фабрика для создания адаптеров мессенджеров
 */
export class MessengerAdapterFactory {
  private static adapters = new Map<MessengerPlatform, () => MessengerAdapter>([
    [MessengerPlatform.TELEGRAM, () => new TelegramAdapter()],
    [MessengerPlatform.MAX, () => new MaxAdapter()],
  ]);
  
  /**
   * Создает адаптер для указанной платформы
   */
  static createAdapter(platform: MessengerPlatform): MessengerAdapter {
    const adapterFactory = this.adapters.get(platform);
    
    if (!adapterFactory) {
      throw new MessengerError(
        `Unsupported messenger platform: ${platform}`,
        platform,
        'UNSUPPORTED_PLATFORM'
      );
    }
    
    return adapterFactory();
  }
  
  /**
   * Создает и инициализирует адаптер
   */
  static async createAndInitialize(credentials: MessengerCredentials): Promise<MessengerAdapter> {
    const adapter = this.createAdapter(credentials.platform);
    await adapter.initialize(credentials);
    return adapter;
  }
  
  /**
   * Получает список поддерживаемых платформ
   */
  static getSupportedPlatforms(): MessengerPlatform[] {
    return Array.from(this.adapters.keys());
  }
  
  /**
   * Проверяет, поддерживается ли платформа
   */
  static isSupported(platform: MessengerPlatform): boolean {
    return this.adapters.has(platform);
  }
  
  /**
   * Регистрирует новый адаптер (для расширения функциональности)
   */
  static registerAdapter(
    platform: MessengerPlatform,
    factory: () => MessengerAdapter
  ): void {
    this.adapters.set(platform, factory);
  }
}

/**
 * Менеджер адаптеров для управления множественными подключениями
 */
export class MessengerAdapterManager {
  private adapters = new Map<string, MessengerAdapter>();
  
  /**
   * Добавляет адаптер с уникальным ключом
   */
  async addAdapter(key: string, credentials: MessengerCredentials): Promise<void> {
    const adapter = await MessengerAdapterFactory.createAndInitialize(credentials);
    this.adapters.set(key, adapter);
  }
  
  /**
   * Получает адаптер по ключу
   */
  getAdapter(key: string): MessengerAdapter | undefined {
    return this.adapters.get(key);
  }
  
  /**
   * Получает все адаптеры определенной платформы
   */
  getAdaptersByPlatform(platform: MessengerPlatform): MessengerAdapter[] {
    return Array.from(this.adapters.values()).filter(
      adapter => adapter.platform === platform
    );
  }
  
  /**
   * Получает все активные адаптеры
   */
  getAllAdapters(): MessengerAdapter[] {
    return Array.from(this.adapters.values());
  }
  
  /**
   * Удаляет адаптер
   */
  async removeAdapter(key: string): Promise<void> {
    const adapter = this.adapters.get(key);
    if (adapter) {
      await adapter.dispose();
      this.adapters.delete(key);
    }
  }
  
  /**
   * Отправляет сообщение через несколько адаптеров
   */
  async sendMessageToMultipleAdapters(
    adapterKeys: string[],
    chatId: string,
    message: any
  ): Promise<Array<{ key: string; result: any }>> {
    const results = [];
    
    for (const key of adapterKeys) {
      const adapter = this.getAdapter(key);
      if (adapter) {
        try {
          const result = await adapter.sendMessage(chatId, message);
          results.push({ key, result });
        } catch (error) {
          results.push({ 
            key, 
            result: { 
              success: false, 
              error: error instanceof Error ? error.message : 'Unknown error' 
            } 
          });
        }
      }
    }
    
    return results;
  }
  
  /**
   * Отправляет сообщение на все платформы одного бота
   */
  async broadcastMessage(
    botId: string,
    platforms: MessengerPlatform[],
    chatId: string,
    message: any
  ): Promise<Array<{ platform: MessengerPlatform; result: any }>> {
    const results = [];
    
    for (const platform of platforms) {
      const adapters = this.getAdaptersByPlatform(platform);
      const botAdapter = adapters.find(adapter => {
        // Предполагаем, что ключ адаптера содержит botId
        return Array.from(this.adapters.entries())
          .find(([key, adapterInstance]) => 
            adapterInstance === adapter && key.includes(botId)
          );
      });
      
      if (botAdapter) {
        try {
          const result = await botAdapter.sendMessage(chatId, message);
          results.push({ platform, result });
        } catch (error) {
          results.push({ 
            platform, 
            result: { 
              success: false, 
              error: error instanceof Error ? error.message : 'Unknown error' 
            } 
          });
        }
      }
    }
    
    return results;
  }
  
  /**
   * Освобождает все ресурсы
   */
  async dispose(): Promise<void> {
    const disposePromises = Array.from(this.adapters.values()).map(
      adapter => adapter.dispose()
    );
    
    await Promise.all(disposePromises);
    this.adapters.clear();
  }
  
  /**
   * Получает статистику адаптеров
   */
  getStats(): {
    total: number;
    byPlatform: Record<MessengerPlatform, number>;
  } {
    const byPlatform = {} as Record<MessengerPlatform, number>;
    
    for (const adapter of this.adapters.values()) {
      byPlatform[adapter.platform] = (byPlatform[adapter.platform] || 0) + 1;
    }
    
    return {
      total: this.adapters.size,
      byPlatform,
    };
  }
}