# FeedMaster

Advanced content management and automated publishing platform for Telegram channels.

## Features

- **Bot Management**: Add and manage Telegram bots with API token validation
- **Source Configuration**: Configure various content sources including RSS feeds and open Telegram channels  
- **Content Fetching**: Asynchronously fetch content from configured sources based on a defined schedule
- **Keyword Filtering**: Filter fetched content based on specified keywords and blacklists
- **Manual Moderation**: Provide a moderation interface to review and approve/reject content before publication
- **Content Publication**: Publish approved content to the designated Telegram channel via the Telegram Bot API
- **AI Summarization**: Summarize fetched content using generative AI before sending to manual moderation

## Tech Stack

- **Frontend**: Next.js 15 + React 18 + TypeScript
- **UI**: shadcn/ui + Radix UI + Tailwind CSS
- **AI**: Firebase Genkit + Google AI
- **Internationalization**: next-intl
- **Hosting**: Firebase App Hosting

## Getting Started

To get started, take a look at src/app/[locale]/page.tsx.
