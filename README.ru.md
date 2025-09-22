# 🤖 FeedMaster - Интеллектуальная платформа автоматизации контента

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC)](https://tailwindcss.com/)

**FeedMaster** — это интеллектуальная система автоматического сбора, фильтрации и публикации контента в Telegram-каналы. Создана с использованием современных веб-технологий и спроектирована для масштабируемости.

## 🚀 Возможности

### 🎯 Основной функционал
- **Многоисточниковый сбор контента**: RSS-ленты, веб-сайты, Telegram-каналы, внешние API
- **Продвинутая фильтрация**: Ключевые слова, чёрные списки, NLP, семантический анализ
- **Модерация контента**: Ручная проверка перед публикацией
- **Управление ботами**: Несколько Telegram-ботов через единый интерфейс
- **Ролевая модель**: Пользователь, Модератор, Администратор, Владелец

### 📊 Административная панель
- **Dashboard**: Аналитика в реальном времени, метрики пользователей, отслеживание доходов
- **Управление пользователями**: 12,483+ пользователей, управление подписками, отслеживание нарушений
- **Биллинг и финансы**: MRR ₽1,857,400, обработка платежей, аналитика доходов
- **Системный мониторинг**: Метрики производительности, управление self-hosted инсталляциями

### 🌍 Интернационализация
- **Основной**: Русский интерфейс (по умолчанию)
- **Дополнительный**: Английский интерфейс
- **Локализация**: Полная поддержка перевода UI

## 🏗️ Архитектура

### Технологический стек
- **Frontend**: Next.js 15 + React 18 + TypeScript
- **UI компоненты**: shadcn/ui + Radix UI + Tailwind CSS
- **Управление состоянием**: TanStack Query для серверного состояния
- **Интернационализация**: next-intl
- **Иконки**: Lucide React
- **Графики**: Recharts

### Структура проекта
```
src/
├── app/
│   ├── [locale]/
│   │   ├── (admin)/          # Маршруты админ панели
│   │   │   ├── admin/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── users/
│   │   │   │   ├── billing/
│   │   │   │   └── system/
│   │   │   └── layout.tsx
│   │   ├── (app)/            # Основные маршруты приложения
│   │   └── (auth)/           # Маршруты аутентификации
│   └── api/
│       └── admin/            # API endpoints
├── components/
│   ├── admin/                # Компоненты для админки
│   ├── ui/                   # Переиспользуемые UI компоненты
│   └── ...
└── lib/
    ├── types.ts              # TypeScript определения
    ├── utils.ts              # Утилиты
    └── data.ts               # Тестовые данные
```

## 🚀 Начало работы

### Требования
- Node.js 18+ 
- npm или yarn

### Установка

1. **Клонирование репозитория**
```bash
git clone https://github.com/leszavr/Feedmaster.git
cd Feedmaster
```

2. **Установка зависимостей**
```bash
npm install
```

3. **Настройка переменных окружения**
```bash
cp .env.example .env.local
# Отредактируйте .env.local с вашей конфигурацией
```

4. **Запуск сервера разработки**
```bash
npm run dev
```

5. **Открытие приложения**
- Основное приложение: [http://localhost:9002](http://localhost:9002)
- Админ панель: [http://localhost:9002/admin/dashboard](http://localhost:9002/admin/dashboard)

## 🔧 Конфигурация

### Переменные окружения
```env
# Конфигурация Firebase
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id

# Telegram Bot API
TELEGRAM_BOT_TOKEN=your_bot_token

# База данных
DATABASE_URL=postgresql://username:password@localhost:5432/feedmaster

# Обработка платежей
PAYMENT_PROVIDER_API_KEY=your_payment_key
```

### Настройка локализации
Платформа поддерживает русский (по умолчанию) и английский языки:

```typescript
// src/navigation.ts
export const locales = ['ru', 'en'] as const;
export const defaultLocale = 'ru' as const;
```

## 📊 Функции административной панели

### Аналитика Dashboard
- **Метрики пользователей**: 12,483 всего пользователей, отслеживание подписок
- **Доходы**: MRR ₽1,857,400, ARR ₽22,288,800
- **Производительность**: Графики и KPI в реальном времени

### Управление пользователями
- **Фильтрация**: По роли, тарифу, статусу
- **Действия**: Блокировка/разблокировка, изменение тарифов, отправка сообщений
- **Мониторинг**: Использование ботов, отслеживание жалоб

### Система биллинга
- **Способы оплаты**: СБП, банковские карты, ЮMoney
- **Тарифные планы**: Free, Pro, Team, Enterprise
- **Аналитика**: Доходы по странам, коэффициент оттока

### Системный мониторинг
- **Производительность**: Использование CPU, RAM, диска
- **Self-hosted**: Управление инсталляциями, лицензирование
- **Оповещения**: Отслеживание критических инцидентов

## 🛡️ Безопасность и соответствие требованиям

- **Шифрование токенов**: Токены Telegram ботов зашифрованы при хранении
- **RBAC**: Ролевая модель доступа
- **Аудит логирование**: Отслеживание действий пользователей
- **Соответствие РФ**: Локальные платёжные системы, резидентность данных

## 📱 API Endpoints

### Admin API
```typescript
GET /api/admin/dashboard    # Аналитика dashboard
GET /api/admin/users        # Данные управления пользователями
GET /api/admin/billing      # Данные биллинга и финансов
GET /api/admin/system       # Данные системного мониторинга
```

## 🚢 Развёртывание

### Production сборка
```bash
npm run build
npm start
```

### Docker развёртывание
```bash
docker build -t feedmaster .
docker run -p 3000:3000 feedmaster
```

### Настройка окружения
- **SaaS**: Развёртывание на облачных провайдерах (Vercel, Railway, и т.д.)
- **Self-hosted**: Docker контейнеры, собственная инфраструктура

## 🤝 Участие в разработке

1. Форкните репозиторий
2. Создайте ветку функциональности (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📝 Лицензия

Этот проект лицензирован под лицензией MIT - см. файл [LICENSE](LICENSE) для подробностей.

## 🆘 Поддержка

- 📧 Email: support@feedmaster.app
- 💬 Telegram: @feedmaster_support
- 📖 Документация: [docs.feedmaster.app](https://docs.feedmaster.app)

## 🗺️ Roadmap

- [ ] **Q4 2025**: Интеграция FastAPI backend
- [ ] **Q1 2026**: Продвинутая AI фильтрация контента
- [ ] **Q2 2026**: Мульти-платформенные публикации (Discord, Slack)
- [ ] **Q3 2026**: Продвинутая аналитика и инсайты
- [ ] **Q4 2026**: Enterprise функции и white-labeling

---

**Создано с ❤️ в России** | **FeedMaster © 2025**