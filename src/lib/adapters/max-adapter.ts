import { Bot } from '@maxhub/max-bot-api';
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
  UnifiedKeyboard,
  UnifiedButton,
  MessengerError,
  AuthenticationError,
  RateLimitError,
} from './types';

/**
 * Адаптер для MAX Messenger Bot API
 */
export class MaxAdapter extends BaseMessengerAdapter {
  readonly platform = MessengerPlatform.MAX;
  
  private bot?: Bot;
  private botInfo?: BotInfo;
  
  protected async onInitialize(): Promise<void> {
    try {
      this.bot = new Bot(this.credentials!.token);
      this.botInfo = await this.getBotInfo();
    } catch (error) {
      throw new AuthenticationError(this.platform, 'Failed to initialize MAX bot');
    }
  }
  
  async getBotInfo(): Promise<BotInfo> {
    this.ensureInitialized();
    
    if (this.botInfo) {
      return this.botInfo;
    }
    
    try {
      const response = await this.bot!.api.raw.get('me');
      
      this.botInfo = {
        id: response.user_id.toString(),
        username: response.username,
        firstName: response.name,
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
      const maxMessage: any = {
        text: this.formatText(message.text, message.format),
      };
      
      // Добавляем форматирование
      if (message.format === 'markdown') {
        maxMessage.format = 'markdown';
      } else if (message.format === 'html') {
        maxMessage.format = 'html';
      }
      
      // Добавляем вложения
      if (message.attachments && message.attachments.length > 0) {
        maxMessage.attachments = this.convertAttachments(message.attachments);
      }
      
      // Добавляем клавиатуру
      if (message.keyboard) {
        const keyboardAttachment = this.convertKeyboard(message.keyboard);
        if (!maxMessage.attachments) {
          maxMessage.attachments = [];
        }
        maxMessage.attachments.push(keyboardAttachment);
      }
      
      // Добавляем ответ на сообщение
      if (message.replyToMessageId) {
        maxMessage.link = {
          type: 'reply',
          mid: message.replyToMessageId,
        };
      }
      
      const response = await this.bot!.api.sendMessageToChat(parseInt(chatId), maxMessage.text, {
        format: maxMessage.format,
        attachments: maxMessage.attachments,
        link: maxMessage.link,
      });
      
      return {
        success: true,
        messageId: response.body.mid,
        platformSpecific: response,
      };
    } catch (error) {
      if (this.isRateLimitError(error)) {
        throw new RateLimitError(this.platform);
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  async getChat(chatId: string): Promise<UnifiedChat> {
    this.ensureInitialized();
    
    try {
      const response = await this.bot!.api.raw.get(`chats/${chatId}`);
      
      return {
        id: response.chat_id.toString(),
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
    this.ensureInitialized();
    
    try {
      const response = await this.bot!.api.raw.get(`users/${userId}`);
      
      return {
        id: response.user_id.toString(),
        username: response.username,
        firstName: response.first_name,
        lastName: response.last_name,
        platform: this.platform,
      };
    } catch (error) {
      throw new MessengerError(
        `Failed to get user info: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.platform
      );
    }
  }
  
  async setWebhook(url: string, options?: {
    maxConnections?: number;
    allowedUpdates?: string[];
  }): Promise<boolean> {
    this.ensureInitialized();
    
    try {
      await this.bot!.api.raw.post('subscriptions', {
        body: {
          url,
          version: '1.0',
        },
      });
      
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
      await this.bot!.api.raw.delete('subscriptions');
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
      const response = await this.bot!.api.raw.get('subscriptions');
      
      return {
        url: response.url,
        isActive: !!response.url,
        platform: this.platform,
      };
    } catch (error) {
      return {
        url: undefined,
        isActive: false,
        platform: this.platform,
      };
    }
  }
  
  processWebhookUpdate(rawUpdate: any): UnifiedUpdate {
    const updateId = rawUpdate.event_id || Date.now().toString();
    
    if (rawUpdate.type === 'message_created') {
      const msg = rawUpdate.payload;
      return {
        updateId,
        type: 'message',
        message: {
          id: msg.message.mid,
          text: msg.message.text || '',
          chat: {
            id: msg.chat.chat_id.toString(),
            type: this.mapChatType(msg.chat.type),
            title: msg.chat.title,
            platform: this.platform,
          },
          from: {
            id: msg.from.user_id.toString(),
            username: msg.from.username,
            firstName: msg.from.first_name,
            lastName: msg.from.last_name,
            platform: this.platform,
          },
          date: new Date(msg.timestamp),
        },
        platform: this.platform,
        rawData: rawUpdate,
      };
    }
    
    if (rawUpdate.type === 'message_callback') {
      const cb = rawUpdate.payload;
      return {
        updateId,
        type: 'callback_query',
        callbackQuery: {
          id: cb.callback_id,
          from: {
            id: cb.from.user_id.toString(),
            username: cb.from.username,
            firstName: cb.from.first_name,
            lastName: cb.from.last_name,
            platform: this.platform,
          },
          data: cb.payload,
        },
        platform: this.platform,
        rawData: rawUpdate,
      };
    }
    
    if (rawUpdate.type === 'bot_started') {
      return {
        updateId,
        type: 'bot_started',
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
    // MAX токен имеет свой формат, но пока не документирован точно
    // Используем базовую проверку на длину и содержимое
    return token.length >= 20 && /^[A-Za-z0-9._-]+$/.test(token);
  }
  
  validateChatId(chatId: string): boolean {
    // MAX chat ID - обычно числовой
    const numericId = parseInt(chatId);
    return !isNaN(numericId) && numericId > 0;
  }
  
  formatText(text: string, format?: 'markdown' | 'html'): string {
    if (!format) return text;
    
    if (format === 'markdown') {
      // MAX поддерживает стандартный Markdown
      return text;
    }
    
    if (format === 'html') {
      // MAX поддерживает базовые HTML теги
      return text;
    }
    
    return text;
  }
  
  getPlatformLimits() {
    return {
      maxMessageLength: 4096, // Аналогично Telegram
      maxCaptionLength: 1024,
      maxButtonsPerRow: 7, // Согласно документации MAX
      maxButtonRows: 30, // Согласно документации MAX
      rateLimitPerSecond: 20, // Консервативная оценка
      rateLimitPerMinute: 600,
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
      // Пробуем получить информацию о чате
      await this.getChat(chatId);
      
      // Если удалось получить информацию, скорее всего бот имеет доступ
      return {
        canSendMessages: true,
        canEditMessages: false, // Консервативная оценка
        canDeleteMessages: false,
        isAdmin: false,
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
   * Конвертация типа чата MAX в унифицированный тип
   */
  private mapChatType(maxType: string): 'private' | 'group' | 'supergroup' | 'channel' {
    switch (maxType) {
      case 'dialog':
        return 'private';
      case 'chat':
        return 'group';
      case 'channel':
        return 'channel';
      default:
        return 'private';
    }
  }
  
  /**
   * Конвертация унифицированной клавиатуры в формат MAX
   */
  private convertKeyboard(keyboard: UnifiedKeyboard): any {
    if (keyboard.type === 'inline') {
      return {
        type: 'inline_keyboard',
        payload: {
          buttons: keyboard.buttons.map(row =>
            row.map(button => this.convertButton(button))
          ),
        },
      };
    }
    
    // Reply keyboard не поддерживается в MAX, возвращаем inline
    return {
      type: 'inline_keyboard',
      payload: {
        buttons: keyboard.buttons.map(row =>
          row.map(button => this.convertButton(button))
        ),
      },
    };
  }
  
  /**
   * Конвертация унифицированной кнопки в формат MAX
   */
  private convertButton(button: UnifiedButton): any {
    const maxButton: any = {
      text: button.text,
      type: this.mapButtonType(button.type),
    };
    
    switch (button.type) {
      case 'callback':
        maxButton.payload = button.data;
        break;
      case 'url':
        maxButton.url = button.url;
        break;
      case 'contact':
        maxButton.type = 'request_contact';
        break;
      case 'location':
        maxButton.type = 'request_geo_location';
        break;
      case 'app':
        maxButton.type = 'open_app';
        break;
      case 'message':
        maxButton.type = 'message';
        break;
    }
    
    return maxButton;
  }
  
  /**
   * Маппинг типов кнопок
   */
  private mapButtonType(type: string): string {
    switch (type) {
      case 'callback':
        return 'callback';
      case 'url':
        return 'link';
      case 'contact':
        return 'request_contact';
      case 'location':
        return 'request_geo_location';
      case 'app':
        return 'open_app';
      case 'message':
        return 'message';
      default:
        return 'callback';
    }
  }
  
  /**
   * Конвертация вложений (заглушка для будущей реализации)
   */
  private convertAttachments(attachments: any[]): any[] {
    // Пока возвращаем пустой массив, в будущем добавим конвертацию вложений
    return [];
  }
  
  /**
   * Проверка на ошибку rate limit
   */
  private isRateLimitError(error: any): boolean {
    return error?.response?.status === 429 || 
           error?.code === 'RATE_LIMIT' ||
           error?.message?.includes('rate limit');
  }
}