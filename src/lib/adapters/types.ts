// Типы для унифицированной работы с мессенджерами

export enum MessengerPlatform {
  TELEGRAM = 'telegram',
  MAX = 'max',
}

export interface MessengerCredentials {
  token: string;
  platform: MessengerPlatform;
  // Дополнительные поля для каждой платформы
  additionalData?: Record<string, any>;
}

export interface UnifiedMessage {
  text: string;
  format?: 'markdown' | 'html' | 'plain';
  attachments?: UnifiedAttachment[];
  keyboard?: UnifiedKeyboard;
  replyToMessageId?: string;
}

export interface UnifiedAttachment {
  type: 'photo' | 'video' | 'audio' | 'document' | 'sticker' | 'location';
  url?: string;
  token?: string;
  caption?: string;
  metadata?: Record<string, any>;
}

export interface UnifiedKeyboard {
  type: 'inline' | 'reply';
  buttons: UnifiedButton[][];
}

export interface UnifiedButton {
  text: string;
  type: 'callback' | 'url' | 'contact' | 'location' | 'app' | 'message';
  data?: string;
  url?: string;
}

export interface UnifiedChat {
  id: string;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  platform: MessengerPlatform;
}

export interface UnifiedUser {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  platform: MessengerPlatform;
}

export interface SendMessageResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  platformSpecific?: Record<string, any>;
}

export interface BotInfo {
  id: string;
  username: string;
  firstName: string;
  platform: MessengerPlatform;
  isActive: boolean;
}

export interface WebhookInfo {
  url?: string;
  isActive: boolean;
  maxConnections?: number;
  platform: MessengerPlatform;
}

// События от мессенджеров
export interface UnifiedUpdate {
  updateId: string;
  type: 'message' | 'callback_query' | 'bot_started' | 'bot_added' | 'bot_removed';
  message?: UnifiedMessage & { id: string; chat: UnifiedChat; from: UnifiedUser; date: Date };
  callbackQuery?: {
    id: string;
    from: UnifiedUser;
    data: string;
    message?: UnifiedMessage & { id: string; chat: UnifiedChat; date: Date };
  };
  chat?: UnifiedChat;
  user?: UnifiedUser;
  platform: MessengerPlatform;
  rawData: any; // Оригинальные данные от платформы
}

// Исключения
export class MessengerError extends Error {
  constructor(
    message: string,
    public platform: MessengerPlatform,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'MessengerError';
  }
}

export class AuthenticationError extends MessengerError {
  constructor(platform: MessengerPlatform, message = 'Authentication failed') {
    super(message, platform, 'AUTH_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends MessengerError {
  constructor(platform: MessengerPlatform, retryAfter?: number) {
    super('Rate limit exceeded', platform, 'RATE_LIMIT', 429);
    this.name = 'RateLimitError';
    if (retryAfter) {
      this.retryAfter = retryAfter;
    }
  }
  
  retryAfter?: number;
}

export class InvalidTokenError extends MessengerError {
  constructor(platform: MessengerPlatform) {
    super('Invalid or expired token', platform, 'INVALID_TOKEN', 401);
    this.name = 'InvalidTokenError';
  }
}