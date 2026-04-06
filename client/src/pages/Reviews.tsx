import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Star, Quote, MessageSquareQuote } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: "سارة العلي",
    role: "مختصة تغذية",
    content: "منتجات Gummy Bloom ليست مجرد مكملات، بل هي تجربة حياة. تركيباتهم المخصصة غيرت روتين صحتي بالكامل.",
    rating: 5,
    date: "2024-03-15",
    color: "#9333ea"
  },
  {
    id: 2,
    name: "Mohamed Amine",
    role: "Fitness Coach",
    content: "The Focus Spark gummies are a game changer for my morning sessions. Pure energy without the crash.",
    rating: 5,
    date: "2024-03-10",
    color: "#3b82f6"
  },
  {
    id: 3,
    name: "ليلى بوزيد",
    role: "مؤثرة جمال",
    content: "بشرتي وشعري أصبحا أكثر إشراقاً بعد التزامي بـ Glow Bloom. الطعم رائع والنتائج أروع!",
    rating: 5,
    date: "2024-03-05",
    color: "#ec4899"
  },
  {
    id: 4,
    name: "Karim Brahimi",
    role: "Software Engineer",
    content: "Deep Sleep gummies actually work. I've been tracking my sleep and the deep REM cycles have improved significantly.",
    rating: 5,
    date: "2024-02-28",
    color: "#6366f1"
  },
  {
    id: 5,
    name: "مريم الجزائرية",
    role: "ربة منزل",
    content: "أفضل ما في الماركة هو المصداقية. التوصيل سريع والتعليب فخم جداً، تشعر فعلاً أنك تشتري منتجاً عالمياً.",
    rating: 5,
    date: "2024-02-20",
    color: "#8b5cf6"
  },
  {
    id: 6,
    name: "Yasmine Belkacem",
    role: "Artist",
    content: "The aesthetic of the brand is what first caught my eye, but the quality of the gummies is what made me a loyal customer.",
    rating: 5,
    date: "2024-02-15",
    color: "#d946ef"
  }
];

export default function Reviews() {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 overflow-x-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-screen pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="container relative z-10 px-6">
        <header className="text-center mb-24 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 mb-6 backdrop-blur-md">
              <Star className="w-4 h-4 text-purple-400 fill-purple-400" />
              <span className="text-xs font-bold tracking-widest text-purple-300 uppercase">
                {isArabic ? "مجتمع بلوم" : "Bloom Community"}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              {isArabic ? "آراء المتابعين" : "Our Community Stories"}
            </h1>
            <p className="text-xl text-gray-400 font-light leading-relaxed">
              {isArabic 
                ? "انضم إلى آلاف الأشخاص الذين غيروا حياتهم مع Gummy Bloom. هنا نتشارك قصص النجاح والعافية."
                : "Join thousands who transformed their lives with Gummy Bloom. Here we share stories of success and wellness."}
            </p>
          </motion.div>
        </header>

        {/* Masonry-like Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="break-inside-avoid"
            >
              <div className="relative p-8 rounded-[2.5rem] bg-neutral-900/40 border border-white/5 backdrop-blur-xl group hover:bg-neutral-900/60 transition-all duration-500 hover:border-purple-500/30 shadow-2xl overflow-hidden">
                {/* Decoration */}
                <div 
                  className="absolute -top-12 -right-12 w-32 h-32 blur-[80px] opacity-10 pointer-events-none group-hover:opacity-30 transition-opacity" 
                  style={{ backgroundColor: review.color }}
                />
                
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-1 text-purple-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-white/5" />
                </div>

                <p className="text-lg text-gray-200 font-medium leading-relaxed mb-8 italic" dir={review.name.match(/[أ-ي]/) ? "rtl" : "ltr"}>
                  "{review.content}"
                </p>

                <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center font-black text-white" 
                    style={{ background: `linear-gradient(45deg, ${review.color}, #000)` }}
                  >
                    {review.name.substring(0, 1)}
                  </div>
                  <div dir={review.name.match(/[أ-ي]/) ? "rtl" : "ltr"}>
                    <h4 className="font-bold text-white mb-0.5">{review.name}</h4>
                    <p className="text-xs text-gray-500">{review.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Support Section */}
        <footer className="mt-20 text-center">
            <div className="inline-block p-8 rounded-3xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/5 backdrop-blur-md">
                <MessageSquareQuote className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">{isArabic ? "شاركنا تجربتك" : "Share Your Experience"}</h3>
                <p className="text-gray-400 max-w-sm mx-auto mb-6">
                    {isArabic 
                        ? "نحن فخورون بكل نجاح تحققه. تواصل معنا لمشاركة قصتك."
                        : "We are proud of every success you achieve. Contact us to share your story."}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <button className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors">
                        {isArabic ? "أرسل مراجعة" : "Submit Review"}
                    </button>
                    <button className="px-6 py-3 bg-neutral-800 text-white font-bold rounded-xl hover:bg-neutral-700 transition-colors border border-white/5">
                        {isArabic ? "تواصل معنا" : "Contact Us"}
                    </button>
                </div>
            </div>
        </footer>
      </div>
    </div>
  );
}
