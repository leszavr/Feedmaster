import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  ArrowRight,
  Play,
  Users,
  Target,
  Lightbulb,
  Heart
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              FeedMaster
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Войти</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
                Начать путь
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero - Story Beginning */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-0">
                <Lightbulb className="w-4 h-4 mr-2" />
                История одного открытия
              </Badge>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Представьте мир, где<br />
                <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  контент создается сам
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                В 2024 году мы поняли: создатели контента тратят 80% времени на рутину 
                и только 20% на творчество. Мы решили это изменить.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/login">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 px-10 py-4 text-lg">
                  Стать частью истории
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-10 py-4 text-lg border-2">
                <Play className="mr-2 h-5 w-5" />
                Смотреть историю (3 мин)
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* The Journey */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Путь к автоматизации
              </h2>
              <p className="text-xl text-gray-600">
                Как тысячи создателей контента меняют свою жизнь
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-300 to-pink-300"></div>
              
              <div className="space-y-16">
                {/* Step 1 */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-12 text-right">
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Прошлое: Ежедневная рутина
                      </h3>
                      <p className="text-gray-600">
                        8:00 - Открываете 20 сайтов<br/>
                        10:00 - Ищете интересные статьи<br/>
                        12:00 - Редактируете и форматируете<br/>
                        14:00 - Публикуете в канал<br/>
                        15:00 - Повторяете завтра...
                      </p>
                    </div>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">😰</span>
                  </div>
                  
                  <div className="w-1/2 pl-12">
                    <div className="text-gray-400">
                      <strong>Проблема:</strong> 6 часов в день на рутину
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-12 text-right">
                    <div className="text-gray-400">
                      <strong>Озарение:</strong> А что если автоматизировать?
                    </div>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="w-1/2 pl-12">
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Настоящее: Умное решение
                      </h3>
                      <p className="text-gray-600">
                        ИИ читает источники → отбирает лучшее → форматирует → публикует.
                        Вы настраиваете один раз, а система работает 24/7.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-12 text-right">
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Будущее: Творческая свобода
                      </h3>
                      <p className="text-gray-600">
                        Освобожденное время тратите на создание уникального контента, 
                        общение с аудиторией и развитие проектов. Канал работает сам.
                      </p>
                    </div>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="w-1/2 pl-12">
                    <div className="text-gray-400">
                      <strong>Результат:</strong> 80% времени на творчество
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Stories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Истории нашего сообщества
              </h2>
              <p className="text-xl text-gray-600">
                Реальные люди, реальные изменения
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto flex items-center justify-center">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Алексей</h3>
                  <p className="text-gray-600 text-sm mb-4">IT-канал, 15K подписчиков</p>
                  <blockquote className="text-gray-700 italic">
                    "Раньше контент-план был моим кошмаром. Теперь FeedMaster делает 80% работы, 
                    а я фокусируюсь на живом общении с аудиторией. Подписчики стали активнее!"
                  </blockquote>
                </div>
                <div className="text-3xl">📈 +40% вовлеченность</div>
              </div>

              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto flex items-center justify-center">
                  <Target className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Мария</h3>
                  <p className="text-gray-600 text-sm mb-4">Маркетинг-блог, 8K подписчиков</p>
                  <blockquote className="text-gray-700 italic">
                    "Запустила второй канал, который сама мечтала создать. FeedMaster ведет 
                    основной канал, я развиваю новое направление. Мечты стали реальностью!"
                  </blockquote>
                </div>
                <div className="text-3xl">🚀 +2 новых проекта</div>
              </div>

              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto flex items-center justify-center">
                  <Heart className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Дмитрий</h3>
                  <p className="text-gray-600 text-sm mb-4">Tech-новости, 25K подписчиков</p>
                  <blockquote className="text-gray-700 italic">
                    "Вернулось время для семьи. Раньше каждый вечер проводил за поиском контента. 
                    Теперь играю с детьми, а канал растет быстрее чем когда-либо."
                  </blockquote>
                </div>
                <div className="text-3xl">❤️ Work-life balance</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 bg-gradient-to-r from-purple-900 via-purple-800 to-pink-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">
                Наша миссия
              </h2>
              <p className="text-2xl leading-relaxed opacity-90">
                Мы верим, что каждый создатель контента должен тратить время на творчество, 
                а не на рутину. К 2030 году хотим освободить <strong>1 миллион часов</strong> 
                творческого времени для создателей по всему миру.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold">1000+</div>
                <div className="text-lg opacity-75">создателей уже с нами</div>
              </div>
              <div>
                <div className="text-4xl font-bold">50,000+</div>
                <div className="text-lg opacity-75">часов освобожденного времени</div>
              </div>
              <div>
                <div className="text-4xl font-bold">∞</div>
                <div className="text-lg opacity-75">возможностей для творчества</div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">
                Станьте частью этой истории
              </h3>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/login">
                  <Button size="lg" className="bg-white text-purple-800 hover:bg-gray-100 px-10 py-4 text-lg font-semibold">
                    Присоединиться к революции
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-10 py-4 text-lg">
                  Узнать больше
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Честные цены, честные возможности
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Начните бесплатно. Растите вместе с нами.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100">
                <h3 className="text-2xl font-bold mb-4">Для начала</h3>
                <div className="text-4xl font-bold mb-6">₽0 <span className="text-lg font-normal text-gray-500">навсегда</span></div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-500 rounded-full mr-3 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    1 канал, 100 постов/месяц
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-500 rounded-full mr-3 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    Базовая модерация
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-500 rounded-full mr-3 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    Сообщество поддержки
                  </li>
                </ul>
                <Link href="/login">
                  <Button className="w-full" variant="outline" size="lg">
                    Начать путешествие
                  </Button>
                </Link>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-8 rounded-2xl shadow-xl text-white relative">
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black">
                  🔥 Выбор сообщества
                </Badge>
                <h3 className="text-2xl font-bold mb-4">Для роста</h3>
                <div className="text-4xl font-bold mb-6">₽1,990 <span className="text-lg font-normal opacity-75">/месяц</span></div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-white rounded-full mr-3 flex items-center justify-center">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    10 каналов, безлимит постов
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-white rounded-full mr-3 flex items-center justify-center">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    ИИ-модерация + аналитика
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-white rounded-full mr-3 flex items-center justify-center">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    Приоритетная поддержка
                  </li>
                </ul>
                <Link href="/login">
                  <Button className="w-full bg-white text-purple-600 hover:bg-gray-100" size="lg">
                    Ускорить рост
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <span className="text-xl font-bold">FeedMaster</span>
          </div>
          
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Освобождаем время для творчества. Вместе строим будущее контент-индустрии.
          </p>
          
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white">О нас</a>
            <a href="#" className="hover:text-white">Блог</a>
            <a href="#" className="hover:text-white">Сообщество</a>
            <a href="#" className="hover:text-white">Поддержка</a>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-500">
            © 2025 FeedMaster. Создаем будущее контента.
          </div>
        </div>
      </footer>
    </div>
  );
}