import { BaseMessengerAdapter } from './base-adapter';
import {
  MessengerPlatform,
  UnifiedMessage,
  UnifiedChat,
  UnifiedUser,
  SendMessageResponse,
  BotInfo,
  WebhookInfo,
  UnifiedUpdate,
  UnifiedAttachment,
  UnifiedKeyboard,
  MessengerError,
  AuthenticationError,
  RateLimitError,
  InvalidTokenError,
} from './types';

/**
 * Адаптер для Telegram Bot API
 */
export class TelegramAdapter extends BaseMessengerAdapter {
  readonly platform = MessengerPlatform.TELEGRAM;
  
  private readonly baseUrl = 'https://api.telegram.org/bot';
  private botInfo?: BotInfo;
  
  protected async onInitialize(): Promise<void> {
    // Проверяем токен, получив информацию о боте
    try {
      this.botInfo = await this.getBotInfo();
    } catch (error) {
      throw new AuthenticationError(this.platform, 'Failed to initialize Telegram bot');
    }
  }
  
  async getBotInfo(): Promise<BotInfo> {
    this.ensureInitialized();
    
    if (this.botInfo) {
      return this.botInfo;
    }
    
    try {
      const response = await this.makeRequest('getMe');
      
      this.botInfo = {
        id: response.id.toString(),
        username: response.username,
        firstName: response.first_name,
        platform: this.platform,
        isActive: true,
      };
      
      return this.botInfo;
    } catch (error) {
      throw new AuthenticationError(this.platform, 'Failed to get bot info');
    }
  }
  
  async sendMessage(chatId: string, message: UnifiedMessage): Promise<SendMessageResponse> {
    this.ensureInitialized();
    
    try {
      const telegramMessage: any = {
        chat_id: chatId,
        text: this.formatText(message.text, message.format),
      };
      
      // Добавляем форматирование
      if (message.format === 'markdown') {
        telegramMessage.parse_mode = 'MarkdownV2';
      } else if (message.format === 'html') {
        telegramMessage.parse_mode = 'HTML';
      }
      
      // Добавляем клавиатуру
      if (message.keyboard) {
        telegramMessage.reply_markup = this.convertKeyboard(message.keyboard);
      }
      
      // Добавляем ответ на сообщение
      if (message.replyToMessageId) {
        telegramMessage.reply_to_message_id = parseInt(message.replyToMessageId);
      }
      
      const response = await this.makeRequest('sendMessage', telegramMessage);
      
      return {
        success: true,
        messageId: response.message_id.toString(),
        platformSpecific: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  async getChat(chatId: string): Promise<UnifiedChat> {
    this.ensureInitialized();
    
    try {
      const response = await this.makeRequest('getChat', { chat_id: chatId });
      
      return {
        id: response.id.toString(),
        type: this.mapChatType(response.type),
        title: response.title,
        username: response.username,
        platform: this.platform,
      };
    } catch (error) {
      throw new MessengerError(
        `Failed to get chat info: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.platform
      );
    }
  }
  
  async getUser(userId: string): Promise<UnifiedUser> {
    // Telegram Bot API не предоставляет прямого метода для получения пользователя
    // Эта информация доступна только в контексте сообщений
    throw new MessengerError('Getting user info is not supported in Telegram Bot API', this.platform);
  }
  
  async setWebhook(url: string, options?: {
    maxConnections?: number;
    allowedUpdates?: string[];
  }): Promise<boolean> {
    this.ensureInitialized();
    
    try {
      const params: any = { url };
      
      if (options?.maxConnections) {
        params.max_connections = options.maxConnections;
      }
      
      if (options?.allowedUpdates) {
        params.allowed_updates = options.allowedUpdates;
      }
      
      await this.makeRequest('setWebhook', params);
      return true;
    } catch (error) {
      throw new MessengerError(
        `Failed to set webhook: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.platform
      );
    }
  }
  
  async deleteWebhook(): Promise<boolean> {
    this.ensureInitialized();
    
    try {
      await this.makeRequest('deleteWebhook');
      return true;
    } catch (error) {
      throw new MessengerError(
        `Failed to delete webhook: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.platform
      );
    }
  }
  
  async getWebhookInfo(): Promise<WebhookInfo> {
    this.ensureInitialized();
    
    try {
      const response = await this.makeRequest('getWebhookInfo');
      
      return {
        url: response.url,
        isActive: !!response.url,
        maxConnections: response.max_connections,
        platform: this.platform,
      };
    } catch (error) {
      throw new MessengerError(
        `Failed to get webhook info: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.platform
      );
    }
  }
  
  processWebhookUpdate(rawUpdate: any): UnifiedUpdate {
    const updateId = rawUpdate.update_id.toString();
    
    if (rawUpdate.message) {
      const msg = rawUpdate.message;
      return {
        updateId,
        type: 'message',
        message: {
          id: msg.message_id.toString(),
          text: msg.text || '',
          chat: {
            id: msg.chat.id.toString(),
            type: this.mapChatType(msg.chat.type),
            title: msg.chat.title,
            username: msg.chat.username,
            platform: this.platform,
          },
          from: {
            id: msg.from.id.toString(),
            username: msg.from.username,
            firstName: msg.from.first_name,
            lastName: msg.from.last_name,
            platform: this.platform,
          },
          date: new Date(msg.date * 1000),
        },
        platform: this.platform,
        rawData: rawUpdate,
      };
    }
    
    if (rawUpdate.callback_query) {
      const cb = rawUpdate.callback_query;
      return {
        updateId,
        type: 'callback_query',
        callbackQuery: {
          id: cb.id,
          from: {
            id: cb.from.id.toString(),
            username: cb.from.username,
            firstName: cb.from.first_name,
            lastName: cb.from.last_name,
            platform: this.platform,
          },
          data: cb.data,
          message: cb.message ? {
            id: cb.message.message_id.toString(),
            text: cb.message.text || '',
            chat: {
              id: cb.message.chat.id.toString(),
              type: this.mapChatType(cb.message.chat.type),
              title: cb.message.chat.title,
              username: cb.message.chat.username,
              platform: this.platform,
            },
            date: new Date(cb.message.date * 1000),
          } : undefined,
        },
        platform: this.platform,
        rawData: rawUpdate,
      };
    }
    
    // Базовое обновление для неизвестных типов
    return {
      updateId,
      type: 'message', // Fallback
      platform: this.platform,
      rawData: rawUpdate,
    };
  }
  
  validateToken(token: string): boolean {
    // Telegram токен имеет формат: 123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
    const telegramTokenRegex = /^\d{8,10}:[A-Za-z0-9_-]{35}$/;
    return telegramTokenRegex.test(token);
  }
  
  validateChatId(chatId: string): boolean {
    // Telegram chat ID может быть:
    // - Положительное число (приватный чат)
    // - Отрицательное число (группа/супергруппа)
    // - @username (публичный канал/группа)
    if (chatId.startsWith('@')) {
      return /^@[A-Za-z0-9_]{5,32}$/.test(chatId);
    }
    
    const numericId = parseInt(chatId);
    return !isNaN(numericId) && Math.abs(numericId) > 0;
  }
  
  formatText(text: string, format?: 'markdown' | 'html'): string {
    if (!format) return text;
    
    if (format === 'markdown') {
      // Экранируем специальные символы для MarkdownV2
      return text
        .replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
    }
    
    if (format === 'html') {
      // Экранируем HTML теги
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
    
    return text;
  }
  
  getPlatformLimits() {
    return {
      maxMessageLength: 4096,
      maxCaptionLength: 1024,
      maxButtonsPerRow: 8,
      maxButtonRows: 100,
      rateLimitPerSecond: 30,
      rateLimitPerMinute: 1000,
    };
  }
  
  async checkBotPermissions(chatId: string): Promise<{
    canSendMessages: boolean;
    canEditMessages: boolean;
    canDeleteMessages: boolean;
    isAdmin: boolean;
  }> {
    this.ensureInitialized();
    
    try {
      const chat = await this.getChat(chatId);
      
      if (chat.type === 'private') {
        return {
          canSendMessages: true,
          canEditMessages: true,
          canDeleteMessages: true,
          isAdmin: false,
        };
      }
      
      // Для групп и каналов получаем информацию о боте как участнике
      const botInfo = await this.getBotInfo();
      const response = await this.makeRequest('getChatMember', {
        chat_id: chatId,
        user_id: botInfo.id,
      });
      
      const status = response.status;
      
      return {
        canSendMessages: status !== 'left' && status !== 'kicked',
        canEditMessages: status === 'administrator' || status === 'creator',
        canDeleteMessages: status === 'administrator' || status === 'creator',
        isAdmin: status === 'administrator' || status === 'creator',
      };
    } catch (error) {
      return {
        canSendMessages: false,
        canEditMessages: false,
        canDeleteMessages: false,
        isAdmin: false,
      };
    }
  }
  
  /**
   * Выполнение запроса к Telegram Bot API
   */
  private async makeRequest(method: string, params?: any): Promise<any> {
    const url = `${this.baseUrl}${this.credentials!.token}/${method}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params || {}),
    });
    
    const data = await response.json();
    
    if (!data.ok) {
      if (data.error_code === 401) {
        throw new AuthenticationError(this.platform, data.description);
      }
      
      if (data.error_code === 429) {
        throw new RateLimitError(this.platform, data.parameters?.retry_after);
      }
      
      throw new MessengerError(
        data.description || 'Unknown error',
        this.platform,
        data.error_code?.toString(),
        response.status
      );
    }
    
    return data.result;
  }
  
  /**
   * Конвертация типа чата Telegram в унифицированный тип
   */
  private mapChatType(telegramType: string): 'private' | 'group' | 'supergroup' | 'channel' {
    switch (telegramType) {
      case 'private':
        return 'private';
      case 'group':
        return 'group';
      case 'supergroup':
        return 'supergroup';
      case 'channel':
        return 'channel';
      default:
        return 'private';
    }
  }
  
  /**
   * Конвертация унифицированной клавиатуры в формат Telegram
   */
  private convertKeyboard(keyboard: UnifiedKeyboard): any {
    if (keyboard.type === 'inline') {
      return {
        inline_keyboard: keyboard.buttons.map(row =>
          row.map(button => {
            const telegramButton: any = { text: button.text };
            
            switch (button.type) {
              case 'callback':
                telegramButton.callback_data = button.data;
                break;
              case 'url':
                telegramButton.url = button.url;
                break;
              case 'contact':
                telegramButton.request_contact = true;
                break;
              case 'location':
                telegramButton.request_location = true;
                break;
            }
            
            return telegramButton;
          })
        ),
      };
    }
    
    // Reply keyboard
    return {
      keyboard: keyboard.buttons.map(row =>
        row.map(button => ({ text: button.text }))
      ),
      resize_keyboard: true,
      one_time_keyboard: true,
    };
  }
}