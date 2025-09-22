# 🤖 Адаптеры Мессенджеров FeedMaster

Унифицированная система для работы с различными мессенджерами (Telegram, MAX) через единый API.

## 📁 Структура

```
src/lib/adapters/
├── index.ts              # Главный экспорт
├── types.ts              # Типы и интерфейсы
├── base-adapter.ts       # Базовый класс адаптера
├── telegram-adapter.ts   # Адаптер для Telegram
├── max-adapter.ts        # Адаптер для MAX
├── factory.ts            # Фабрика и менеджер адаптеров
└── examples.ts           # Примеры использования
```

## 🚀 Быстрый старт

### Создание адаптера

```typescript
import { MessengerAdapterFactory, MessengerPlatform } from '@/lib/adapters';

const credentials = {
  token: 'your_bot_token',
  platform: MessengerPlatform.TELEGRAM, // или MessengerPlatform.MAX
};

const adapter = await MessengerAdapterFactory.createAndInitialize(credentials);
```

### Отправка сообщения

```typescript
const message = {
  text: '**Привет!** Это тестовое сообщение.',
  format: 'markdown' as const,
};

const result = await adapter.sendMessage('chat_id', message);
console.log('Результат:', result);
```

### Использование сервиса приложения

```typescript
import { AppMessengerService } from '@/lib/messenger-service';

const service = AppMessengerService.getInstance();

// Тестирование подключения
const testResult = await service.testBotConnection(bot);

// Публикация поста
const publishResult = await service.publishPost(bots, {
  title: 'Заголовок',
  content: 'Содержимое поста',
  link: 'https://example.com',
});
```

## 🏗️ Архитектура

### Базовые принципы

1. **Унификация** - единый API для всех платформ
2. **Расширяемость** - легко добавлять новые мессенджеры
3. **Надежность** - обработка ошибок и валидация
4. **Производительность** - кэширование и оптимизация

### Ключевые компоненты

#### MessengerAdapter
Базовый интерфейс для всех адаптеров:
- `sendMessage()` - отправка сообщений
- `getBotInfo()` - информация о боте
- `setWebhook()` - настройка webhook'ов
- `validateToken()` - валидация токенов

#### AdapterFactory
Фабрика для создания адаптеров:
- Автоматическое определение типа
- Инициализация с валидацией
- Поддержка новых платформ

#### AdapterManager
Менеджер для управления множественными адаптерами:
- Кэширование подключений
- Массовые операции
- Статистика и мониторинг

## 🔧 Поддерживаемые платформы

### Telegram
- ✅ Отправка сообщений
- ✅ Форматирование (HTML, Markdown)
- ✅ Inline клавиатуры
- ✅ Webhook поддержка
- ✅ Валидация токенов

### MAX
- ✅ Отправка сообщений
- ✅ Форматирование (HTML, Markdown)
- ✅ Inline клавиатуры
- ✅ Webhook поддержка
- ✅ Валидация токенов

## 📝 Примеры

### Мультиплатформенная отправка

```typescript
// Боты для разных платформ
const telegramBot = { platform: MessengerPlatform.TELEGRAM, token: '...', channelId: '@channel' };
const maxBot = { platform: MessengerPlatform.MAX, token: '...', channelId: '123456' };

// Отправка на обе платформы
const results = await service.sendToCrossPlatform([
  { bot: telegramBot },
  { bot: maxBot }
], message);
```

### Проверка статуса ботов

```typescript
const statuses = await service.getBotsStatus();
console.log('Активные боты:', statuses.filter(s => s.status === 'active'));
```

### Настройка webhook'ов

```typescript
await service.setupWebhook('bot_id', 'https://myapp.com/webhook');
```

## 🛡️ Безопасность

- Валидация токенов по формату платформы
- Проверка прав доступа к каналам
- Обработка ошибок аутентификации
- Rate limiting поддержка

## 🔮 Планы развития

- [ ] Поддержка VK ботов
- [ ] Поддержка Discord
- [ ] Продвинутая аналитика
- [ ] Автоматическое восстановление подключений
- [ ] Batch операции для оптимизации

## 📊 Мониторинг

```typescript
// Получение статистики
const stats = service.getStats();
console.log(`Всего адаптеров: ${stats.total}`);
console.log(`Telegram: ${stats.byPlatform.telegram}`);
console.log(`MAX: ${stats.byPlatform.max}`);
```

---

Эта архитектура обеспечивает гибкую и масштабируемую интеграцию с различными мессенджерами, сохраняя при этом простоту использования.