import { MessengerPlatform } from './adapters';

/**
 * Утилиты для валидации токенов и ID разных мессенджеров
 */

export class TokenValidator {
  /**
   * Валидация токена Telegram бота
   */
  static validateTelegramToken(token: string): boolean {
    // Telegram токен имеет формат: 123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
    const telegramTokenRegex = /^\d{8,10}:[A-Za-z0-9_-]{35}$/;
    return telegramTokenRegex.test(token);
  }

  /**
   * Валидация токена MAX бота
   */
  static validateMaxToken(token: string): boolean {
    // MAX токен должен быть длиннее 20 символов и содержать только допустимые символы
    return token.length >= 20 && /^[A-Za-z0-9._-]+$/.test(token);
  }

  /**
   * Валидация токена в зависимости от платформы
   */
  static validateToken(token: string, platform: MessengerPlatform): boolean {
    switch (platform) {
      case MessengerPlatform.TELEGRAM:
        return this.validateTelegramToken(token);
      case MessengerPlatform.MAX:
        return this.validateMaxToken(token);
      default:
        return false;
    }
  }

  /**
   * Получение формата токена для платформы
   */
  static getTokenFormat(platform: MessengerPlatform): string {
    switch (platform) {
      case MessengerPlatform.TELEGRAM:
        return "123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11";
      case MessengerPlatform.MAX:
        return "max_bot_abc123def456ghi789";
      default:
        return "";
    }
  }

  /**
   * Получение инструкций для получения токена
   */
  static getTokenInstructions(platform: MessengerPlatform): {
    botName: string;
    botUrl: string;
    instruction: string;
  } {
    switch (platform) {
      case MessengerPlatform.TELEGRAM:
        return {
          botName: "@BotFather",
          botUrl: "https://t.me/BotFather",
          instruction: "Отправьте /newbot и следуйте инструкциям"
        };
      case MessengerPlatform.MAX:
        return {
          botName: "@MasterBot", 
          botUrl: "https://max.ru/MasterBot",
          instruction: "Отправьте /create и следуйте инструкциям"
        };
      default:
        return {
          botName: "",
          botUrl: "",
          instruction: ""
        };
    }
  }
}

export class ChannelValidator {
  /**
   * Валидация ID канала Telegram
   */
  static validateTelegramChannelId(channelId: string): boolean {
    // Telegram chat ID может быть:
    // - @username (публичный канал/группа)
    // - Отрицательное число (приватная группа/супергруппа)
    // - Положительное число (приватный чат)
    if (channelId.startsWith('@')) {
      return /^@[A-Za-z0-9_]{5,32}$/.test(channelId);
    }
    
    const numericId = parseInt(channelId);
    return !isNaN(numericId) && Math.abs(numericId) > 0;
  }

  /**
   * Валидация ID канала MAX
   */
  static validateMaxChannelId(channelId: string): boolean {
    // MAX канал обычно числовой ID
    const numericId = parseInt(channelId);
    return !isNaN(numericId) && numericId > 0;
  }

  /**
   * Валидация ID канала в зависимости от платформы
   */
  static validateChannelId(channelId: string, platform: MessengerPlatform): boolean {
    switch (platform) {
      case MessengerPlatform.TELEGRAM:
        return this.validateTelegramChannelId(channelId);
      case MessengerPlatform.MAX:
        return this.validateMaxChannelId(channelId);
      default:
        return false;
    }
  }

  /**
   * Получение формата ID канала для платформы
   */
  static getChannelIdFormat(platform: MessengerPlatform): string {
    switch (platform) {
      case MessengerPlatform.TELEGRAM:
        return "@mychannel или -1001234567890";
      case MessengerPlatform.MAX:
        return "123456789";
      default:
        return "";
    }
  }

  /**
   * Получение инструкций для получения ID канала
   */
  static getChannelIdInstructions(platform: MessengerPlatform): string {
    switch (platform) {
      case MessengerPlatform.TELEGRAM:
        return "Для публичного канала используйте @username, для приватного - числовой ID";
      case MessengerPlatform.MAX:
        return "Используйте числовой ID канала из настроек канала в MAX";
      default:
        return "";
    }
  }
}

/**
 * Объединенный валидатор для удобства использования
 */
export class MessengerValidator {
  static validateBotCredentials(
    token: string,
    channelId: string,
    platform: MessengerPlatform
  ): {
    tokenValid: boolean;
    channelIdValid: boolean;
    overall: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    const tokenValid = TokenValidator.validateToken(token, platform);
    if (!tokenValid) {
      errors.push(`Неверный формат токена для ${platform}`);
    }
    
    const channelIdValid = ChannelValidator.validateChannelId(channelId, platform);
    if (!channelIdValid) {
      errors.push(`Неверный формат ID канала для ${platform}`);
    }
    
    return {
      tokenValid,
      channelIdValid,
      overall: tokenValid && channelIdValid,
      errors
    };
  }

  static getPlatformInfo(platform: MessengerPlatform) {
    return {
      platform,
      token: TokenValidator.getTokenInstructions(platform),
      channel: {
        format: ChannelValidator.getChannelIdFormat(platform),
        instructions: ChannelValidator.getChannelIdInstructions(platform)
      }
    };
  }
}