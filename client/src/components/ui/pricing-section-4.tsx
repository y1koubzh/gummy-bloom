"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles as SparklesComp } from "@/components/ui/sparkles";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import type { Product } from "@/types";

interface GummyPricingSectionProps {
  products?: Product[];
  onAddToCart?: (product: Product) => void;
}

export default function GummyPricingSection({ products = [], onAddToCart }: GummyPricingSectionProps) {
  const pricingRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const isArabic = language === 'ar';

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.2, // Faster stagger for many items
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  return (
    <div
      className="min-h-screen mx-auto relative bg-black overflow-x-hidden pt-20"
      ref={pricingRef}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <TimelineContent
        animationNum={4}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute top-0 h-96 w-screen overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] "
      >
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2c_1px,transparent_1px),linear-gradient(to_bottom,#3a3a3a01_1px,transparent_1px)] bg-[size:70px_80px] "></div>
        <SparklesComp
          density={1200}
          direction="bottom"
          speed={1}
          color="#A855F7"
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
        />
      </TimelineContent>

      <article className="text-center mb-16 pt-12 max-w-3xl mx-auto space-y-2 relative z-50 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          <VerticalCutReveal
            splitBy="words"
            staggerDuration={0.15}
            staggerFrom="first"
            reverse={true}
            containerClassName="justify-center "
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 40,
              delay: 0,
            }}
          >
            {isArabic ? "مجموعتنا الفاخرة" : "Our Premium Collection"}
          </VerticalCutReveal>
        </h1>

        <TimelineContent
          as="p"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="text-gray-400 text-lg"
        >
          {isArabic 
            ? "اكتشف القوة الغذائية المذهلة في كل حبة غامي، مصممة خصيصاً لتعزيز صحتك وجمالك." 
            : "Discover the amazing nutritional power in every gummy, specifically designed to boost your health and beauty."}
        </TimelineContent>
      </article>

      {/* Grid Layout for ALL products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl gap-8 py-6 mx-auto px-6 relative z-50 mb-24">
        {products.map((product, index) => (
          <TimelineContent
            key={product.id}
            as="div"
            animationNum={index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className={cn(
                "group relative text-white border-neutral-800 backdrop-blur-md bg-neutral-900/50 hover:bg-neutral-900/80 transition-all duration-500 overflow-hidden",
                product.featured ? "border-purple-500/40 shadow-[0px_0px_50px_0px_#9333ea15]" : ""
              )}
            >
              {/* Decorative Glow */}
              <div 
                className="absolute -right-20 -top-20 w-40 h-40 rounded-full blur-[100px] opacity-20 transition-opacity group-hover:opacity-40" 
                style={{ backgroundColor: product.color || '#9333ea' }}
              />

              {product.featured === 1 && (
                <div className="absolute top-4 left-4 bg-purple-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest z-10">
                  Featured
                </div>
              )}

              <CardHeader className="text-right pt-8 pb-4">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{product.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">
                    <NumberFlow
                      format={{ style: "decimal" }}
                      value={(product.discountPrice || product.price) / 100}
                    />
                    <span className="text-lg ms-1 font-bold">دج</span>
                  </span>
                  {product.discountPrice && (
                    <span className="text-gray-500 text-sm line-through decoration-purple-500/50">
                      {(product.price / 100)} دج
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-sm text-gray-400 leading-relaxed min-h-[60px] mb-6 line-clamp-3">
                  {product.description}
                </p>

                <button
                  onClick={() => onAddToCart?.(product)}
                  className="w-full mb-6 p-4 text-sm font-black rounded-xl transition-all active:scale-95 bg-white text-black hover:bg-purple-600 hover:text-white flex items-center justify-center gap-2"
                >
                  {isArabic ? "أضف إلى السلة" : "Add to Cart"}
                </button>

                {/* Ingredients / Tags */}
                <div className="pt-6 border-t border-neutral-800/50 text-right">
                  <div className="flex flex-wrap gap-2 justify-start flex-row-reverse">
                    {product.healthBenefit && (
                      <span className="text-[10px] bg-purple-800/20 text-purple-300 px-2 py-1 rounded-md border border-purple-800/30">
                        {product.healthBenefit}
                      </span>
                    )}
                    {product.flavor && (
                      <span className="text-[10px] bg-neutral-800 text-gray-300 px-2 py-1 rounded-md border border-neutral-700">
                        {product.flavor}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TimelineContent>
        ))}
      </div>
    </div>
  );
}
