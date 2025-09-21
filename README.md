# 🚀 FeedMaster

> **Advanced content management and automated publishing platform for Telegram channels**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/leszavr/Feedmaster)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)

---

## 📋 Overview

FeedMaster is a comprehensive platform designed to streamline content curation and automated publishing for Telegram channels. It combines intelligent content aggregation, AI-powered moderation, and seamless publishing workflows to help content creators and channel administrators manage their content efficiently.

### ✨ Key Features

- 🤖 **Bot Management**: Add and manage Telegram bots with API token validation
- 📡 **Multi-Source Content**: RSS feeds, Telegram channels, and web sources integration  
- 🔍 **Smart Filtering**: Advanced keyword filtering with AND/OR logic and blacklists
- 🧠 **AI Integration**: Automated content summarization and quality assessment using Google Gemini
- ✅ **Moderation Workflow**: Manual and automated content approval system
- ⏰ **Scheduled Publishing**: Smart timing and batch publishing capabilities
- 📊 **Analytics**: Comprehensive insights and performance metrics
- 🌐 **Multi-language**: Built-in internationalization support

---

## 🏗️ Architecture

FeedMaster follows a modern, scalable architecture:

```
┌─────────────────┬─────────────────┬─────────────────┐
│   Frontend      │   API Gateway   │  Microservices  │
│   (Next.js)     │    (FastAPI)    │     (Python)    │
└─────────────────┴─────────────────┴─────────────────┘
         │                  │                  │
         └──────────────────┼──────────────────┘
                            │
                    ┌───────▼───────┐
                    │  Data Layer   │
                    │ PostgreSQL +  │
                    │    Redis      │
                    └───────────────┘
```

### Tech Stack

**Frontend:**
- ⚡ **Next.js 15** with React 18 and TypeScript
- 🎨 **shadcn/ui** + Radix UI for components
- 💨 **Tailwind CSS** for styling
- 🌐 **next-intl** for internationalization

**Backend (Planned):**
- 🐍 **FastAPI** microservices architecture
- 🗄️ **PostgreSQL** for data persistence
- 🚀 **Redis** for caching and job queues
- 🔄 **Celery** for background task processing
- 🤖 **Firebase Genkit** + Google Gemini for AI features

**Infrastructure:**
- 🐳 **Docker** containerization
- ☸️ **Kubernetes** orchestration
- 📊 **Prometheus** + Grafana monitoring
- 🔒 **AWS/GCP** cloud deployment

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/leszavr/Feedmaster.git
   cd Feedmaster
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

---

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

- 📋 **[Implementation Plan](docs/detailed-implementation-plan.md)** - 16-week development roadmap
- 🏗️ **[Technical Architecture](docs/technical-architecture.md)** - System design and architecture
- 📅 **[Development Roadmap](docs/development-roadmap.md)** - Timeline and sprint planning  
- 🚀 **[Deployment Guide](docs/deployment-infrastructure-guide.md)** - Infrastructure and deployment
- ⚙️ **[Backend Specification](docs/backend-technical-specification.md)** - API and backend details

---

## 🛠️ Development

### Project Structure

```
feedmaster/
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   │   ├── ui/             # Base UI components (shadcn/ui)
│   │   ├── auth/           # Authentication components
│   │   ├── bots/           # Bot management
│   │   ├── sources/        # Content sources
│   │   └── moderation/     # Content moderation
│   ├── lib/                # Utilities and configurations
│   └── hooks/              # Custom React hooks
├── docs/                   # Project documentation
├── public/                 # Static assets
└── messages/               # Internationalization files
```

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checks

### Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Tailwind CSS** for styling

---

## 🚦 Roadmap

### Phase 1: Foundation (Weeks 1-4) ✅
- [x] UI/UX Implementation
- [x] Project documentation
- [x] Development planning

### Phase 2: Backend Development (Weeks 5-10) 🔄
- [ ] Microservices architecture
- [ ] Authentication system
- [ ] Bot management APIs
- [ ] Content processing pipeline

### Phase 3: AI Integration (Weeks 11-13) 📋
- [ ] Content summarization
- [ ] Quality assessment
- [ ] Smart moderation

### Phase 4: Production Ready (Weeks 14-16) 📋
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Deployment automation
- [ ] Monitoring & analytics

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **shadcn** for the beautiful UI components
- **Vercel** for hosting and deployment platform
- **Google** for Gemini AI integration

---

## 📞 Support

- 📧 **Email**: support@feedmaster.io
- 💬 **Discord**: [Join our community](https://discord.gg/feedmaster)
- 🐛 **Issues**: [GitHub Issues](https://github.com/leszavr/Feedmaster/issues)
- 📖 **Docs**: [Documentation](https://docs.feedmaster.io)

---

<div align="center">

**Built with ❤️ by the FeedMaster team**

[Website](https://feedmaster.io) • [Documentation](https://docs.feedmaster.io) • [Community](https://discord.gg/feedmaster)

</div>
