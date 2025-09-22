import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Rss, 
  ShieldCheck, 
  Zap, 
  Users, 
  BarChart3,
  Check,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Clock,
  TrendingUp
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bot className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">FeedMaster</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Войти</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Начать бесплатно
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="space-y-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm">
                <span className="animate-pulse">✨</span>
                <span className="ml-2">Устали вручную собирать контент?</span>
              </div>
              
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Ваш Telegram канал работает <br />
                  <span className="relative">
                    на автопилоте
                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-purple-300" viewBox="0 0 200 12" fill="none">
                      <path d="M2 6C40 2, 80 2, 120 6C140 8, 160 8, 198 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                  </span>
                </h1>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  Помните, как раньше вы тратили <strong>часы</strong> на поиск интересных статей? 
                  А потом еще больше времени на их редактирование и публикацию? 
                  <br /><br />
                  <span className="text-purple-600 font-medium">Теперь всё это делает FeedMaster.</span> 
                  Просто настройте один раз — и ваш канал будет наполняться качественным контентом сам.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/login">
                    <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">
                      Хочу попробовать бесплатно
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="px-8 py-3 rounded-xl border-2">
                    Посмотреть как работает
                  </Button>
                </div>
                
                <p className="text-sm text-gray-500">
                  💳 Не нужна карта • 🚀 Запуск за 2 минуты • 🎯 1000+ довольных пользователей
                </p>
              </div>
            </div>
            
            {/* Right Column - Visual */}
            <div className="relative lg:block hidden">
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-400 ml-4">FeedMaster Dashboard</span>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-700">✅ Найдено 12 новых статей из Habr</span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-blue-700">🤖 ИИ обработал и одобрил 8 постов</span>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-purple-700">🚀 Опубликовано в канал (1.2K подписчиков)</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Сегодня:</span>
                      <span className="font-semibold text-gray-700">24 поста • 95% качества</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                Экономия: 4.5 часа
              </div>
              <div className="absolute -bottom-4 -left-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                Без вашего участия!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Знакомая ситуация? 🤔
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-400">
                <div className="text-4xl mb-4">😩</div>
                <h3 className="font-semibold text-gray-900 mb-2">Каждый день одно и то же</h3>
                <p className="text-gray-600 text-sm">
                  Открываете 20 сайтов, ищете что-то интересное, копируете, форматируете...
                  И так каждый день по несколько часов.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-400">
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="font-semibold text-gray-900 mb-2">Времени катастрофически не хватает</h3>
                <p className="text-gray-600 text-sm">
                  Хотите публиковать регулярно, но на поиск и подготовку контента 
                  уходит половина дня. А еще основная работа...
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-400">
                <div className="text-4xl mb-4">📉</div>
                <h3 className="font-semibold text-gray-900 mb-2">Качество страдает</h3>
                <p className="text-gray-600 text-sm">
                  В спешке публикуете что попало. Подписчики отписываются. 
                  Канал превращается в свалку случайных ссылок.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">А что если всё это делать не нужно? 🚀</h3>
              <p className="text-lg opacity-90">
                FeedMaster берет на себя всю рутину: находит контент, проверяет качество, 
                форматирует и публикует. Вы просто настраиваете один раз и получаете 
                результат.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Как это работает? Просто как 1-2-3 ✨
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Никакой магии — только умные алгоритмы, которые работают пока вы спите
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Добавляете источники</h3>
              <p className="text-gray-600">
                RSS фиды любимых блогов, Telegram каналы, новостные сайты — 
                всё что читаете сами
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">ИИ отбирает лучшее</h3>
              <p className="text-gray-600">
                Умный алгоритм читает всё новое, отсеивает спам и мусор, 
                оставляет только качественный контент
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Автоматически публикует</h3>
              <p className="text-gray-600">
                Форматирует, добавляет хештеги и публикует в ваш канал 
                в удобное время
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Что говорят пользователи</h2>
            <p className="text-gray-300">Реальные отзывы от создателей контента</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center font-bold">
                  А
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold">Алексей К.</h4>
                  <p className="text-sm text-gray-300">Tech канал, 15K подписчиков</p>
                </div>
              </div>
              <p className="text-gray-100 italic">
                "Раньше тратил 3-4 часа в день на поиск контента. Теперь FeedMaster делает всё сам. 
                Освободившееся время трачу на создание собственных материалов."
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-bold">
                  М
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold">Мария С.</h4>
                  <p className="text-sm text-gray-300">Маркетинг канал, 8K подписчиков</p>
                </div>
              </div>
              <p className="text-gray-100 italic">
                "Качество контента заметно выросло. ИИ отсеивает весь мусор, остаются только 
                действительно полезные статьи. Подписчики это оценили!"
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center font-bold">
                  Д
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold">Дмитрий В.</h4>
                  <p className="text-sm text-gray-300">IT новости, 25K подписчиков</p>
                </div>
              </div>
              <p className="text-gray-100 italic">
                "Настроил и забыл. Канал работает 24/7, подписчики довольны регулярным контентом. 
                Лучшее решение для автоматизации!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Начните бесплатно, масштабируйтесь по мере роста
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Честные цены без скрытых платежей
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2 border-gray-200 relative">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl">Попробовать</CardTitle>
                <div className="text-4xl font-bold text-gray-900">₽0</div>
                <CardDescription>Навсегда бесплатно</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    1 бот
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    3 источника
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    100 постов в месяц
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    Базовые фильтры
                  </li>
                </ul>
                <Link href="/login">
                  <Button className="w-full" variant="outline">
                    Начать бесплатно
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-purple-500 relative shadow-xl">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-500 text-white px-4 py-1">🔥 Популярный</Badge>
              </div>
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl">Профессиональный</CardTitle>
                <div className="text-4xl font-bold text-gray-900">₽1,990</div>
                <CardDescription>В месяц</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    10 ботов
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    Неограниченные источники
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    10,000 постов в месяц
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    ИИ модерация и аналитика
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    Приоритетная поддержка
                  </li>
                </ul>
                <Link href="/login">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Выбрать Pro
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl">Для агентств</CardTitle>
                <div className="text-4xl font-bold text-gray-900">₽9,990</div>
                <CardDescription>В месяц</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    Неограниченно всё
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    Мультитенантность
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    API доступ
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    Белый лейбл
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    Персональный менеджер
                  </li>
                </ul>
                <Button className="w-full" variant="outline">
                  Обсудить условия
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold">
              Хватит тратить время на рутину! 🚀
            </h2>
            <p className="text-xl opacity-90">
              Присоединяйтесь к 1000+ создателям контента, которые уже автоматизировали свои каналы. 
              Первые 100 постов — бесплатно!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                  Попробовать бесплатно
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                Посмотреть демо
              </Button>
            </div>
            
            <p className="text-sm opacity-75">
              ⚡ Настройка за 2 минуты • 🔒 Безопасно • 💳 Кредитная карта не нужна
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bot className="h-6 w-6 text-purple-400" />
                <span className="text-xl font-bold text-white">FeedMaster</span>
              </div>
              <p className="text-gray-400 mb-4">
                Умная автоматизация контента для ваших Telegram каналов
              </p>
              <p className="text-sm text-gray-500">
                © 2025 FeedMaster. Сделано с ❤️ в России
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Продукт</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Функции</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Тарифы</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Отзывы</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Обновления</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Поддержка</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Помощь</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Документация</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Видеогайды</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Техподдержка</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Связь</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Telegram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Email</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Блог</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}