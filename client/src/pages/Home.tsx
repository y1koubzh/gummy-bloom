import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Heart, Brain } from 'lucide-react';
import { ROUTES } from '@shared/constants';
import { GlowyWavesHero } from '@/components/ui/glowy-waves-hero';

export default function Home() {
  const [, navigate] = useLocation();
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  const features = [
    {
      icon: Sparkles,
      title: isArabic ? 'تركيبات مخصصة' : 'Personalized Blends',
      description: isArabic ? 'أنشئ تركيبات الغامي الخاصة بك والمصممة خصيصاً لأهدافك الصحية' : 'Create custom gummy formulas tailored to your health goals',
    },
    {
      icon: Zap,
      title: isArabic ? 'مكونات ممتازة' : 'Premium Ingredients',
      description: isArabic ? 'مصنوعة من فيتامينات ومعادن ونباتات عالية الجودة' : 'Made with high-quality vitamins, minerals, and botanicals',
    },
    {
      icon: Heart,
      title: isArabic ? 'تركيز صحي' : 'Health Focused',
      description: isArabic ? 'ادعم رحلة العافية الخاصة بك بمكملات تدعمها العلوم' : 'Support your wellness journey with science-backed supplements',
    },
    {
      icon: Brain,
      title: isArabic ? 'توصيات الذكاء الاصطناعي' : 'AI Recommendations',
      description: isArabic ? 'احصل على اقتراحات منتجات مخصصة بناءً على احتياجاتك' : 'Get personalized product suggestions based on your needs',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Dynamic Waves Hero Section */}
      <GlowyWavesHero />

      {/* Features Section */}
      <section className="py-24 md:py-40 bg-neutral-950 border-t border-white/5">
        <div className="container px-6">
          <div className="text-center mb-24" dir={isArabic ? 'rtl' : 'ltr'}>
            <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              {isArabic ? 'لماذا تختار Gummy Bloom؟' : 'Why Choose Gummy Bloom?'}
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              {isArabic 
                ? 'نحن نجمع بين المكونات الممتازة والتخصيص لإنشاء مكملات غذائية تعمل من أجلك خصيصاً.'
                : 'We combine premium ingredients with personalization to create supplements that work for you.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-neutral-900/50 rounded-3xl border border-white/5 p-10 hover:border-purple-500/30 transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(147,51,234,0.3)] group backdrop-blur-sm"
                  dir={isArabic ? 'rtl' : 'ltr'}
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-white/5 shadow-inner">
                    <Icon size={28} className="text-purple-400" />
                  </div>
                  <h3 className="font-bold text-2xl mb-4 group-hover:text-purple-400 transition-colors">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed font-light">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-40">
        <div className="container px-6">
          <div className="bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 rounded-[3rem] p-12 md:p-24 text-white text-center shadow-[0_40px_100px_-20px_rgba(147,51,234,0.4)] relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="relative z-10" dir={isArabic ? 'rtl' : 'ltr'}>
              <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                {isArabic ? 'هل أنت مستعد لتصميم تركيبتك الخاصة؟' : 'Ready to Create Your Custom Formula?'}
              </h2>
              <p className="text-xl md:text-2xl opacity-80 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
                {isArabic 
                  ? 'ابدأ الآن في تصميم مزيج الغامي المخصص لك واستمتع بمكملات غذائية صُنعت من أجلك فقط.'
                  : 'Start designing your personalized gummy blend today and experience the difference of supplements made just for you.'}
              </p>
              <Button
                onClick={() => navigate(ROUTES.BUILDER)}
                className="bg-white text-purple-700 hover:bg-gray-100 font-black py-8 px-12 rounded-2xl text-xl transition-all hover:scale-105 active:scale-95 shadow-2xl"
              >
                {isArabic ? 'ابدأ التصميم الآن' : 'Create Your Blend'}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
