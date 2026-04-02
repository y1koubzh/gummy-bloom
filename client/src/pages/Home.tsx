import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Heart, Brain } from 'lucide-react';
import { ROUTES } from '@shared/constants';

export default function Home() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();

  const features = [
    {
      icon: Sparkles,
      title: 'Personalized Blends',
      description: 'Create custom gummy formulas tailored to your health goals',
    },
    {
      icon: Zap,
      title: 'Premium Ingredients',
      description: 'Made with high-quality vitamins, minerals, and botanicals',
    },
    {
      icon: Heart,
      title: 'Health Focused',
      description: 'Support your wellness journey with science-backed supplements',
    },
    {
      icon: Brain,
      title: 'AI Recommendations',
      description: 'Get personalized product suggestions based on your needs',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10" />
        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Your <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Perfect Gummies
                </span>, Personalized
              </h1>
              <p className="text-xl text-muted-foreground">
                Create custom vitamin and supplement gummies tailored to your unique health goals. Choose your flavors, ingredients, and dosages.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate(ROUTES.BUILDER)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 px-8 rounded-lg text-lg flex items-center justify-center gap-2"
                >
                  Start Building
                  <ArrowRight size={20} />
                </Button>
                <Button
                  onClick={() => navigate(ROUTES.PRODUCTS)}
                  variant="outline"
                  className="font-semibold py-6 px-8 rounded-lg text-lg"
                >
                  Browse Products
                </Button>
              </div>
            </div>

            {/* Hero Image Placeholder */}
            <div className="relative h-96 md:h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 opacity-20 blur-3xl animate-float" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Gummy Bloom?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We combine premium ingredients with personalization to create supplements that work for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-card rounded-2xl border border-border p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-12 md:p-20 text-white text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Create Your Custom Formula?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Start designing your personalized gummy blend today and experience the difference of supplements made just for you.
            </p>
            <Button
              onClick={() => navigate(ROUTES.BUILDER)}
              className="bg-white text-primary hover:bg-gray-100 font-semibold py-6 px-8 rounded-lg text-lg"
            >
              Create Your Blend
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by Our Customers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card rounded-2xl border border-border p-8"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">
                  "Gummy Bloom has transformed my supplement routine. The ability to customize my blend is amazing!"
                </p>
                <div>
                  <p className="font-semibold">Customer {i}</p>
                  <p className="text-sm text-muted-foreground">Verified Buyer</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
