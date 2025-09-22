# 🤖 FeedMaster - Intelligent Content Automation Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC)](https://tailwindcss.com/)

**FeedMaster** is an intelligent system for automated content collection, filtering, and publishing to Telegram channels. Built with modern web technologies and designed for scalability.

## 🚀 Features

### 🎯 Core Functionality
- **Multi-source content aggregation**: RSS feeds, websites, Telegram channels, external APIs
- **Advanced filtering**: Keywords, blacklists, NLP, semantic analysis
- **Content moderation**: Manual review before publishing
- **Bot management**: Multiple Telegram bots through unified interface
- **Role-based access**: User, Moderator, Administrator, Owner roles

### 📊 Admin Panel
- **Dashboard**: Real-time analytics, user metrics, revenue tracking
- **User Management**: 12,483+ users, subscription management, violation tracking
- **Billing & Finance**: MRR ₽1,857,400, payment processing, revenue analytics
- **System Monitoring**: Performance metrics, self-hosted instance management

### � Internationalization
- **Primary**: Russian interface (default)
- **Secondary**: English interface
- **Localization**: Complete UI translation support

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

