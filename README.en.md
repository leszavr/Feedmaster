# 🤖 FeedMaster - Intelligent Content Automation Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC)](https://tailwindcss.com/)

**FeedMaster** is an intelligent system for automatic content collection, filtering, and publishing to messengers (Telegram, MAX). Built with modern web technologies and designed for scalability.

## 🚀 Features

### 🎯 Core Functionality
- **Multi-messenger Support**: Simultaneous publishing to Telegram and MAX
- **Multi-source Content Collection**: RSS feeds, websites, Telegram channels, external APIs
- **Advanced Filtering**: Keywords, blacklists, NLP, semantic analysis
- **Content Moderation**: Manual review before publishing
- **Bot Management**: Multiple bots through unified interface
- **Role-based Access**: User, Moderator, Administrator, Owner roles

### 📊 Administrative Panel
- **Dashboard**: Modern dashboard with analytics cards and glassmorphism design
- **Onboarding Process**: Step-by-step platform introduction for new users
- **Bot Management**: Creating and configuring bots for different platforms with validation
- **Content Sources System**: RSS and other content source configuration
- **Moderation**: Tools for manual content review
- **Settings System**: Profile, password, and other parameter management

### 🤖 Multi-messenger Integration
- **Telegram**: Full Telegram Bot API support
- **MAX**: Integration with Russian messenger MAX
- **Unified API**: Single interface for all platforms
- **Adapter Pattern**: Easy addition of new messengers
- **Validation**: Token and channel verification for each platform

### 🌍 Interface
- **Primary Language**: Russian interface
- **Modern Design**: Glassmorphism effects, responsive layout
- **UX Optimization**: Auto-save forms, real-time validation

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 15 + React 18 + TypeScript
- **UI Components**: shadcn/ui + Radix UI + Tailwind CSS
- **State Management**: TanStack Query for server state
- **Internationalization**: next-intl (Russian language)
- **Messengers**: Telegram Bot API + MAX Bot API (@maxhub/max-bot-api)
- **Forms**: React Hook Form + Zod validation + auto-save
- **Design**: Glassmorphism effects, live gradients, responsive layout
- **Icons**: Lucide React
- **Charts**: Recharts

### Project Structure
```
src/
├── app/
│   ├── [locale]/
│   │   ├── (app)/            # Main application routes
│   │   │   ├── dashboard/    # Main dashboard
│   │   │   ├── bots/         # Bot management
│   │   │   ├── sources/      # Content sources
│   │   │   ├── moderation/   # Content moderation
│   │   │   ├── users/        # User management
│   │   │   └── settings/     # Settings
│   │   ├── (auth)/           # Authentication routes
│   │   └── onboarding/       # Onboarding process
│   └── actions.ts            # Server actions
├── components/
│   ├── bots/                 # Bot components
│   ├── dashboard/            # Dashboard components
│   ├── layout/               # Layout components
│   ├── ui/                   # Reusable UI components
│   └── auth/                 # Authentication components
└── lib/
    ├── adapters/             # Messenger adapters
    ├── types.ts              # TypeScript definitions
    ├── utils.ts              # Utilities
    ├── validators.ts         # Token validation
    └── data.ts               # Test data
```

## 🚀 Getting Started

### Requirements
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone Repository**
```bash
git clone https://github.com/leszavr/Feedmaster.git
cd Feedmaster
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Start Development Server**
```bash
npm run dev
```

5. **Open Application**
- Main application: [http://localhost:9002](http://localhost:9002)
- Onboarding: [http://localhost:9002/onboarding](http://localhost:9002/onboarding)
- Dashboard: [http://localhost:9002/dashboard](http://localhost:9002/dashboard)

## 🤖 Multi-messenger Architecture

### Supported Platforms
- **Telegram**: Full integration with Telegram Bot API
- **MAX**: Integration with Russian messenger MAX

### Adapter Pattern
```typescript
// Create Telegram adapter
const telegramAdapter = await MessengerAdapterFactory.createAndInitialize({
  token: 'telegram_bot_token',
  platform: MessengerPlatform.TELEGRAM
});

// Create MAX adapter
const maxAdapter = await MessengerAdapterFactory.createAndInitialize({
  token: 'max_bot_token', 
  platform: MessengerPlatform.MAX
});

// Send message
const message = {
  text: '**Hello!** This is a test message.',
  format: 'markdown'
};

await telegramAdapter.sendMessage('chat_id', message);
await maxAdapter.sendMessage('chat_id', message);
```

### Validation Features
- **Telegram tokens**: `123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`
- **MAX tokens**: `max_bot_abc123def456ghi789`
- **Telegram channels**: `@channel` or `-1001234567890`
- **MAX channels**: `123456789` (numeric ID)

## 📊 Platform Features

### Dashboard
- **Modern Design**: Glassmorphism cards with live gradients
- **Statistics Cards**: Dynamic counters for bots, sources, posts
- **Activity Charts**: Interactive charts with Recharts
- **Recent Activities**: Real-time action feed with filtering

### Bot Management
- **Multi-platform**: Create bots for Telegram and MAX
- **Smart Validation**: Real-time token and channel verification by platform format
- **Auto-save**: Form drafts saved automatically
- **Status Monitoring**: Bot state tracking with indicators
- **Connection Testing**: Bot availability check before saving

### Onboarding and UX
- **Step-by-step Introduction**: 4-stage platform familiarization process
- **Visual Indicators**: Progress navigation with color codes
- **Interactive Tips**: Contextual help at each step
- **Modern Forms**: Enhanced validation, loading states, error handling

## 🛡️ Security

- **Token Validation**: Format verification for each platform
- **Obfuscation**: Token hiding in interface
- **Permission Checks**: Bot access validation to channels
- **Role-based Model**: Function access control

## 🚀 Roadmap

### Near-term Plans
- [x] **Landing Page**: Modern main page with glassmorphism design
- [x] **Onboarding Process**: Step-by-step introduction with visual indicators
- [x] **Form Improvements**: Auto-save, validation, loading states
- [x] **MAX Integration**: Russian messenger MAX support
- [x] **Multi-messenger Architecture**: Adapter pattern for scalability
- [ ] **Database**: PostgreSQL + Prisma ORM integration
- [ ] **API Endpoints**: Replace mock data with real APIs
- [ ] **RSS Parsing**: Automatic content collection implementation
- [ ] **AI Moderation**: OpenAI/Claude integration for filtering

### Long-term Goals
- [ ] **Additional Messengers**: VK, Discord, WhatsApp Business
- [ ] **Advanced Analytics**: Performance metrics, A/B testing
- [ ] **Webhook System**: Real-time notifications
- [ ] **Developer API**: Open API for integrations
- [ ] **Mobile Application**: iOS and Android versions

## 🚀 Deployment

### Development
```bash
npm run dev     # Start in development mode
npm run build   # Build for production
npm run start   # Start production server
```

### Production
- **Vercel**: Ready for Vercel deployment
- **Docker**: Containerization support
- **Self-hosted**: Deploy on own infrastructure

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@feedmaster.ru
- 💬 Telegram: @feedmaster_support
- 📖 GitHub: [github.com/leszavr/feedmaster](https://github.com/leszavr/feedmaster)

## 🗺️ Roadmap

- [x] **Q4 2024**: Basic UI and multi-messenger integration (Landing, Onboarding, MAX)
- [ ] **Q1 2025**: Backend integration (PostgreSQL, API endpoints) 
- [ ] **Q2 2025**: RSS parsing and AI content moderation
- [ ] **Q3 2025**: Additional messengers (VK, Discord)
- [ ] **Q4 2025**: Advanced analytics and mobile application

---

**Created with ❤️ for content automation** | **FeedMaster © 2024**