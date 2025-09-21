# Техническое задание: Backend API для FeedMaster

## 1. Общие требования

### 1.1 Архитектура
- **Микросервисная архитектура** с API Gateway
- **RESTful API** с OpenAPI документацией
- **Асинхронная обработка** для тяжелых операций
- **Horizontal scaling** поддержка

### 1.2 Технологический стек
- **FastAPI 0.104+** для всех сервисов
- **PostgreSQL 15** как основная БД
- **Redis 7** для кэширования и очередей
- **Celery** для фоновых задач
- **Docker** для контейнеризации

## 2. Сервисы

### 2.1 API Gateway
**Порт**: 8000  
**Ответственность**: Роутинг запросов, аутентификация, rate limiting

#### Endpoints:
```
GET  /health                    # Health check
POST /auth/login               # Аутентификация
POST /auth/refresh            # Обновление токена
GET  /api/v1/users/*          # Проксирование в User Service
GET  /api/v1/bots/*           # Проксирование в Bot Service
GET  /api/v1/sources/*        # Проксирование в Content Service
```

#### Middleware:
- **CORS** для frontend
- **Rate limiting** (100 req/min per IP)
- **JWT validation**
- **Request logging**

### 2.2 Auth Service
**Порт**: 8001  
**Ответственность**: Аутентификация и авторизация

#### Endpoints:
```
POST /auth/register           # Регистрация
POST /auth/login             # Вход
POST /auth/refresh           # Обновление токена
POST /auth/logout            # Выход
POST /auth/forgot-password   # Восстановление пароля
POST /auth/reset-password    # Сброс пароля
GET  /auth/verify-token      # Проверка токена
```

#### Модели данных:
```python
class User(BaseModel):
    id: UUID
    email: EmailStr
    password_hash: str
    role: UserRole = UserRole.MODERATOR
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

class UserRole(str, Enum):
    ADMIN = "admin"
    MODERATOR = "moderator"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
```

### 2.3 Bot Management Service
**Порт**: 8002  
**Ответственность**: Управление Telegram ботами

#### Endpoints:
```
GET    /bots                  # Список ботов пользователя
POST   /bots                  # Добавить бота
GET    /bots/{bot_id}        # Информация о боте
PUT    /bots/{bot_id}        # Обновить бота
DELETE /bots/{bot_id}        # Удалить бота
POST   /bots/{bot_id}/validate # Проверить токен
GET    /bots/{bot_id}/channels # Каналы бота
POST   /bots/{bot_id}/publish  # Опубликовать сообщение
```

#### Модели данных:
```python
class Bot(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    token: str  # Зашифрован в БД
    username: Optional[str]
    first_name: Optional[str]
    status: BotStatus = BotStatus.INACTIVE
    created_at: datetime
    last_active: Optional[datetime]

class BotStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    ERROR = "error"

class Channel(BaseModel):
    id: str  # Telegram channel ID
    title: str
    username: Optional[str]
    type: ChannelType
    bot_permissions: List[str]

class PublishRequest(BaseModel):
    channel_id: str
    text: str
    parse_mode: Optional[str] = "HTML"
    media: Optional[List[str]]
    schedule_time: Optional[datetime]
```

### 2.4 Content Service
**Porт**: 8003  
**Ответственность**: Управление источниками и контентом

#### Endpoints:
```
# Sources
GET    /sources               # Список источников
POST   /sources               # Добавить источник
GET    /sources/{source_id}   # Информация об источнике
PUT    /sources/{source_id}   # Обновить источник
DELETE /sources/{source_id}   # Удалить источник
POST   /sources/{source_id}/test # Тестировать источник

# Posts
GET    /posts                 # Список постов с фильтрацией
GET    /posts/{post_id}       # Информация о посте
PUT    /posts/{post_id}/status # Обновить статус (модерация)
POST   /posts/{post_id}/summarize # Создать саммари
GET    /posts/pending         # Посты на модерацию
POST   /posts/bulk-action     # Массовые операции
```

#### Модели данных:
```python
class Source(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    type: SourceType
    url: HttpUrl
    keywords: List[str] = []
    blacklist: List[str] = []
    filter_logic: FilterLogic = FilterLogic.OR
    fetch_interval: int = 60  # minutes
    status: SourceStatus = SourceStatus.ACTIVE
    last_fetch: Optional[datetime]
    created_at: datetime

class SourceType(str, Enum):
    RSS = "rss"
    TELEGRAM = "telegram"
    WEB = "web"

class Post(BaseModel):
    id: UUID
    source_id: UUID
    title: str
    content: str
    summary: Optional[str]
    url: HttpUrl
    keywords: List[str] = []
    status: PostStatus = PostStatus.PENDING
    ai_score: Optional[float]  # 0-1, качество контента
    fetched_at: datetime
    moderated_at: Optional[datetime]
    published_at: Optional[datetime]

class PostStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    PUBLISHED = "published"
```

### 2.5 AI Service
**Порт**: 8004  
**Ответственность**: ИИ обработка контента

#### Endpoints:
```
POST /ai/summarize           # Создать саммари
POST /ai/analyze-quality     # Оценить качество контента
POST /ai/extract-keywords    # Извлечь ключевые слова
POST /ai/classify-content    # Классифицировать контент
POST /ai/detect-spam         # Детекция спама
```

#### Модели данных:
```python
class SummarizeRequest(BaseModel):
    text: str
    max_length: int = 280
    language: str = "ru"

class SummarizeResponse(BaseModel):
    summary: str
    confidence: float

class QualityAnalysisResponse(BaseModel):
    score: float  # 0-1
    reasons: List[str]
    recommendation: str  # approve/reject/review

class KeywordExtraction(BaseModel):
    text: str
    language: str = "ru"
    max_keywords: int = 10
```

## 3. База данных

### 3.1 PostgreSQL Schema

```sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'moderator',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Bots
CREATE TABLE bots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    token_encrypted TEXT NOT NULL,
    username VARCHAR(255),
    first_name VARCHAR(255),
    status bot_status DEFAULT 'inactive',
    last_active TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sources
CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type source_type NOT NULL,
    url TEXT NOT NULL,
    keywords TEXT[] DEFAULT '{}',
    blacklist TEXT[] DEFAULT '{}',
    filter_logic filter_logic DEFAULT 'OR',
    fetch_interval INTEGER DEFAULT 60,
    status source_status DEFAULT 'active',
    last_fetch TIMESTAMP,
    last_error TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Posts
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    url TEXT NOT NULL UNIQUE,
    keywords TEXT[] DEFAULT '{}',
    status post_status DEFAULT 'pending',
    ai_score DECIMAL(3,2),
    fetched_at TIMESTAMP DEFAULT NOW(),
    moderated_at TIMESTAMP,
    moderated_by UUID REFERENCES users(id),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Channels
CREATE TABLE channels (
    id VARCHAR(255) PRIMARY KEY,  -- Telegram chat ID
    bot_id UUID REFERENCES bots(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    type channel_type NOT NULL,
    permissions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Publication History
CREATE TABLE publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id),
    bot_id UUID REFERENCES bots(id),
    channel_id VARCHAR(255) REFERENCES channels(id),
    message_id INTEGER,
    status publication_status DEFAULT 'pending',
    error_message TEXT,
    published_at TIMESTAMP DEFAULT NOW()
);

-- Enums
CREATE TYPE user_role AS ENUM ('admin', 'moderator');
CREATE TYPE bot_status AS ENUM ('active', 'inactive', 'error');
CREATE TYPE source_type AS ENUM ('rss', 'telegram', 'web');
CREATE TYPE source_status AS ENUM ('active', 'paused', 'error');
CREATE TYPE filter_logic AS ENUM ('AND', 'OR');
CREATE TYPE post_status AS ENUM ('pending', 'approved', 'rejected', 'published');
CREATE TYPE channel_type AS ENUM ('channel', 'group', 'supergroup');
CREATE TYPE publication_status AS ENUM ('pending', 'published', 'failed');

-- Indexes
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_source_id ON posts(source_id);
CREATE INDEX idx_posts_fetched_at ON posts(fetched_at);
CREATE INDEX idx_sources_user_id ON sources(user_id);
CREATE INDEX idx_sources_status ON sources(status);
CREATE INDEX idx_bots_user_id ON bots(user_id);
CREATE INDEX idx_bots_status ON bots(status);
```

### 3.2 Redis Schema

```
# Кэш токенов (TTL 24h)
auth:tokens:{user_id} -> JWT token info

# Кэш постов (TTL 1h)
posts:cache:{post_id} -> Post JSON

# Источники для обработки
queue:fetch:rss -> List of source IDs
queue:fetch:telegram -> List of source IDs
queue:ai:processing -> List of post IDs

# Rate limiting
rate_limit:user:{user_id}:{endpoint} -> counter
rate_limit:ip:{ip}:{endpoint} -> counter

# Статистика
stats:daily:{date} -> Daily stats JSON
stats:sources:{source_id} -> Source stats
```

## 4. Celery Tasks

### 4.1 Content Fetching
```python
@app.task
def fetch_rss_source(source_id: str):
    """Загрузка RSS источника"""

@app.task  
def fetch_telegram_source(source_id: str):
    """Загрузка Telegram канала"""

@app.task
def fetch_web_source(source_id: str):
    """Загрузка веб-сайта"""
```

### 4.2 AI Processing
```python
@app.task
def generate_summary(post_id: str):
    """Генерация саммари для поста"""

@app.task
def analyze_content_quality(post_id: str):
    """Анализ качества контента"""

@app.task
def auto_moderate_post(post_id: str):
    """Автоматическая модерация"""
```

### 4.3 Publishing
```python
@app.task
def publish_to_telegram(post_id: str, bot_id: str, channel_id: str):
    """Публикация в Telegram"""

@app.task
def schedule_publication(post_id: str, schedule_time: datetime):
    """Отложенная публикация"""
```

### 4.4 Periodic Tasks
```python
@app.task
def cleanup_old_posts():
    """Очистка старых постов"""

@app.task  
def update_source_statistics():
    """Обновление статистики источников"""

@app.task
def health_check_bots():
    """Проверка состояния ботов"""
```

## 5. Security Requirements

### 5.1 Authentication & Authorization
- **JWT tokens** с expiration time 1h
- **Refresh tokens** с TTL 30 дней
- **Role-based access control** (RBAC)
- **Password hashing** с bcrypt

### 5.2 Data Protection
- **Encryption** всех Bot API токенов
- **HTTPS only** для всех соединений
- **Rate limiting** по пользователям и IP
- **Input validation** всех параметров

### 5.3 Security Headers
```python
# В каждом сервисе
from fastapi.middleware.security import HTTPSRedirectMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app.add_middleware(HTTPSRedirectMiddleware)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*.feedmaster.io"])

# Security headers
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response
```

## 6. Performance Requirements

### 6.1 Response Times
- **API calls**: < 200ms (95th percentile)
- **Content fetching**: < 30s per source
- **AI processing**: < 10s per post
- **Publishing**: < 5s per post

### 6.2 Throughput
- **API requests**: 1000 RPS
- **Content processing**: 100 posts/minute
- **Publications**: 50 posts/minute
- **Concurrent users**: 100+

### 6.3 Availability
- **Uptime**: 99.9%
- **Error rate**: < 0.1%
- **Recovery time**: < 5 minutes

## 7. Monitoring & Logging

### 7.1 Metrics (Prometheus)
```python
from prometheus_client import Counter, Histogram, Gauge

# Counters
api_requests_total = Counter('api_requests_total', 'Total API requests', ['method', 'endpoint', 'status'])
posts_processed_total = Counter('posts_processed_total', 'Total posts processed', ['source_type', 'status'])

# Histograms  
request_duration = Histogram('request_duration_seconds', 'Request duration')
content_fetch_duration = Histogram('content_fetch_duration_seconds', 'Content fetch time')

# Gauges
active_sources = Gauge('active_sources_count', 'Number of active sources')
pending_posts = Gauge('pending_posts_count', 'Number of pending posts')
```

### 7.2 Structured Logging
```python
import structlog

logger = structlog.get_logger()

# В коде
logger.info("Post processed", 
           post_id=post.id, 
           source_id=post.source_id,
           status=post.status,
           processing_time=duration)
```

### 7.3 Health Checks
```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "version": "1.0.0",
        "dependencies": {
            "database": await check_database(),
            "redis": await check_redis(),
            "telegram_api": await check_telegram()
        }
    }
```

## 8. Error Handling

### 8.1 HTTP Error Responses
```python
class ErrorResponse(BaseModel):
    error: str
    message: str
    details: Optional[Dict] = None
    timestamp: datetime
    request_id: str

# Standard error codes
400 - Bad Request (validation errors)
401 - Unauthorized (auth required)
403 - Forbidden (insufficient permissions)  
404 - Not Found
429 - Too Many Requests (rate limit)
500 - Internal Server Error
503 - Service Unavailable
```

### 8.2 Retry Logic
```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=10)
)
async def fetch_with_retry(url: str):
    # Fetch content with retry logic
    pass
```

## 9. Testing Strategy

### 9.1 Unit Tests
- **Coverage**: 80%+ для всех сервисов
- **Framework**: pytest + pytest-asyncio
- **Mocking**: httpx_mock для внешних API

### 9.2 Integration Tests  
- **Database tests** с test containers
- **API tests** для всех endpoints
- **Celery task tests**

### 9.3 E2E Tests
- **Critical user journeys**
- **Cross-service interactions**
- **Performance testing**

## 10. Deployment

### 10.1 Docker Configuration
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 10.2 Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/feedmaster
REDIS_URL=redis://redis:6379/0

# Security  
SECRET_KEY=your-secret-key
ENCRYPTION_KEY=your-encryption-key

# External APIs
TELEGRAM_API_URL=https://api.telegram.org
OPENAI_API_KEY=your-openai-key

# Features
ENABLE_AI_MODERATION=true
MAX_CONTENT_LENGTH=10000
```

## 11. API Documentation

### 11.1 OpenAPI Specification
- **Automatic generation** через FastAPI
- **Interactive docs** на `/docs`
- **ReDoc** на `/redoc`
- **OpenAPI JSON** на `/openapi.json`

### 11.2 Authentication
```yaml
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - BearerAuth: []
```

Этот технический документ покрывает все основные аспекты backend разработки и служит руководством для команды разработки.