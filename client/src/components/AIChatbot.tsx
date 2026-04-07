import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, MessageCircle, X, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function AIChatbot() {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: isArabic 
        ? 'مرحباً! أنا مساعد Gummy Bloom الذكي. كيف يمكنني مساعدتك اليوم في اختيار المكملات الغذائية المناسبة؟' 
        : 'Hi! I\'m your Gummy Bloom assistant. I can help you find the perfect supplement blend based on your health goals. What are you interested in?',
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
        text: data.text || data || (isArabic ? 'عذراً، حدث خطأ في الاتصال.' : 'Sorry, something went wrong.'),
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: isArabic 
            ? 'عذراً، لا يمكنني الاتصال بالخادم حالياً. يرجى التأكد من إعداد رابط Flowise في ملف .env' 
            : 'Sorry, I cannot connect to the AI server right now. Please check Flowise configuration.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-[0_10px_40px_-10px_rgba(147,51,234,0.5)] hover:scale-110 hover:rotate-12 transition-all duration-300 flex items-center justify-center z-50 border border-white/20"
      >
        <MessageCircle size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[90vw] md:w-96 h-[600px] bg-neutral-950 border border-white/10 rounded-[2rem] shadow-2xl flex flex-col z-50 overflow-hidden backdrop-blur-xl" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
            <MessageCircle size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Gummy Bloom AI</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-white/70 uppercase tracking-widest">{isArabic ? "متصل حالياً" : "Online Now"}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-white/20 p-2 rounded-xl transition-colors text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-5 py-4 rounded-2xl text-sm leading-relaxed ${
                message.sender === 'user'
                  ? 'bg-purple-600 text-white rounded-tr-none shadow-lg shadow-purple-500/20'
                  : 'bg-neutral-900 text-gray-200 rounded-tl-none border border-white/5'
              }`}
            >
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-neutral-900 px-5 py-4 rounded-2xl rounded-tl-none border border-white/5">
              <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-neutral-950 border-t border-white/5">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isArabic ? "اكتب سؤالك هنا..." : "Type your message..."}
            className="w-full bg-neutral-900 border border-white/10 rounded-2xl px-5 py-4 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="absolute right-2 p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 transition-all active:scale-95"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-600 mt-4 uppercase tracking-[0.2em]">
            Powered by Bloom AI
        </p>
      </div>
    </div>
  );
}
