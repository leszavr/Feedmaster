# Техническая архитектура FeedMaster

## Схема базы данных

### Основные таблицы

```sql
-- Пользователи системы
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'moderator',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- Типы для enum полей
CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE source_type AS ENUM ('RSS', 'Telegram', 'Web');
CREATE TYPE source_status AS ENUM ('active', 'paused', 'error');
CREATE TYPE post_status AS ENUM ('pending', 'approved', 'rejected', 'published');
CREATE TYPE bot_status AS ENUM ('active', 'inactive', 'error');

-- Источники контента
CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type source_type NOT NULL,
    url TEXT NOT NULL,
    keywords TEXT[], -- массив ключевых слов
    blacklist TEXT[], -- массив запрещенных слов
    fetch_interval INTEGER DEFAULT 60, -- интервал в минутах
    status source_status DEFAULT 'active',
    last_fetch TIMESTAMP,
    fetch_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    last_error TEXT,
    filter_logic VARCHAR(10) DEFAULT 'OR', -- AND/OR логика фильтрации
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Telegram боты
CREATE TABLE bots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    token_encrypted TEXT NOT NULL, -- зашифрованный токен
    channel_id VARCHAR(255) NOT NULL, -- @channel или -100123456789
    status bot_status DEFAULT 'inactive',
    last_active TIMESTAMP,
    message_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Посты/контент
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT, -- AI сгенерированное резюме
    url TEXT, -- оригинальная ссылка
    image_url TEXT, -- изображение для поста
    keywords TEXT[], -- извлеченные ключевые слова
    status post_status DEFAULT 'pending',
    quality_score DECIMAL(3,2), -- от 0.00 до 1.00
    fetched_at TIMESTAMP DEFAULT NOW(),
    moderated_at TIMESTAMP,
    moderated_by UUID REFERENCES users(id),
    published_at TIMESTAMP,
    published_to UUID REFERENCES bots(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- История действий пользователей
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL, -- 'post_approved', 'bot_created', etc.
    entity_type VARCHAR(50), -- 'post', 'bot', 'source'
    entity_id UUID,
    details JSONB, -- дополнительная информация
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Статистика системы
CREATE TABLE system_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    posts_fetched INTEGER DEFAULT 0,
    posts_approved INTEGER DEFAULT 0,
    posts_rejected INTEGER DEFAULT 0,
    posts_published INTEGER DEFAULT 0,
    sources_active INTEGER DEFAULT 0,
    bots_active INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для производительности
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_fetched_at ON posts(fetched_at);
CREATE INDEX idx_posts_source_id ON posts(source_id);
CREATE INDEX idx_sources_status ON sources(status);
CREATE INDEX idx_sources_next_fetch ON sources(last_fetch, fetch_interval);
CREATE INDEX idx_bots_status ON bots(status);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
```

---

## API архитектура

### Микросервисы структура

```
┌─────────────────────────────────────────────────────────┐
│                    API Gateway                          │
│                   (FastAPI)                             │
│              Port: 8000                                 │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Auth Service│ │Content Srv  │ │ Bot Service │
│   Port:8001 │ │  Port:8002  │ │  Port:8003  │
└─────────────┘ └─────────────┘ └─────────────┘
        │             │             │
        └─────────────┼─────────────┘
                      │
              ┌───────▼───────┐
              │  PostgreSQL   │
              │   Port:5432   │
              └───────────────┘
```

### API Gateway Endpoints

```python
# api_gateway/main.py
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI(title="FeedMaster API Gateway")

# CORS настройка
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Роутинг к микросервисам
@app.api_route("/api/auth/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def auth_proxy(path: str, request: Request):
    async with httpx.AsyncClient() as client:
        url = f"http://auth-service:8001/{path}"
        response = await client.request(
            request.method,
            url,
            content=await request.body(),
            headers=dict(request.headers)
        )
        return Response(response.content, response.status_code, dict(response.headers))

@app.api_route("/api/content/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def content_proxy(path: str, request: Request):
    # Аналогично для content service
    pass

@app.api_route("/api/bots/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def bots_proxy(path: str, request: Request):
    # Аналогично для bot service
    pass
```

### Auth Service API

```python
# auth_service/main.py
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
import jwt, bcrypt
from datetime import datetime, timedelta

app = FastAPI(title="Auth Service")

@app.post("/register")
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Регистрация нового пользователя"""
    # Проверка уникальности email
    if get_user_by_email(db, user_data.email):
        raise HTTPException(400, "Email already registered")
    
    # Хеширование пароля
    password_hash = bcrypt.hashpw(user_data.password.encode(), bcrypt.gensalt())
    
    # Создание пользователя
    user = create_user(db, user_data, password_hash)
    
    # Генерация токенов
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    
    return {
        "user": user_to_dict(user),
        "access_token": access_token,
        "refresh_token": refresh_token
    }

@app.post("/login")
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Авторизация пользователя"""
    user = authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(401, "Invalid credentials")
    
    # Обновление last_login
    update_user_last_login(db, user.id)
    
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    
    return {
        "user": user_to_dict(user),
        "access_token": access_token,
        "refresh_token": refresh_token
    }

@app.post("/refresh")
async def refresh_token(token_data: RefreshToken, db: Session = Depends(get_db)):
    """Обновление access токена"""
    try:
        payload = jwt.decode(token_data.refresh_token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
        
        user = get_user(db, user_id)
        if not user or not user.is_active:
            raise HTTPException(401, "User not found or inactive")
        
        access_token = create_access_token(user.id)
        return {"access_token": access_token}
        
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid refresh token")

@app.get("/me")
async def get_current_user(current_user: User = Depends(get_current_user)):
    """Получение информации о текущем пользователе"""
    return user_to_dict(current_user)

@app.put("/profile")
async def update_profile(
    profile_data: UserUpdate, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Обновление профиля пользователя"""
    updated_user = update_user(db, current_user.id, profile_data)
    return user_to_dict(updated_user)
```

### Content Service API

```python
# content_service/main.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

app = FastAPI(title="Content Service")

@app.get("/sources", response_model=List[SourceResponse])
async def get_sources(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Получение списка источников пользователя"""
    sources = get_user_sources(db, current_user.id)
    return sources

@app.post("/sources", response_model=SourceResponse)
async def create_source(
    source_data: SourceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Создание нового источника"""
    source = create_user_source(db, current_user.id, source_data)
    
    # Запуск задачи для первой загрузки
    fetch_source_content.delay(source.id)
    
    return source

@app.put("/sources/{source_id}", response_model=SourceResponse)
async def update_source(
    source_id: str,
    source_data: SourceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Обновление источника"""
    source = get_source(db, source_id)
    if not source or source.user_id != current_user.id:
        raise HTTPException(404, "Source not found")
    
    updated_source = update_source_data(db, source_id, source_data)
    return updated_source

@app.delete("/sources/{source_id}")
async def delete_source(
    source_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Удаление источника"""
    source = get_source(db, source_id)
    if not source or source.user_id != current_user.id:
        raise HTTPException(404, "Source not found")
    
    delete_source_by_id(db, source_id)
    return {"message": "Source deleted"}

@app.get("/posts", response_model=List[PostResponse])
async def get_posts(
    status: Optional[str] = None,
    source_id: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Получение списка постов с фильтрацией"""
    posts = get_user_posts(db, current_user.id, status, source_id, limit, offset)
    return posts

@app.get("/posts/pending", response_model=List[PostResponse])
async def get_pending_posts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Получение постов на модерацию"""
    if current_user.role not in ['admin', 'moderator']:
        raise HTTPException(403, "Not enough permissions")
    
    posts = get_posts_by_status(db, 'pending')
    return posts

@app.put("/posts/{post_id}/status")
async def update_post_status(
    post_id: str,
    status_data: PostStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Обновление статуса поста (модерация)"""
    if current_user.role not in ['admin', 'moderator']:
        raise HTTPException(403, "Not enough permissions")
    
    post = get_post(db, post_id)
    if not post:
        raise HTTPException(404, "Post not found")
    
    updated_post = update_post_status_db(
        db, post_id, status_data.status, current_user.id
    )
    
    # Если пост одобрен, запускаем публикацию
    if status_data.status == 'approved':
        publish_post.delay(post_id)
    
    # Логирование действия
    log_audit_action(
        db, current_user.id, 'post_moderated', 
        'post', post_id, {'status': status_data.status}
    )
    
    return updated_post
```

### Bot Service API

```python
# bot_service/main.py
from fastapi import FastAPI, Depends, HTTPException
from telegram import Bot
from telegram.error import TelegramError
import asyncio

app = FastAPI(title="Bot Service")

@app.get("/bots", response_model=List[BotResponse])
async def get_bots(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Получение списка ботов пользователя"""
    bots = get_user_bots(db, current_user.id)
    return bots

@app.post("/bots", response_model=BotResponse)
async def create_bot(
    bot_data: BotCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Создание нового бота"""
    # Валидация токена
    is_valid = await validate_telegram_token(bot_data.token)
    if not is_valid:
        raise HTTPException(400, "Invalid Telegram bot token")
    
    # Шифрование токена
    encrypted_token = encrypt_token(bot_data.token)
    
    bot = create_user_bot(db, current_user.id, bot_data, encrypted_token)
    
    # Логирование
    log_audit_action(
        db, current_user.id, 'bot_created', 
        'bot', bot.id, {'name': bot.name}
    )
    
    return bot

@app.put("/bots/{bot_id}", response_model=BotResponse)
async def update_bot(
    bot_id: str,
    bot_data: BotUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Обновление бота"""
    bot = get_bot(db, bot_id)
    if not bot or bot.user_id != current_user.id:
        raise HTTPException(404, "Bot not found")
    
    # Если обновляется токен, валидируем его
    if bot_data.token:
        is_valid = await validate_telegram_token(bot_data.token)
        if not is_valid:
            raise HTTPException(400, "Invalid Telegram bot token")
        bot_data.token = encrypt_token(bot_data.token)
    
    updated_bot = update_bot_data(db, bot_id, bot_data)
    return updated_bot

@app.delete("/bots/{bot_id}")
async def delete_bot(
    bot_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Удаление бота"""
    bot = get_bot(db, bot_id)
    if not bot or bot.user_id != current_user.id:
        raise HTTPException(404, "Bot not found")
    
    delete_bot_by_id(db, bot_id)
    
    log_audit_action(
        db, current_user.id, 'bot_deleted', 
        'bot', bot_id, {'name': bot.name}
    )
    
    return {"message": "Bot deleted"}

@app.post("/bots/{bot_id}/validate")
async def validate_bot_token(
    bot_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Валидация токена бота"""
    bot = get_bot(db, bot_id)
    if not bot or bot.user_id != current_user.id:
        raise HTTPException(404, "Bot not found")
    
    decrypted_token = decrypt_token(bot.token_encrypted)
    is_valid = await validate_telegram_token(decrypted_token)
    
    # Обновление статуса бота
    new_status = 'active' if is_valid else 'error'
    update_bot_status(db, bot_id, new_status)
    
    return {"valid": is_valid, "status": new_status}

@app.post("/bots/{bot_id}/publish")
async def publish_to_telegram(
    bot_id: str,
    content: PublishContent,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Публикация контента в Telegram"""
    bot = get_bot(db, bot_id)
    if not bot or bot.user_id != current_user.id:
        raise HTTPException(404, "Bot not found")
    
    try:
        decrypted_token = decrypt_token(bot.token_encrypted)
        telegram_bot = Bot(token=decrypted_token)
        
        # Отправка сообщения
        message = await telegram_bot.send_message(
            chat_id=bot.channel_id,
            text=content.text,
            parse_mode='HTML' if content.html else None
        )
        
        # Обновление статистики
        increment_bot_message_count(db, bot_id)
        update_bot_last_active(db, bot_id)
        
        return {
            "success": True,
            "message_id": message.message_id,
            "chat_id": message.chat_id
        }
        
    except TelegramError as e:
        # Логирование ошибки
        update_bot_error(db, bot_id, str(e))
        raise HTTPException(400, f"Telegram error: {str(e)}")

@app.get("/bots/{bot_id}/stats")
async def get_bot_stats(
    bot_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Статистика бота"""
    bot = get_bot(db, bot_id)
    if not bot or bot.user_id != current_user.id:
        raise HTTPException(404, "Bot not found")
    
    stats = get_bot_statistics(db, bot_id)
    return stats

# Вспомогательные функции
async def validate_telegram_token(token: str) -> bool:
    """Валидация токена через Telegram API"""
    try:
        bot = Bot(token=token)
        bot_info = await bot.get_me()
        return True
    except TelegramError:
        return False
```

---

## Pydantic модели для API

```python
# models/api_models.py
from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum

# User models
class UserRole(str, Enum):
    admin = "admin"
    moderator = "moderator"
    user = "user"

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    avatar_url: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    avatar_url: Optional[str]
    role: UserRole
    created_at: datetime
    last_login: Optional[datetime]

# Source models
class SourceType(str, Enum):
    RSS = "RSS"
    Telegram = "Telegram"
    Web = "Web"

class SourceStatus(str, Enum):
    active = "active"
    paused = "paused"
    error = "error"

class SourceCreate(BaseModel):
    name: str
    type: SourceType
    url: str
    keywords: List[str] = []
    blacklist: List[str] = []
    fetch_interval: int = 60
    filter_logic: str = "OR"

class SourceUpdate(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None
    keywords: Optional[List[str]] = None
    blacklist: Optional[List[str]] = None
    fetch_interval: Optional[int] = None
    status: Optional[SourceStatus] = None

class SourceResponse(BaseModel):
    id: str
    name: str
    type: SourceType
    url: str
    keywords: List[str]
    blacklist: List[str]
    fetch_interval: int
    status: SourceStatus
    last_fetch: Optional[datetime]
    fetch_count: int
    error_count: int
    created_at: datetime

# Bot models
class BotStatus(str, Enum):
    active = "active"
    inactive = "inactive"
    error = "error"

class BotCreate(BaseModel):
    name: str
    token: str
    channel_id: str

class BotUpdate(BaseModel):
    name: Optional[str] = None
    token: Optional[str] = None
    channel_id: Optional[str] = None
    status: Optional[BotStatus] = None

class BotResponse(BaseModel):
    id: str
    name: str
    channel_id: str
    status: BotStatus
    last_active: Optional[datetime]
    message_count: int
    error_count: int
    created_at: datetime

# Post models
class PostStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    published = "published"

class PostStatusUpdate(BaseModel):
    status: PostStatus

class PostResponse(BaseModel):
    id: str
    title: str
    content: str
    summary: Optional[str]
    url: Optional[str]
    keywords: List[str]
    status: PostStatus
    quality_score: Optional[float]
    fetched_at: datetime
    moderated_at: Optional[datetime]
    published_at: Optional[datetime]
    source: SourceResponse

# Publish models
class PublishContent(BaseModel):
    text: str
    html: bool = False

# Auth models
class RefreshToken(BaseModel):
    refresh_token: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: UserResponse
```

Эта архитектура обеспечивает:

1. **Масштабируемость** - микросервисы можно независимо масштабировать
2. **Безопасность** - шифрование токенов, JWT аутентификация, аудит логи  
3. **Производительность** - индексы в БД, кэширование через Redis
4. **Мониторинг** - логирование всех действий, метрики для каждого сервиса
5. **Гибкость** - легко добавлять новые источники и типы контента

Готовы перейти к техническому заданию для каждого компонента?