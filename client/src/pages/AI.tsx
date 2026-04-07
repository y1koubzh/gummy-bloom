import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Loader2, RefreshCw, Zap, ShieldCheck, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function AI() {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: isArabic 
        ? 'مرحباً بك في Bloom AI. أنا هنا لمساعدتك في تصميم أفضل روتين مكملات غذائية مخصص لحياتك. ماذا نخطط لتحسينه اليوم؟' 
        : 'Welcome to Bloom AI. I\'m here to help you design the best supplement routine tailored for your life. What are we aiming to improve today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const flowiseUrl = import.meta.env.VITE_FLOWISE_API_URL;
      
      if (!flowiseUrl || flowiseUrl.includes('YOUR_FLOW_ID')) {
        throw new Error('Flowise API URL not configured');
      }

      const response = await fetch(flowiseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentInput,
        }),
      });

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.text || data || (isArabic ? 'عذراً، لم أستطع فهم ذلك. يرجى المحاولة لاحقاً.' : 'Sorry, I couldn\'t process that. Please try again.'),
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('AI Page error:', error);
      toast.error(isArabic ? 'مشكلة في الاتصال بالمساعد الذكي' : 'AI connection error');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: isArabic 
            ? 'يبدو أنني غير متصل حالياً بنظام Flowise. يرجى التحقق من إعدادات الـ API.' 
            : 'I seem to be disconnected from the Flowise system. Please check API settings.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([messages[0]]);
    toast.success(isArabic ? 'تم مسح المحادثة' : 'Chat cleared');
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 overflow-hidden flex flex-col">
      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[30%] bg-blue-600/5 blur-[100px] rounded-full delay-1000 animate-pulse" />
      </div>

      <div className="container flex-1 max-w-5xl mx-auto flex flex-col relative z-10 px-6 pb-6 h-[calc(100vh-100px)]">
        {/* Header Area */}
        <header className="flex items-center justify-between py-6 border-b border-white/5 mb-8">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-[0_0_30px_-5px_rgba(147,51,234,0.4)]">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-black">{isArabic ? "مساعد بلوم الذكي" : "Bloom AI Assistant"}</h1>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] uppercase tracking-tighter text-gray-500">{isArabic ? "مدعوم بنظام FLOWISE" : "Powered by Flowise"}</span>
                    </div>
                </div>
            </div>
            <button 
                onClick={clearChat}
                className="p-3 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 transition-all border border-white/5 group"
                title={isArabic ? "مسح المحادثة" : "Clear Chat"}
            >
                <RefreshCw size={20} className="group-active:rotate-180 transition-transform duration-500" />
            </button>
        </header>

        {/* Message Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto pr-4 mb-4 space-y-8 scrollbar-hide flex flex-col"
        >
            <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                    <motion.div
                        key={message.id}
                        initial={{ opacity: 0, x: message.sender === 'user' ? 20 : -20, y: 10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        className={`flex gap-4 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 ${
                            message.sender === 'user' 
                                ? 'bg-neutral-800' 
                                : 'bg-gradient-to-br from-purple-900/30 to-black'
                        }`}>
                            {message.sender === 'user' ? <User size={20} /> : <Sparkles size={20} className="text-purple-400" />}
                        </div>
                        <div className={`group relative max-w-[80%] px-6 py-5 rounded-[2rem] shadow-xl ${
                            message.sender === 'user'
                                ? 'bg-purple-600/90 text-white rounded-tr-none'
                                : 'bg-neutral-900 border border-white/10 text-gray-100 rounded-tl-none'
                        }`} dir={message.text.match(/[أ-ي]/) ? "rtl" : "ltr"}>
                            <p className="text-base md:text-lg leading-relaxed">{message.text}</p>
                            <span className="block mt-2 text-[10px] opacity-40">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
            {isLoading && (
                 <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="flex gap-4"
                >
                    <div className="w-10 h-10 rounded-2xl bg-neutral-900 flex items-center justify-center animate-pulse border border-white/5">
                        <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                    </div>
                    <div className="bg-neutral-900/50 border border-white/5 px-6 py-5 rounded-[2rem] rounded-tl-none flex gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500/40 animate-bounce delay-75" />
                        <span className="w-2 h-2 rounded-full bg-purple-500/40 animate-bounce delay-150" />
                        <span className="w-2 h-2 rounded-full bg-purple-500/40 animate-bounce delay-300" />
                    </div>
                </motion.div>
            )}
        </div>

        {/* Input Area */}
        <div className="relative group max-w-4xl mx-auto w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-[2.5rem] blur opacity-0 group-focus-within:opacity-30 transition duration-1000" />
            <div className="relative bg-neutral-900 border border-white/10 rounded-[2.5rem] overflow-hidden flex items-center p-2 focus-within:border-purple-500/30 transition-all">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={isArabic ? "تحدث معي عن أهدافك الصحية..." : "Talk to me about your health goals..."}
                    className="flex-1 bg-transparent border-none px-6 py-4 md:py-6 text-lg focus:outline-none focus:ring-0 placeholder:text-gray-600"
                    dir={isArabic ? "rtl" : "ltr"}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-purple-600 hover:bg-purple-500 text-white rounded-full disabled:opacity-30 disabled:grayscale transition-all active:scale-90"
                >
                    <Send className={isArabic ? "rotate-180" : ""} size={24} />
                </button>
            </div>
            {/* Quick Suggestions */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
                {[
                    { icon: Zap, text: isArabic ? "ما هي فوائد المغنيسيوم؟" : "Benefits of energy gummies?" },
                    { icon: Heart, text: isArabic ? "أريد تركيبة للنوم العميق" : "I need help with deep sleep" },
                    { icon: ShieldCheck, text: isArabic ? "هل منتجاتكم طبيعية؟" : "Are your products natural?" }
                ].map((item, i) => (
                    <button 
                        key={i}
                        onClick={() => { setInputValue(item.text); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-500 hover:bg-white/10 hover:text-white transition-all"
                    >
                        <item.icon size={12} />
                        {item.text}
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
