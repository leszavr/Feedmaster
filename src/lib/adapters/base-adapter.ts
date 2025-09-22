import { 
  MessengerCredentials, 
  UnifiedMessage, 
  UnifiedChat, 
  UnifiedUser,
  SendMessageResponse,
  BotInfo,
  WebhookInfo,
  UnifiedUpdate,
  MessengerPlatform
} from './types';

/**
 * Базовый интерфейс адаптера для мессенджеров
 * Определяет единый API для работы с различными платформами
 */
export interface MessengerAdapter {
  /**
   * Платформа мессенджера
   */
  readonly platform: MessengerPlatform;
  
  /**
   * Инициализация адаптера с учетными данными
   */
  initialize(credentials: MessengerCredentials): Promise<void>;
  
  /**
   * Проверка валидности токена и получение информации о боте
   */
  getBotInfo(): Promise<BotInfo>;
  
  /**
   * Отправка сообщения в чат
   */
  sendMessage(
    chatId: string, 
    message: UnifiedMessage
  ): Promise<SendMessageResponse>;
  
  /**
   * Отправка сообщения нескольким получателям
   */
  sendMessageToMultiple(
    chatIds: string[], 
    message: UnifiedMessage
  ): Promise<SendMessageResponse[]>;
  
  /**
   * Получение информации о чате
   */
  getChat(chatId: string): Promise<UnifiedChat>;
  
  /**
   * Получение информации о пользователе
   */
  getUser(userId: string): Promise<UnifiedUser>;
  
  /**
   * Настройка webhook для получения обновлений
   */
  setWebhook(url: string, options?: {
    maxConnections?: number;
    allowedUpdates?: string[];
  }): Promise<boolean>;
  
  /**
   * Удаление webhook
   */
  deleteWebhook(): Promise<boolean>;
  
  /**
   * Получение информации о webhook
   */
  getWebhookInfo(): Promise<WebhookInfo>;
  
  /**
   * Обработка входящих обновлений от webhook
   */
  processWebhookUpdate(rawUpdate: any): UnifiedUpdate;
  
  /**
   * Валидация токена платформы
   */
  validateToken(token: string): boolean;
  
  /**
   * Валидация ID чата/канала
   */
  validateChatId(chatId: string): boolean;
  
  /**
   * Форматирование текста под специфику платформы
   */
  formatText(text: string, format?: 'markdown' | 'html'): string;
  
  /**
   * Получение ограничений платформы
   */
  getPlatformLimits(): {
    maxMessageLength: number;
    maxCaptionLength: number;
    maxButtonsPerRow: number;
    maxButtonRows: number;
    rateLimitPerSecond: number;
    rateLimitPerMinute: number;
  };
  
  /**
   * Проверка доступности бота в чате
   */
  checkBotPermissions(chatId: string): Promise<{
    canSendMessages: boolean;
    canEditMessages: boolean;
    canDeleteMessages: boolean;
    isAdmin: boolean;
  }>;
  
  /**
   * Освобождение ресурсов адаптера
   */
  dispose(): Promise<void>;
}

/**
 * Абстрактный базовый класс адаптера
 * Предоставляет общую функциональность для всех адаптеров
 */
export abstract class BaseMessengerAdapter implements MessengerAdapter {
  abstract readonly platform: MessengerPlatform;
  
  protected credentials?: MessengerCredentials;
  protected isInitialized = false;
  
  async initialize(credentials: MessengerCredentials): Promise<void> {
    if (!this.validateToken(credentials.token)) {
      throw new Error(`Invalid token format for ${this.platform}`);
    }
    
    this.credentials = credentials;
    await this.onInitialize();
    this.isInitialized = true;
  }
  
  /**
   * Проверка инициализации адаптера
   */
  protected ensureInitialized(): void {
    if (!this.isInitialized || !this.credentials) {
      throw new Error(`${this.platform} adapter is not initialized`);
    }
  }
  
  /**
   * Метод для переопределения инициализации в наследниках
   */
  protected abstract onInitialize(): Promise<void>;
  
  // Абстрактные методы для реализации в наследниках
  abstract getBotInfo(): Promise<BotInfo>;
  abstract sendMessage(chatId: string, message: UnifiedMessage): Promise<SendMessageResponse>;
  abstract getChat(chatId: string): Promise<UnifiedChat>;
  abstract getUser(userId: string): Promise<UnifiedUser>;
  abstract setWebhook(url: string, options?: any): Promise<boolean>;
  abstract deleteWebhook(): Promise<boolean>;
  abstract getWebhookInfo(): Promise<WebhookInfo>;
  abstract processWebhookUpdate(rawUpdate: any): UnifiedUpdate;
  abstract validateToken(token: string): boolean;
  abstract validateChatId(chatId: string): boolean;
  abstract formatText(text: string, format?: 'markdown' | 'html'): string;
  abstract getPlatformLimits(): any;
  abstract checkBotPermissions(chatId: string): Promise<any>;
  
  /**
   * Реализация отправки нескольким получателям
   */
  async sendMessageToMultiple(
    chatIds: string[], 
    message: UnifiedMessage
  ): Promise<SendMessageResponse[]> {
    const results: SendMessageResponse[] = [];
    
    for (const chatId of chatIds) {
      try {
        const result = await this.sendMessage(chatId, message);
        results.push(result);
        
        // Пауза между отправками для соблюдения rate limits
        await this.rateLimitDelay();
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return results;
  }
  
  /**
   * Пауза для соблюдения ограничений частоты запросов
   */
  protected async rateLimitDelay(): Promise<void> {
    const limits = this.getPlatformLimits();
    const delayMs = 1000 / limits.rateLimitPerSecond;
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  
  /**
   * Освобождение ресурсов
   */
  async dispose(): Promise<void> {
    this.isInitialized = false;
    this.credentials = undefined;
  }
}