import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Rss, 
  ShieldCheck, 
  ArrowRight,
  Terminal,
  Code,
  Zap
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Terminal className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-mono font-bold">feedmaster</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">login</Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-black hover:bg-gray-800 font-mono">
                start
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="font-mono text-xs">
                v2.0.1-beta
              </Badge>
              
              <h1 className="text-5xl md:text-6xl font-mono font-bold text-gray-900 leading-tight">
                $ feedmaster init
              </h1>
              
              <div className="bg-gray-900 rounded-lg p-6 font-mono text-left max-w-2xl mx-auto">
                <div className="text-green-400 text-sm">
                  <span className="text-gray-500">➜</span> feedmaster setup telegram-bot<br/>
                  <span className="text-gray-500">➜</span> feedmaster add source --rss habr.com<br/>
                  <span className="text-gray-500">➜</span> feedmaster start --auto-moderate<br/>
                  <br/>
                  <span className="text-blue-400">✓</span> Bot configured successfully<br/>
                  <span className="text-blue-400">✓</span> RSS feed connected<br/>
                  <span className="text-blue-400">✓</span> AI moderation enabled<br/>
                  <span className="text-yellow-400">→</span> Processing 24 posts/day automatically
                </div>
              </div>
              
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Автоматизация контента для Telegram каналов. <br/>
                Один раз настроил → работает всегда.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="bg-black hover:bg-gray-800 font-mono px-8">
                  $ git clone feedmaster
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="font-mono px-8">
                view docs
              </Button>
            </div>
            
            <div className="text-sm text-gray-500 font-mono">
              free tier • 2min setup • 1k+ developers
            </div>
          </div>
        </div>
      </section>

      {/* Features as Code */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-mono font-bold mb-4">
              // How it works
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border rounded-lg p-6">
              <div className="font-mono text-sm mb-4">
                <span className="text-purple-600">interface</span> <span className="text-blue-600">ContentSource</span> {"{"}
              </div>
              <div className="pl-4 font-mono text-sm space-y-1">
                <div><span className="text-green-600">type:</span> <span className="text-orange-600">'RSS' | 'Telegram'</span></div>
                <div><span className="text-green-600">url:</span> <span className="text-orange-600">string</span></div>
                <div><span className="text-green-600">keywords:</span> <span className="text-orange-600">string[]</span></div>
                <div><span className="text-green-600">autoModerate:</span> <span className="text-orange-600">boolean</span></div>
              </div>
              <div className="font-mono text-sm mt-4">{"}"}</div>
              <p className="text-sm text-gray-600 mt-4">
                Типизированная конфигурация источников контента
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <div className="font-mono text-sm mb-4">
                <span className="text-purple-600">class</span> <span className="text-blue-600">AIModerator</span> {"{"}
              </div>
              <div className="pl-4 font-mono text-sm space-y-1">
                <div><span className="text-green-600">async</span> <span className="text-blue-600">analyze</span>(content) {"{}"}</div>
                <div><span className="text-green-600">async</span> <span className="text-blue-600">filterSpam</span>() {"{}"}</div>
                <div><span className="text-green-600">async</span> <span className="text-blue-600">approve</span>() {"{}"}</div>
              </div>
              <div className="font-mono text-sm mt-4">{"}"}</div>
              <p className="text-sm text-gray-600 mt-4">
                ML-модель для автоматической модерации
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <div className="font-mono text-sm mb-4">
                <span className="text-purple-600">async function</span> <span className="text-blue-600">publishPost</span>() {"{"}
              </div>
              <div className="pl-4 font-mono text-sm space-y-1">
                <div><span className="text-gray-600">// Telegram Bot API</span></div>
                <div><span className="text-green-600">await</span> bot.sendMessage()</div>
                <div><span className="text-green-600">await</span> scheduleNext()</div>
              </div>
              <div className="font-mono text-sm mt-4">{"}"}</div>
              <p className="text-sm text-gray-600 mt-4">
                Автоматическая публикация в каналы
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <div className="font-mono text-sm mb-4">
                <span className="text-purple-600">const</span> <span className="text-blue-600">metrics</span> = {"{"}
              </div>
              <div className="pl-4 font-mono text-sm space-y-1">
                <div><span className="text-green-600">postsPerDay:</span> <span className="text-orange-600">24</span></div>
                <div><span className="text-green-600">approvalRate:</span> <span className="text-orange-600">0.95</span></div>
                <div><span className="text-green-600">uptime:</span> <span className="text-orange-600">"99.9%"</span></div>
              </div>
              <div className="font-mono text-sm mt-4">{"}"}</div>
              <p className="text-sm text-gray-600 mt-4">
                Метрики в реальном времени
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing as Package.json */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-mono font-bold mb-4">
              cat package.json
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <div className="border rounded-lg p-6 bg-gray-50">
              <div className="font-mono text-sm">
                <div className="text-purple-600">"name":</div>
                <div className="pl-4 text-orange-600">"feedmaster-free"</div>
                <div className="text-purple-600 mt-4">"price":</div>
                <div className="pl-4 text-orange-600">"$0/month"</div>
                <div className="text-purple-600 mt-4">"features":</div>
                <div className="pl-4 text-orange-600">[</div>
                <div className="pl-8 text-gray-600">
                  "1 bot",<br/>
                  "3 sources",<br/>
                  "100 posts/month"
                </div>
                <div className="pl-4 text-orange-600">]</div>
              </div>
              <Link href="/login">
                <Button className="w-full mt-6 font-mono" variant="outline">
                  npm install --free
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-black rounded-lg p-6 bg-white relative">
              <Badge className="absolute -top-2 left-4 bg-black text-white font-mono">
                recommended
              </Badge>
              <div className="font-mono text-sm">
                <div className="text-purple-600">"name":</div>
                <div className="pl-4 text-orange-600">"feedmaster-pro"</div>
                <div className="text-purple-600 mt-4">"price":</div>
                <div className="pl-4 text-orange-600">"₽1990/month"</div>
                <div className="text-purple-600 mt-4">"features":</div>
                <div className="pl-4 text-orange-600">[</div>
                <div className="pl-8 text-gray-600">
                  "10 bots",<br/>
                  "unlimited sources",<br/>
                  "10k posts/month",<br/>
                  "AI moderation",<br/>
                  "analytics"
                </div>
                <div className="pl-4 text-orange-600">]</div>
              </div>
              <Link href="/login">
                <Button className="w-full mt-6 bg-black hover:bg-gray-800 font-mono">
                  npm install --pro
                </Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="border rounded-lg p-6 bg-gray-50">
              <div className="font-mono text-sm">
                <div className="text-purple-600">"name":</div>
                <div className="pl-4 text-orange-600">"feedmaster-enterprise"</div>
                <div className="text-purple-600 mt-4">"price":</div>
                <div className="pl-4 text-orange-600">"₽9990/month"</div>
                <div className="text-purple-600 mt-4">"features":</div>
                <div className="pl-4 text-orange-600">[</div>
                <div className="pl-8 text-gray-600">
                  "unlimited everything",<br/>
                  "white-label",<br/>
                  "api access",<br/>
                  "dedicated support"
                </div>
                <div className="pl-4 text-orange-600">]</div>
              </div>
              <Button className="w-full mt-6 font-mono" variant="outline">
                contact --enterprise
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                  <Terminal className="h-4 w-4 text-white" />
                </div>
                <span className="font-mono font-bold">feedmaster</span>
              </div>
              <p className="text-sm text-gray-600 font-mono">
                ~/automation/telegram-content
              </p>
            </div>
            
            <div>
              <h3 className="font-mono font-semibold mb-4">docs/</h3>
              <ul className="space-y-2 text-sm font-mono text-gray-600">
                <li><a href="#" className="hover:text-black">README.md</a></li>
                <li><a href="#" className="hover:text-black">API.md</a></li>
                <li><a href="#" className="hover:text-black">INSTALL.md</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-mono font-semibold mb-4">support/</h3>
              <ul className="space-y-2 text-sm font-mono text-gray-600">
                <li><a href="#" className="hover:text-black">issues</a></li>
                <li><a href="#" className="hover:text-black">discussions</a></li>
                <li><a href="#" className="hover:text-black">changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-mono font-semibold mb-4">connect/</h3>
              <ul className="space-y-2 text-sm font-mono text-gray-600">
                <li><a href="#" className="hover:text-black">telegram</a></li>
                <li><a href="#" className="hover:text-black">github</a></li>
                <li><a href="#" className="hover:text-black">twitter</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-500 font-mono">
              © 2025 feedmaster • MIT license • made with &lt;3
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}